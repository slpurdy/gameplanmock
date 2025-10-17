import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { 
  Send, 
  Hash, 
  Trophy,
  Bell,
  Settings,
  Plus,
  Search
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

const Chat = () => {
  const channels = [
    { name: "general", unread: 3 },
    { name: "events", unread: 0 },
    { name: "training", unread: 1 },
    { name: "social", unread: 0 },
  ];

  const messages = [
    { user: "Coach Alex", message: "Good morning team! Ready for today's practice?", time: "9:15 AM", initials: "CA" },
    { user: "Sarah M.", message: "Absolutely! See you at the track 🏃‍♀️", time: "9:17 AM", initials: "SM" },
    { user: "Mike T.", message: "Running a bit late, will be there by 9:30", time: "9:20 AM", initials: "MT" },
    { user: "Coach Alex", message: "No problem Mike, we'll start with warmups", time: "9:21 AM", initials: "CA" },
    { user: "Jenny K.", message: "Does anyone have extra water bottles? Forgot mine 😅", time: "9:25 AM", initials: "JK" },
    { user: "Tom R.", message: "I got extras, I'll bring them", time: "9:26 AM", initials: "TR" },
  ];

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 z-50">
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

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Channels */}
        <aside className="w-64 border-r border-border bg-muted/30 hidden md:flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="font-bold text-lg mb-4">Thunder Cycling Club</h2>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-muted-foreground">CHANNELS</span>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {channels.map((channel, index) => (
                <button
                  key={index}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors ${
                    index === 0 ? "bg-muted font-medium" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span>{channel.name}</span>
                  </div>
                  {channel.unread > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center">
                      {channel.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col">
          {/* Channel Header */}
          <div className="border-b border-border p-4 bg-card">
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-bold">general</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              General team discussion and announcements
            </p>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((msg, index) => (
                <div key={index} className="flex gap-3 hover:bg-muted/50 -mx-2 px-2 py-2 rounded-lg transition-colors">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {msg.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-semibold">{msg.user}</span>
                      <span className="text-xs text-muted-foreground">{msg.time}</span>
                    </div>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="border-t border-border p-4 bg-card">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-2">
                <Input 
                  placeholder="Type a message... (Ctrl+Enter to send)" 
                  className="flex-1"
                />
                <Button variant="hero" size="icon">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Press Enter to send • Shift+Enter for new line
              </p>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Member List (optional, hidden on mobile) */}
        <aside className="w-64 border-l border-border bg-muted/30 hidden lg:block">
          <div className="p-4">
            <h3 className="font-semibold mb-4">Members Online • 8</h3>
            <div className="space-y-2">
              {["Coach Alex", "Sarah M.", "Mike T.", "Jenny K.", "Tom R.", "Lisa W.", "James P.", "Anna S."].map((member, index) => (
                <div key={index} className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg transition-colors">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {member.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 h-3 w-3 bg-accent rounded-full border-2 border-card" />
                  </div>
                  <span className="text-sm">{member}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Chat;
