-- Create comments table for event discussions
CREATE TABLE public.event_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.event_comments ENABLE ROW LEVEL SECURITY;

-- Team members can view comments on their team's events
CREATE POLICY "Team members can view event comments"
ON public.event_comments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM events e
    JOIN team_members tm ON tm.team_id = e.team_id
    WHERE e.id = event_comments.event_id AND tm.user_id = auth.uid()
  )
);

-- Team members can create comments on their team's events
CREATE POLICY "Team members can create comments"
ON public.event_comments
FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM events e
    JOIN team_members tm ON tm.team_id = e.team_id
    WHERE e.id = event_comments.event_id AND tm.user_id = auth.uid()
  )
);

-- Users can update their own comments
CREATE POLICY "Users can update their own comments"
ON public.event_comments
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete their own comments"
ON public.event_comments
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_event_comments_updated_at
BEFORE UPDATE ON public.event_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add policy to allow team members to view other profiles in their team
CREATE POLICY "Team members can view team member profiles"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM team_members tm1
    JOIN team_members tm2 ON tm1.team_id = tm2.team_id
    WHERE tm1.user_id = auth.uid() AND tm2.user_id = profiles.id
  )
);