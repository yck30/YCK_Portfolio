import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Navigation } from '@/components/Navigation'
import { BackButton } from '@/components/BackButton'
import { Footer } from '@/components/Footer'
import { createClient } from '@/utils/supabase/server'

export const revalidate = 0;


export default async function ProjectDetail({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  const { data: project } = await supabase.from('projects').select('*').eq('id', params.slug).single()

  if (!project) {
    notFound()
  }

  return (
    <main className="page-shell section-padding">
      <Navigation />
      
      <article className="container" style={{ maxWidth: '900px', marginTop: '80px', paddingBottom: '60px' }}>
        <BackButton href="/" label="Back to Portfolio" />
        
        <header style={{ marginTop: '32px', marginBottom: '64px' }}>
          <span style={{ 
            display: 'inline-block',
            color: 'var(--color-bg)',
            background: 'var(--color-paper)',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '16px'
          }}>
            {project.role}
          </span>
          <h1 style={{ fontSize: 'clamp(48px, 6vw, 72px)', margin: '0 0 24px 0', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            {project.title}
          </h1>
          <p style={{ fontSize: 'clamp(18px, 2vw, 24px)', color: 'var(--color-muted)', lineHeight: 1.5, margin: 0, maxWidth: '700px' }}>
            {project.description}
          </p>
        </header>

        {project.images && project.images.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '64px' }}>
            {project.images.map((img: any, idx: number) => (
              <div key={idx} style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--color-hairline)' }}>
                <Image 
                  src={img.src} 
                  alt={`${project.title} screenshot ${idx + 1}`}
                  fill
                  style={{ objectFit: 'cover', objectPosition: img.position || 'center' }}
                  priority={idx === 0}
                />
              </div>
            ))}
          </div>
        )}

        {project.features && project.features.length > 0 && (
          <div style={{ background: 'var(--color-glass)', border: '1px solid var(--color-hairline)', borderRadius: '16px', padding: '40px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '24px', fontFamily: 'var(--font-primary)' }}>Key Features & Details</h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: 0, padding: 0, listStyle: 'none' }}>
              {project.features.map((feature: string, idx: number) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '18px', color: 'var(--color-paper)', lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--color-muted)', marginTop: '2px' }}>—</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>

      <Footer />
    </main>
  )
}
