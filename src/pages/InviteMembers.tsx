import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import {
  Trophy,
  Bell,
  Settings,
  Mail,
  Copy,
  Share2,
  Users,
  Send,
  Check,
  QrCode,
  Link as LinkIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const InviteMembers = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [inviteCode, setInviteCode] = useState("");
  const [teamName, setTeamName] = useState("");
  const [emails, setEmails] = useState("");
  const [personalMessage, setPersonalMessage] = useState(
    "Hey! I'd like to invite you to join our team on GamePlan. It's a great app for organizing practices, events, and keeping in touch with the team."
  );
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchTeamInfo();
  }, [user]);

  const fetchTeamInfo = async () => {
    if (!user) return;

    try {
      const { data: membership } = await supabase
        .from("team_members")
        .select("team_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (membership?.team_id) {
        const { data: team } = await supabase
          .from("teams")
          .select("name, invite_code")
          .eq("id", membership.team_id)
          .single();

        if (team) {
          setTeamName(team.name);
          setInviteCode(team.invite_code);
        }
      }
    } catch (error) {
      console.error("Error fetching team info:", error);
    }
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    toast({
      title: "Copied!",
      description: "Invite code copied to clipboard.",
    });
  };

  const copyInviteLink = () => {
    const link = `${window.location.origin}/join-team?code=${inviteCode}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Copied!",
      description: "Invite link copied to clipboard.",
    });
  };

  const handleSendInvites = async () => {
    const emailList = emails
      .split(/[,\n]/)
      .map((e) => e.trim())
      .filter((e) => e);

    if (emailList.length === 0) {
      toast({
        variant: "destructive",
        title: "No emails",
        description: "Please enter at least one email address.",
      });
      return;
    }

    setSending(true);
    // Simulate sending emails
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSending(false);

    toast({
      title: "Invites sent!",
      description: `Sent ${emailList.length} invitation${emailList.length > 1 ? "s" : ""}.`,
    });
    setEmails("");
  };

  const shareOptions = [
    { name: "WhatsApp", icon: "📱", color: "bg-green-500" },
    { name: "Messenger", icon: "💬", color: "bg-blue-500" },
    { name: "Twitter", icon: "🐦", color: "bg-sky-500" },
    { name: "SMS", icon: "✉️", color: "bg-purple-500" },
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

      <main className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
        {/* Page Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Invite Members to {teamName || "Your Team"}</h1>
          <p className="text-muted-foreground mt-2">
            Grow your team by inviting friends and teammates
          </p>
        </div>

        <Tabs defaultValue="code" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="code">Invite Code</TabsTrigger>
            <TabsTrigger value="email">Email Invite</TabsTrigger>
            <TabsTrigger value="share">Share Link</TabsTrigger>
          </TabsList>

          {/* Invite Code Tab */}
          <TabsContent value="code">
            <Card className="p-6 space-y-6">
              <div className="text-center">
                <Label className="text-muted-foreground">Your Team Invite Code</Label>
                <div className="mt-2 text-4xl font-mono font-bold tracking-widest text-primary">
                  {inviteCode || "--------"}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={copyInviteCode}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Code
                </Button>
                <Button variant="outline" className="flex-1">
                  <QrCode className="h-4 w-4 mr-2" />
                  Show QR Code
                </Button>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">How it works</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Share this code with your teammates</li>
                  <li>They sign up for GamePlan</li>
                  <li>They enter the code to join your team</li>
                </ol>
              </div>
            </Card>
          </TabsContent>

          {/* Email Invite Tab */}
          <TabsContent value="email">
            <Card className="p-6 space-y-4">
              <div>
                <Label htmlFor="emails">Email Addresses</Label>
                <Textarea
                  id="emails"
                  placeholder="Enter email addresses (comma or line separated)"
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate multiple emails with commas or new lines
                </p>
              </div>

              <div>
                <Label htmlFor="message">Personal Message (optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Add a personal message..."
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                variant="hero"
                className="w-full"
                onClick={handleSendInvites}
                disabled={sending || !emails.trim()}
              >
                {sending ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Invitations
                  </>
                )}
              </Button>
            </Card>
          </TabsContent>

          {/* Share Link Tab */}
          <TabsContent value="share">
            <Card className="p-6 space-y-6">
              <div>
                <Label className="text-muted-foreground">Shareable Invite Link</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={`${window.location.origin}/join-team?code=${inviteCode}`}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button variant="outline" onClick={copyInviteLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground mb-3 block">Share via</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {shareOptions.map((option) => (
                    <Button
                      key={option.name}
                      variant="outline"
                      className="h-auto py-4 flex-col gap-2"
                    >
                      <span className="text-2xl">{option.icon}</span>
                      <span className="text-sm">{option.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Auto-approve new members</h4>
                    <p className="text-sm text-muted-foreground">
                      Anyone with this link can join your team instantly
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Invites */}
        <Card className="p-6">
          <h3 className="font-bold mb-4">Pending Invites</h3>
          <div className="space-y-3">
            {[
              { email: "john@example.com", status: "pending", sentAt: "2 hours ago" },
              { email: "jane@example.com", status: "accepted", sentAt: "1 day ago" },
            ].map((invite, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{invite.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{invite.sentAt}</span>
                  <Badge
                    variant={invite.status === "accepted" ? "default" : "secondary"}
                    className={invite.status === "accepted" ? "bg-accent" : ""}
                  >
                    {invite.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default InviteMembers;