-- Supabase Schema for YCK Portfolio

-- Create Projects Table
CREATE TABLE public.projects (
    id text PRIMARY KEY,
    title text NOT NULL,
    description text NOT NULL,
    role text NOT NULL,
    link text NOT NULL,
    features jsonb DEFAULT '[]'::jsonb,
    images jsonb DEFAULT '[]'::jsonb,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Blog Posts Table
CREATE TABLE public.blog_posts (
    id text PRIMARY KEY,
    slug text UNIQUE NOT NULL,
    title text NOT NULL,
    excerpt text NOT NULL,
    content text NOT NULL,
    tags jsonb DEFAULT '[]'::jsonb,
    images jsonb DEFAULT '[]'::jsonb,
    read_time text,
    published_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create Policies for Projects
-- Anyone can view projects
CREATE POLICY "Projects are viewable by everyone" ON public.projects FOR SELECT USING (true);
-- Only authenticated users can insert/update/delete
CREATE POLICY "Only authenticated users can insert projects" ON public.projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can update projects" ON public.projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can delete projects" ON public.projects FOR DELETE USING (auth.role() = 'authenticated');

-- Create Policies for Blog Posts
-- Anyone can view blog posts
CREATE POLICY "Blog posts are viewable by everyone" ON public.blog_posts FOR SELECT USING (true);
-- Only authenticated users can insert/update/delete
CREATE POLICY "Only authenticated users can insert blog posts" ON public.blog_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can update blog posts" ON public.blog_posts FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can delete blog posts" ON public.blog_posts FOR DELETE USING (auth.role() = 'authenticated');

-- Insert initial data (Migrating from JSON)
INSERT INTO public.projects (id, title, description, role, link, features, images, order_index) VALUES
('kitabuild', 'KitaBuild', 'An AI-powered hackathon project discovery and team formation platform.', 'Lead Developer & Designer', 'https://kitabuild.example.com', '["AI Matching Algorithm", "Real-time Chat", "Project Showcases"]', '[{"src": "/assets/kitabuild-1.png", "position": "center"}, {"src": "/assets/kitabuild-2.png", "position": "top"}]', 1),
('bikin-ingat', 'BIKIN INGAT', 'A gamified spaced-repetition learning app for students in Malaysia.', 'Fullstack Engineer', 'https://bikiningat.example.com', '["Spaced Repetition System", "Gamification Elements", "Progress Tracking"]', '[{"src": "/assets/bikin-1.png", "position": "center"}]', 2);

INSERT INTO public.blog_posts (id, slug, title, excerpt, content, tags, read_time) VALUES
('merging-strategy-motion', 'first-post', 'Merging Strategy & Motion', 'Exploring how tactile motion design influences user conversion paths.', '# Merging Strategy & Motion\n\nMotion design is often treated as the final coat of paint on a digital product. It''s the icing on the cake, the flourish added just before launch. But when we treat motion as an afterthought, we miss its true potential.\n\nMotion isn''t just about delight—it''s a critical component of user strategy and conversion.\n\n## The Cognitive Load of Static Interfaces\n\nWhen a user navigates a static interface, state changes can be jarring. A modal popping in instantly or a layout shifting without transition increases cognitive load. The brain has to process the "before" and "after" states and bridge the gap manually.\n\nFluid transitions do that work for the user. A well-designed spring animation connecting two states tells a physical story: *this object came from here and went there*.\n\n## Tactile UI and Trust\n\nPremium feel builds trust, and trust drives conversion. In my experience building landing pages and products, we''ve seen that high-quality, tactile feedback (like the subtle magnetic pull of a CTA button) subtly reassures the user of the platform''s robustness.\n\n> "A great interface feels like a physical object in a digital space."\n\n## Conclusion\n\nBy integrating motion early in the design strategy phase, we can guide attention, reduce cognitive load, and ultimately craft experiences that feel less like software and more like magic.', '["Design", "Motion"]', '4 min read'),
('power-of-server-components', 'second-post', 'The Power of Server Components', 'Why Next.js Server Components are perfect for blazing fast portfolio sites.', '# The Power of Server Components\n\nNext.js 14 introduces a paradigm shift in how we build React applications. By moving the rendering logic to the server, we can achieve blazing fast load times and exceptional SEO.\n\n## Why Server Components?\n\n1. **Zero Client-Side JavaScript:** Send less code to the browser.\n2. **Direct Backend Access:** Fetch data from databases securely without exposing APIs.\n3. **Automatic Caching:** Next.js aggressively caches responses for instant loads.\n\nFor a portfolio, this means your case studies load instantly, your images are perfectly optimized, and you don''t sacrifice the interactive feel of a single-page app.', '["Engineering", "Next.js"]', '6 min read');
