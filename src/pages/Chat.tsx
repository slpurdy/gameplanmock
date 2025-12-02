import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessage, { Message } from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import ChatMembersList from "@/components/chat/ChatMembersList";

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

interface Member {
  id: string;
  name: string;
  initials: string;
  status: "online" | "away" | "offline";
  title?: string;
}

const Chat = () => {
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMembers, setShowMembers] = useState(true);

  const [channels, setChannels] = useState<Channel[]>([
    { id: "1", name: "general", unread: 3, description: "General team discussion" },
    { id: "2", name: "announcements", unread: 1, description: "Important team announcements" },
    { id: "3", name: "training", unread: 0, description: "Training schedules and tips" },
    { id: "4", name: "social", unread: 5, description: "Off-topic conversations" },
    { id: "5", name: "race-day", unread: 0, description: "Race day coordination" },
  ]);

  const [directMessages] = useState<DirectMessage[]>([
    { id: "dm1", name: "Coach Alex", initials: "CA", status: "online", unread: 2 },
    { id: "dm2", name: "Sarah Martinez", initials: "SM", status: "online", unread: 0 },
    { id: "dm3", name: "Mike Thompson", initials: "MT", status: "away", unread: 0 },
    { id: "dm4", name: "Jenny Kim", initials: "JK", status: "offline", unread: 1 },
  ]);

  const [members] = useState<Member[]>([
    { id: "1", name: "Coach Alex", initials: "CA", status: "online", title: "Head Coach" },
    { id: "2", name: "Sarah Martinez", initials: "SM", status: "online", title: "Team Captain" },
    { id: "3", name: "Mike Thompson", initials: "MT", status: "away" },
    { id: "4", name: "Jenny Kim", initials: "JK", status: "online" },
    { id: "5", name: "Tom Rodriguez", initials: "TR", status: "offline" },
    { id: "6", name: "Lisa Wong", initials: "LW", status: "online" },
    { id: "7", name: "James Park", initials: "JP", status: "online" },
    { id: "8", name: "Anna Smith", initials: "AS", status: "away" },
  ]);

  const [activeChannel, setActiveChannel] = useState<Channel>(channels[0]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      user: "Coach Alex",
      initials: "CA",
      content: "Welcome everyone to the new team chat! 🎉 Let's use this space to coordinate and stay connected.",
      time: "9:00 AM",
      timestamp: new Date(),
      isPinned: true,
      avatarColor: "hsl(214 95% 48% / 0.2)",
      reactions: [
        { emoji: "🎉", count: 5, hasReacted: true },
        { emoji: "❤️", count: 3, hasReacted: false },
      ],
    },
    {
      id: "2",
      user: "Sarah Martinez",
      initials: "SM",
      content: "Excited to be here! When's our next practice?",
      time: "9:15 AM",
      timestamp: new Date(),
      avatarColor: "hsl(25 95% 53% / 0.2)",
      threadCount: 2,
    },
    {
      id: "3",
      user: "Mike Thompson",
      initials: "MT",
      content: "Saturday at 8am, right?",
      time: "9:20 AM",
      timestamp: new Date(),
      avatarColor: "hsl(142 76% 36% / 0.2)",
    },
    {
      id: "4",
      user: "Coach Alex",
      initials: "CA",
      content: "That's correct! Don't forget to bring your gear. We'll be doing drills and a scrimmage.",
      time: "9:25 AM",
      timestamp: new Date(),
      isPinned: true,
      avatarColor: "hsl(214 95% 48% / 0.2)",
    },
    {
      id: "5",
      user: "Jenny Kim",
      initials: "JK",
      content: "I'll bring the water bottles for everyone 💧",
      time: "9:30 AM",
      timestamp: new Date(),
      isUnread: true,
      avatarColor: "hsl(315 70% 50% / 0.2)",
      reactions: [
        { emoji: "👍", count: 4, hasReacted: false },
        { emoji: "❤️", count: 2, hasReacted: true },
      ],
    },
    {
      id: "6",
      user: "Tom Rodriguez",
      initials: "TR",
      content: "Thanks Jenny! See everyone Saturday!",
      time: "9:45 AM",
      timestamp: new Date(),
      isUnread: true,
      avatarColor: "hsl(45 90% 50% / 0.2)",
    },
    {
      id: "7",
      user: "Lisa Wong",
      initials: "LW",
      content: "Has anyone seen the updated schedule? I think there might be a change for next week's game.",
      time: "10:00 AM",
      timestamp: new Date(),
      isUnread: true,
      avatarColor: "hsl(180 70% 40% / 0.2)",
    },
  ]);

  const pinnedMessages = messages.filter((m) => m.isPinned);
  const onlineCount = members.filter((m) => m.status === "online").length;

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleChannelSelect = (channel: Channel) => {
    setActiveChannel(channel);
    setChannels(channels.map((c) => (c.id === channel.id ? { ...c, unread: 0 } : c)));
    setShowSidebar(false);
  };

  const handleDMSelect = (dm: DirectMessage) => {
    toast({ title: `Opening DM with ${dm.name}`, description: "Direct messages coming soon!" });
    setShowSidebar(false);
  };

  const handleCreateChannel = (name: string, description: string) => {
    const newChannel: Channel = {
      id: Date.now().toString(),
      name: name.toLowerCase().replace(/\s+/g, "-"),
      unread: 0,
      description: description || `Channel for ${name}`,
    };
    setChannels([...channels, newChannel]);
    toast({ title: "Channel created!", description: `#${newChannel.name} is ready to use.` });
  };

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      user: "You",
      initials: "YU",
      content,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timestamp: new Date(),
      avatarColor: "hsl(var(--primary) / 0.2)",
    };
    setMessages([...messages, newMessage]);
  };

  const handlePinMessage = (id: string) => {
    setMessages(messages.map((m) => (m.id === id ? { ...m, isPinned: !m.isPinned } : m)));
    const msg = messages.find((m) => m.id === id);
    toast({
      title: msg?.isPinned ? "Message unpinned" : "Message pinned",
      description: msg?.isPinned ? "Message removed from pins" : "Message added to pins",
    });
  };

  const handleReaction = (id: string, emoji: string) => {
    setMessages(
      messages.map((m) => {
        if (m.id !== id) return m;
        const reactions = m.reactions || [];
        const existingIdx = reactions.findIndex((r) => r.emoji === emoji);

        if (existingIdx >= 0) {
          const existing = reactions[existingIdx];
          if (existing.hasReacted) {
            if (existing.count === 1) {
              return { ...m, reactions: reactions.filter((_, i) => i !== existingIdx) };
            }
            return {
              ...m,
              reactions: reactions.map((r, i) =>
                i === existingIdx ? { ...r, count: r.count - 1, hasReacted: false } : r
              ),
            };
          } else {
            return {
              ...m,
              reactions: reactions.map((r, i) =>
                i === existingIdx ? { ...r, count: r.count + 1, hasReacted: true } : r
              ),
            };
          }
        } else {
          return { ...m, reactions: [...reactions, { emoji, count: 1, hasReacted: true }] };
        }
      })
    );
  };

  const handleThreadOpen = (id: string) => {
    toast({ title: "Thread view", description: "Thread replies coming soon!" });
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: "Copied!", description: "Message copied to clipboard" });
  };

  // Check if messages should be grouped (same user, within 5 minutes)
  const shouldGroupMessage = (msg: Message, prevMsg: Message | null) => {
    if (!prevMsg) return false;
    if (msg.user !== prevMsg.user) return false;
    const timeDiff = msg.timestamp.getTime() - prevMsg.timestamp.getTime();
    return timeDiff < 5 * 60 * 1000; // 5 minutes
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Mobile Sidebar Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-3 z-50 md:hidden"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar Overlay for Mobile */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-50 h-full transition-transform duration-200 ${
          showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <ChatSidebar
          channels={channels}
          directMessages={directMessages}
          activeChannelId={activeChannel.id}
          onChannelSelect={handleChannelSelect}
          onDMSelect={handleDMSelect}
          onCreateChannel={handleCreateChannel}
          teamName="GamePlan Team"
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader
          channel={activeChannel}
          memberCount={members.length}
          onlineCount={onlineCount}
          pinnedMessages={pinnedMessages}
          onSearch={() => toast({ title: "Search", description: "Search coming soon!" })}
        />

        {/* Messages */}
        <ScrollArea className="flex-1" ref={scrollRef}>
          <div className="py-4">
            {/* Channel Welcome */}
            <div className="px-4 pb-6 mb-4 border-b border-border">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                  <span className="text-2xl">#</span>
                </div>
              </div>
              <h2 className="text-xl font-bold mb-1">#{activeChannel.name}</h2>
              <p className="text-muted-foreground text-sm">{activeChannel.description}</p>
              <p className="text-muted-foreground text-sm mt-2">
                This is the start of the <strong>#{activeChannel.name}</strong> channel.
              </p>
            </div>

            {/* Messages List */}
            {messages.map((msg, idx) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onPin={handlePinMessage}
                onReaction={handleReaction}
                onThreadOpen={handleThreadOpen}
                onCopy={handleCopyMessage}
                isGrouped={shouldGroupMessage(msg, messages[idx - 1] || null)}
              />
            ))}
          </div>
        </ScrollArea>

        <ChatInput channelName={activeChannel.name} onSendMessage={handleSendMessage} />
      </div>

      {/* Members Sidebar - Desktop only */}
      {showMembers && (
        <div className="hidden lg:block">
          <ChatMembersList members={members} onClose={() => setShowMembers(false)} />
        </div>
      )}
    </div>
  );
};

export default Chat;
