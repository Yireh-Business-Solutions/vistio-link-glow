-- Create storage buckets for card images and company logos
INSERT INTO storage.buckets (id, name, public) VALUES ('card-images', 'card-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('company-logos', 'company-logos', true);

-- Create policies for card-images bucket
CREATE POLICY "Users can upload their own card images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'card-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can view card images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'card-images');

CREATE POLICY "Users can update their own card images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'card-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own card images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'card-images' AND auth.uid() IS NOT NULL);

-- Create policies for company-logos bucket
CREATE POLICY "Users can upload their own company logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'company-logos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can view company logos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'company-logos');

CREATE POLICY "Users can update their own company logos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'company-logos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own company logos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'company-logos' AND auth.uid() IS NOT NULL);

-- Add image and link columns to cards table
ALTER TABLE public.cards 
ADD COLUMN IF NOT EXISTS image_1_url TEXT,
ADD COLUMN IF NOT EXISTS image_2_url TEXT,
ADD COLUMN IF NOT EXISTS image_3_url TEXT,
ADD COLUMN IF NOT EXISTS image_4_url TEXT,
ADD COLUMN IF NOT EXISTS image_5_url TEXT,
ADD COLUMN IF NOT EXISTS link_1_title TEXT,
ADD COLUMN IF NOT EXISTS link_1_url TEXT,
ADD COLUMN IF NOT EXISTS link_2_title TEXT,
ADD COLUMN IF NOT EXISTS link_2_url TEXT,
ADD COLUMN IF NOT EXISTS link_3_title TEXT,
ADD COLUMN IF NOT EXISTS link_3_url TEXT,
ADD COLUMN IF NOT EXISTS link_4_title TEXT,
ADD COLUMN IF NOT EXISTS link_4_url TEXT,
ADD COLUMN IF NOT EXISTS link_5_title TEXT,
ADD COLUMN IF NOT EXISTS link_5_url TEXT,
ADD COLUMN IF NOT EXISTS link_6_title TEXT,
ADD COLUMN IF NOT EXISTS link_6_url TEXT,
ADD COLUMN IF NOT EXISTS link_7_title TEXT,
ADD COLUMN IF NOT EXISTS link_7_url TEXT,
ADD COLUMN IF NOT EXISTS link_8_title TEXT,
ADD COLUMN IF NOT EXISTS link_8_url TEXT,
ADD COLUMN IF NOT EXISTS link_9_title TEXT,
ADD COLUMN IF NOT EXISTS link_9_url TEXT,
ADD COLUMN IF NOT EXISTS link_10_title TEXT,
ADD COLUMN IF NOT EXISTS link_10_url TEXT,
ADD COLUMN IF NOT EXISTS link_11_title TEXT,
ADD COLUMN IF NOT EXISTS link_11_url TEXT,
ADD COLUMN IF NOT EXISTS link_12_title TEXT,
ADD COLUMN IF NOT EXISTS link_12_url TEXT,
ADD COLUMN IF NOT EXISTS link_13_title TEXT,
ADD COLUMN IF NOT EXISTS link_13_url TEXT,
ADD COLUMN IF NOT EXISTS link_14_title TEXT,
ADD COLUMN IF NOT EXISTS link_14_url TEXT,
ADD COLUMN IF NOT EXISTS link_15_title TEXT,
ADD COLUMN IF NOT EXISTS link_15_url TEXT,
ADD COLUMN IF NOT EXISTS link_16_title TEXT,
ADD COLUMN IF NOT EXISTS link_16_url TEXT,
ADD COLUMN IF NOT EXISTS link_17_title TEXT,
ADD COLUMN IF NOT EXISTS link_17_url TEXT,
ADD COLUMN IF NOT EXISTS link_18_title TEXT,
ADD COLUMN IF NOT EXISTS link_18_url TEXT,
ADD COLUMN IF NOT EXISTS link_19_title TEXT,
ADD COLUMN IF NOT EXISTS link_19_url TEXT,
ADD COLUMN IF NOT EXISTS link_20_title TEXT,
ADD COLUMN IF NOT EXISTS link_20_url TEXT;