import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useParams } from "react-router-dom";
import { 
  Trophy, Bell, Settings, Calendar, Clock, MapPin, Users, 
  Check, X, HelpCircle, Share2, Edit, MessageSquare, Download
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EventDetail = () => {
  const { id } = useParams();

  const attendees = {
    going: [
      { name: "Coach Alex", initials: "CA" },
      { name: "Sarah M.", initials: "SM" },
      { name: "Mike T.", initials: "MT" },
      { name: "Jenny K.", initials: "JK" },
      { name: "Tom R.", initials: "TR" },
      { name: "Lisa W.", initials: "LW" },
      { name: "James P.", initials: "JP" },
      { name: "Anna S.", initials: "AS" },
      { name: "David L.", initials: "DL" },
      { name: "Emma R.", initials: "ER" },
      { name: "Chris M.", initials: "CM" },
      { name: "Sophie T.", initials: "ST" },
    ],
    maybe: [
      { name: "Kevin B.", initials: "KB" },
      { name: "Rachel G.", initials: "RG" },
    ],
    notGoing: [
      { name: "Mark W.", initials: "MW" },
    ]
  };

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

      <main className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
        {/* Event Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <Link to="/calendar" className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">
              ← Back to Calendar
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Weekend Practice</h1>
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Saturday, January 20, 2025
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                9:00 AM - 12:00 PM
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* RSVP Section */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Your Response</h2>
          <div className="grid grid-cols-3 gap-3">
            <Button variant="default" className="h-16">
              <Check className="h-5 w-5 mr-2" />
              Going
            </Button>
            <Button variant="outline" className="h-16">
              <HelpCircle className="h-5 w-5 mr-2" />
              Maybe
            </Button>
            <Button variant="outline" className="h-16">
              <X className="h-5 w-5 mr-2" />
              Can't Go
            </Button>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Event Details */}
          <div className="md:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Event Details</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Location</div>
                    <div className="text-muted-foreground">Central Park Track</div>
                    <div className="text-sm text-muted-foreground">123 Park Ave, San Francisco, CA</div>
                    <Button variant="link" className="px-0 h-auto">
                      Get Directions →
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">
                    Regular weekend training session. We'll focus on interval training and hill repeats. 
                    Please bring plenty of water, energy snacks, and sunscreen. Weather looks good for 
                    Saturday morning!
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">What to Bring</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-accent" />
                      Water bottles
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-accent" />
                      Energy snacks
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-accent" />
                      Sunscreen
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-accent" />
                      Helmet
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Comments */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-primary" />
                Comments
              </h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">SM</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">Sarah M.</span>
                      <span className="text-xs text-muted-foreground">2 hours ago</span>
                    </div>
                    <p className="text-sm">Looking forward to this! Should we carpool?</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">MT</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">Mike T.</span>
                      <span className="text-xs text-muted-foreground">1 hour ago</span>
                    </div>
                    <p className="text-sm">I can drive! Room for 3 more people.</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <textarea 
                      className="w-full p-3 rounded-lg border bg-background resize-none"
                      placeholder="Add a comment..."
                      rows={2}
                    />
                    <Button variant="hero" size="sm" className="mt-2">
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Attendees Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold mb-4">Attendance</h3>
              
              <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="text-center p-3 bg-accent/10 rounded-lg">
                  <div className="text-2xl font-bold text-accent">{attendees.going.length}</div>
                  <div className="text-xs text-muted-foreground">Going</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{attendees.maybe.length}</div>
                  <div className="text-xs text-muted-foreground">Maybe</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{attendees.notGoing.length}</div>
                  <div className="text-xs text-muted-foreground">No</div>
                </div>
              </div>

              <Tabs defaultValue="going" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="going">Going</TabsTrigger>
                  <TabsTrigger value="maybe">Maybe</TabsTrigger>
                  <TabsTrigger value="no">No</TabsTrigger>
                </TabsList>
                
                <TabsContent value="going" className="mt-4 space-y-2">
                  {attendees.going.map((person, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg transition-colors">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {person.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{person.name}</span>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="maybe" className="mt-4 space-y-2">
                  {attendees.maybe.map((person, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg transition-colors">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {person.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{person.name}</span>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="no" className="mt-4 space-y-2">
                  {attendees.notGoing.map((person, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg transition-colors">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {person.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{person.name}</span>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>

              <Button variant="outline" className="w-full mt-4">
                <Download className="h-4 w-4 mr-2" />
                Export Attendees
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetail;
