import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Navigation } from '@/components/Navigation'
import { BackButton } from '@/components/BackButton'
import { Footer } from '@/components/Footer'
import { createClient } from '@/utils/supabase/server'
import { parseCustomLinks, formatDisplayUrl } from '@/utils/links'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'

export const revalidate = 0;

export default async function BlogPostDetail({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  const rawSlug = params.slug || ''
  let decodedSlug = rawSlug
  try {
    decodedSlug = decodeURIComponent(rawSlug)
  } catch (e) {
    // ignore
  }
  
  // 1. Try fetching by slug with decodedSlug
  let { data: post } = await supabase.from('blog_posts').select('*').eq('slug', decodedSlug).single()
  if (!post && rawSlug !== decodedSlug) {
    const { data: postByRaw } = await supabase.from('blog_posts').select('*').eq('slug', rawSlug).single()
    post = postByRaw
  }
  // 2. Fallback to id match
  if (!post) {
    const { data: postById } = await supabase.from('blog_posts').select('*').eq('id', decodedSlug).single()
    post = postById
  }
  // 3. Fallback to case-insensitive slug or title
  if (!post) {
    const { data: postByIlike } = await supabase.from('blog_posts').select('*').ilike('slug', decodedSlug).single()
    post = postByIlike
  }
  if (!post) {
    const { data: postByTitle } = await supabase.from('blog_posts').select('*').ilike('title', decodedSlug).single()
    post = postByTitle
  }

  if (!post) {
    notFound()
  }

  const formattedDate = post.published_at 
    ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
    : ''

  const links = parseCustomLinks(post.link);

  return (
    <main className="page-shell section-padding">
      <Navigation />
      
      <article className="container" style={{ maxWidth: '820px', marginTop: '80px', paddingBottom: '60px' }}>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

            {/* Quick Header Resource Links */}
            {links.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '4px' }}>
                {links.map((linkItem, idx) => {
                  const fullUrl = linkItem.url.startsWith('http') ? linkItem.url : `https://${linkItem.url}`;
                  const label = linkItem.label || formatDisplayUrl(linkItem.url);

                  return (
                    <a
                      key={idx}
                      href={fullUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid var(--color-hairline)',
                        color: 'var(--color-paper)',
                        fontSize: '13px',
                        fontWeight: 500,
                        textDecoration: 'none',
                        transition: 'all 0.2s ease'
                      }}
                      title={label}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                      </svg>
                      <span>{label}</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                      </svg>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
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
          <div style={{ marginBottom: '48px' }}>
            <MarkdownRenderer content={post.content} />
          </div>
        )}

        {/* Dedicated Related Resources & External Links Section */}
        {links.length > 0 && (
          <div 
            style={{ 
              marginTop: '48px',
              padding: '28px',
              background: 'var(--color-glass)',
              border: '1px solid var(--color-hairline)',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '8px', 
                  background: 'rgba(255, 255, 255, 0.08)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--color-paper)'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                </svg>
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-primary)' }}>
                Related Links & Resources ({links.length})
              </h3>
            </div>

            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: links.length > 1 ? 'repeat(auto-fit, minmax(280px, 1fr))' : '1fr', 
                gap: '12px' 
              }}
            >
              {links.map((linkItem, idx) => {
                const fullUrl = linkItem.url.startsWith('http') ? linkItem.url : `https://${linkItem.url}`;
                const titleLabel = linkItem.label || 'External Resource';
                const displayHost = formatDisplayUrl(linkItem.url);

                return (
                  <a
                    key={idx}
                    href={fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--color-hairline)',
                      textDecoration: 'none',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      gap: '12px'
                    }}
                    className="blog-resource-card"
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
                      <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-paper)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {titleLabel}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--color-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {displayHost}
                      </span>
                    </div>
                    <div 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.06)',
                        color: 'var(--color-paper)',
                        flexShrink: 0
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                      </svg>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </article>

      <Footer />
    </main>
  )
}
