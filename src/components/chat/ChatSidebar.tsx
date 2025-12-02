import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Hash,
  Plus,
  Search,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Settings,
  Home,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface Channel {
  id: string;
  name: string;
  unread: number;
  description?: string;
  isPrivate?: boolean;
}

interface DirectMessage {
  id: string;
  name: string;
  initials: string;
  status: "online" | "away" | "offline";
  unread: number;
}

interface MissedSummary {
  messageCount: number;
  highlights: string[];
  mentionCount: number;
}

interface ChatSidebarProps {
  channels: Channel[];
  directMessages: DirectMessage[];
  activeChannelId: string;
  onChannelSelect: (channel: Channel) => void;
  onDMSelect: (dm: DirectMessage) => void;
  onCreateChannel: (name: string, description: string) => void;
  teamName: string;
  totalUnread: number;
  missedSummary?: MissedSummary;
}

const ChatSidebar = ({
  channels,
  directMessages,
  activeChannelId,
  onChannelSelect,
  onDMSelect,
  onCreateChannel,
  teamName,
  totalUnread,
  missedSummary,
}: ChatSidebarProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showMissedSummary, setShowMissedSummary] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDesc, setNewChannelDesc] = useState("");
  const [channelsExpanded, setChannelsExpanded] = useState(true);
  const [dmsExpanded, setDmsExpanded] = useState(true);
  const [appsExpanded, setAppsExpanded] = useState(true);

  const filteredChannels = channels.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateChannel = () => {
    if (newChannelName.trim()) {
      onCreateChannel(newChannelName, newChannelDesc);
      setNewChannelName("");
      setNewChannelDesc("");
      setShowCreateChannel(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-accent";
      case "away":
        return "bg-yellow-500";
      default:
        return "bg-muted-foreground/40";
    }
  };

  return (
    <aside className="w-64 bg-[hsl(215,30%,12%)] text-[hsl(0,0%,90%)] flex flex-col h-full">
      {/* Workspace Header */}
      <div className="p-3 border-b border-[hsl(215,25%,20%)]">
        <button className="w-full flex items-center justify-between hover:bg-[hsl(215,25%,16%)] p-2 rounded-md transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-primary-foreground">
              {teamName.charAt(0).toUpperCase()}
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm truncate max-w-[140px]">{teamName}</div>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-8 bg-[hsl(215,25%,16%)] border-[hsl(215,25%,20%)] text-[hsl(0,0%,90%)] placeholder:text-muted-foreground h-8 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="px-2 space-y-0.5">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-[hsl(0,0%,70%)] hover:bg-[hsl(215,25%,16%)] rounded-md transition-colors"
        >
          <Home className="h-4 w-4" />
          Home
        </Link>
        <button className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-[hsl(0,0%,70%)] hover:bg-[hsl(215,25%,16%)] rounded-md transition-colors">
          <MessageSquare className="h-4 w-4" />
          Threads
        </button>
        
        {/* Missed Summary / Catch Up */}
        <Dialog open={showMissedSummary} onOpenChange={setShowMissedSummary}>
          <DialogTrigger asChild>
            <button className="w-full flex items-center justify-between px-3 py-1.5 text-sm text-[hsl(0,0%,70%)] hover:bg-[hsl(215,25%,16%)] rounded-md transition-colors">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Catch Up
              </div>
              {totalUnread > 0 && (
                <Badge className="bg-secondary text-secondary-foreground text-xs h-5 min-w-[20px]">
                  {totalUnread}
                </Badge>
              )}
            </button>
          </DialogTrigger>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-secondary" />
                Missed Chat Summary
              </DialogTitle>
            </DialogHeader>
            {missedSummary && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{missedSummary.messageCount}</div>
                    <div className="text-xs text-muted-foreground">New Messages</div>
                  </div>
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-secondary">{missedSummary.mentionCount}</div>
                    <div className="text-xs text-muted-foreground">Mentions</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Key Highlights</h4>
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
            )}
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="flex-1 px-2 py-3">
        {/* Channels Section */}
        <div className="mb-4">
          <button
            onClick={() => setChannelsExpanded(!channelsExpanded)}
            className="w-full flex items-center justify-between px-2 py-1 text-sm text-[hsl(0,0%,70%)] hover:text-[hsl(0,0%,90%)] transition-colors"
          >
            <div className="flex items-center gap-1">
              {channelsExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
              <span className="font-medium">Channels</span>
            </div>
            <Dialog open={showCreateChannel} onOpenChange={setShowCreateChannel}>
              <DialogTrigger asChild>
                <Plus
                  className="h-4 w-4 opacity-0 group-hover:opacity-100 hover:bg-[hsl(215,25%,20%)] rounded"
                  onClick={(e) => e.stopPropagation()}
                />
              </DialogTrigger>
              <DialogContent className="bg-card">
                <DialogHeader>
                  <DialogTitle>Create Channel</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Channel Name</Label>
                    <Input
                      placeholder="e.g., announcements"
                      value={newChannelName}
                      onChange={(e) => setNewChannelName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Description (optional)</Label>
                    <Input
                      placeholder="What's this channel about?"
                      value={newChannelDesc}
                      onChange={(e) => setNewChannelDesc(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleCreateChannel} className="w-full" disabled={!newChannelName.trim()}>
                    Create
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </button>

          {channelsExpanded && (
            <div className="mt-1 space-y-0.5">
              {filteredChannels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => onChannelSelect(channel)}
                  className={`w-full flex items-center justify-between px-2 py-1 rounded-md text-sm transition-colors ${
                    activeChannelId === channel.id
                      ? "bg-primary/20 text-primary-foreground"
                      : "text-[hsl(0,0%,70%)] hover:bg-[hsl(215,25%,16%)]"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Hash className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{channel.name}</span>
                  </div>
                  {channel.unread > 0 && (
                    <Badge className="bg-secondary text-secondary-foreground text-xs h-5 min-w-[20px]">
                      {channel.unread}
                    </Badge>
                  )}
                </button>
              ))}
              <Dialog open={showCreateChannel} onOpenChange={setShowCreateChannel}>
                <DialogTrigger asChild>
                  <button className="w-full flex items-center gap-1.5 px-2 py-1 text-sm text-[hsl(0,0%,50%)] hover:text-[hsl(0,0%,70%)] transition-colors">
                    <Plus className="h-4 w-4" />
                    Add channel
                  </button>
                </DialogTrigger>
              </Dialog>
            </div>
          )}
        </div>

        {/* Direct Messages Section */}
        <div>
          <button
            onClick={() => setDmsExpanded(!dmsExpanded)}
            className="w-full flex items-center gap-1 px-2 py-1 text-sm text-[hsl(0,0%,70%)] hover:text-[hsl(0,0%,90%)] transition-colors"
          >
            {dmsExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
            <span className="font-medium">Direct Messages</span>
          </button>

          {dmsExpanded && (
            <div className="mt-1 space-y-0.5">
              {directMessages.map((dm) => (
                <button
                  key={dm.id}
                  onClick={() => onDMSelect(dm)}
                  className="w-full flex items-center justify-between px-2 py-1 rounded-md text-sm text-[hsl(0,0%,70%)] hover:bg-[hsl(215,25%,16%)] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-[10px] bg-[hsl(215,25%,25%)]">
                          {dm.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-[hsl(215,30%,12%)] ${getStatusColor(
                          dm.status
                        )}`}
                      />
                    </div>
                    <span className="truncate">{dm.name}</span>
                  </div>
                  {dm.unread > 0 && (
                    <Badge className="bg-secondary text-secondary-foreground text-xs h-5 min-w-[20px]">
                      {dm.unread}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Apps / Integrations Section */}
        <div className="mt-4">
          <button
            onClick={() => setAppsExpanded(!appsExpanded)}
            className="w-full flex items-center gap-1 px-2 py-1 text-sm text-[hsl(0,0%,70%)] hover:text-[hsl(0,0%,90%)] transition-colors"
          >
            {appsExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
            <span className="font-medium">Apps</span>
          </button>

          {appsExpanded && (
            <div className="mt-1 space-y-0.5">
              <button
                onClick={() => toast({ title: "Coming soon!", description: "Slack integration will be available soon." })}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-[hsl(0,0%,70%)] hover:bg-[hsl(215,25%,16%)] transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.124 2.521a2.528 2.528 0 0 1 2.52-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.52V8.834zm-1.271 0a2.528 2.528 0 0 1-2.521 2.521 2.528 2.528 0 0 1-2.521-2.521V2.522A2.528 2.528 0 0 1 15.166 0a2.528 2.528 0 0 1 2.521 2.522v6.312zm-2.521 10.124a2.528 2.528 0 0 1 2.521 2.52A2.528 2.528 0 0 1 15.166 24a2.528 2.528 0 0 1-2.521-2.522v-2.52h2.521zm0-1.271a2.528 2.528 0 0 1-2.521-2.521 2.528 2.528 0 0 1 2.521-2.521h6.312A2.528 2.528 0 0 1 24 15.166a2.528 2.528 0 0 1-2.522 2.521h-6.312z"/>
                </svg>
                Connect Slack
              </button>
              <button
                onClick={() => toast({ title: "Coming soon!", description: "Discord integration will be available soon." })}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-[hsl(0,0%,70%)] hover:bg-[hsl(215,25%,16%)] transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z"/>
                </svg>
                Connect Discord
              </button>
              <button
                onClick={() => toast({ title: "Coming soon!", description: "Microsoft Teams integration will be available soon." })}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-[hsl(0,0%,70%)] hover:bg-[hsl(215,25%,16%)] transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.625 8.073h-5.27V5.107a1.96 1.96 0 0 0-1.962-1.962H5.107a1.96 1.96 0 0 0-1.962 1.962v8.286a1.96 1.96 0 0 0 1.962 1.962h2.268v3.107a1.96 1.96 0 0 0 1.962 1.962h5.27l2.625 2.268v-2.268h3.393a1.96 1.96 0 0 0 1.962-1.962v-6.428a1.96 1.96 0 0 0-1.962-1.961z"/>
                </svg>
                Connect Teams
              </button>
              <button
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-[hsl(0,0%,50%)] hover:text-[hsl(0,0%,70%)] transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Browse integrations
              </button>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Settings */}
      <div className="p-3 border-t border-[hsl(215,25%,20%)]">
        <Link
          to="/settings"
          className="flex items-center gap-2 px-2 py-1.5 text-sm text-[hsl(0,0%,70%)] hover:bg-[hsl(215,25%,16%)] rounded-md transition-colors"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </aside>
  );
};

export default ChatSidebar;
