import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronDown, Plus, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Team {
  id: string;
  name: string;
  sport: string | null;
  role: string;
}

interface TeamSwitcherProps {
  currentTeamId?: string;
  onTeamChange?: (teamId: string) => void;
}

const TeamSwitcher = ({ currentTeamId, onTeamChange }: TeamSwitcherProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserTeams();
    }
  }, [user]);

  useEffect(() => {
    if (teams.length > 0 && !activeTeam) {
      const team = currentTeamId 
        ? teams.find(t => t.id === currentTeamId) || teams[0]
        : teams[0];
      setActiveTeam(team);
    }
  }, [teams, currentTeamId]);

  const fetchUserTeams = async () => {
    if (!user) return;

    try {
      const { data: memberships, error } = await supabase
        .from("team_members")
        .select(`
          team_id,
          role,
          teams (
            id,
            name,
            sport
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;

      const userTeams: Team[] = memberships
        ?.filter(m => m.teams)
        .map(m => ({
          id: (m.teams as any).id,
          name: (m.teams as any).name,
          sport: (m.teams as any).sport,
          role: m.role,
        })) || [];

      setTeams(userTeams);
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTeamSelect = (team: Team) => {
    setActiveTeam(team);
    onTeamChange?.(team.id);
    // Store selected team in localStorage for persistence
    localStorage.setItem("activeTeamId", team.id);
  };

  if (loading) {
    return (
      <Button variant="ghost" className="gap-2" disabled>
        <Users className="h-4 w-4" />
        Loading...
      </Button>
    );
  }

  if (teams.length === 0) {
    return (
      <Button variant="outline" className="gap-2" asChild>
        <Link to="/create-team">
          <Plus className="h-4 w-4" />
          Create Team
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 max-w-[200px]">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {activeTeam?.name?.substring(0, 2).toUpperCase() || "T"}
            </AvatarFallback>
          </Avatar>
          <span className="truncate font-semibold">{activeTeam?.name || "Select Team"}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Your Teams</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {teams.map((team) => (
          <DropdownMenuItem
            key={team.id}
            onClick={() => handleTeamSelect(team)}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-3 flex-1">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {team.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{team.name}</div>
                <div className="text-xs text-muted-foreground">
                  {team.sport || "Team"} • {team.role}
                </div>
              </div>
              {activeTeam?.id === team.id && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/create-team" className="cursor-pointer">
            <Plus className="h-4 w-4 mr-2" />
            Create New Team
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/join-team" className="cursor-pointer">
            <Users className="h-4 w-4 mr-2" />
            Join a Team
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TeamSwitcher;