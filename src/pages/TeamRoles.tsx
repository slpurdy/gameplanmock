import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "moderator" | "member";
  initials: string;
  joinedAt: string;
}

const TeamRoles = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [showRoleInfo, setShowRoleInfo] = useState(false);

  const [members, setMembers] = useState<TeamMember[]>([
    { id: "1", name: "Coach Alex", email: "alex@team.com", role: "admin", initials: "CA", joinedAt: "Jan 2024" },
    { id: "2", name: "Sarah Martinez", email: "sarah@team.com", role: "moderator", initials: "SM", joinedAt: "Feb 2024" },
    { id: "3", name: "Mike Thompson", email: "mike@team.com", role: "member", initials: "MT", joinedAt: "Feb 2024" },
    { id: "4", name: "Jenny Kim", email: "jenny@team.com", role: "member", initials: "JK", joinedAt: "Mar 2024" },
    { id: "5", name: "Tom Rodriguez", email: "tom@team.com", role: "member", initials: "TR", joinedAt: "Mar 2024" },
    { id: "6", name: "Lisa Wong", email: "lisa@team.com", role: "moderator", initials: "LW", joinedAt: "Apr 2024" },
  ]);

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

  const handleRoleChange = (memberId: string, newRole: "admin" | "moderator" | "member") => {
    setMembers(
      members.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );
    toast({
      title: "Role updated",
      description: "Member role has been successfully changed.",
    });
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleCounts = () => ({
    admin: members.filter((m) => m.role === "admin").length,
    moderator: members.filter((m) => m.role === "moderator").length,
    member: members.filter((m) => m.role === "member").length,
  });

  const counts = getRoleCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/dashboard" className="flex items-center gap-2">
              <Trophy className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">GamePlan</span>
            </Link>

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
                <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
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
                const config = roleConfig[member.role];
                const Icon = config.icon;
                return (
                  <Card key={member.id} className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10">{member.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{member.name}</div>
                        <div className="text-sm text-muted-foreground truncate">{member.email}</div>
                        <div className="text-xs text-muted-foreground">Joined {member.joinedAt}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Select
                          value={member.role}
                          onValueChange={(value: "admin" | "moderator" | "member") =>
                            handleRoleChange(member.id, value)
                          }
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Remove Member</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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