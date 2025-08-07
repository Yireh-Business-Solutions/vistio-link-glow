-- Add customization options to cards table
ALTER TABLE public.cards 
ADD COLUMN IF NOT EXISTS profile_image_size text DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS company_logo_size text DEFAULT 'small',
ADD COLUMN IF NOT EXISTS visible_sections jsonb DEFAULT '{"contact": true, "social": true, "professional": true, "images": true, "custom_links": true}'::jsonb,
ADD COLUMN IF NOT EXISTS signature_style jsonb DEFAULT '{"background": "gradient", "pattern": "none", "custom_colors": {"primary": null, "secondary": null}}'::jsonb,
ADD COLUMN IF NOT EXISTS background_style jsonb DEFAULT '{"pattern": "grid", "gradient_direction": "diagonal", "custom_colors": {"start": null, "end": null}}'::jsonb;