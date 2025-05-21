-- Create the 'ads' table
CREATE TABLE public.ads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2),
    category TEXT,
    image_urls TEXT[], -- Array of image URLs from Cloudflare Images
    lottie_url TEXT,    -- Optional Lottie animation URL
    is_topped BOOLEAN DEFAULT FALSE,
    topped_expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security (RLS) for the 'ads' table
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to view all ads
CREATE POLICY "Authenticated users can view all ads" ON public.ads
FOR SELECT USING (auth.role() = 'authenticated');

-- Policy for authenticated users to create their own ads
CREATE POLICY "Authenticated users can create their own ads" ON public.ads
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for authenticated users to update their own ads
CREATE POLICY "Authenticated users can update their own ads" ON public.ads
FOR UPDATE USING (auth.uid() = user_id);

-- Policy for authenticated users to delete their own ads
CREATE POLICY "Authenticated users can delete their own ads" ON public.ads
FOR DELETE USING (auth.uid() = user_id);

-- Create a function to handle topping expiration
CREATE OR REPLACE FUNCTION public.check_topped_expiration()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_topped = TRUE AND NEW.topped_expires_at IS NULL THEN
        RAISE EXCEPTION 'topped_expires_at must be set if is_topped is TRUE';
    END IF;
    IF NEW.is_topped = FALSE THEN
        NEW.topped_expires_at = NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function before insert or update on 'ads'
CREATE TRIGGER check_topped_expiration_trigger
BEFORE INSERT OR UPDATE ON public.ads
FOR EACH ROW EXECUTE FUNCTION public.check_topped_expiration();

-- Add a function to generate UUIDs if not already present (Supabase usually has this)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
