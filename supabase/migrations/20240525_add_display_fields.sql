-- Add display fields to churches table for UI compatibility
ALTER TABLE public.churches ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE public.churches ADD COLUMN IF NOT EXISTS size TEXT DEFAULT 'Mid-Size';
ALTER TABLE public.churches ADD COLUMN IF NOT EXISTS style TEXT;
ALTER TABLE public.churches ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.churches ADD COLUMN IF NOT EXISTS image_alt TEXT;
