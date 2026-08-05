import React from 'react';
import { Navigation } from '@/components/Navigation';
import { BackButton } from '@/components/BackButton';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy | CK Yong',
  description: 'Privacy policy and data handling for CK Yong\'s portfolio.',
};

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <Navigation />
      
      <section className="section-padding" style={{ marginTop: '40px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <header style={{ marginBottom: '3rem' }}>
            <BackButton href="/" label="Back to Home" />
            <h1 style={{ fontSize: 'clamp(40px, 5vw, 64px)', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>
              Privacy Policy
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '1.125rem' }}>
              Last Updated: August 2026
            </p>
          </header>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', lineHeight: 1.7, fontSize: '1.05rem', color: 'var(--color-muted)' }}>
            
            <section>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-paper)' }}>1. Introduction</h2>
              <p>
                Welcome to my personal portfolio and brand hub. I value your privacy and believe in full transparency regarding how your data is handled. This policy outlines what data is collected, why it is collected, and the trusted third-party services used to process it. I do not sell your personal data to advertisers or third parties.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-paper)' }}>2. Information Collection & Usage</h2>
              
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', marginTop: '1.5rem', color: 'var(--color-paper)' }}>Contact Form (Formspree)</h3>
              <p>
                When you use the &quot;Get in touch&quot; form, you are asked to provide your <strong>Name</strong>, <strong>Email Address</strong>, and a <strong>Message</strong>. This data is securely processed by Formspree. It is used strictly for the purpose of receiving and responding to your direct inquiries.
              </p>

              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', marginTop: '1.5rem', color: 'var(--color-paper)' }}>Newsletter (Buttondown)</h3>
              <p>
                If you choose to subscribe to the blog newsletter, your <strong>Email Address</strong> will be collected and managed via Buttondown. This information is used exclusively to send you updates when new articles are published. You may opt out and unsubscribe at any time using the link provided in every email.
              </p>

              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', marginTop: '1.5rem', color: 'var(--color-paper)' }}>Website Analytics (Google Analytics 4)</h3>
              <p>
                To understand how visitors interact with the portfolio and improve the user experience, this site uses Google Analytics 4 (GA4). GA4 may use cookies to collect anonymous, aggregated data such as pages visited, device types, and generalized geographical locations. This data cannot be used to personally identify you.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-paper)' }}>3. Third-Party Services</h2>
              <p>
                This portfolio is hosted on <strong>Vercel</strong>, which may collect standard access logs (like IP addresses) for security and operational purposes. By using this site, you also consent to the data processing practices of our service providers: Formspree (contact form), Buttondown (newsletter), and Google (analytics), in accordance with their respective privacy policies.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-paper)' }}>4. Your Rights</h2>
              <p>
                You have the right to request access to, correction of, or deletion of any personal data you have directly provided to me (e.g., via the contact form or newsletter). If you wish to exercise these rights or have any questions about this Privacy Policy, please contact me directly.
              </p>
            </section>

            <section style={{ marginTop: '2rem', padding: '2rem', background: 'var(--color-glass)', borderRadius: '12px', border: '1px solid var(--color-hairline)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-paper)' }}>Contact Information</h2>
              <p style={{ margin: 0 }}>
                If you have any questions or concerns, please reach out at: <br/>
                <a href="mailto:ckyong@kitabuild.com" style={{ color: 'var(--color-paper)', textDecoration: 'underline', textUnderlineOffset: '4px' }}>ckyong@kitabuild.com</a>
              </p>
            </section>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
