-- Create churches table
CREATE TABLE IF NOT EXISTS public.churches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT,
  country TEXT DEFAULT 'US',
  latitude NUMERIC,
  longitude NUMERIC,
  phone TEXT,
  email TEXT,
  website TEXT,
  denomination TEXT,
  church_network TEXT,
  worship_style TEXT,
  service_times JSONB DEFAULT '[]'::JSONB,
  ministries TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  kids_ministry BOOLEAN DEFAULT FALSE,
  youth_ministry BOOLEAN DEFAULT FALSE,
  college_ministry BOOLEAN DEFAULT FALSE,
  small_groups BOOLEAN DEFAULT FALSE,
  online_service BOOLEAN DEFAULT FALSE,
  online_service_url TEXT,
  accessibility TEXT[] DEFAULT '{}',
  parking_info TEXT,
  profile_image_url TEXT,
  gallery_urls TEXT[] DEFAULT '{}',
  verified BOOLEAN DEFAULT FALSE,
  claimed BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create church_claims table
CREATE TABLE IF NOT EXISTS public.church_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE,
  claimant_name TEXT NOT NULL,
  claimant_role TEXT,
  claimant_email TEXT NOT NULL,
  claimant_phone TEXT,
  church_website TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sponsored_listings table
CREATE TABLE IF NOT EXISTS public.sponsored_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  placement_area TEXT,
  start_date DATE,
  end_date DATE,
  active BOOLEAN DEFAULT TRUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create saved_churches table
CREATE TABLE IF NOT EXISTS public.saved_churches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, church_id)
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID REFERENCES public.churches(id) ON DELETE SET NULL,
  sender_name TEXT,
  sender_email TEXT,
  sender_phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_churches_city ON public.churches(city);
CREATE INDEX IF NOT EXISTS idx_churches_state ON public.churches(state);
CREATE INDEX IF NOT EXISTS idx_churches_zip ON public.churches(zip);
CREATE INDEX IF NOT EXISTS idx_churches_denomination ON public.churches(denomination);
CREATE INDEX IF NOT EXISTS idx_churches_featured ON public.churches(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_churches_verified ON public.churches(verified) WHERE verified = TRUE;
CREATE INDEX IF NOT EXISTS idx_churches_active ON public.churches(active) WHERE active = TRUE;
CREATE INDEX IF NOT EXISTS idx_churches_slug ON public.churches(slug);

CREATE INDEX IF NOT EXISTS idx_sponsored_listings_church_id ON public.sponsored_listings(church_id);
CREATE INDEX IF NOT EXISTS idx_church_claims_church_id ON public.church_claims(church_id);
CREATE INDEX IF NOT EXISTS idx_saved_churches_user_id ON public.saved_churches(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_churches_church_id ON public.saved_churches(church_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_church_id ON public.contact_messages(church_id);

-- Create function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for churches table
DROP TRIGGER IF EXISTS update_churches_updated_at ON public.churches;
CREATE TRIGGER update_churches_updated_at
  BEFORE UPDATE ON public.churches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for sponsored_listings table
DROP TRIGGER IF EXISTS update_sponsored_listings_updated_at ON public.sponsored_listings;
CREATE TRIGGER update_sponsored_listings_updated_at
  BEFORE UPDATE ON public.sponsored_listings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsored_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_churches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for churches
-- Public users can read active churches
CREATE POLICY "Public users can read active churches" ON public.churches
  FOR SELECT
  USING (active = TRUE);

-- RLS Policies for church_claims
-- Public users can insert claim requests
CREATE POLICY "Public users can insert church claims" ON public.church_claims
  FOR INSERT
  WITH CHECK (TRUE);

-- RLS Policies for sponsored_listings
-- Public users can read active sponsored listings
CREATE POLICY "Public users can read active sponsored listings" ON public.sponsored_listings
  FOR SELECT
  USING (active = TRUE);

-- RLS Policies for saved_churches
-- Authenticated users can insert their own saved churches
CREATE POLICY "Users can insert their own saved churches" ON public.saved_churches
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Authenticated users can read their own saved churches
CREATE POLICY "Users can read their own saved churches" ON public.saved_churches
  FOR SELECT
  USING (user_id = auth.uid());

-- Authenticated users can delete their own saved churches
CREATE POLICY "Users can delete their own saved churches" ON public.saved_churches
  FOR DELETE
  USING (user_id = auth.uid());

-- RLS Policies for contact_messages
-- Public users can insert contact messages
CREATE POLICY "Public users can insert contact messages" ON public.contact_messages
  FOR INSERT
  WITH CHECK (TRUE);

-- Create full-text search index and column
ALTER TABLE public.churches ADD COLUMN IF NOT EXISTS search_vector TSVECTOR;

-- Trigger to update search_vector
CREATE OR REPLACE FUNCTION public.update_churches_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    SETWEIGHT(TO_TSVECTOR('english', COALESCE(NEW.name, '')), 'A') ||
    SETWEIGHT(TO_TSVECTOR('english', COALESCE(NEW.city, '')), 'B') ||
    SETWEIGHT(TO_TSVECTOR('english', COALESCE(NEW.state, '')), 'B') ||
    SETWEIGHT(TO_TSVECTOR('english', COALESCE(NEW.denomination, '')), 'C') ||
    SETWEIGHT(TO_TSVECTOR('english', COALESCE(NEW.description, '')), 'D') ||
    SETWEIGHT(TO_TSVECTOR('english', COALESCE(NEW.worship_style, '')), 'C') ||
    SETWEIGHT(TO_TSVECTOR('english', ARRAY_TO_STRING(NEW.ministries, ' ')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_churches_search_vector ON public.churches;
CREATE TRIGGER update_churches_search_vector
  BEFORE INSERT OR UPDATE ON public.churches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_churches_search_vector();

-- Create GiST index for full-text search
CREATE INDEX IF NOT EXISTS idx_churches_search_vector ON public.churches USING GIST(search_vector);
