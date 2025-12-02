import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Bold,
  Italic,
  Strikethrough,
  Link2,
  ListOrdered,
  List,
  Code,
  AtSign,
  Smile,
  Paperclip,
  Send,
  Mic,
  Video,
} from "lucide-react";

interface ChatInputProps {
  channelName: string;
  onSendMessage: (content: string) => void;
  placeholder?: string;
}

const ChatInput = ({ channelName, onSendMessage, placeholder }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const formatButtons = [
    { icon: Bold, label: "Bold", shortcut: "⌘B" },
    { icon: Italic, label: "Italic", shortcut: "⌘I" },
    { icon: Strikethrough, label: "Strikethrough", shortcut: "⌘⇧X" },
    { icon: Link2, label: "Link", shortcut: "⌘K" },
    { icon: ListOrdered, label: "Ordered list", shortcut: "⌘⇧7" },
    { icon: List, label: "Bullet list", shortcut: "⌘⇧8" },
    { icon: Code, label: "Code", shortcut: "⌘⇧C" },
  ];

  return (
    <div className="p-4 border-t border-border bg-background">
      <div
        className={`border rounded-lg transition-colors ${
          isFocused ? "border-primary" : "border-border"
        }`}
      >
        {/* Formatting Toolbar */}
        <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border">
          <TooltipProvider delayDuration={0}>
            {formatButtons.map(({ icon: Icon, label, shortcut }) => (
              <Tooltip key={label}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                    <Icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {label}
                  <span className="ml-2 text-muted-foreground">{shortcut}</span>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder || `Message #${channelName}`}
          className="w-full px-3 py-2 bg-transparent resize-none outline-none text-sm min-h-[44px] max-h-[200px]"
          rows={1}
        />

        {/* Bottom Actions */}
        <div className="flex items-center justify-between px-2 py-1.5 border-t border-border">
          <div className="flex items-center gap-0.5">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  Attach file
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                    <Smile className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  Emoji
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                    <AtSign className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  Mention someone
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                    <Video className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  Record video
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                    <Mic className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  Record audio
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!message.trim()}
            size="sm"
            className="h-7 px-3 gap-1"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground mt-1.5 px-1">
        <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">Enter</kbd> to send,{" "}
        <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">Shift + Enter</kbd> for new line
      </p>
    </div>
  );
};

export default ChatInput;
