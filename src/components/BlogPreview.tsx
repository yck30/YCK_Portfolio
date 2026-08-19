import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export async function BlogPreview() {
  const supabase = createClient()
  const { data: posts } = await supabase.from('blog_posts').select('*').order('published_at', { ascending: false }).limit(2)
  const previewPosts = posts || [];

  return (
    <section id="writing" className="section-padding blog-preview-section">
      <div className="container">
        <div className="blog-preview-header">
          <h2>Writing</h2>
          <Link href="/blog" className="view-all">View all posts →</Link>
        </div>
        <div className="blog-preview-grid">
          {previewPosts.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="blog-card">
              <span className="blog-date">
                {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric', timeZone: 'UTC' })}
                {post.read_time && <span style={{ marginLeft: '8px', opacity: 0.6 }}>· {post.read_time}</span>}
              </span>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
