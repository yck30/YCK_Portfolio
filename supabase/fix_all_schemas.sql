-- Master Supabase Schema Alignment for YCK Portfolio
-- Run this in your Supabase SQL Editor to ensure all tables support all CMS features

-- 1. Ensure blog_posts has images and link support
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS images jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS link text;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS read_time text;

-- 2. Ensure projects has content (details page description), images, and features support
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS content text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS images jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS features jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS order_index integer DEFAULT 0;

-- 3. Ensure hero_content has images support
ALTER TABLE public.hero_content ADD COLUMN IF NOT EXISTS images jsonb DEFAULT '[]'::jsonb;

-- 4. Ensure kitabuild_pipeline has all link and cta columns
ALTER TABLE public.kitabuild_pipeline ADD COLUMN IF NOT EXISTS link text;
ALTER TABLE public.kitabuild_pipeline ADD COLUMN IF NOT EXISTS cta text;
ALTER TABLE public.kitabuild_pipeline ADD COLUMN IF NOT EXISTS order_index integer DEFAULT 0;

-- 5. Ensure journey_entries has link and order_index
ALTER TABLE public.journey_entries ADD COLUMN IF NOT EXISTS link text;
ALTER TABLE public.journey_entries ADD COLUMN IF NOT EXISTS order_index integer DEFAULT 0;

-- 6. Ensure credentials has issuer and order_index
ALTER TABLE public.credentials ADD COLUMN IF NOT EXISTS issuer text;
ALTER TABLE public.credentials ADD COLUMN IF NOT EXISTS order_index integer DEFAULT 0;

-- 7. Ensure footer_links has type and order_index
ALTER TABLE public.footer_links ADD COLUMN IF NOT EXISTS type text DEFAULT 'social';
ALTER TABLE public.footer_links ADD COLUMN IF NOT EXISTS order_index integer DEFAULT 0;
