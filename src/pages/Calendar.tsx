import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import BackButton from "@/components/BackButton";
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { downloadICSFile, openGoogleCalendar } from "@/lib/calendar-utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Calendar as CalendarIcon, 
  Trophy,
  Bell,
  Settings,
  Plus,
  MapPin,
  Clock,
  Check,
  X,
  HelpCircle,
  Download,
  ExternalLink,
  Loader2
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, isSameDay } from "date-fns";

interface Event {
  id: string;
  title: string;
  event_date: string;
  event_time: string;
  location: string;
  address?: string;
  description?: string;
  team_id: string;
  going_count: number;
  maybe_count: number;
  not_going_count: number;
  user_status?: string;
}

const Calendar = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [calendarDialogOpen, setCalendarDialogOpen] = useState(false);
  const [selectedEventForCalendar, setSelectedEventForCalendar] = useState<Event | null>(null);
  const [rsvpLoading, setRsvpLoading] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  const handleAction = (action: string) => {
    toast({
      title: action,
      description: "This feature is coming soon!",
    });
  };

  // Fetch user and events
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
        }

        // Fetch events with attendee counts
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .order('event_date', { ascending: true });

        if (eventsError) throw eventsError;

        // Fetch attendee counts for each event
        const eventsWithCounts = await Promise.all(
          (eventsData || []).map(async (event) => {
            const { data: attendees } = await supabase
              .from('event_attendees')
              .select('status, user_id')
              .eq('event_id', event.id);

            const going_count = attendees?.filter(a => a.status === 'going').length || 0;
            const maybe_count = attendees?.filter(a => a.status === 'maybe').length || 0;
            const not_going_count = attendees?.filter(a => a.status === 'not_going').length || 0;
            const user_status = user ? attendees?.find(a => a.user_id === user.id)?.status : undefined;

            return {
              ...event,
              going_count,
              maybe_count,
              not_going_count,
              user_status
            };
          })
        );

        setEvents(eventsWithCounts);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast({
          title: "Error",
          description: "Failed to load events",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Handle RSVP
  const handleRSVP = async (e: React.MouseEvent, eventId: string, status: 'going' | 'maybe' | 'not_going') => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!userId) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to RSVP",
        variant: "destructive"
      });
      return;
    }

    setRsvpLoading(`${eventId}-${status}`);

    try {
      // Check if user already has an RSVP
      const { data: existing } = await supabase
        .from('event_attendees')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        // Update existing RSVP
        const { error } = await supabase
          .from('event_attendees')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Insert new RSVP
        const { error } = await supabase
          .from('event_attendees')
          .insert({ event_id: eventId, user_id: userId, status });

        if (error) throw error;
      }

      // Update local state
      setEvents(prev => prev.map(event => {
        if (event.id === eventId) {
          const oldStatus = event.user_status;
          let going_count = event.going_count;
          let maybe_count = event.maybe_count;
          let not_going_count = event.not_going_count;

          // Decrement old status count
          if (oldStatus === 'going') going_count--;
          else if (oldStatus === 'maybe') maybe_count--;
          else if (oldStatus === 'not_going') not_going_count--;

          // Increment new status count
          if (status === 'going') going_count++;
          else if (status === 'maybe') maybe_count++;
          else if (status === 'not_going') not_going_count++;

          return {
            ...event,
            user_status: status,
            going_count,
            maybe_count,
            not_going_count
          };
        }
        return event;
      }));

      toast({
        title: "RSVP Updated",
        description: `You're ${status === 'going' ? 'going' : status === 'maybe' ? 'maybe going' : 'not going'} to this event`
      });

      // If going, show add to calendar dialog
      if (status === 'going') {
        const event = events.find(e => e.id === eventId);
        if (event) {
          setSelectedEventForCalendar(event);
          setCalendarDialogOpen(true);
        }
      }
    } catch (error) {
      console.error('Error updating RSVP:', error);
      toast({
        title: "Error",
        description: "Failed to update RSVP",
        variant: "destructive"
      });
    } finally {
      setRsvpLoading(null);
    }
  };

  // Handle download calendar
  const handleDownloadCalendar = () => {
    if (!selectedEventForCalendar) return;
    
    downloadICSFile({
      title: selectedEventForCalendar.title,
      description: selectedEventForCalendar.description,
      location: selectedEventForCalendar.address || selectedEventForCalendar.location,
      date: selectedEventForCalendar.event_date,
      time: selectedEventForCalendar.event_time
    });
    
    setCalendarDialogOpen(false);
    toast({
      title: "Calendar Downloaded",
      description: "Event has been downloaded to your calendar"
    });
  };

  // Handle Google Calendar
  const handleGoogleCalendar = () => {
    if (!selectedEventForCalendar) return;
    
    openGoogleCalendar({
      title: selectedEventForCalendar.title,
      description: selectedEventForCalendar.description,
      location: selectedEventForCalendar.address || selectedEventForCalendar.location,
      date: selectedEventForCalendar.event_date,
      time: selectedEventForCalendar.event_time
    });
    
    setCalendarDialogOpen(false);
  };

  // Get dates that have events for calendar highlighting
  const eventDates = events.map(e => parseISO(e.event_date));

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Format date for display
  const formatEventDate = (date: string) => {
    return format(parseISO(date), 'MMM d');
  };

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
              <Button variant="ghost" size="icon" className="relative" onClick={() => handleAction("Notifications")}>
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-secondary rounded-full" />
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/settings">
                  <Settings className="h-5 w-5" />
                </Link>
              </Button>
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Team Calendar</h1>
            <p className="text-muted-foreground">Manage events and track attendance</p>
          </div>
          <Button variant="hero" size="lg" asChild>
            <Link to="/calendar/create">
              <Plus className="h-5 w-5 mr-2" />
              Create Event
            </Link>
          </Button>
        </div>

        {/* 50/50 Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Calendar Column */}
          <Card className="p-6">
            <h2 className="font-bold text-lg mb-4">Event Calendar</h2>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border-0 pointer-events-auto w-full"
              modifiers={{
                hasEvent: eventDates
              }}
              modifiersStyles={{
                hasEvent: {
                  backgroundColor: 'hsl(var(--primary) / 0.2)',
                  fontWeight: 'bold',
                  borderRadius: '50%'
                }
              }}
            />
            
            {/* Legend */}
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary/20 border border-primary/40" />
                <span>Has Events</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>Selected</span>
              </div>
            </div>

            {/* Upcoming Events Summary */}
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="font-semibold mb-3">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{events.length}</div>
                  <div className="text-xs text-muted-foreground">Total Events</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-accent">
                    {events.filter(e => e.user_status === 'going').length}
                  </div>
                  <div className="text-xs text-muted-foreground">You're Going</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Events List Column */}
          <div className="space-y-4">
            <h2 className="font-bold text-lg">Upcoming Events</h2>
            
            {loading ? (
              <Card className="p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">Loading events...</p>
              </Card>
            ) : events.length === 0 ? (
              <Card className="p-8 text-center">
                <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No Events Yet</h3>
                <p className="text-muted-foreground mb-4">Create your first event to get started</p>
                <Button variant="hero" asChild>
                  <Link to="/calendar/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Link>
                </Button>
              </Card>
            ) : (
              events.map((event) => (
                <Card key={event.id} className="p-5 hover:shadow-lg transition-all duration-300">
                  <Link to={`/event/${event.id}`} className="block">
                    <div className="flex flex-col gap-4">
                      <div className="space-y-2">
                        <div className="flex items-start gap-3">
                          <CalendarIcon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <h3 className="text-lg font-bold">{event.title}</h3>
                            <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <CalendarIcon className="h-3 w-3" />
                                {formatEventDate(event.event_date)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTime(event.event_time)}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 ml-8">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            {event.going_count} Going
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <HelpCircle className="h-3 w-3" />
                            {event.maybe_count} Maybe
                          </Badge>
                          {event.not_going_count > 0 && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <X className="h-3 w-3" />
                              {event.not_going_count} Can't Go
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* RSVP Buttons - Outside the Link */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                    <Button 
                      variant={event.user_status === 'going' ? 'default' : 'outline'}
                      className="flex-1"
                      size="sm"
                      onClick={(e) => handleRSVP(e, event.id, 'going')}
                      disabled={rsvpLoading === `${event.id}-going`}
                    >
                      {rsvpLoading === `${event.id}-going` ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Going
                        </>
                      )}
                    </Button>
                    <Button 
                      variant={event.user_status === 'maybe' ? 'default' : 'outline'}
                      className="flex-1"
                      size="sm"
                      onClick={(e) => handleRSVP(e, event.id, 'maybe')}
                      disabled={rsvpLoading === `${event.id}-maybe`}
                    >
                      {rsvpLoading === `${event.id}-maybe` ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <HelpCircle className="h-4 w-4 mr-1" />
                          Maybe
                        </>
                      )}
                    </Button>
                    <Button 
                      variant={event.user_status === 'not_going' ? 'default' : 'outline'}
                      className="flex-1"
                      size="sm"
                      onClick={(e) => handleRSVP(e, event.id, 'not_going')}
                      disabled={rsvpLoading === `${event.id}-not_going`}
                    >
                      {rsvpLoading === `${event.id}-not_going` ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <X className="h-4 w-4 mr-1" />
                          Can't Go
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              ))
            )}

            {/* Create Public Event CTA */}
            <Card className="p-6 bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20 text-center">
              <Trophy className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">Host a Public Event</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Open registration to other teams
              </p>
              <Button variant="hero" size="sm" asChild>
                <Link to="/calendar/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Public Event
                </Link>
              </Button>
            </Card>
          </div>
        </div>

        {/* Attendance Stats */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Attendance Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                {events.length > 0 ? Math.round(events.reduce((acc, e) => acc + e.going_count, 0) / events.length * 10) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Average Attendance</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-1">{events.length}</div>
              <div className="text-sm text-muted-foreground">Total Events</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-1">
                {events.reduce((acc, e) => acc + e.going_count, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total RSVPs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                {events.filter(e => e.user_status === 'going').length}
              </div>
              <div className="text-sm text-muted-foreground">Your Confirmed</div>
            </div>
          </div>
        </Card>
      </main>

      {/* Add to Calendar Dialog */}
      <Dialog open={calendarDialogOpen} onOpenChange={setCalendarDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add to Calendar</DialogTitle>
            <DialogDescription>
              Would you like to add "{selectedEventForCalendar?.title}" to your calendar?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button onClick={handleDownloadCalendar} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Calendar File (.ics)
            </Button>
            <Button variant="outline" onClick={handleGoogleCalendar} className="w-full">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in Google Calendar
            </Button>
            <Button variant="ghost" onClick={() => setCalendarDialogOpen(false)} className="w-full">
              Skip for Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;
