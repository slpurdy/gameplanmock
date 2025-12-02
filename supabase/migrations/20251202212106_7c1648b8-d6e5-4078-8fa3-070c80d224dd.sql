-- Create a security definer function to check if users share a team
CREATE OR REPLACE FUNCTION public.users_share_team(other_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_members tm1
    JOIN public.team_members tm2 ON tm1.team_id = tm2.team_id
    WHERE tm1.user_id = auth.uid() AND tm2.user_id = other_user_id
  );
$$;

-- Drop the problematic profile policy
DROP POLICY IF EXISTS "Team members can view team member profiles" ON public.profiles;

-- Recreate with security definer function
CREATE POLICY "Team members can view team member profiles"
ON public.profiles
FOR SELECT
USING (auth.uid() = id OR public.users_share_team(id));

-- Also fix policies on events and teams that reference team_members
-- Create helper function for team membership check
CREATE OR REPLACE FUNCTION public.is_team_member(check_team_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_id = check_team_id
    AND user_id = auth.uid()
  );
$$;

-- Fix teams policies
DROP POLICY IF EXISTS "Team members can view their teams" ON public.teams;
CREATE POLICY "Team members can view their teams"
ON public.teams
FOR SELECT
USING (public.is_team_member(id));

DROP POLICY IF EXISTS "Team admins can update their teams" ON public.teams;
CREATE POLICY "Team admins can update their teams"
ON public.teams
FOR UPDATE
USING (public.is_team_admin(id));

-- Fix events policies  
DROP POLICY IF EXISTS "Team members can view events" ON public.events;
CREATE POLICY "Team members can view events"
ON public.events
FOR SELECT
USING (is_public = true OR public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team admins can manage events" ON public.events;
DROP POLICY IF EXISTS "Team admins can create events" ON public.events;
DROP POLICY IF EXISTS "Team admins can update events" ON public.events;
DROP POLICY IF EXISTS "Team admins can delete events" ON public.events;

CREATE POLICY "Team admins can create events"
ON public.events
FOR INSERT
WITH CHECK (public.is_team_admin(team_id));

CREATE POLICY "Team admins can update events"
ON public.events
FOR UPDATE
USING (public.is_team_admin(team_id));

CREATE POLICY "Team admins can delete events"
ON public.events
FOR DELETE
USING (public.is_team_admin(team_id));