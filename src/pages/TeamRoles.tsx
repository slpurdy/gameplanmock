import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import BackButton from "@/components/BackButton";
import {
  Trophy,
  Bell,
  Settings,
  Shield,
  Users,
  Crown,
  UserCog,
  User,
  Search,
  MoreVertical,
  Check,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

interface TeamMember {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profile: {
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
  } | null;
}

const TeamRoles = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showRoleInfo, setShowRoleInfo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  const roleConfig = {
    admin: { icon: Crown, color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Admin" },
    moderator: { icon: Shield, color: "text-blue-500", bg: "bg-blue-500/10", label: "Moderator" },
    member: { icon: User, color: "text-muted-foreground", bg: "bg-muted", label: "Member" },
  };

  const rolePermissions = {
    admin: [
      "Manage team settings",
      "Add/remove members",
      "Assign roles to members",
      "Create and delete events",
      "Manage payment settings",
      "Access all team data",
    ],
    moderator: [
      "Create events",
      "Manage RSVPs",
      "Pin messages and documents",
      "Manage chat channels",
      "View member details",
    ],
    member: [
      "View team calendar",
      "RSVP to events",
      "Participate in team chat",
      "View team documents",
      "Update own profile",
    ],
  };

  useEffect(() => {
    if (user) {
      fetchTeamMembers();
    }
  }, [user]);

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      // First get user's team
      const { data: userTeam, error: teamError } = await supabase
        .from("team_members")
        .select("team_id, role")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (teamError) throw teamError;
      if (!userTeam) {
        setLoading(false);
        return;
      }

      setTeamId(userTeam.team_id);
      setCurrentUserRole(userTeam.role);

      // Fetch all team members with profiles
      const { data: membersData, error: membersError } = await supabase
        .from("team_members")
        .select(`
          id,
          user_id,
          role,
          joined_at,
          profile:profiles(full_name, email, avatar_url)
        `)
        .eq("team_id", userTeam.team_id)
        .order("joined_at", { ascending: true });

      if (membersError) throw membersError;
      setMembers(membersData as unknown as TeamMember[]);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load team members",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: string) => {
    if (currentUserRole !== "admin") {
      toast({
        variant: "destructive",
        title: "Permission denied",
        description: "Only admins can change member roles",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("team_members")
        .update({ role: newRole })
        .eq("id", memberId);

      if (error) throw error;

      setMembers(
        members.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
      );
      toast({
        title: "Role updated",
        description: "Member role has been successfully changed.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update role",
      });
    }
  };

  const handleRemoveMember = async (memberId: string, memberUserId: string) => {
    if (currentUserRole !== "admin") {
      toast({
        variant: "destructive",
        title: "Permission denied",
        description: "Only admins can remove members",
      });
      return;
    }

    if (memberUserId === user?.id) {
      toast({
        variant: "destructive",
        title: "Cannot remove yourself",
        description: "You cannot remove yourself from the team",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", memberId);

      if (error) throw error;

      setMembers(members.filter((m) => m.id !== memberId));
      toast({
        title: "Member removed",
        description: "Member has been removed from the team.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to remove member",
      });
    }
  };

  const getInitials = (name: string | null, email: string | null) => {
    if (name) return name.split(" ").map((n) => n[0]).join("").toUpperCase();
    if (email) return email.substring(0, 2).toUpperCase();
    return "??";
  };

  const filteredMembers = members.filter(
    (m) =>
      (m.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (m.profile?.email?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
  );

  const getRoleCounts = () => ({
    admin: members.filter((m) => m.role === "admin").length,
    moderator: members.filter((m) => m.role === "moderator").length,
    member: members.filter((m) => m.role === "member").length,
  });

  const counts = getRoleCounts();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!teamId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">No team found</h1>
        <p className="text-muted-foreground mb-4">You need to join or create a team first.</p>
        <Button asChild>
          <Link to="/create-team">Create a Team</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BackButton />
              <Link to="/dashboard" className="flex items-center gap-2">
                <Trophy className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">GamePlan</span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/settings">
                  <Settings className="h-5 w-5" />
                </Link>
              </Button>
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(null, user?.email || null)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <UserCog className="h-8 w-8 text-primary" />
              Team Roles & Access
            </h1>
            <p className="text-muted-foreground mt-1">Manage member permissions and access levels</p>
          </div>
          <Button variant="outline" onClick={() => setShowRoleInfo(true)}>
            <Shield className="h-4 w-4 mr-2" />
            View Permissions
          </Button>
        </div>

        {/* Role Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["admin", "moderator", "member"] as const).map((role) => {
            const config = roleConfig[role];
            const Icon = config.icon;
            return (
              <Card key={role} className={`p-6 ${config.bg}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${config.bg}`}>
                    <Icon className={`h-6 w-6 ${config.color}`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{counts[role]}</div>
                    <div className="text-sm text-muted-foreground">{config.label}s</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Members List */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Members ({members.length})
            </h2>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {filteredMembers.map((member) => {
                const config = roleConfig[member.role as keyof typeof roleConfig] || roleConfig.member;
                const Icon = config.icon;
                const isCurrentUser = member.user_id === user?.id;
                return (
                  <Card key={member.id} className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10">
                          {getInitials(member.profile?.full_name || null, member.profile?.email || null)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">
                          {member.profile?.full_name || member.profile?.email || "Unknown"}
                          {isCurrentUser && <span className="text-xs text-muted-foreground ml-2">(You)</span>}
                        </div>
                        <div className="text-sm text-muted-foreground truncate">{member.profile?.email}</div>
                        <div className="text-xs text-muted-foreground">
                          Joined {format(new Date(member.joined_at), "MMM yyyy")}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Select
                          value={member.role}
                          onValueChange={(value) => handleRoleChange(member.id, value)}
                          disabled={currentUserRole !== "admin"}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue>
                              <div className="flex items-center gap-2">
                                <Icon className={`h-4 w-4 ${config.color}`} />
                                {config.label}
                              </div>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">
                              <div className="flex items-center gap-2">
                                <Crown className="h-4 w-4 text-yellow-500" />
                                Admin
                              </div>
                            </SelectItem>
                            <SelectItem value="moderator">
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-blue-500" />
                                Moderator
                              </div>
                            </SelectItem>
                            <SelectItem value="member">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                Member
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {currentUserRole === "admin" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem asChild>
                                <Link to={`/profile/${member.user_id}`}>View Profile</Link>
                              </DropdownMenuItem>
                              {!isCurrentUser && (
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => handleRemoveMember(member.id, member.user_id)}
                                >
                                  Remove Member
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </Card>

        {/* Role Permissions Dialog */}
        <Dialog open={showRoleInfo} onOpenChange={setShowRoleInfo}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Role Permissions</DialogTitle>
              <DialogDescription>
                Understanding what each role can do in your team
              </DialogDescription>
            </DialogHeader>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              {(["admin", "moderator", "member"] as const).map((role) => {
                const config = roleConfig[role];
                const Icon = config.icon;
                return (
                  <Card key={role} className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className={`h-5 w-5 ${config.color}`} />
                      <span className="font-semibold">{config.label}</span>
                    </div>
                    <ul className="space-y-2">
                      {rolePermissions[role].map((permission, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{permission}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default TeamRoles;
