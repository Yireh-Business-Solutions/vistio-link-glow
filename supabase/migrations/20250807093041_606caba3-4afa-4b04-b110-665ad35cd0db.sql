-- Create founder role system for unlimited access
CREATE TYPE public.app_role AS ENUM ('founder', 'admin', 'user');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role),
    UNIQUE (email)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "Founders can manage all roles" ON public.user_roles
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.user_roles ur 
        WHERE ur.user_id = auth.uid() AND ur.role = 'founder'
    )
);

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Insert founder users
INSERT INTO public.user_roles (email, role) VALUES 
('andre@yireh.co.za', 'founder'),
('dylan@yireh.co.za', 'founder')
ON CONFLICT (email) DO UPDATE SET role = 'founder';

-- Update get_user_limits function to handle founders
CREATE OR REPLACE FUNCTION public.get_user_limits(_user_id uuid)
 RETURNS TABLE(max_cards integer, max_profile_images integer, max_gallery_images integer, max_custom_links integer, design_variants_count integer, visible_sections_enabled boolean, signatures_enabled boolean, backgrounds_enabled boolean, subscription_tier text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $function$
  -- Check if user is founder first
  SELECT 
    CASE WHEN public.has_role(_user_id, 'founder') THEN 999999 ELSE COALESCE(sp.max_cards, 1) END as max_cards,
    CASE WHEN public.has_role(_user_id, 'founder') THEN 999999 ELSE COALESCE(sp.max_profile_images, 1) END as max_profile_images,
    CASE WHEN public.has_role(_user_id, 'founder') THEN 999999 ELSE COALESCE(sp.max_gallery_images, 1) END as max_gallery_images,
    CASE WHEN public.has_role(_user_id, 'founder') THEN 999999 ELSE COALESCE(sp.max_custom_links, 1) END as max_custom_links,
    CASE WHEN public.has_role(_user_id, 'founder') THEN 999999 ELSE COALESCE(sp.design_variants_count, 1) END as design_variants_count,
    CASE WHEN public.has_role(_user_id, 'founder') THEN true ELSE COALESCE(sp.visible_sections_enabled, false) END as visible_sections_enabled,
    CASE WHEN public.has_role(_user_id, 'founder') THEN true ELSE COALESCE(sp.signatures_enabled, false) END as signatures_enabled,
    CASE WHEN public.has_role(_user_id, 'founder') THEN true ELSE COALESCE(sp.backgrounds_enabled, false) END as backgrounds_enabled,
    CASE WHEN public.has_role(_user_id, 'founder') THEN 'founder' ELSE COALESCE(s.subscription_tier, 'free') END as subscription_tier
  FROM public.subscribers s
  LEFT JOIN public.subscription_plans sp ON sp.name = s.subscription_tier
  WHERE s.user_id = _user_id
  UNION ALL
  SELECT 
    CASE WHEN public.has_role(_user_id, 'founder') THEN 999999 ELSE 1 END,
    CASE WHEN public.has_role(_user_id, 'founder') THEN 999999 ELSE 1 END,
    CASE WHEN public.has_role(_user_id, 'founder') THEN 999999 ELSE 1 END,
    CASE WHEN public.has_role(_user_id, 'founder') THEN 999999 ELSE 1 END,
    CASE WHEN public.has_role(_user_id, 'founder') THEN 999999 ELSE 1 END,
    CASE WHEN public.has_role(_user_id, 'founder') THEN true ELSE false END,
    CASE WHEN public.has_role(_user_id, 'founder') THEN true ELSE false END,
    CASE WHEN public.has_role(_user_id, 'founder') THEN true ELSE false END,
    CASE WHEN public.has_role(_user_id, 'founder') THEN 'founder' ELSE 'free' END
  WHERE NOT EXISTS (SELECT 1 FROM public.subscribers WHERE user_id = _user_id)
  LIMIT 1;
$function$;