-- Fix infinite recursion in RLS policies by creating security definer functions

-- First, drop the problematic policy
DROP POLICY IF EXISTS "Users can view organizations they are members of" ON public.organizations;

-- Create a security definer function to check organization membership
CREATE OR REPLACE FUNCTION public.is_org_member(_org_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.org_memberships
    WHERE org_id = _org_id
      AND user_id = _user_id
  )
$$;

-- Create a new policy using the security definer function
CREATE POLICY "Users can view organizations they are members of"
ON public.organizations
FOR SELECT
USING (
  auth.uid() = admin_user_id 
  OR public.is_org_member(id, auth.uid())
);