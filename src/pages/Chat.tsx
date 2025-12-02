import { useState, useEffect } from "react";
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
  Search,
  Pin,
  FileText,
  Users,
  MoreVertical,
  Sparkles,
  Circle,
  MessageSquare,
  ExternalLink,
  X,
  Upload,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import TeamSwitcher from "@/components/TeamSwitcher";

interface Channel {
  id: string;
  name: string;
  unread: number;
  description?: string;
}

interface Message {
  id: string;
  user: string;
  initials: string;
  content: string;
  time: string;
  isPinned?: boolean;
  isUnread?: boolean;
}

interface PinnedDoc {
  id: string;
  title: string;
  type: string;
  addedBy: string;
  url?: string;
}

interface OnlineMember {
  id: string;
  name: string;
  initials: string;
  status: "online" | "away" | "offline";
}

const Chat = () => {
  const { toast } = useToast();
  const [channels, setChannels] = useState<Channel[]>([
    { id: "1", name: "general", unread: 3, description: "General team discussion" },
    { id: "2", name: "announcements", unread: 1, description: "Important announcements" },
    { id: "3", name: "training", unread: 0, description: "Training schedules and tips" },
    { id: "4", name: "social", unread: 5, description: "Off-topic fun" },
    { id: "5", name: "race-day", unread: 0, description: "Race day coordination" },
  ]);

  const [activeChannel, setActiveChannel] = useState<Channel>(channels[0]);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDesc, setNewChannelDesc] = useState("");
  const [showMissedSummary, setShowMissedSummary] = useState(false);
  const [showPinDoc, setShowPinDoc] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocUrl, setNewDocUrl] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    { id: "1", user: "Coach Alex", initials: "CA", content: "Welcome everyone to the new team chat! 🎉", time: "9:00 AM", isPinned: true },
    { id: "2", user: "Sarah Martinez", initials: "SM", content: "Excited to be here! When's our next practice?", time: "9:15 AM" },
    { id: "3", user: "Mike Thompson", initials: "MT", content: "Saturday at 8am, right?", time: "9:20 AM" },
    { id: "4", user: "Coach Alex", initials: "CA", content: "That's correct! Don't forget to bring your gear.", time: "9:25 AM", isPinned: true },
    { id: "5", user: "Jenny Kim", initials: "JK", content: "I'll bring the water bottles for everyone", time: "9:30 AM", isUnread: true },
    { id: "6", user: "Tom Rodriguez", initials: "TR", content: "Thanks Jenny! See everyone Saturday!", time: "9:45 AM", isUnread: true },
  ]);

  const [pinnedDocs, setPinnedDocs] = useState<PinnedDoc[]>([
    { id: "1", title: "Team Rules & Guidelines", type: "pdf", addedBy: "Coach Alex" },
    { id: "2", title: "Training Schedule Q1", type: "doc", addedBy: "Sarah Martinez" },
    { id: "3", title: "Race Day Checklist", type: "doc", addedBy: "Mike Thompson" },
  ]);

  const [onlineMembers] = useState<OnlineMember[]>([
    { id: "1", name: "Coach Alex", initials: "CA", status: "online" },
    { id: "2", name: "Sarah Martinez", initials: "SM", status: "online" },
    { id: "3", name: "Mike Thompson", initials: "MT", status: "away" },
    { id: "4", name: "Jenny Kim", initials: "JK", status: "online" },
    { id: "5", name: "Tom Rodriguez", initials: "TR", status: "offline" },
    { id: "6", name: "Lisa Wong", initials: "LW", status: "online" },
    { id: "7", name: "James Park", initials: "JP", status: "online" },
    { id: "8", name: "Anna Smith", initials: "AS", status: "away" },
  ]);

  const [missedSummary] = useState({
    messageCount: 23,
    highlights: [
      "Practice moved to Saturday 8am",
      "New team uniforms arriving next week",
      "Jenny volunteered for water duty",
      "Coach posted training schedule",
    ],
    mentionCount: 2,
  });

  const pinnedMessages = messages.filter((m) => m.isPinned);
  const onlineCount = onlineMembers.filter((m) => m.status === "online").length;

  const handleCreateChannel = () => {
    if (newChannelName.trim()) {
      const newChannel: Channel = {
        id: Date.now().toString(),
        name: newChannelName.toLowerCase().replace(/\s+/g, "-"),
        unread: 0,
        description: newChannelDesc || `Channel for ${newChannelName}`,
      };
      setChannels([...channels, newChannel]);
      setNewChannelName("");
      setNewChannelDesc("");
      setShowCreateChannel(false);
      toast({ title: "Channel created!", description: `#${newChannel.name} is ready to use.` });
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        user: "You",
        initials: "YU",
        content: message,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages([...messages, newMessage]);
      setMessage("");
      
      // Clear unread for active channel
      setChannels(channels.map(c => 
        c.id === activeChannel.id ? { ...c, unread: 0 } : c
      ));
    }
  };

  const handlePinMessage = (messageId: string) => {
    setMessages(
      messages.map((m) =>
        m.id === messageId ? { ...m, isPinned: !m.isPinned } : m
      )
    );
    toast({ title: "Message pinned!", description: "Message has been pinned to the channel." });
  };

  const handlePinDoc = () => {
    if (newDocTitle.trim()) {
      const newDoc: PinnedDoc = {
        id: Date.now().toString(),
        title: newDocTitle,
        type: newDocUrl.includes(".pdf") ? "pdf" : "doc",
        addedBy: "You",
        url: newDocUrl,
      };
      setPinnedDocs([...pinnedDocs, newDoc]);
      setNewDocTitle("");
      setNewDocUrl("");
      setShowPinDoc(false);
      toast({ title: "Document pinned!", description: "Document added to channel resources." });
    }
  };

  const handleRemoveDoc = (docId: string) => {
    setPinnedDocs(pinnedDocs.filter(d => d.id !== docId));
    toast({ title: "Document removed", description: "Document has been unpinned." });
  };

  const handleChannelSelect = (channel: Channel) => {
    setActiveChannel(channel);
    // Mark as read
    setChannels(channels.map(c => 
      c.id === channel.id ? { ...c, unread: 0 } : c
    ));
  };

  const filteredChannels = channels.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = channels.reduce((sum, c) => sum + c.unread, 0);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2">
                <Trophy className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold hidden sm:inline">GamePlan</span>
              </Link>
              <TeamSwitcher />
            </div>

            <div className="flex items-center gap-3">
              {/* Online Count Badge */}
              <Badge variant="secondary" className="gap-1 hidden sm:flex">
                <Circle className="h-2 w-2 fill-accent text-accent" />
                {onlineCount} online
              </Badge>

              {/* Missed Summary Button */}
              <Dialog open={showMissedSummary} onOpenChange={setShowMissedSummary}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span className="hidden sm:inline">Catch Up</span>
                    {totalUnread > 0 && (
                      <Badge variant="default" className="ml-1">{totalUnread}</Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Missed Chat Summary</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <Card className="flex-1 p-4 text-center">
                        <div className="text-2xl font-bold text-primary">{missedSummary.messageCount}</div>
                        <div className="text-sm text-muted-foreground">New Messages</div>
                      </Card>
                      <Card className="flex-1 p-4 text-center">
                        <div className="text-2xl font-bold text-accent">{missedSummary.mentionCount}</div>
                        <div className="text-sm text-muted-foreground">Mentions</div>
                      </Card>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Key Highlights</h4>
                      <ul className="space-y-2">
                        {missedSummary.highlights.map((highlight, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <MessageSquare className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button className="w-full" onClick={() => setShowMissedSummary(false)}>
                      Got it!
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {totalUnread > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-secondary rounded-full" />
                )}
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

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Channels */}
        <aside className="w-64 border-r border-border bg-muted/30 hidden md:flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search channels..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Dialog open={showCreateChannel} onOpenChange={setShowCreateChannel}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  New Channel
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Channel</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="channelName">Channel Name</Label>
                    <Input
                      id="channelName"
                      placeholder="e.g., race-prep"
                      value={newChannelName}
                      onChange={(e) => setNewChannelName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="channelDesc">Description (optional)</Label>
                    <Input
                      id="channelDesc"
                      placeholder="What's this channel about?"
                      value={newChannelDesc}
                      onChange={(e) => setNewChannelDesc(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleCreateChannel} className="w-full" disabled={!newChannelName.trim()}>
                    Create Channel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                Channels
              </div>
              {filteredChannels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => handleChannelSelect(channel)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    activeChannel.id === channel.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{channel.name}</span>
                  </div>
                  {channel.unread > 0 && (
                    <Badge variant="default" className="bg-primary text-primary-foreground">
                      {channel.unread}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>

          {/* Third-party Integration */}
          <div className="p-4 border-t border-border">
            <Card className="p-3 bg-muted/50">
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Connect Apps
              </h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => toast({ title: "Coming soon!", description: "Slack integration will be available soon." })}>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.124 2.521a2.528 2.528 0 0 1 2.52-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.52V8.834zm-1.271 0a2.528 2.528 0 0 1-2.521 2.521 2.528 2.528 0 0 1-2.521-2.521V2.522A2.528 2.528 0 0 1 15.166 0a2.528 2.528 0 0 1 2.521 2.522v6.312zm-2.521 10.124a2.528 2.528 0 0 1 2.521 2.52A2.528 2.528 0 0 1 15.166 24a2.528 2.528 0 0 1-2.521-2.522v-2.52h2.521zm0-1.271a2.528 2.528 0 0 1-2.521-2.521 2.528 2.528 0 0 1 2.521-2.521h6.312A2.528 2.528 0 0 1 24 15.166a2.528 2.528 0 0 1-2.522 2.521h-6.312z"/>
                  </svg>
                  Slack
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => toast({ title: "Coming soon!", description: "Discord integration will be available soon." })}>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02z"/>
                  </svg>
                  Discord
                </Button>
              </div>
            </Card>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col">
          {/* Channel Header */}
          <div className="border-b border-border p-4 bg-card">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <Hash className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-xl font-bold">{activeChannel.name}</h2>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeChannel.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* Pinned Messages */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Pin className="h-4 w-4" />
                      <span className="hidden sm:inline">Pinned</span>
                      <Badge variant="secondary">{pinnedMessages.length}</Badge>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Pinned Messages</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-96">
                      <div className="space-y-3">
                        {pinnedMessages.length === 0 ? (
                          <p className="text-muted-foreground text-center py-4">No pinned messages yet</p>
                        ) : (
                          pinnedMessages.map((msg) => (
                            <Card key={msg.id} className="p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-xs">{msg.initials}</AvatarFallback>
                                </Avatar>
                                <span className="font-semibold text-sm">{msg.user}</span>
                                <span className="text-xs text-muted-foreground">{msg.time}</span>
                              </div>
                              <p className="text-sm">{msg.content}</p>
                            </Card>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>

                {/* Pinned Docs */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="hidden sm:inline">Docs</span>
                      <Badge variant="secondary">{pinnedDocs.length}</Badge>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Pinned Documents</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                      {pinnedDocs.map((doc) => (
                        <Card key={doc.id} className="p-3">
                          <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8 text-primary flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold truncate">{doc.title}</div>
                              <div className="text-xs text-muted-foreground">
                                Added by {doc.addedBy}
                              </div>
                            </div>
                            <Badge variant="secondary">{doc.type.toUpperCase()}</Badge>
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveDoc(doc.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                      <Dialog open={showPinDoc} onOpenChange={setShowPinDoc}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full gap-2">
                            <Plus className="h-4 w-4" />
                            Pin a Document
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Pin a Document</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Document Title</Label>
                              <Input
                                placeholder="e.g., Team Handbook"
                                value={newDocTitle}
                                onChange={(e) => setNewDocTitle(e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Document URL (optional)</Label>
                              <Input
                                placeholder="https://..."
                                value={newDocUrl}
                                onChange={(e) => setNewDocUrl(e.target.value)}
                              />
                            </div>
                            <Button onClick={handlePinDoc} className="w-full" disabled={!newDocTitle.trim()}>
                              <Upload className="h-4 w-4 mr-2" />
                              Pin Document
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 group hover:bg-muted/50 -mx-2 px-2 py-2 rounded-lg transition-colors ${
                    msg.isUnread ? "bg-primary/5 border-l-2 border-primary" : ""
                  }`}
                >
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {msg.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{msg.user}</span>
                      <span className="text-xs text-muted-foreground">{msg.time}</span>
                      {msg.isPinned && (
                        <Badge variant="secondary" className="text-xs">
                          <Pin className="h-3 w-3 mr-1" />
                          Pinned
                        </Badge>
                      )}
                      {msg.isUnread && (
                        <Badge className="text-xs bg-primary">New</Badge>
                      )}
                    </div>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handlePinMessage(msg.id)}>
                        <Pin className="h-4 w-4 mr-2" />
                        {msg.isPinned ? "Unpin" : "Pin"} Message
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="border-t border-border p-4 bg-card">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-2">
                <Input
                  placeholder={`Message #${activeChannel.name}`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  className="flex-1"
                />
                <Button variant="hero" onClick={handleSendMessage} disabled={!message.trim()}>
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Press Enter to send • Shift+Enter for new line
              </p>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Members */}
        <aside className="w-64 border-l border-border bg-muted/30 hidden lg:flex flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              Members • {onlineMembers.length}
            </h3>
            <p className="text-xs text-muted-foreground">{onlineCount} online now</p>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-1">
              <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                Online — {onlineCount}
              </div>
              {onlineMembers
                .filter((m) => m.status === "online")
                .map((member) => (
                  <Link
                    key={member.id}
                    to={`/profile/${member.id}`}
                    className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 h-3 w-3 bg-accent rounded-full border-2 border-card" />
                    </div>
                    <span className="text-sm truncate">{member.name}</span>
                  </Link>
                ))}
              
              <div className="text-xs font-semibold text-muted-foreground uppercase mt-4 mb-2">
                Away — {onlineMembers.filter((m) => m.status === "away").length}
              </div>
              {onlineMembers
                .filter((m) => m.status === "away")
                .map((member) => (
                  <Link
                    key={member.id}
                    to={`/profile/${member.id}`}
                    className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 h-3 w-3 bg-yellow-500 rounded-full border-2 border-card" />
                    </div>
                    <span className="text-sm truncate text-muted-foreground">{member.name}</span>
                  </Link>
                ))}

              <div className="text-xs font-semibold text-muted-foreground uppercase mt-4 mb-2">
                Offline — {onlineMembers.filter((m) => m.status === "offline").length}
              </div>
              {onlineMembers
                .filter((m) => m.status === "offline")
                .map((member) => (
                  <Link
                    key={member.id}
                    to={`/profile/${member.id}`}
                    className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg transition-colors opacity-50"
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <span className="text-sm truncate">{member.name}</span>
                  </Link>
                ))}
            </div>
          </ScrollArea>
        </aside>
      </div>
    </div>
  );
};

export default Chat;