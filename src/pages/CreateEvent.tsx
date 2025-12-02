import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Link, useNavigate } from "react-router-dom";
import BackButton from "@/components/BackButton";
import { Trophy, Bell, Settings as SettingsIcon, Calendar, Save } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [teamId, setTeamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [requiresPayment, setRequiresPayment] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserTeam();
    }
  }, [user]);

  const fetchUserTeam = async () => {
    const { data } = await supabase
      .from('team_members')
      .select('team_id')
      .eq('user_id', user?.id)
      .maybeSingle();

    if (data) {
      setTeamId(data.team_id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !teamId) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('events')
        .insert([{
          team_id: teamId,
          title,
          event_date: date,
          event_time: time,
          location,
          address: address || null,
          description: description || null,
          is_public: isPublic,
          requires_payment: requiresPayment,
          created_by: user.id
        }]);

      if (error) throw error;

      toast({
        title: "Event created!",
        description: "Your team can now see this event.",
      });

      navigate('/calendar');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create event.",
      });
    } finally {
      setLoading(false);
    }
  };

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
                <span className="absolute top-1 right-1 h-2 w-2 bg-secondary rounded-full" />
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/settings">
                  <SettingsIcon className="h-5 w-5" />
                </Link>
              </Button>
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Create New Event</h1>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input 
                id="title" 
                placeholder="Weekend Practice" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required 
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input 
                  id="time" 
                  type="time" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input 
                id="location" 
                placeholder="Central Park Track" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Full Address</Label>
              <Input 
                id="address" 
                placeholder="123 Park Ave, San Francisco, CA" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Add event details, what to bring, etc..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="space-y-1">
                <Label>Public Event</Label>
                <p className="text-sm text-muted-foreground">
                  Allow non-members to see and register for this event
                </p>
              </div>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="space-y-1">
                <Label>Charge Entry Fee</Label>
                <p className="text-sm text-muted-foreground">
                  Collect payment from attendees
                </p>
              </div>
              <Switch checked={requiresPayment} onCheckedChange={setRequiresPayment} />
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" type="button" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button variant="hero" className="flex-1" type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Creating..." : "Create Event"}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default CreateEvent;
