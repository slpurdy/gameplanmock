import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Trophy, ArrowRight, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const JoinTeam = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !inviteCode.trim()) return;

    setLoading(true);
    try {
      // Find team by invite code
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('id, name')
        .eq('invite_code', inviteCode.toUpperCase())
        .maybeSingle();

      if (teamError) throw teamError;

      if (!team) {
        toast({
          variant: "destructive",
          title: "Invalid code",
          description: "Team not found with this invite code.",
        });
        setLoading(false);
        return;
      }

      // Join the team
      const { error: joinError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: user.id,
          role: 'member'
        });

      if (joinError) {
        if (joinError.code === '23505') {
          toast({
            variant: "destructive",
            title: "Already a member",
            description: "You're already part of this team.",
          });
        } else {
          throw joinError;
        }
        setLoading(false);
        return;
      }

      toast({
        title: "Welcome!",
        description: `You've joined ${team.name}!`,
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to join team. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Trophy className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">GamePlan</span>
          </Link>
          <h1 className="text-3xl font-bold">Join a Team</h1>
          <p className="text-muted-foreground">Enter your team's invite code to get started</p>
        </div>

        <form onSubmit={handleJoinTeam} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inviteCode">Team Invite Code</Label>
            <Input 
              id="inviteCode" 
              placeholder="Enter 8-character code" 
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              maxLength={8}
              required
              className="text-center text-lg tracking-widest uppercase"
            />
            <p className="text-sm text-muted-foreground">
              Ask your team admin for the invite code
            </p>
          </div>

          <Button 
            variant="hero" 
            className="w-full" 
            size="lg"
            type="submit"
            disabled={loading || !inviteCode.trim()}
          >
            {loading ? "Joining..." : "Join Team"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <Button variant="outline" className="w-full" size="lg" asChild>
          <Link to="/create-team">
            <Users className="h-4 w-4 mr-2" />
            Create a New Team
          </Link>
        </Button>
      </Card>
    </div>
  );
};

export default JoinTeam;
