import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  MessageSquare, 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp,
  Bell,
  Trophy,
  LogOut,
  Settings
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const upcomingEvents = [
    { title: "Weekend Practice", date: "Sat, Jan 20", attendees: 12, total: 15 },
    { title: "Championship Race", date: "Sun, Jan 28", attendees: 18, total: 20 },
  ];

  const recentMessages = [
    { user: "Sarah M.", message: "Are we still on for Saturday?", time: "2m ago" },
    { user: "Mike T.", message: "Great practice everyone! 💪", time: "1h ago" },
    { user: "Coach Alex", message: "Don't forget to bring your gear", time: "3h ago" },
  ];

  const stats = [
    { label: "Team Members", value: "24", icon: Users, color: "text-primary" },
    { label: "This Month Events", value: "8", icon: Calendar, color: "text-accent" },
    { label: "Dues Collected", value: "$480", icon: DollarSign, color: "text-secondary" },
    { label: "Attendance Rate", value: "94%", icon: TrendingUp, color: "text-primary" },
  ];

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
            
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className="font-medium text-primary">
                Dashboard
              </Link>
              <Link to="/chat" className="text-muted-foreground hover:text-foreground transition-colors">
                Chat
              </Link>
              <Link to="/calendar" className="text-muted-foreground hover:text-foreground transition-colors">
                Calendar
              </Link>
              <Link to="/payments" className="text-muted-foreground hover:text-foreground transition-colors">
                Payments
              </Link>
              <Link to="/team" className="text-muted-foreground hover:text-foreground transition-colors">
                Team
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-secondary rounded-full" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-primary to-accent p-8 rounded-2xl text-primary-foreground">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, Coach! 👋</h1>
          <p className="text-primary-foreground/90 text-lg">
            Thunder Cycling Club • 24 active members
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-2">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upcoming Events */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                Upcoming Events
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/calendar">View All</Link>
              </Button>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.date}</p>
                    </div>
                    <Badge variant="secondary">
                      {event.attendees}/{event.total}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    Manage RSVP
                  </Button>
                </div>
              ))}
              <Button variant="hero" className="w-full" asChild>
                <Link to="/calendar">
                  <Calendar className="h-4 w-4 mr-2" />
                  Create New Event
                </Link>
              </Button>
            </div>
          </Card>

          {/* Recent Messages */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-primary" />
                Team Chat
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/chat">Open Chat</Link>
              </Button>
            </div>
            <div className="space-y-4">
              {recentMessages.map((msg, index) => (
                <div key={index} className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {msg.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-sm">{msg.user}</span>
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{msg.message}</p>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="default" className="w-full" asChild>
                <Link to="/chat">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Go to Chat
                </Link>
              </Button>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-24 flex-col gap-2" asChild>
              <Link to="/payments">
                <DollarSign className="h-6 w-6" />
                Collect Dues
              </Link>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2" asChild>
              <Link to="/calendar">
                <Calendar className="h-6 w-6" />
                New Event
              </Link>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2" asChild>
              <Link to="/team">
                <Users className="h-6 w-6" />
                Invite Members
              </Link>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2" asChild>
              <Link to="/team">
                <Trophy className="h-6 w-6" />
                Team Page
              </Link>
            </Button>
          </div>
        </Card>

        {/* Upgrade Banner */}
        <Card className="p-6 bg-gradient-to-r from-secondary/10 to-accent/10 border-secondary/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2">Unlock Premium Features</h3>
              <p className="text-muted-foreground">
                Get unlimited members, custom branding, and advanced analytics
              </p>
            </div>
            <Button variant="accent" size="lg">
              Upgrade Now
            </Button>
          </div>
        </Card>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <div className="grid grid-cols-5 gap-2">
          <Link to="/dashboard" className="flex flex-col items-center gap-1 text-primary">
            <Trophy className="h-5 w-5" />
            <span className="text-xs font-medium">Home</span>
          </Link>
          <Link to="/chat" className="flex flex-col items-center gap-1 text-muted-foreground">
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs">Chat</span>
          </Link>
          <Link to="/calendar" className="flex flex-col items-center gap-1 text-muted-foreground">
            <Calendar className="h-5 w-5" />
            <span className="text-xs">Events</span>
          </Link>
          <Link to="/payments" className="flex flex-col items-center gap-1 text-muted-foreground">
            <DollarSign className="h-5 w-5" />
            <span className="text-xs">Payments</span>
          </Link>
          <Link to="/team" className="flex flex-col items-center gap-1 text-muted-foreground">
            <Users className="h-5 w-5" />
            <span className="text-xs">Team</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
