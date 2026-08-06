import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { BackButton } from '@/components/BackButton'
import { Footer } from '@/components/Footer'
import { Newsletter } from '@/components/Newsletter'
import { createClient } from '@/utils/supabase/server'
import { BlogListClient } from './BlogListClient'

export const revalidate = 0;

export default async function BlogIndex() {
  const supabase = createClient()
  const { data: posts } = await supabase.from('blog_posts').select('*').order('published_at', { ascending: false })
  const safePosts = posts || [];

  return (
    <main className="page-shell section-padding">
      <Navigation />
      <div className="container" style={{ maxWidth: '800px', marginTop: '80px' }}>
        <BackButton href="/" label="Back to Home" />
        <h1 style={{ fontFamily: 'Instrument Serif', fontSize: '64px', marginBottom: '24px' }}>Writing</h1>
        <p style={{ color: 'var(--muted)', fontSize: '18px', marginBottom: '64px' }}>
          Thoughts on design, engineering, entrepreneurship, and building products.
        </p>

        <BlogListClient posts={safePosts} />
        
        <div className="page-separator"></div>
        <Newsletter />
      </div>
      <Footer />
    </main>
  )
}
