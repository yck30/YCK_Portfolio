import { Navigation } from '@/components/Navigation'

export default function BlogIndex() {
  return (
    <main className="page-shell section-padding">
      <Navigation />
      <div className="container" style={{ maxWidth: '800px', marginTop: '80px' }}>
        <h1 style={{ fontFamily: 'Instrument Serif', fontSize: '64px', marginBottom: '24px' }}>Writing</h1>
        <p style={{ color: 'var(--muted)', fontSize: '18px', marginBottom: '48px' }}>
          Thoughts on design, engineering, and building products.
        </p>

        <div className="blog-list" style={{ display: 'grid', gap: '40px' }}>
          <a href="/blog/first-post" style={{ display: 'block', borderBottom: '1px solid var(--hairline)', paddingBottom: '40px' }}>
            <span style={{ display: 'block', color: 'var(--muted)', marginBottom: '8px' }}>Aug 02, 2026</span>
            <h2 style={{ fontSize: '32px', marginBottom: '12px' }}>Merging Strategy & Motion</h2>
            <p style={{ color: 'var(--muted)', fontSize: '16px', margin: 0 }}>
              Exploring how tactile motion design influences user conversion paths.
            </p>
          </a>
        </div>
      </div>
    </main>
  )
}
