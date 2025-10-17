import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { 
  Trophy,
  Bell,
  Settings,
  Users,
  Share2,
  Copy,
  ExternalLink,
  Mail,
  Edit,
  Instagram,
  Facebook,
  Twitter
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import teamIcon from "@/assets/team-icon.png";

const Team = () => {
  const teamMembers = [
    { name: "Coach Alex", role: "Coach", status: "online", initials: "CA" },
    { name: "Sarah Martinez", role: "Captain", status: "online", initials: "SM" },
    { name: "Mike Thompson", role: "Member", status: "online", initials: "MT" },
    { name: "Jenny Kim", role: "Member", status: "offline", initials: "JK" },
    { name: "Tom Rodriguez", role: "Member", status: "online", initials: "TR" },
    { name: "Lisa Wong", role: "Treasurer", status: "offline", initials: "LW" },
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
        {/* Team Brochure Page */}
        <Card className="overflow-hidden">
          {/* Hero Banner */}
          <div className="h-48 bg-gradient-to-r from-primary via-accent to-secondary relative">
            <div className="absolute top-4 right-4">
              <Button variant="secondary" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Page
              </Button>
            </div>
          </div>

          <div className="px-8 pb-8">
            {/* Team Logo & Info */}
            <div className="flex flex-col md:flex-row gap-6 -mt-16 mb-8">
              <img 
                src={teamIcon} 
                alt="Thunder Cycling Club logo" 
                className="h-32 w-32 rounded-2xl border-4 border-background shadow-xl bg-background"
              />
              <div className="flex-1 pt-16 md:pt-20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Thunder Cycling Club</h1>
                    <p className="text-muted-foreground text-lg">
                      Competitive cycling team • Founded 2020 • San Francisco, CA
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="hero">
                      <Mail className="h-4 w-4 mr-2" />
                      Join Team
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-2xl font-bold mb-3">About Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Thunder Cycling Club is a competitive amateur cycling team based in the San Francisco Bay Area. 
                  We organize weekly training rides, participate in regional races, and foster a supportive 
                  community of cyclists of all skill levels. Whether you're training for your first century or 
                  competing at the elite level, you'll find your place with Thunder.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-3xl font-bold text-primary mb-1">24</div>
                  <div className="text-sm text-muted-foreground">Members</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-3xl font-bold text-accent mb-1">156</div>
                  <div className="text-sm text-muted-foreground">Rides This Year</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-3xl font-bold text-secondary mb-1">12</div>
                  <div className="text-sm text-muted-foreground">Race Wins</div>
                </Card>
              </div>

              {/* Public Page Link */}
              <Card className="p-6 bg-muted/50">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-primary" />
                  Public Team Page
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Share your team's public page with potential members and sponsors
                </p>
                <div className="flex gap-2">
                  <Input 
                    value="gameplan.app/thunder-cycling" 
                    readOnly 
                    className="flex-1"
                  />
                  <Button variant="outline">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="default">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </Card>

              {/* Social Links */}
              <div>
                <h3 className="font-bold mb-4">Connect With Us</h3>
                <div className="flex gap-3">
                  <Button variant="outline" size="icon">
                    <Instagram className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Twitter className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Team Members */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Team Members ({teamMembers.length})
            </h2>
            <Button variant="hero">
              <Mail className="h-4 w-4 mr-2" />
              Invite Members
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member, index) => (
              <Card key={index} className="p-4 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    {member.status === "online" && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 bg-accent rounded-full border-2 border-card" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{member.name}</div>
                    <Badge variant="secondary" className="text-xs">
                      {member.role}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Share & Promote */}
        <Card className="p-8 bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
          <div className="text-center space-y-4">
            <Share2 className="h-12 w-12 text-primary mx-auto" />
            <h2 className="text-3xl font-bold">Share Your Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Post your team page and upcoming events to social media with one click. 
              Grow your community and attract new members.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="hero">
                Share on Instagram
              </Button>
              <Button variant="outline">
                Share on Facebook
              </Button>
              <Button variant="outline">
                Copy Link
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Team;
