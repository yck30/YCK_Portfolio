-- Supabase Schema Update: Add detailed 'content' column for Projects and KitaBuild Pipeline

-- 1. Add content column to Projects table (for project detail case study description)
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS content text;

-- 2. Add content column to KitaBuild Pipeline table (for extended project description)
ALTER TABLE public.kitabuild_pipeline ADD COLUMN IF NOT EXISTS content text;
