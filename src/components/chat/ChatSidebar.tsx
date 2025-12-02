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
import {
  Hash,
  Plus,
  Search,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Settings,
  Home,
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

interface ChatSidebarProps {
  channels: Channel[];
  directMessages: DirectMessage[];
  activeChannelId: string;
  onChannelSelect: (channel: Channel) => void;
  onDMSelect: (dm: DirectMessage) => void;
  onCreateChannel: (name: string, description: string) => void;
  teamName: string;
}

const ChatSidebar = ({
  channels,
  directMessages,
  activeChannelId,
  onChannelSelect,
  onDMSelect,
  onCreateChannel,
  teamName,
}: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDesc, setNewChannelDesc] = useState("");
  const [channelsExpanded, setChannelsExpanded] = useState(true);
  const [dmsExpanded, setDmsExpanded] = useState(true);

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
