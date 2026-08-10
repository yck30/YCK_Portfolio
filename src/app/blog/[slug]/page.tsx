import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Navigation } from '@/components/Navigation'
import { BackButton } from '@/components/BackButton'
import { Footer } from '@/components/Footer'
import { createClient } from '@/utils/supabase/server'

export const revalidate = 0;

export default async function BlogPostDetail({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  
  // Try fetching by slug first, fallback to id match
  let { data: post } = await supabase.from('blog_posts').select('*').eq('slug', params.slug).single()
  if (!post) {
    const { data: postById } = await supabase.from('blog_posts').select('*').eq('id', params.slug).single()
    post = postById
  }

  if (!post) {
    notFound()
  }

  const formattedDate = post.published_at 
    ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : ''

  return (
    <main className="page-shell section-padding">
      <Navigation />
      
      <article className="container" style={{ maxWidth: '800px', marginTop: '80px', paddingBottom: '60px' }}>
        <BackButton href="/blog" label="Back to Writing" />
        
        <header style={{ marginTop: '32px', marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {formattedDate && (
              <span style={{ color: 'var(--color-muted)', fontSize: '14px', fontWeight: 500 }}>
                {formattedDate}
              </span>
            )}
            {post.read_time && (
              <span style={{ color: 'var(--color-muted)', fontSize: '14px', opacity: 0.8 }}>
                · {post.read_time}
              </span>
            )}
          </div>

          <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', margin: '0 0 20px 0', lineHeight: 1.15, letterSpacing: '-0.02em', fontFamily: 'Instrument Serif' }}>
            {post.title}
          </h1>

          {post.excerpt && (
            <p style={{ fontSize: 'clamp(18px, 2vw, 22px)', color: 'var(--color-muted)', lineHeight: 1.5, margin: '0 0 24px 0' }}>
              {post.excerpt}
            </p>
          )}

          {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {post.tags.map((tag: string, idx: number) => (
                <span 
                  key={idx}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '999px',
                    border: '1px solid var(--color-hairline)',
                    background: 'var(--color-glass)',
                    color: 'var(--color-paper)',
                    fontSize: '13px'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Display Uploaded Photos / Images exclusively on the details page */}
        {post.images && Array.isArray(post.images) && post.images.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '48px' }}>
            {post.images.map((img: any, idx: number) => {
              const fitMode = typeof img === 'object' && img.fit ? img.fit : 'contain';
              const src = typeof img === 'string' ? img : img.src;
              return (
                <div 
                  key={idx} 
                  style={{ 
                    position: 'relative', 
                    width: '100%', 
                    maxHeight: '600px',
                    aspectRatio: fitMode === 'cover' ? '16/9' : '16/10', 
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    border: '1px solid var(--color-hairline)',
                    background: 'var(--color-glass)',
                    padding: fitMode === 'contain' ? '12px' : '0'
                  }}
                >
                  <Image 
                    src={src} 
                    alt={`${post.title} photo ${idx + 1}`}
                    fill
                    style={{ 
                      objectFit: fitMode as any, 
                      objectPosition: img.position || 'center 15%' 
                    }}
                    priority={idx === 0}
                  />
                </div>
              )
            })}
          </div>
        )}

        {/* Blog Post Main Content */}
        {post.content && (
          <div 
            style={{ 
              fontSize: '18px', 
              color: 'var(--color-paper)', 
              lineHeight: 1.7, 
              whiteSpace: 'pre-wrap',
              fontFamily: 'var(--font-primary)' 
            }}
          >
            {post.content}
          </div>
        )}
      </article>

      <Footer />
    </main>
  )
}
