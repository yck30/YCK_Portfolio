-- Supabase Schema Update: Add detailed 'content' and 'link' columns

-- 1. Add content column to Projects table (for project detail case study description)
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS content text;

-- 2. Add link column to Blog Posts table (for references, live demos & resource URLs)
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS link text;
