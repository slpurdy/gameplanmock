import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Member {
  id: string;
  name: string;
  initials: string;
  status: "online" | "away" | "offline";
  title?: string;
}

interface ChatMembersListProps {
  members: Member[];
  onClose: () => void;
}

const ChatMembersList = ({ members, onClose }: ChatMembersListProps) => {
  const onlineMembers = members.filter((m) => m.status === "online");
  const awayMembers = members.filter((m) => m.status === "away");
  const offlineMembers = members.filter((m) => m.status === "offline");

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

  const MemberItem = ({ member }: { member: Member }) => (
    <Link
      to={`/profile/${member.id}`}
      className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors"
    >
      <div className="relative">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {member.initials}
          </AvatarFallback>
        </Avatar>
        <span
          className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background ${getStatusColor(
            member.status
          )}`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{member.name}</div>
        {member.title && (
          <div className="text-xs text-muted-foreground truncate">{member.title}</div>
        )}
      </div>
    </Link>
  );

  return (
    <aside className="w-64 border-l border-border bg-background flex flex-col">
      <div className="h-12 flex items-center justify-between px-4 border-b border-border">
        <h3 className="font-semibold text-sm">Members</h3>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {onlineMembers.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground uppercase mb-2">
                Online — {onlineMembers.length}
              </h4>
              <div className="space-y-0.5">
                {onlineMembers.map((member) => (
                  <MemberItem key={member.id} member={member} />
                ))}
              </div>
            </div>
          )}

          {awayMembers.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground uppercase mb-2">
                Away — {awayMembers.length}
              </h4>
              <div className="space-y-0.5">
                {awayMembers.map((member) => (
                  <MemberItem key={member.id} member={member} />
                ))}
              </div>
            </div>
          )}

          {offlineMembers.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground uppercase mb-2">
                Offline — {offlineMembers.length}
              </h4>
              <div className="space-y-0.5 opacity-60">
                {offlineMembers.map((member) => (
                  <MemberItem key={member.id} member={member} />
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
};

export default ChatMembersList;
