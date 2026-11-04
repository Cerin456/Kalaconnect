-- KalaConnect Database Schema for Supabase / PostgreSQL
-- Run this SQL in your Supabase Dashboard SQL Editor to initialize production tables

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Artists Profile Table
CREATE TABLE IF NOT EXISTS public.artists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    craft TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    experience TEXT NOT NULL,
    story TEXT,
    tradition TEXT,
    avatar_url TEXT DEFAULT '/images/artist_meera.png',
    badge TEXT DEFAULT 'Verified Artisan',
    views_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Artworks Table
CREATE TABLE IF NOT EXISTS public.artworks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    craft TEXT NOT NULL,
    medium TEXT NOT NULL,
    year TEXT DEFAULT '2026',
    price TEXT,
    dimensions TEXT,
    image_url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Direct Enquiries Table
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    enquiry_type TEXT DEFAULT 'custom_commission',
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'responded')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- 6. Public Read Policies
CREATE POLICY "Public artists are viewable by everyone" ON public.artists
    FOR SELECT USING (true);

CREATE POLICY "Public artworks are viewable by everyone" ON public.artworks
    FOR SELECT USING (true);

-- 7. Enquiry Submission Policy
CREATE POLICY "Anyone can submit an enquiry" ON public.enquiries
    FOR INSERT WITH CHECK (true);

-- 8. Indexes for Instant Search
CREATE INDEX IF NOT EXISTS idx_artists_category ON public.artists(category);
CREATE INDEX IF NOT EXISTS idx_artists_slug ON public.artists(slug);
CREATE INDEX IF NOT EXISTS idx_artworks_artist ON public.artworks(artist_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_artist ON public.enquiries(artist_id);

-- 9. AI Art Pricing Records Table
CREATE TABLE IF NOT EXISTS public.pricing_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE,
    artwork_id UUID REFERENCES public.artworks(id) ON DELETE SET NULL,
    artwork_title TEXT NOT NULL,
    category TEXT NOT NULL,
    dimensions TEXT,
    materials TEXT,
    material_cost NUMERIC(10,2) NOT NULL DEFAULT 0,
    labour_hours NUMERIC(10,2) NOT NULL DEFAULT 0,
    hourly_rate NUMERIC(10,2) NOT NULL DEFAULT 0,
    additional_costs NUMERIC(10,2) NOT NULL DEFAULT 0,
    complexity TEXT NOT NULL DEFAULT 'moderate',
    experience_level TEXT,
    profit_margin NUMERIC(5,2) NOT NULL DEFAULT 25,
    production_cost NUMERIC(10,2) NOT NULL DEFAULT 0,
    suggested_min_price NUMERIC(10,2) NOT NULL DEFAULT 0,
    suggested_max_price NUMERIC(10,2) NOT NULL DEFAULT 0,
    recommended_price NUMERIC(10,2) NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'INR',
    ai_explanation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Creative Journeys Table
CREATE TABLE IF NOT EXISTS public.creative_journeys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE,
    artwork_id UUID REFERENCES public.artworks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    introduction TEXT,
    full_story TEXT,
    keywords TEXT[],
    social_description TEXT,
    visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Journey Stages Table
CREATE TABLE IF NOT EXISTS public.journey_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journey_id UUID REFERENCES public.creative_journeys(id) ON DELETE CASCADE,
    stage_title TEXT NOT NULL,
    description TEXT NOT NULL,
    media_url TEXT NOT NULL,
    media_type TEXT NOT NULL DEFAULT 'image',
    stage_order INT NOT NULL DEFAULT 0,
    stage_date TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Digital Exhibitions Table
CREATE TABLE IF NOT EXISTS public.exhibitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT NOT NULL,
    theme TEXT NOT NULL,
    category TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
    published BOOLEAN NOT NULL DEFAULT true,
    views_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Exhibition Artworks Mapping Table
CREATE TABLE IF NOT EXISTS public.exhibition_artworks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exhibition_id UUID REFERENCES public.exhibitions(id) ON DELETE CASCADE,
    artwork_id UUID REFERENCES public.artworks(id) ON DELETE CASCADE,
    display_order INT NOT NULL DEFAULT 0,
    custom_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(exhibition_id, artwork_id)
);

-- 14. Enable RLS for New Tables
ALTER TABLE public.pricing_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exhibitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exhibition_artworks ENABLE ROW LEVEL SECURITY;

-- 15. Policies
CREATE POLICY "Public journeys are viewable by everyone" ON public.creative_journeys
    FOR SELECT USING (published = true AND visibility = 'public');

CREATE POLICY "Public journey stages are viewable by everyone" ON public.journey_stages
    FOR SELECT USING (true);

CREATE POLICY "Public exhibitions are viewable by everyone" ON public.exhibitions
    FOR SELECT USING (published = true AND visibility = 'public');

CREATE POLICY "Public exhibition artworks are viewable by everyone" ON public.exhibition_artworks
    FOR SELECT USING (true);
