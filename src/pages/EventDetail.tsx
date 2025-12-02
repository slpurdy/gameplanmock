import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useParams, useNavigate } from "react-router-dom";
import BackButton from "@/components/BackButton";
import { 
  Trophy, Bell, Settings, Calendar, Clock, MapPin, Users, 
  Check, X, HelpCircle, Share2, Edit, MessageSquare, Download, Loader2
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string;
  location: string;
  address: string | null;
  is_public: boolean;
  team_id: string;
}

interface Attendee {
  id: string;
  user_id: string;
  status: string;
  profile: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profile: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [rsvpStatus, setRsvpStatus] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEventData();
    }
  }, [id, user]);

  const fetchEventData = async () => {
    setLoading(true);
    try {
      // Fetch event details
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (eventError) throw eventError;
      setEvent(eventData);

      // Fetch attendees with profiles
      const { data: attendeesData } = await supabase
        .from("event_attendees")
        .select(`
          id,
          user_id,
          status,
          profile:profiles(full_name, avatar_url)
        `)
        .eq("event_id", id);

      if (attendeesData) {
        setAttendees(attendeesData as unknown as Attendee[]);
        // Check current user's RSVP status
        const userRsvp = attendeesData.find((a: any) => a.user_id === user?.id);
        setRsvpStatus(userRsvp?.status || null);
      }

      // Fetch comments with profiles
      const { data: commentsData } = await supabase
        .from("event_comments")
        .select(`
          id,
          content,
          created_at,
          user_id,
          profile:profiles(full_name, avatar_url)
        `)
        .eq("event_id", id)
        .order("created_at", { ascending: true });

      if (commentsData) {
        setComments(commentsData as unknown as Comment[]);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load event",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (status: string) => {
    if (!user || !id) return;
    
    setSubmitting(true);
    try {
      const existingRsvp = attendees.find((a) => a.user_id === user.id);
      
      if (existingRsvp) {
        // Update existing RSVP
        const { error } = await supabase
          .from("event_attendees")
          .update({ status })
          .eq("id", existingRsvp.id);
        if (error) throw error;
      } else {
        // Create new RSVP
        const { error } = await supabase
          .from("event_attendees")
          .insert({ event_id: id, user_id: user.id, status });
        if (error) throw error;
      }

      setRsvpStatus(status);
      toast({ title: "RSVP updated!", description: `You're marked as ${status}` });
      fetchEventData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update RSVP",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePostComment = async () => {
    if (!user || !id || !newComment.trim()) return;
    
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("event_comments")
        .insert({ event_id: id, user_id: user.id, content: newComment.trim() });

      if (error) throw error;
      
      setNewComment("");
      toast({ title: "Comment posted!" });
      fetchEventData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to post comment",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "??";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
  };

  const goingAttendees = attendees.filter((a) => a.status === "going");
  const maybeAttendees = attendees.filter((a) => a.status === "maybe");
  const notGoingAttendees = attendees.filter((a) => a.status === "not_going");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Event not found</h1>
        <Button onClick={() => navigate("/calendar")}>Back to Calendar</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BackButton />
              <Link to="/dashboard" className="flex items-center gap-2">
                <Trophy className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">GamePlan</span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-secondary rounded-full" />
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/settings">
                  <Settings className="h-5 w-5" />
                </Link>
              </Button>
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user ? getInitials(user.email?.split("@")[0] || "U") : "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
        {/* Event Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {format(new Date(event.event_date), "EEEE, MMMM d, yyyy")}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {event.event_time}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* RSVP Section */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Your Response</h2>
          <div className="grid grid-cols-3 gap-3">
            <Button 
              variant={rsvpStatus === "going" ? "default" : "outline"} 
              className="h-16"
              onClick={() => handleRSVP("going")}
              disabled={submitting}
            >
              <Check className="h-5 w-5 mr-2" />
              Going
            </Button>
            <Button 
              variant={rsvpStatus === "maybe" ? "default" : "outline"} 
              className="h-16"
              onClick={() => handleRSVP("maybe")}
              disabled={submitting}
            >
              <HelpCircle className="h-5 w-5 mr-2" />
              Maybe
            </Button>
            <Button 
              variant={rsvpStatus === "not_going" ? "default" : "outline"} 
              className="h-16"
              onClick={() => handleRSVP("not_going")}
              disabled={submitting}
            >
              <X className="h-5 w-5 mr-2" />
              Can't Go
            </Button>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Event Details */}
          <div className="md:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Event Details</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Location</div>
                    <div className="text-muted-foreground">{event.location}</div>
                    {event.address && (
                      <div className="text-sm text-muted-foreground">{event.address}</div>
                    )}
                    <Button variant="link" className="px-0 h-auto">
                      Get Directions →
                    </Button>
                  </div>
                </div>

                {event.description && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-muted-foreground whitespace-pre-wrap">{event.description}</p>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Comments */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-primary" />
                Comments ({comments.length})
              </h2>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(comment.profile?.full_name || null)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{comment.profile?.full_name || "Anonymous"}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(comment.created_at), "MMM d 'at' h:mm a")}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))}

                {comments.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No comments yet. Be the first to comment!</p>
                )}

                {user && (
                  <div className="flex gap-3 pt-2">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(user.email?.split("@")[0] || "U")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <textarea 
                        className="w-full p-3 rounded-lg border bg-background resize-none"
                        placeholder="Add a comment..."
                        rows={2}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <Button 
                        variant="hero" 
                        size="sm" 
                        className="mt-2"
                        onClick={handlePostComment}
                        disabled={submitting || !newComment.trim()}
                      >
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Post Comment
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Attendees Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold mb-4">Attendance</h3>
              
              <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="text-center p-3 bg-accent/10 rounded-lg">
                  <div className="text-2xl font-bold text-accent">{goingAttendees.length}</div>
                  <div className="text-xs text-muted-foreground">Going</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{maybeAttendees.length}</div>
                  <div className="text-xs text-muted-foreground">Maybe</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{notGoingAttendees.length}</div>
                  <div className="text-xs text-muted-foreground">No</div>
                </div>
              </div>

              <Tabs defaultValue="going" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="going">Going</TabsTrigger>
                  <TabsTrigger value="maybe">Maybe</TabsTrigger>
                  <TabsTrigger value="no">No</TabsTrigger>
                </TabsList>
                
                <TabsContent value="going" className="mt-4 space-y-2">
                  {goingAttendees.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-2">No one yet</p>
                  ) : (
                    goingAttendees.map((person) => (
                      <div key={person.id} className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg transition-colors">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {getInitials(person.profile?.full_name || null)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{person.profile?.full_name || "Anonymous"}</span>
                      </div>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="maybe" className="mt-4 space-y-2">
                  {maybeAttendees.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-2">No one yet</p>
                  ) : (
                    maybeAttendees.map((person) => (
                      <div key={person.id} className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg transition-colors">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {getInitials(person.profile?.full_name || null)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{person.profile?.full_name || "Anonymous"}</span>
                      </div>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="no" className="mt-4 space-y-2">
                  {notGoingAttendees.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-2">No one yet</p>
                  ) : (
                    notGoingAttendees.map((person) => (
                      <div key={person.id} className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg transition-colors">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {getInitials(person.profile?.full_name || null)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{person.profile?.full_name || "Anonymous"}</span>
                      </div>
                    ))
                  )}
                </TabsContent>
              </Tabs>

              <Button variant="outline" className="w-full mt-4">
                <Download className="h-4 w-4 mr-2" />
                Export Attendees
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetail;
