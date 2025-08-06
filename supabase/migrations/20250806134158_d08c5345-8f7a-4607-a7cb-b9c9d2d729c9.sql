-- Add new fields to cards table for enhanced professional look
ALTER TABLE public.cards 
ADD COLUMN IF NOT EXISTS work_phone TEXT,
ADD COLUMN IF NOT EXISTS whatsapp TEXT,
ADD COLUMN IF NOT EXISTS company_logo TEXT,
ADD COLUMN IF NOT EXISTS certifications TEXT,
ADD COLUMN IF NOT EXISTS awards TEXT,
ADD COLUMN IF NOT EXISTS specialties TEXT;