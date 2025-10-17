import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Check, X, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  going: number;
  maybe: number;
  notGoing: number;
  status?: "going" | "maybe" | "not-going" | null;
  compact?: boolean;
}

const EventCard = ({ 
  id, 
  title, 
  date, 
  time, 
  location, 
  going, 
  maybe, 
  notGoing, 
  status,
  compact = false 
}: EventCardProps) => {
  if (compact) {
    return (
      <Link to={`/event/${id}`}>
        <div className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{date}</p>
            </div>
            <Badge variant="secondary">
              {going}/{going + maybe + notGoing}
            </Badge>
          </div>
          <Button variant="outline" size="sm" className="w-full mt-2">
            Manage RSVP
          </Button>
        </div>
      </Link>
    );
  }

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div>
            <div className="flex items-start gap-3 mb-2">
              <Calendar className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold">{title}</h3>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {location}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Check className="h-3 w-3" />
              {going} Going
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <HelpCircle className="h-3 w-3" />
              {maybe} Maybe
            </Badge>
            {notGoing > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                <X className="h-3 w-3" />
                {notGoing} Can't Go
              </Badge>
            )}
          </div>
        </div>

        <div className="flex md:flex-col gap-2">
          <Button 
            variant={status === "going" ? "default" : "outline"}
            className="flex-1 md:flex-none"
            size="sm"
          >
            <Check className="h-4 w-4 mr-1" />
            Going
          </Button>
          <Button 
            variant={status === "maybe" ? "default" : "outline"}
            className="flex-1 md:flex-none"
            size="sm"
          >
            <HelpCircle className="h-4 w-4 mr-1" />
            Maybe
          </Button>
          <Button 
            variant="outline"
            className="flex-1 md:flex-none"
            size="sm"
          >
            <X className="h-4 w-4 mr-1" />
            Can't Go
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
