-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price_monthly INTEGER NOT NULL, -- Price in cents (ZAR)
  price_yearly INTEGER NOT NULL, -- Price in cents (ZAR)
  stripe_price_id_monthly TEXT,
  stripe_price_id_yearly TEXT,
  max_cards INTEGER NOT NULL,
  max_profile_images INTEGER NOT NULL,
  max_gallery_images INTEGER NOT NULL,
  max_custom_links INTEGER NOT NULL,
  design_variants_count INTEGER NOT NULL,
  visible_sections_enabled BOOLEAN NOT NULL DEFAULT false,
  signatures_enabled BOOLEAN NOT NULL DEFAULT false,
  backgrounds_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create subscribers table
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT DEFAULT 'free',
  subscription_end TIMESTAMPTZ,
  stripe_subscription_id TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies for subscription_plans (publicly readable)
CREATE POLICY "Plans are publicly viewable" ON public.subscription_plans
FOR SELECT
USING (true);

-- Create policies for subscribers
CREATE POLICY "Users can view their own subscription" ON public.subscribers
FOR SELECT
USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "Users can update their own subscription" ON public.subscribers
FOR UPDATE
USING (true);

CREATE POLICY "Users can insert their own subscription" ON public.subscribers
FOR INSERT
WITH CHECK (true);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, price_monthly, price_yearly, max_cards, max_profile_images, max_gallery_images, max_custom_links, design_variants_count, visible_sections_enabled, signatures_enabled, backgrounds_enabled) VALUES
('Free', 0, 0, 1, 1, 1, 1, 1, false, false, false),
('Personal', 4900, 55000, 2, 2, 2, 5, 2, true, false, false),
('Pro', 39900, 440000, 5, 5, 5, 10, 10, true, true, true),
('Business', 99900, 1100000, 15, 5, 5, 20, 10, true, true, true);

-- Create function to get user subscription limits
CREATE OR REPLACE FUNCTION public.get_user_limits(_user_id uuid)
RETURNS TABLE(
  max_cards integer,
  max_profile_images integer,
  max_gallery_images integer,
  max_custom_links integer,
  design_variants_count integer,
  visible_sections_enabled boolean,
  signatures_enabled boolean,
  backgrounds_enabled boolean,
  subscription_tier text
)
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
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
$$;