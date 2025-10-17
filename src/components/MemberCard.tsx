import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

interface MemberCardProps {
  id: string;
  name: string;
  role: string;
  status: "online" | "offline";
  initials: string;
  compact?: boolean;
}

const MemberCard = ({ id, name, role, status, initials, compact = false }: MemberCardProps) => {
  if (compact) {
    return (
      <Link to={`/profile/${id}`}>
        <div className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer">
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            {status === "online" && (
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-accent rounded-full border-2 border-card" />
            )}
          </div>
          <span className="text-sm">{name}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/profile/${id}`}>
      <Card className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            {status === "online" && (
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-accent rounded-full border-2 border-card" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate">{name}</div>
            <Badge variant="secondary" className="text-xs">
              {role}
            </Badge>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default MemberCard;
