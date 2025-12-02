import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Hash,
  Star,
  Users,
  Pin,
  ChevronDown,
  Bell,
  Phone,
  Video,
  Search,
  Settings,
  UserPlus,
  FileText,
} from "lucide-react";

interface Channel {
  id: string;
  name: string;
  description?: string;
}

interface PinnedMessage {
  id: string;
  user: string;
  initials: string;
  content: string;
  time: string;
}

interface ChatHeaderProps {
  channel: Channel;
  memberCount: number;
  onlineCount: number;
  pinnedMessages: PinnedMessage[];
  onSearch: () => void;
}

const ChatHeader = ({
  channel,
  memberCount,
  onlineCount,
  pinnedMessages,
  onSearch,
}: ChatHeaderProps) => {
  return (
    <header className="h-12 flex items-center justify-between px-4 border-b border-border bg-background">
      {/* Left - Channel Info */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 hover:bg-muted px-2 py-1 rounded-md transition-colors">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">{channel.name}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-72">
            <div className="px-3 py-2">
              <div className="flex items-center gap-2 mb-1">
                <Hash className="h-4 w-4" />
                <span className="font-semibold">{channel.name}</span>
              </div>
              <p className="text-sm text-muted-foreground">{channel.description}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Star className="h-4 w-4 mr-2" />
              Star channel
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell className="h-4 w-4 mr-2" />
              Notification preferences
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Channel settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="text-muted-foreground hidden sm:inline">|</span>

        <span className="text-sm text-muted-foreground hidden sm:block truncate max-w-[200px]">
          {channel.description}
        </span>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-1">
        {/* Members */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">{memberCount}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{memberCount} members</span>
                <Badge variant="secondary" className="text-xs">
                  {onlineCount} online
                </Badge>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserPlus className="h-4 w-4 mr-2" />
              Add people
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Pinned Messages */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground">
              <Pin className="h-4 w-4" />
              <span className="hidden sm:inline">{pinnedMessages.length}</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Pin className="h-4 w-4" />
                Pinned Messages
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-96">
              {pinnedMessages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Pin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No pinned messages yet</p>
                  <p className="text-sm">Pin important messages to find them easily</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pinnedMessages.map((msg) => (
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
                  ))}
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Huddle / Call */}
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hidden sm:flex">
          <Phone className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hidden sm:flex">
          <Video className="h-4 w-4" />
        </Button>

        {/* Search */}
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={onSearch}>
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};

export default ChatHeader;
