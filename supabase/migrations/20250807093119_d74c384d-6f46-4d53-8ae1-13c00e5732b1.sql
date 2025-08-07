-- Update get_user_limits function to handle founder emails directly
CREATE OR REPLACE FUNCTION public.get_user_limits(_user_id uuid)
 RETURNS TABLE(max_cards integer, max_profile_images integer, max_gallery_images integer, max_custom_links integer, design_variants_count integer, visible_sections_enabled boolean, signatures_enabled boolean, backgrounds_enabled boolean, subscription_tier text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $function$
  -- Check if user is founder by email
  SELECT 
    CASE WHEN auth.email() IN ('andre@yireh.co.za', 'dylan@yireh.co.za') THEN 999999 ELSE COALESCE(sp.max_cards, 1) END as max_cards,
    CASE WHEN auth.email() IN ('andre@yireh.co.za', 'dylan@yireh.co.za') THEN 999999 ELSE COALESCE(sp.max_profile_images, 1) END as max_profile_images,
    CASE WHEN auth.email() IN ('andre@yireh.co.za', 'dylan@yireh.co.za') THEN 999999 ELSE COALESCE(sp.max_gallery_images, 1) END as max_gallery_images,
    CASE WHEN auth.email() IN ('andre@yireh.co.za', 'dylan@yireh.co.za') THEN 999999 ELSE COALESCE(sp.max_custom_links, 1) END as max_custom_links,
    CASE WHEN auth.email() IN ('andre@yireh.co.za', 'dylan@yireh.co.za') THEN 999999 ELSE COALESCE(sp.design_variants_count, 1) END as design_variants_count,
    CASE WHEN auth.email() IN ('andre@yireh.co.za', 'dylan@yireh.co.za') THEN true ELSE COALESCE(sp.visible_sections_enabled, false) END as visible_sections_enabled,
    CASE WHEN auth.email() IN ('andre@yireh.co.za', 'dylan@yireh.co.za') THEN true ELSE COALESCE(sp.signatures_enabled, false) END as signatures_enabled,
    CASE WHEN auth.email() IN ('andre@yireh.co.za', 'dylan@yireh.co.za') THEN true ELSE COALESCE(sp.backgrounds_enabled, false) END as backgrounds_enabled,
    CASE WHEN auth.email() IN ('andre@yireh.co.za', 'dylan@yireh.co.za') THEN 'founder' ELSE COALESCE(s.subscription_tier, 'free') END as subscription_tier
  FROM public.subscribers s
  LEFT JOIN public.subscription_plans sp ON sp.name = s.subscription_tier
  WHERE s.user_id = _user_id
  UNION ALL
  SELECT 
    CASE WHEN auth.email() IN ('andre@yireh.co.za', 'dylan@yireh.co.za') THEN 999999 ELSE 1 END,
    CASE WHEN auth.email() IN ('andre@yireh.co.za', 'dylan@yireh.co.za') THEN 999999 ELSE 1 END,
    CASE WHEN auth.email() IN ('andre@yireh.co.za', 'dylan@yireh.co.za') THEN 999999 ELSE 1 END,
    CASE WHEN auth.email() IN ('andre@yireh.co.za', 'dylan@yireh.co.za') THEN 999999 ELSE 1 END,
    CASE WHEN auth.email() IN ('andre@yireh.co.za', 'dylan@yireh.co.za') THEN 999999 ELSE 1 END,
    CASE WHEN auth.email() IN ('andre@yireh.co.za', 'dylan@yireh.co.za') THEN true ELSE false END,
    CASE WHEN auth.email() IN ('andre@yireh.co.za', 'dylan@yireh.co.za') THEN true ELSE false END,
    CASE WHEN auth.email() IN ('andre@yireh.co.za', 'dylan@yireh.co.za') THEN true ELSE false END,
    CASE WHEN auth.email() IN ('andre@yireh.co.za', 'dylan@yireh.co.za') THEN 'founder' ELSE 'free' END
  WHERE NOT EXISTS (SELECT 1 FROM public.subscribers WHERE user_id = _user_id)
  LIMIT 1;
$function$;