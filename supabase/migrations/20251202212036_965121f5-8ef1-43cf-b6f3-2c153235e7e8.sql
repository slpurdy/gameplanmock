-- Drop ALL policies on team_members table
DROP POLICY IF EXISTS "Users can join teams" ON public.team_members;
DROP POLICY IF EXISTS "Users can view their own memberships" ON public.team_members;
DROP POLICY IF EXISTS "Team admins can update members" ON public.team_members;
DROP POLICY IF EXISTS "Team admins can delete members" ON public.team_members;

-- Recreate with non-recursive simple policies
CREATE POLICY "Members can view own membership"
ON public.team_members
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Members can insert own membership"
ON public.team_members
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update team memberships"
ON public.team_members
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.team_members sub 
    WHERE sub.team_id = team_members.team_id 
    AND sub.user_id = auth.uid() 
    AND sub.role = 'admin'
  )
);

CREATE POLICY "Users can leave or admins can remove"
ON public.team_members
FOR DELETE
USING (
  user_id = auth.uid() 
  OR EXISTS (
    SELECT 1 FROM public.team_members sub 
    WHERE sub.team_id = team_members.team_id 
    AND sub.user_id = auth.uid() 
    AND sub.role = 'admin'
  )
);