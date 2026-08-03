import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Credentials | CK Yong',
  description: 'Credentials and certifications.',
};

export default function CredentialsPage() {
  return (
    <main className="page-shell">
      <Navigation />
      
      <section className="section-padding" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>Credentials</h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.25rem' }}>
            This page is currently under development. Check back soon for updates.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
