-- Supabase Schema Expansion for Hero Section, Privacy Policy & Footer Settings

-- 1. Create Hero Content Table
CREATE TABLE IF NOT EXISTS public.hero_content (
    id text PRIMARY KEY DEFAULT 'main',
    eyebrow text NOT NULL DEFAULT 'Web Developer & AI Builder',
    line1 text NOT NULL DEFAULT 'Strategy,',
    line2 text NOT NULL DEFAULT 'design &',
    line3 text NOT NULL DEFAULT 'motion.',
    subtitle text NOT NULL DEFAULT 'Bridging the gap between creative vision and technical execution.',
    location_badge text NOT NULL DEFAULT 'Based in Malaysia',
    scroll_badge text NOT NULL DEFAULT 'Scroll to explore',
    copyright_text text NOT NULL DEFAULT '© 2026 CK Yong',
    images jsonb DEFAULT '["/assets/Personal_1.JPG", "/assets/Personal_2.JPG", "/assets/Personal_3.JPG"]'::jsonb,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Privacy Policy Table
CREATE TABLE IF NOT EXISTS public.privacy_policy (
    id text PRIMARY KEY DEFAULT 'main',
    title text NOT NULL DEFAULT 'Privacy Policy',
    last_updated text NOT NULL DEFAULT 'August 2026',
    content text NOT NULL DEFAULT '## 1. Introduction
Welcome to my personal portfolio and brand hub. I value your privacy and believe in full transparency regarding how your data is handled. This policy outlines what data is collected, why it is collected, and the trusted third-party services used to process it. I do not sell your personal data to advertisers or third parties.

## 2. Information Collection & Usage

### Contact Form (Formspree)
When you use the "Get in touch" form, you are asked to provide your **Name**, **Email Address**, and a **Message**. This data is securely processed by Formspree. It is used strictly for the purpose of receiving and responding to your direct inquiries.

### Newsletter (Buttondown)
If you choose to subscribe to the blog newsletter, your **Email Address** will be collected and managed via Buttondown. This information is used exclusively to send you updates when new articles are published. You may opt out and unsubscribe at any time using the link provided in every email.

### Website Analytics (Google Analytics 4)
To understand how visitors interact with the portfolio and improve the user experience, this site uses Google Analytics 4 (GA4). GA4 may use cookies to collect anonymous, aggregated data such as pages visited, device types, and generalized geographical locations. This data cannot be used to personally identify you.

## 3. Third-Party Services
This portfolio is hosted on **Vercel**, which may collect standard access logs (like IP addresses) for security and operational purposes. By using this site, you also consent to the data processing practices of our service providers: Formspree (contact form), Buttondown (newsletter), and Google (analytics), in accordance with their respective privacy policies.

## 4. Your Rights
You have the right to request access to, correction of, or deletion of any personal data you have directly provided to me (e.g., via the contact form or newsletter). If you wish to exercise these rights or have any questions about this Privacy Policy, please contact me directly.',
    contact_email text NOT NULL DEFAULT 'ckyong@kitabuild.com',
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Footer Settings Table
CREATE TABLE IF NOT EXISTS public.footer_settings (
    id text PRIMARY KEY DEFAULT 'main',
    heading text NOT NULL DEFAULT 'Stay Connected',
    subtitle text NOT NULL DEFAULT 'Have a project in mind or just want to say hi? Feel free to reach out across any of the platforms below.',
    copyright_text text NOT NULL DEFAULT '© 2026 CK Yong. All rights reserved.',
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_policy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Hero content is viewable by everyone" ON public.hero_content FOR SELECT USING (true);
CREATE POLICY "Privacy policy is viewable by everyone" ON public.privacy_policy FOR SELECT USING (true);
CREATE POLICY "Footer settings are viewable by everyone" ON public.footer_settings FOR SELECT USING (true);

-- Authenticated write policies (Hero content)
CREATE POLICY "Only authenticated users can insert hero content" ON public.hero_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can update hero content" ON public.hero_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can delete hero content" ON public.hero_content FOR DELETE USING (auth.role() = 'authenticated');

-- Authenticated write policies (Privacy policy)
CREATE POLICY "Only authenticated users can insert privacy policy" ON public.privacy_policy FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can update privacy policy" ON public.privacy_policy FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can delete privacy policy" ON public.privacy_policy FOR DELETE USING (auth.role() = 'authenticated');

-- Authenticated write policies (Footer settings)
CREATE POLICY "Only authenticated users can insert footer settings" ON public.footer_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can update footer settings" ON public.footer_settings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can delete footer settings" ON public.footer_settings FOR DELETE USING (auth.role() = 'authenticated');

-- Seed Data Insertion
INSERT INTO public.hero_content (id, eyebrow, line1, line2, line3, subtitle, location_badge, scroll_badge, copyright_text, images) VALUES (
    'main',
    'Web Developer & AI Builder',
    'Strategy,',
    'design &',
    'motion.',
    'Bridging the gap between creative vision and technical execution.',
    'Based in Malaysia',
    'Scroll to explore',
    '© 2026 CK Yong',
    '["/assets/Personal_1.JPG", "/assets/Personal_2.JPG", "/assets/Personal_3.JPG"]'::jsonb
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.footer_settings (id, heading, subtitle, copyright_text) VALUES (
    'main',
    'Stay Connected',
    'Have a project in mind or just want to say hi? Feel free to reach out across any of the platforms below.',
    '© 2026 CK Yong. All rights reserved.'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.privacy_policy (id, title, last_updated, contact_email) VALUES (
    'main',
    'Privacy Policy',
    'August 2026',
    'ckyong@kitabuild.com'
) ON CONFLICT (id) DO NOTHING;
