-- Supabase Data Fix Script

-- Clear the incorrect projects
DELETE FROM public.projects;

-- Insert the correct projects based on your original data
INSERT INTO public.projects (id, title, description, role, link, features, images, order_index) VALUES
('kitabuild-community', 'KitaBuild Community', 'Community platform for AI, vibecoding, and digital creation skills.', 'Community Initiative', '#', '["A platform for sharing and exchanging ideas across AI, vibecoding, Canva, digital marketing, and content creation", "Monthly sessions blending hands-on workshops, expert sharing, and open forums or debates", "Hosted at American Corner Sabah (ACS), Sabah State Library, Tanjung Aru Branch, Kota Kinabalu", "Special thanks to ACS for supporting the community with space and venue"]', '[{"src": "/assets/KitaBuild_Community_1.jpg", "position": "center 15%", "fit": "cover"}, {"src": "/assets/KitaBuild_Community_2.jpg", "position": "center 25%", "fit": "cover"}]', 1),
('bikin-ingat', 'BIKIN INGAT', 'An AI-powered medication adherence app built for the aging population. Built with Team 404 — Tatiana Fyka Binti Azman, CK Yong, Amelia Michelle Bernard, Calista Tatiana Lo, and Aquino Pentojo Joikon — during Gamuda AI Academy Sabah, Cohort 3.', 'Capstone Project', '#', '["Scans prescriptions and medicine boxes to auto-schedule doses", "Explains medications in plain language and flags drug interactions", "Connects users to the nearest pharmacy for refills", "Built on Google Cloud Vision, Gemini, RAG, and Firebase"]', '[{"src": "/assets/Bikin_Ingat_Portfolio.jpg", "position": "center 10%", "fit": "cover"}, {"src": "/assets/Bikin_Ingat_Team_404.jpg", "position": "center 30%", "fit": "cover"}]', 2);
