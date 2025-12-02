import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MoreHorizontal,
  MessageSquare,
  Pin,
  Smile,
  Bookmark,
  Share,
  Copy,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Reaction {
  emoji: string;
  count: number;
  hasReacted: boolean;
}

export interface Message {
  id: string;
  user: string;
  initials: string;
  content: string;
  time: string;
  timestamp: Date;
  isPinned?: boolean;
  isUnread?: boolean;
  reactions?: Reaction[];
  threadCount?: number;
  avatarColor?: string;
}

interface ChatMessageProps {
  message: Message;
  onPin: (id: string) => void;
  onReaction: (id: string, emoji: string) => void;
  onThreadOpen: (id: string) => void;
  onCopy: (content: string) => void;
  isGrouped?: boolean;
}

const QUICK_REACTIONS = ["👍", "❤️", "😂", "🎉", "🔥"];

const ChatMessage = ({
  message,
  onPin,
  onReaction,
  onThreadOpen,
  onCopy,
  isGrouped = false,
}: ChatMessageProps) => {
  const [showActions, setShowActions] = useState(false);

  const formatTime = (time: string) => {
    return time;
  };

  return (
    <div
      className={`group relative px-4 py-1 hover:bg-muted/50 transition-colors ${
        message.isUnread ? "bg-primary/5" : ""
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex gap-2">
        {/* Avatar or spacer for grouped messages */}
        {isGrouped ? (
          <div className="w-9 flex-shrink-0">
            <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
              {formatTime(message.time)}
            </span>
          </div>
        ) : (
          <Avatar className="h-9 w-9 flex-shrink-0 mt-0.5">
            <AvatarFallback
              className="text-xs font-medium"
              style={{
                backgroundColor: message.avatarColor || "hsl(var(--primary) / 0.2)",
                color: "hsl(var(--primary))",
              }}
            >
              {message.initials}
            </AvatarFallback>
          </Avatar>
        )}

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          {!isGrouped && (
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-sm hover:underline cursor-pointer">
                {message.user}
              </span>
              <span className="text-xs text-muted-foreground">{formatTime(message.time)}</span>
              {message.isPinned && (
                <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                  <Pin className="h-2.5 w-2.5 mr-0.5" />
                  Pinned
                </Badge>
              )}
            </div>
          )}
          <p className="text-sm leading-relaxed break-words">{message.content}</p>

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {message.reactions.map((reaction) => (
                <button
                  key={reaction.emoji}
                  onClick={() => onReaction(message.id, reaction.emoji)}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-colors ${
                    reaction.hasReacted
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-muted border-border hover:border-primary/30"
                  }`}
                >
                  <span>{reaction.emoji}</span>
                  <span>{reaction.count}</span>
                </button>
              ))}
            </div>
          )}

          {/* Thread indicator */}
          {message.threadCount && message.threadCount > 0 && (
            <button
              onClick={() => onThreadOpen(message.id)}
              className="flex items-center gap-1 mt-1.5 text-xs text-primary hover:underline"
            >
              <MessageSquare className="h-3 w-3" />
              {message.threadCount} {message.threadCount === 1 ? "reply" : "replies"}
            </button>
          )}
        </div>
      </div>

      {/* Hover Actions Bar */}
      {showActions && (
        <div className="absolute -top-4 right-4 flex items-center bg-card border border-border rounded-lg shadow-lg p-0.5">
          <TooltipProvider delayDuration={0}>
            {QUICK_REACTIONS.map((emoji) => (
              <Tooltip key={emoji}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-base"
                    onClick={() => onReaction(message.id, emoji)}
                  >
                    {emoji}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  React with {emoji}
                </TooltipContent>
              </Tooltip>
            ))}

            <div className="w-px h-5 bg-border mx-0.5" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onReaction(message.id, "+")}
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                Add reaction
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onThreadOpen(message.id)}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                Reply in thread
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onPin(message.id)}
                >
                  <Pin className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {message.isPinned ? "Unpin" : "Pin"} message
              </TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onCopy(message.content)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy text
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save message
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="h-4 w-4 mr-2" />
                  Share message
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete message
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
