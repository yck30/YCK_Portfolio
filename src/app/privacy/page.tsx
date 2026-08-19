import React from 'react';
import { Navigation } from '@/components/Navigation';
import { BackButton } from '@/components/BackButton';
import { Footer } from '@/components/Footer';
import { createClient } from '@/utils/supabase/server';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import fallbackPrivacy from '@/data/privacy.json';

export const metadata = {
  title: 'Privacy Policy | CK Yong',
  description: 'Privacy policy and data handling for CK Yong\'s portfolio.',
};

export const revalidate = 0;

export default async function PrivacyPage() {
  const supabase = createClient();
  const { data: dbPrivacy } = await supabase.from('privacy_policy').select('*').single();

  const title = dbPrivacy?.title || fallbackPrivacy.title;
  const lastUpdated = dbPrivacy?.last_updated || fallbackPrivacy.last_updated;
  const content = dbPrivacy?.content || fallbackPrivacy.content;
  const contactEmail = dbPrivacy?.contact_email || fallbackPrivacy.contact_email;

  return (
    <main className="page-shell">
      <Navigation />
      
      <section className="section-padding" style={{ marginTop: '40px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <header style={{ marginBottom: '3rem' }}>
            <BackButton href="/" label="Back to Home" />
            <h1 style={{ fontSize: 'clamp(40px, 5vw, 64px)', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>
              {title}
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '1.125rem' }}>
              Last Updated: {lastUpdated}
            </p>
          </header>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '1.05rem', color: 'var(--color-muted)' }}>
            
            <div>
              <MarkdownRenderer content={content} />
            </div>

            <section style={{ marginTop: '2rem', padding: '2rem', background: 'var(--color-glass)', borderRadius: '12px', border: '1px solid var(--color-hairline)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-paper)' }}>Contact Information</h2>
              <p style={{ margin: 0 }}>
                If you have any questions or concerns, please reach out at: <br/>
                <a href={`mailto:${contactEmail}`} style={{ color: 'var(--color-paper)', textDecoration: 'underline', textUnderlineOffset: '4px' }}>{contactEmail}</a>
              </p>
            </section>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
