import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Link, useNavigate } from "react-router-dom";
import { Trophy, Bell, Settings, Calendar, ArrowLeft, Save } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const CreateEvent = () => {
  const navigate = useNavigate();

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

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <h1 className="text-3xl md:text-4xl font-bold mb-8">Create New Event</h1>

        <Card className="p-6">
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input id="title" placeholder="Weekend Practice" required />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input id="date" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input id="time" type="time" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input id="location" placeholder="Central Park Track" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Full Address</Label>
              <Input id="address" placeholder="123 Park Ave, San Francisco, CA" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Add event details, what to bring, etc..."
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
              <Switch />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="space-y-1">
                <Label>Charge Entry Fee</Label>
                <p className="text-sm text-muted-foreground">
                  Collect payment from attendees
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button variant="hero" className="flex-1" onClick={() => navigate('/calendar')}>
                <Save className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default CreateEvent;
