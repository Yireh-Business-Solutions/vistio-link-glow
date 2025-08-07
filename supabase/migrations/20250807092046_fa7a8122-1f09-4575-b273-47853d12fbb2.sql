-- Fix database function search path security warnings by updating all functions
-- to use proper security definer settings with stable search_path

-- Update get_user_limits function with proper search_path
CREATE OR REPLACE FUNCTION public.get_user_limits(_user_id uuid)
 RETURNS TABLE(max_cards integer, max_profile_images integer, max_gallery_images integer, max_custom_links integer, design_variants_count integer, visible_sections_enabled boolean, signatures_enabled boolean, backgrounds_enabled boolean, subscription_tier text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $function$
  SELECT 
    COALESCE(sp.max_cards, 1) as max_cards,
    COALESCE(sp.max_profile_images, 1) as max_profile_images,
    COALESCE(sp.max_gallery_images, 1) as max_gallery_images,
    COALESCE(sp.max_custom_links, 1) as max_custom_links,
    COALESCE(sp.design_variants_count, 1) as design_variants_count,
    COALESCE(sp.visible_sections_enabled, false) as visible_sections_enabled,
    COALESCE(sp.signatures_enabled, false) as signatures_enabled,
    COALESCE(sp.backgrounds_enabled, false) as backgrounds_enabled,
    COALESCE(s.subscription_tier, 'free') as subscription_tier
  FROM public.subscribers s
  LEFT JOIN public.subscription_plans sp ON sp.name = s.subscription_tier
  WHERE s.user_id = _user_id
  UNION ALL
  SELECT 1, 1, 1, 1, 1, false, false, false, 'free'
  WHERE NOT EXISTS (SELECT 1 FROM public.subscribers WHERE user_id = _user_id)
  LIMIT 1;
$function$;

-- Update update_updated_at_column function with proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Update handle_new_user function with proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'name');
  RETURN NEW;
END;
$function$;

-- Update is_org_member function with proper search_path
CREATE OR REPLACE FUNCTION public.is_org_member(_org_id uuid, _user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.org_memberships
    WHERE org_id = _org_id
      AND user_id = _user_id
  )
$function$;