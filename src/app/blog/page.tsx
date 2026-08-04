import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { BackButton } from '@/components/BackButton'
import { Footer } from '@/components/Footer'
import { Newsletter } from '@/components/Newsletter'
import posts from '@/data/blog.json'

export default function BlogIndex() {
  return (
    <main className="page-shell section-padding">
      <Navigation />
      <div className="container" style={{ maxWidth: '800px', marginTop: '80px' }}>
        <BackButton href="/" label="Back to Home" />
        <h1 style={{ fontFamily: 'Instrument Serif', fontSize: '64px', marginBottom: '24px' }}>Writing</h1>
        <p style={{ color: 'var(--muted)', fontSize: '18px', marginBottom: '64px' }}>
          Thoughts on design, engineering, entrepreneurship, and building products.
        </p>

        <div className="editorial-list">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="editorial-item">
              <span className="editorial-date">{post.date}</span>
              <div className="editorial-content">
                <h2 className="editorial-title">
                  {post.title}
                  <span className="editorial-arrow">→</span>
                </h2>
                <p className="editorial-excerpt">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="page-separator"></div>
        <Newsletter />
      </div>
      <Footer />
    </main>
  )
}
