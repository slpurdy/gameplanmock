import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Calendar as CalendarIcon, 
  Trophy,
  Bell,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Users,
  Check,
  X,
  HelpCircle
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Calendar = () => {
  const events = [
    { 
      title: "Weekend Practice", 
      date: "Jan 20", 
      time: "9:00 AM", 
      location: "Central Park Track",
      going: 12,
      maybe: 2,
      notGoing: 1,
      status: "going"
    },
    { 
      title: "Team Meeting", 
      date: "Jan 22", 
      time: "7:00 PM", 
      location: "Online (Zoom)",
      going: 18,
      maybe: 3,
      notGoing: 0,
      status: "going"
    },
    { 
      title: "Championship Race", 
      date: "Jan 28", 
      time: "8:00 AM", 
      location: "State Stadium",
      going: 18,
      maybe: 2,
      notGoing: 0,
      status: "maybe"
    },
  ];

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

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Team Calendar</h1>
            <p className="text-muted-foreground">Manage events and track attendance</p>
          </div>
          <Button variant="hero" size="lg" asChild>
            <Link to="/calendar/create">
              <Plus className="h-5 w-5 mr-2" />
              Create Event
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Mini Calendar */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">January 2025</h2>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2 text-center">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <div key={i} className="text-xs font-semibold text-muted-foreground p-2">
                  {day}
                </div>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <button
                  key={day}
                  className={`p-2 text-sm rounded-lg hover:bg-muted transition-colors ${
                    day === 20 || day === 22 || day === 28
                      ? "bg-primary text-primary-foreground font-bold"
                      : day === 15
                      ? "bg-muted font-medium"
                      : ""
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </Card>

          {/* Events List */}
          <div className="md:col-span-2 space-y-4">
            {events.map((event, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-start gap-3 mb-2">
                        <CalendarIcon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="text-xl font-bold">{event.title}</h3>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4" />
                              {event.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {event.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {event.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        {event.going} Going
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <HelpCircle className="h-3 w-3" />
                        {event.maybe} Maybe
                      </Badge>
                      {event.notGoing > 0 && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <X className="h-3 w-3" />
                          {event.notGoing} Can't Go
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2">
                    <Button 
                      variant={event.status === "going" ? "default" : "outline"}
                      className="flex-1 md:flex-none"
                      size="sm"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Going
                    </Button>
                    <Button 
                      variant={event.status === "maybe" ? "default" : "outline"}
                      className="flex-1 md:flex-none"
                      size="sm"
                    >
                      <HelpCircle className="h-4 w-4 mr-1" />
                      Maybe
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1 md:flex-none"
                      size="sm"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Can't Go
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {/* Create Public Event CTA */}
            <Card className="p-8 bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20 text-center">
              <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Host a Public Event</h3>
              <p className="text-muted-foreground mb-4">
                Open registration to other teams and collect signup fees
              </p>
              <Button variant="hero">
                <Plus className="h-4 w-4 mr-2" />
                Create Public Event
              </Button>
            </Card>
          </div>
        </div>

        {/* Attendance Stats */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Attendance Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">94%</div>
              <div className="text-sm text-muted-foreground">Average Attendance</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-1">8</div>
              <div className="text-sm text-muted-foreground">Events This Month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-1">156</div>
              <div className="text-sm text-muted-foreground">Total Check-ins</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">3</div>
              <div className="text-sm text-muted-foreground">Upcoming Events</div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Calendar;
