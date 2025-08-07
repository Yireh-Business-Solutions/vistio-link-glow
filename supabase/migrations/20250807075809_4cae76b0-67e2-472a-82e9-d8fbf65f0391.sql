-- Add new columns for multiple profile images and design variant
ALTER TABLE public.cards 
ADD COLUMN profile_image_2_url TEXT,
ADD COLUMN profile_image_3_url TEXT,
ADD COLUMN profile_image_4_url TEXT,
ADD COLUMN profile_image_5_url TEXT,
ADD COLUMN design_variant TEXT DEFAULT 'classic';