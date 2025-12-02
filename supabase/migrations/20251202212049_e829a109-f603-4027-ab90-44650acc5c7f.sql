-- Create a security definer function to check team membership without RLS
CREATE OR REPLACE FUNCTION public.is_team_admin(check_team_id uuid)
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
    AND role = 'admin'
  );
$$;

-- Drop the problematic policies
DROP POLICY IF EXISTS "Admins can update team memberships" ON public.team_members;
DROP POLICY IF EXISTS "Users can leave or admins can remove" ON public.team_members;

-- Recreate with the security definer function
CREATE POLICY "Admins can update team memberships"
ON public.team_members
FOR UPDATE
USING (public.is_team_admin(team_id));

CREATE POLICY "Users can leave or admins can remove"
ON public.team_members
FOR DELETE
USING (user_id = auth.uid() OR public.is_team_admin(team_id));