import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Trophy, Calendar, Clock, MapPin, Users, DollarSign, 
  Check, Share2, ExternalLink
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import heroImage from "@/assets/hero-image.jpg";

const PublicEvent = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Simple Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">GamePlan</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Event Details */}
          <div className="md:col-span-3 space-y-6">
            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src={heroImage} 
                alt="Event" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 right-4">
                <Button variant="secondary" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Badge variant="secondary" className="mb-3">Public Event</Badge>
              <h1 className="text-4xl font-bold mb-4">Bay Area Century Challenge</h1>
              <p className="text-lg text-muted-foreground">
                Join us for an epic 100-mile cycling challenge through the beautiful Bay Area. 
                All skill levels welcome!
              </p>
            </div>

            {/* Event Info */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Event Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <div className="font-semibold">Date & Time</div>
                    <div className="text-muted-foreground">Saturday, February 15, 2025</div>
                    <div className="text-muted-foreground">6:00 AM - 4:00 PM</div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <div className="font-semibold">Location</div>
                    <div className="text-muted-foreground">Golden Gate Park</div>
                    <div className="text-sm text-muted-foreground">San Francisco, CA</div>
                    <Button variant="link" className="px-0 h-auto">
                      Get Directions <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <div className="font-semibold">Participants</div>
                    <div className="text-muted-foreground">127 registered • 200 spots total</div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <div className="font-semibold">Entry Fee</div>
                    <div className="text-muted-foreground">$35.00 per rider</div>
                    <div className="text-sm text-muted-foreground">Includes SAG support, route markings, and post-ride meal</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* About */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">About This Event</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  The Bay Area Century Challenge is a premier cycling event that takes riders through 
                  some of the most scenic routes in Northern California. Whether you're a seasoned 
                  cyclist or attempting your first century, this event offers support and camaraderie 
                  every mile of the way.
                </p>
                <p>
                  The route includes rolling hills, coastal views, and well-marked paths with SAG 
                  support at regular intervals. Rest stops provide water, snacks, and mechanical 
                  support as needed.
                </p>
                <h3 className="font-semibold text-foreground pt-2">What's Included:</h3>
                <ul className="space-y-2">
                  {[
                    "Fully marked and supported route",
                    "SAG vehicle support",
                    "Rest stops every 15-20 miles",
                    "Post-ride meal and celebration",
                    "Finisher medal",
                    "Event t-shirt"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-accent flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            {/* Organizer */}
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Organized by</h3>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Thunder Cycling Club</div>
                  <div className="text-sm text-muted-foreground">San Francisco, CA</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Registration Sidebar */}
          <div className="md:col-span-2">
            <Card className="p-6 sticky top-24">
              <div className="space-y-6">
                <div>
                  <div className="text-3xl font-bold mb-2">$35.00</div>
                  <div className="text-sm text-muted-foreground">Per participant</div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" placeholder="John Doe" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" placeholder="you@example.com" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" type="tel" placeholder="(555) 123-4567" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency">Emergency Contact *</Label>
                    <Input id="emergency" placeholder="Name and phone" required />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>T-Shirt Size</Label>
                    <select className="w-full p-2 rounded-lg border bg-background">
                      <option>Small</option>
                      <option>Medium</option>
                      <option>Large</option>
                      <option>X-Large</option>
                      <option>XX-Large</option>
                    </select>
                  </div>

                  <div className="flex items-start gap-2">
                    <input type="checkbox" id="waiver" className="mt-1" required />
                    <label htmlFor="waiver" className="text-sm text-muted-foreground">
                      I agree to the event waiver and understand the risks involved in cycling
                    </label>
                  </div>
                </div>

                <Button variant="hero" size="lg" className="w-full">
                  Register & Pay
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Secure payment powered by Stripe
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublicEvent;
