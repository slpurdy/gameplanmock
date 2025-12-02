import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useParams } from "react-router-dom";
import BackButton from "@/components/BackButton";
import { useToast } from "@/hooks/use-toast";
import { 
  Trophy, Bell, Settings, Mail, Calendar, MapPin, Star, Award, TrendingUp
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const Profile = () => {
  const { id } = useParams();
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: action,
      description: "This feature is coming soon!",
    });
  };

  const stats = [
    { label: "Events Attended", value: "42", icon: Calendar },
    { label: "Attendance Rate", value: "94%", icon: TrendingUp },
    { label: "Team Wins", value: "8", icon: Award },
  ];

  const recentEvents = [
    { name: "Weekend Practice", date: "Jan 13", status: "attended" },
    { name: "Team Meeting", date: "Jan 8", status: "attended" },
    { name: "Hill Training", date: "Jan 6", status: "missed" },
  ];

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
              <Button variant="ghost" size="icon" className="relative" onClick={() => handleAction("Notifications")}>
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-secondary rounded-full" />
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

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back Link */}
        <Link to="/team" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block hidden">
          ← Back to Team
        </Link>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="md:col-span-1 space-y-6">
            <Card className="p-6 text-center">
              <Avatar className="h-32 w-32 mx-auto mb-4">
                <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                  SM
                </AvatarFallback>
              </Avatar>
              
              <h1 className="text-2xl font-bold mb-1">Sarah Martinez</h1>
              <Badge variant="secondary" className="mb-4">Team Captain</Badge>
              
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-6">
                <MapPin className="h-4 w-4" />
                San Francisco, CA
              </div>

              <div className="space-y-2">
                <Button variant="hero" className="w-full" onClick={() => handleAction("Send Message")}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full" onClick={() => handleAction("View Full Profile")}>
                  View Full Profile
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-4">About</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Passionate cyclist with 5+ years of competitive experience. Love long distance 
                rides and helping new team members improve their skills.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-4">Achievements</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Award className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Perfect Attendance</div>
                    <div className="text-xs text-muted-foreground">2024 Season</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Race Winner</div>
                    <div className="text-xs text-muted-foreground">Regional Championship</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Star className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Team MVP</div>
                    <div className="text-xs text-muted-foreground">2023</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Activity & Stats */}
          <div className="md:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="p-6 text-center">
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-semibold">{event.name}</div>
                        <div className="text-sm text-muted-foreground">{event.date}</div>
                      </div>
                    </div>
                    <Badge variant={event.status === "attended" ? "default" : "outline"}>
                      {event.status === "attended" ? "Attended" : "Missed"}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Performance Overview */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">This Season</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Events Attended</span>
                    <span className="font-semibold">42 / 45</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "93%" }} />
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Team Contributions</span>
                    <span className="font-semibold">28 messages • 12 comments</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Member Since</span>
                    <span className="font-semibold">January 2023</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Contact Info */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="font-medium">sarah.martinez@example.com</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
