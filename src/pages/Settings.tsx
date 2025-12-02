import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import BackButton from "@/components/BackButton";
import { useToast } from "@/hooks/use-toast";
import { 
  Trophy, Bell, Settings as SettingsIcon, Save, Upload, Shield, CreditCard, Users, Trash2
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  const { toast } = useToast();

  const handleSave = (section: string) => {
    toast({
      title: "Settings saved!",
      description: `Your ${section} settings have been updated.`,
    });
  };

  const handleAction = (action: string) => {
    toast({
      title: action,
      description: "This feature is coming soon!",
    });
  };

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
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and team preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                <Button variant="outline" onClick={() => handleAction("Upload Photo")}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john.doe@example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Tell your team about yourself..."
                    rows={4}
                    defaultValue="Cycling enthusiast and weekend warrior. Been riding for 5 years!"
                  />
                </div>

                <Button variant="hero" onClick={() => handleSave("profile")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Team Settings */}
          <TabsContent value="team" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Team Settings</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input id="teamName" defaultValue="Thunder Cycling Club" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teamDescription">Team Description</Label>
                  <Textarea 
                    id="teamDescription"
                    rows={4}
                    defaultValue="Competitive amateur cycling team based in San Francisco Bay Area."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teamLocation">Location</Label>
                  <Input id="teamLocation" defaultValue="San Francisco, CA" />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Allow New Member Requests</Label>
                    <p className="text-sm text-muted-foreground">
                      Let people request to join your team
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Public Team Page</Label>
                    <p className="text-sm text-muted-foreground">
                      Make your team page visible to everyone
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Button variant="hero" onClick={() => handleSave("team")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Team Settings
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>New Messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify me about new chat messages
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Event Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Send reminders before events
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Payment Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify about pending dues
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Team Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Important team announcements
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch />
                </div>

                <Button variant="hero" onClick={() => handleSave("notification")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Payments */}
          <TabsContent value="payments" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Payment Methods</h2>
              
              <div className="space-y-6">
                <div className="p-4 border-2 border-primary/20 rounded-lg bg-primary/5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-6 w-6 text-primary" />
                      <div>
                        <div className="font-semibold">Stripe Account</div>
                        <div className="text-sm text-muted-foreground">Connected</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleAction("Configure Stripe")}>Configure</Button>
                  </div>
                </div>

                <Button variant="outline" className="w-full" onClick={() => handleAction("Add Payment Method")}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Billing History</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium">Premium Plan</div>
                        <div className="text-sm text-muted-foreground">Jan 1, 2025</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">$29.00</div>
                        <Button variant="ghost" size="sm" onClick={() => handleAction("Download Receipt")}>Download</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Security Settings</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>

                <Button variant="hero" onClick={() => handleSave("password")}>
                  <Shield className="h-4 w-4 mr-2" />
                  Update Password
                </Button>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => handleAction("Enable 2FA")}>Enable</Button>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="font-semibold text-destructive">Danger Zone</h3>
                  <Card className="p-4 border-destructive/50">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Delete Account</div>
                        <div className="text-sm text-muted-foreground">
                          Permanently delete your account and all data
                        </div>
                      </div>
                      <Button variant="destructive" onClick={() => handleAction("Delete Account")}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;
