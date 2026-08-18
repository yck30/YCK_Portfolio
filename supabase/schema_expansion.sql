-- Supabase Schema Expansion for YCK Portfolio (Phase 3 - Full CMS Expansion)

-- 1. Create About Content Table
CREATE TABLE IF NOT EXISTS public.about_content (
    id text PRIMARY KEY DEFAULT 'main',
    headline text NOT NULL,
    bio jsonb DEFAULT '[]'::jsonb,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Journey Entries Table
CREATE TABLE IF NOT EXISTS public.journey_entries (
    id text PRIMARY KEY,
    year text NOT NULL,
    title text NOT NULL,
    company text NOT NULL,
    description text NOT NULL,
    link text,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create KitaBuild Pipeline Table
CREATE TABLE IF NOT EXISTS public.kitabuild_pipeline (
    id text PRIMARY KEY,
    title text NOT NULL,
    description text NOT NULL,
    status text NOT NULL,
    link text,
    cta text,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Credentials Table
CREATE TABLE IF NOT EXISTS public.credentials (
    id text PRIMARY KEY,
    category text NOT NULL,
    title text NOT NULL,
    issuer text,
    year text NOT NULL,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Footer Links Table
CREATE TABLE IF NOT EXISTS public.footer_links (
    id text PRIMARY KEY,
    label text NOT NULL,
    url text NOT NULL,
    type text DEFAULT 'social',
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on all new tables
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kitabuild_pipeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_links ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "About content is viewable by everyone" ON public.about_content FOR SELECT USING (true);
CREATE POLICY "Journey entries are viewable by everyone" ON public.journey_entries FOR SELECT USING (true);
CREATE POLICY "KitaBuild pipeline is viewable by everyone" ON public.kitabuild_pipeline FOR SELECT USING (true);
CREATE POLICY "Credentials are viewable by everyone" ON public.credentials FOR SELECT USING (true);
CREATE POLICY "Footer links are viewable by everyone" ON public.footer_links FOR SELECT USING (true);

-- Authenticated write policies (About)
CREATE POLICY "Only authenticated users can insert about content" ON public.about_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can update about content" ON public.about_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can delete about content" ON public.about_content FOR DELETE USING (auth.role() = 'authenticated');

-- Authenticated write policies (Journey)
CREATE POLICY "Only authenticated users can insert journey entries" ON public.journey_entries FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can update journey entries" ON public.journey_entries FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can delete journey entries" ON public.journey_entries FOR DELETE USING (auth.role() = 'authenticated');

-- Authenticated write policies (KitaBuild Pipeline)
CREATE POLICY "Only authenticated users can insert pipeline" ON public.kitabuild_pipeline FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can update pipeline" ON public.kitabuild_pipeline FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can delete pipeline" ON public.kitabuild_pipeline FOR DELETE USING (auth.role() = 'authenticated');

-- Authenticated write policies (Credentials)
CREATE POLICY "Only authenticated users can insert credentials" ON public.credentials FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can update credentials" ON public.credentials FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can delete credentials" ON public.credentials FOR DELETE USING (auth.role() = 'authenticated');

-- Authenticated write policies (Footer links)
CREATE POLICY "Only authenticated users can insert footer links" ON public.footer_links FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can update footer links" ON public.footer_links FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can delete footer links" ON public.footer_links FOR DELETE USING (auth.role() = 'authenticated');

-- Seed Data Insertion

-- Seed About Content
INSERT INTO public.about_content (id, headline, bio) VALUES (
    'main',
    'I build experiences that merge strategy, design, and motion.',
    '["I''m CK. My current personal focus is website/landing page development, vibecoding, and AI projects.", "I believe in shipping fast without compromising on the details. Whether it''s crafting a high-conversion landing page or developing a community platform, I bridge the gap between creative vision and technical execution."]'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Seed Journey Entries
INSERT INTO public.journey_entries (id, year, title, company, description, link, order_index) VALUES
('j1', '2026–Present', 'Chief Strategy Officer (Founder)', 'KitaBuild LLP', 'Founding KitaBuild LLP to provide end-to-end product development services', 'https://kitabuild.com/', 1),
('j2', '2026-Present', 'Co-founder', 'KitaBuild Community', 'Co-founded a state-wide platform to democratize AI and vibecoding skills across Sabah', null, 2),
('j3', '2026', 'Full-Stack AI Development', 'Gamuda AI Academy (Sabah), Cohort 3', 'Intensive 3-month program covering frontend, backend, database, cloud deployment, and AI integration', null, 3),
('j4', '2024–2026', 'Executive Director & Co-Founder', 'Singapore-owned private company, Sabah', 'Visioned and established a sustainable manufacturing company in Sabah, focusing on eco-friendly practices and community engagement', null, 4),
('j5', '2024', 'Business Manager', 'Chinese-Sabah joint venture', 'Embarked on mining and commodity trading', null, 5),
('j6', '2019–2024', 'Business Development', 'Sabah State-owned GLC', 'Industrial park management and ports operations', null, 6),
('j7', '2019', 'Bachelor of Economics (Hons)', 'Universiti Malaysia Sabah', 'Graduated with Honours, laying the analytical foundation for a career in strategy and business development', null, 7),
('j8', '2019', 'Commissioned 2nd Lieutenant', 'Royal Malaysian Air Force (Volunteer Reserve)', 'Commissioned by the Crown Prince of Johor after completing military and tactical training', null, 8)
ON CONFLICT (id) DO NOTHING;

-- Seed KitaBuild Pipeline
INSERT INTO public.kitabuild_pipeline (id, title, description, status, link, cta, order_index) VALUES
('devnable', 'Devnable', 'An interactive global directory mapping developer talent, agencies, and code products.', 'LIVE', 'https://www.devnable.space/map', 'Explore the Map', 1),
('web-hosting', 'Web Hosting', 'Get a landing page live in days, not weeks — hosting handled, so you focus on the offer, not the server.', 'LIVE', 'https://kitabuild.com/saas', null, 2),
('digital-marketing', 'Digital Marketing & Video Production', '1-page landing page plus a 2-minute mobilegraphy marketing video — RM 1,000 package.', 'Available Now', 'https://kitabuild.com/', 'Enquire via the KitaBuild website or get in touch above', 3),
('training', 'Training', 'Hands-on AI, vibecoding, digital marketing and content-creation training for teams and individuals who want to build.', 'Ongoing', 'https://kitabuild.com/', 'Enquire via the KitaBuild website or get in touch above', 4),
('kitacreator', 'KitaCreator', 'Skip the cold-DM hunt for creators or brands — matched based on fit.', 'Coming Soon', null, null, 5),
('kitaacademy', 'KitaAcademy', 'A structured LMS, go from curious to capable.', 'Coming Soon', null, null, 6),
('custom-solutions', 'Custom AI & Digital Solutions', 'Custom AI-driven tools built around a specific corporate bottleneck, instead of forcing your process to fit off-the-shelf software.', 'Coming Soon', null, null, 7)
ON CONFLICT (id) DO NOTHING;

-- Seed Credentials
INSERT INTO public.credentials (id, category, title, issuer, year, order_index) VALUES
('c1', 'Academic & Research', '"A Critical Review of Sustainability Outcomes and Measurement Challenges in ESG Frameworks"', 'Scopus-indexed, MSW Management Journal', '2026', 1),
('c2', 'Academic & Research', 'Master of Business Administration (In Progress)', 'INTI International University', '2025', 2),
('c3', 'Academic & Research', 'Bachelor of Economics (Hons), Planning and Development Economics', 'Universiti Malaysia Sabah', '2019', 3),
('c4', 'Academic & Research', 'Commissioned 2nd Lieutenant', 'Royal Malaysian Air Force (Volunteer Reserve)', '2019', 4),

('c5', 'AI & Software Development', 'Full-Stack AI Developer Certificate', 'Gamuda AI Academy (Sabah), Cohort 3', '2026', 5),
('c6', 'AI & Software Development', '2nd Runner-Up, Capstone Project', 'Gamuda AI Academy (Sabah), Cohort 3', '2026', 6),
('c7', 'AI & Software Development', 'Certified User: Programmer (Unity)', 'Unity Technologies', '2025', 7),
('c8', 'AI & Software Development', 'Android Certified Application Developer', 'ATC', '2023', 8),

('c9', 'Project Management', 'PMI Certified Associate in Project Management (CAPM)', null, '2026', 9),
('c10', 'Project Management', 'PMI Project Management Ready®', null, '2025', 10),

('c11', 'Digital Content & Design (Adobe Certified Professional)', 'Document Creation & Management using Adobe Acrobat Pro', null, '2025', 11),
('c12', 'Digital Content & Design (Adobe Certified Professional)', 'Print & Digital Media Publication using Adobe InDesign', null, '2025', 12),
('c13', 'Digital Content & Design (Adobe Certified Professional)', 'Content Creation & Marketing using Adobe Express', null, '2025', 13),
('c14', 'Digital Content & Design (Adobe Certified Professional)', 'Visual Design using Adobe Photoshop', null, '2024', 14),
('c15', 'Digital Content & Design (Adobe Certified Professional)', 'Multiplatform Animation using Adobe Animate', null, '2024', 15),
('c16', 'Digital Content & Design (Adobe Certified Professional)', 'Visual Effects & Motion Graphics using Adobe After Effects', null, '2024', 16),
('c17', 'Digital Content & Design (Adobe Certified Professional)', 'Graphic Design & Illustration using Adobe Illustrator', null, '2023', 17),
('c18', 'Digital Content & Design (Adobe Certified Professional)', 'Digital Video using Adobe Premiere Pro', null, '2023', 18),

('c19', 'Business & Office Productivity', 'Microsoft Office Specialist – Word Expert', null, '2024', 19),
('c20', 'Business & Office Productivity', 'Microsoft Office Specialist – Excel Expert', null, '2024', 20),
('c21', 'Business & Office Productivity', 'Access UBS Certificate – Accounting', null, '2024', 21),
('c22', 'Business & Office Productivity', 'Access UBS Certificate – Inventory', null, '2024', 22),
('c23', 'Business & Office Productivity', 'Microsoft Office Specialist – Associate (Word, Excel, PowerPoint)', null, '2023', 23),

('c24', 'Data Strategy & Automation', 'Microsoft Certified: Power Platform Fundamentals', null, '2023', 24),
('c25', 'Data Strategy & Automation', 'Microsoft Certified: Power BI Data Analyst Associate', null, '2023', 25),

('c26', 'Digital Marketing', 'Digital Marketing Certificate', 'Google Digital Garage', '2023', 26),
('c27', 'Digital Marketing', 'Meta Certified Digital Marketing Associate', null, '2023', 27)
ON CONFLICT (id) DO NOTHING;

-- Seed Footer Links
INSERT INTO public.footer_links (id, label, url, type, order_index) VALUES
('fl1', 'Email', 'mailto:ckyong@kitabuild.com', 'contact', 1),
('fl2', 'WhatsApp', 'https://wa.me/60189896411', 'contact', 2),
('fl3', 'GitHub', 'https://github.com/yck30', 'social', 3),
('fl4', 'LinkedIn', 'https://www.linkedin.com/in/chunkityong', 'social', 4),
('fl5', 'TikTok', 'https://www.tiktok.com/@yck96', 'social', 5),
('fl6', 'Instagram', 'https://www.instagram.com/ck_yong96/', 'social', 6),
('fl7', 'Threads', 'https://www.threads.com/@ck_yong96', 'social', 7),
('fl8', 'Facebook', 'https://web.facebook.com/YCK96/', 'social', 8)
ON CONFLICT (id) DO NOTHING;
