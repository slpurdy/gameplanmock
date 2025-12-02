import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import BackButton from "@/components/BackButton";
import {
  Trophy,
  Bell,
  Settings,
  Users,
  Calendar,
  DollarSign,
  Copy,
  Edit,
  Save,
  X,
  MapPin,
  Mail,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface TeamData {
  id: string;
  name: string;
  sport: string;
  description: string;
  invite_code: string;
  created_at: string;
  memberCount: number;
  eventCount: number;
}

const TeamDetails = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<TeamData | null>(null);
  const [editedTeam, setEditedTeam] = useState<Partial<TeamData>>({});

  useEffect(() => {
    fetchTeamData();
  }, [user]);

  const fetchTeamData = async () => {
    if (!user) return;
    
    try {
      // Get user's team membership
      const { data: membership } = await supabase
        .from("team_members")
        .select("team_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (membership?.team_id) {
        // Get team details
        const { data: teamData } = await supabase
          .from("teams")
          .select("*")
          .eq("id", membership.team_id)
          .single();

        // Get member count
        const { count: memberCount } = await supabase
          .from("team_members")
          .select("*", { count: "exact", head: true })
          .eq("team_id", membership.team_id);

        // Get event count
        const { count: eventCount } = await supabase
          .from("events")
          .select("*", { count: "exact", head: true })
          .eq("team_id", membership.team_id);

        if (teamData) {
          setTeam({
            ...teamData,
            memberCount: memberCount || 0,
            eventCount: eventCount || 0,
          });
          setEditedTeam(teamData);
        }
      }
    } catch (error) {
      console.error("Error fetching team data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!team) return;

    try {
      const { error } = await supabase
        .from("teams")
        .update({
          name: editedTeam.name,
          sport: editedTeam.sport,
          description: editedTeam.description,
        })
        .eq("id", team.id);

      if (error) throw error;

      setTeam({ ...team, ...editedTeam });
      setIsEditing(false);
      toast({
        title: "Team updated",
        description: "Your team details have been saved.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const copyInviteCode = () => {
    if (team?.invite_code) {
      navigator.clipboard.writeText(team.invite_code);
      toast({
        title: "Copied!",
        description: "Invite code copied to clipboard.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold mb-2">No Team Found</h2>
          <p className="text-muted-foreground mb-4">You're not part of any team yet.</p>
          <div className="flex gap-3 justify-center">
            <Button asChild>
              <Link to="/create-team">Create Team</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/join-team">Join Team</Link>
            </Button>
          </div>
        </Card>
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
              <Button variant="ghost" size="icon" className="relative" onClick={() => toast({ title: "Notifications", description: "Coming soon!" })}>
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
        {/* Team Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">{team.name}</h1>
            <p className="text-muted-foreground mt-1">{team.sport || "Sports Team"}</p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Team
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{team.memberCount}</div>
                <div className="text-sm text-muted-foreground">Members</div>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-accent/10">
                <Calendar className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold">{team.eventCount}</div>
                <div className="text-sm text-muted-foreground">Events</div>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-secondary/10">
                <DollarSign className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <div className="text-2xl font-bold">$0</div>
                <div className="text-sm text-muted-foreground">Dues Collected</div>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-muted">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">85%</div>
                <div className="text-sm text-muted-foreground">Avg Attendance</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Team Details */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Team Details</h2>
            <div className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <Label htmlFor="name">Team Name</Label>
                    <Input
                      id="name"
                      value={editedTeam.name || ""}
                      onChange={(e) => setEditedTeam({ ...editedTeam, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sport">Sport</Label>
                    <Input
                      id="sport"
                      value={editedTeam.sport || ""}
                      onChange={(e) => setEditedTeam({ ...editedTeam, sport: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editedTeam.description || ""}
                      onChange={(e) => setEditedTeam({ ...editedTeam, description: e.target.value })}
                      rows={4}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label className="text-muted-foreground">Team Name</Label>
                    <p className="font-medium">{team.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Sport</Label>
                    <p className="font-medium">{team.sport || "Not specified"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Description</Label>
                    <p className="font-medium">{team.description || "No description"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Created</Label>
                    <p className="font-medium">
                      {new Date(team.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Invite Section */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Invite Members</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Invite Code</Label>
                <div className="flex gap-2 mt-1">
                  <Input value={team.invite_code} readOnly className="font-mono" />
                  <Button variant="outline" onClick={copyInviteCode}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Share this code with new members to let them join your team.
                </p>
              </div>

              <div className="pt-4 border-t border-border/40">
                <Label className="text-muted-foreground">Public Team Page</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={`gameplan.app/team/${team.invite_code?.toLowerCase()}`}
                    readOnly
                  />
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button variant="hero" className="w-full" asChild>
                <Link to="/team">
                  <Users className="h-4 w-4 mr-2" />
                  View Team Page
                </Link>
              </Button>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link to="/team-roles">
                <Users className="h-5 w-5" />
                <span>Manage Roles</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link to="/calendar/create">
                <Calendar className="h-5 w-5" />
                <span>Create Event</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link to="/payments">
                <DollarSign className="h-5 w-5" />
                <span>Collect Dues</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link to="/chat">
                <Mail className="h-5 w-5" />
                <span>Team Chat</span>
              </Link>
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default TeamDetails;