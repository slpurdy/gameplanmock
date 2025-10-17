import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Users, MessageSquare, Calendar, DollarSign, Share2, Trophy, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const features = [
    {
      icon: Users,
      title: "Team Management",
      description: "Organize your squad, track attendance, and keep everyone connected in one place."
    },
    {
      icon: MessageSquare,
      title: "Team Chat",
      description: "Slack-style communication channels for seamless team conversations and updates."
    },
    {
      icon: Calendar,
      title: "Event Calendar",
      description: "Schedule practices, games, and social events with built-in RSVP tracking."
    },
    {
      icon: DollarSign,
      title: "Dues & Payments",
      description: "Collect team dues and event fees with secure, automated payment processing."
    },
    {
      icon: Trophy,
      title: "Event Hosting",
      description: "Create and promote public events, manage registrations, and grow your community."
    },
    {
      icon: Share2,
      title: "Social Sharing",
      description: "Share team updates and events across social platforms with one click."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              GamePlan
            </span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Your Team's
              <span className="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Command Center
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              The all-in-one platform for amateur sports teams. Chat, schedule, collect dues, and grow your community—all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/signup">
                  Start Free Trial <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/dashboard">View Demo</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Free for teams up to 10 members • No credit card required
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
            <img 
              src={heroImage} 
              alt="Athletes collaborating and celebrating together" 
              className="relative rounded-2xl shadow-2xl w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20 bg-muted/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything Your Team Needs</h2>
          <p className="text-xl text-muted-foreground">
            Built for the way amateur teams actually work
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm"
            >
              <feature.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold">Trusted by Teams Everywhere</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">2,500+</div>
              <div className="text-muted-foreground">Active Teams</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">50K+</div>
              <div className="text-muted-foreground">Team Members</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">98%</div>
              <div className="text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="p-12 bg-gradient-to-br from-primary to-accent text-primary-foreground text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold">Ready to Get Started?</h2>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Join thousands of teams using GamePlan to organize, communicate, and grow.
          </p>
          <Button variant="secondary" size="lg" asChild className="bg-background text-foreground hover:bg-background/90">
            <Link to="/signup">
              Create Your Team <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">GamePlan</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 GamePlan. Built for teams, by athletes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
