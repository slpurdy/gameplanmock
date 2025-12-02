import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Trophy,
  Bell,
  Settings,
  Calendar,
  Users,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Clock,
  MapPin,
  ChevronRight,
  Star,
  Activity,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface UserStats {
  eventsAttended: number;
  totalEvents: number;
  messagesThisWeek: number;
  duesPaid: number;
  duesTotal: number;
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  rsvpStatus: "going" | "maybe" | "not_going" | null;
}

const UserDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<{ full_name: string; avatar_url: string | null } | null>(null);
  const [stats] = useState<UserStats>({
    eventsAttended: 12,
    totalEvents: 15,
    messagesThisWeek: 47,
    duesPaid: 150,
    duesTotal: 200,
  });

  const [upcomingEvents] = useState<UpcomingEvent[]>([
    { id: "1", title: "Saturday Practice", date: "Dec 7", time: "8:00 AM", location: "Main Field", rsvpStatus: "going" },
    { id: "2", title: "Team Meeting", date: "Dec 9", time: "6:00 PM", location: "Community Center", rsvpStatus: null },
    { id: "3", title: "Championship Game", date: "Dec 14", time: "2:00 PM", location: "Stadium", rsvpStatus: "going" },
  ]);

  const [recentActivity] = useState([
    { type: "rsvp", message: "You RSVP'd to Saturday Practice", time: "2 hours ago" },
    { type: "message", message: "New message in #general", time: "5 hours ago" },
    { type: "payment", message: "Payment received for December dues", time: "1 day ago" },
    { type: "event", message: "New event: Championship Game", time: "2 days ago" },
  ]);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user.id)
      .single();
    if (data) setProfile(data);
  };

  const attendanceRate = Math.round((stats.eventsAttended / stats.totalEvents) * 100);
  const duesProgress = Math.round((stats.duesPaid / stats.duesTotal) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <Trophy className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">GamePlan</span>
            </Link>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-secondary rounded-full" />
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/settings">
                  <Settings className="h-5 w-5" />
                </Link>
              </Button>
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {profile?.full_name?.split(" ").map((n) => n[0]).join("") || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {profile?.full_name?.split(" ")[0] || "Player"}!
            </h1>
            <p className="text-muted-foreground mt-1">Here's what's happening with your team</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/profile/me">
                <Settings className="h-4 w-4 mr-2" />
                My Profile
              </Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/dashboard">
                <Users className="h-4 w-4 mr-2" />
                Team Dashboard
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold">{stats.eventsAttended}</div>
                <div className="text-sm text-muted-foreground">Events Attended</div>
              </div>
            </div>
            <Progress value={attendanceRate} className="mt-3" />
            <p className="text-xs text-muted-foreground mt-1">{attendanceRate}% attendance rate</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-accent/10">
                <MessageSquare className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.messagesThisWeek}</div>
                <div className="text-sm text-muted-foreground">Messages This Week</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-secondary/10">
                <DollarSign className="h-5 w-5 text-secondary" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold">${stats.duesPaid}</div>
                <div className="text-sm text-muted-foreground">Dues Paid</div>
              </div>
            </div>
            <Progress value={duesProgress} className="mt-3" />
            <p className="text-xs text-muted-foreground mt-1">${stats.duesTotal - stats.duesPaid} remaining</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-yellow-500/10">
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">Gold</div>
                <div className="text-sm text-muted-foreground">Member Status</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upcoming Events */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Events
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/calendar">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <Link
                  key={event.id}
                  to={`/event/${event.id}`}
                  className="block p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.date} at {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </span>
                      </div>
                    </div>
                    {event.rsvpStatus && (
                      <Badge
                        variant={event.rsvpStatus === "going" ? "default" : "secondary"}
                        className={event.rsvpStatus === "going" ? "bg-accent" : ""}
                      >
                        {event.rsvpStatus === "going" ? "Going" : event.rsvpStatus}
                      </Badge>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Recent Activity
              </h2>
            </div>
            <ScrollArea className="h-[280px]">
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-muted">
                      {activity.type === "rsvp" && <Calendar className="h-4 w-4" />}
                      {activity.type === "message" && <MessageSquare className="h-4 w-4" />}
                      {activity.type === "payment" && <DollarSign className="h-4 w-4" />}
                      {activity.type === "event" && <Star className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link to="/calendar">
                <Calendar className="h-5 w-5" />
                <span>View Calendar</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link to="/chat">
                <MessageSquare className="h-5 w-5" />
                <span>Team Chat</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link to="/payments">
                <DollarSign className="h-5 w-5" />
                <span>Pay Dues</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link to="/team">
                <Users className="h-5 w-5" />
                <span>Team Info</span>
              </Link>
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default UserDashboard;