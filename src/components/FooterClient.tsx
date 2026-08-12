'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'

interface FooterLinkItem {
  id?: string;
  label: string;
  url: string;
  type?: string;
}

export interface FooterSettings {
  heading?: string;
  subtitle?: string;
  copyright_text?: string;
}

export function FooterClient({ 
  links, 
  settings 
}: { 
  links: FooterLinkItem[];
  settings?: FooterSettings;
}) {
  const footerRef = useRef<HTMLElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches || !footerRef.current || !glowRef.current) return

    const xTo = gsap.quickTo(glowRef.current, "left", { duration: 0.6, ease: "power3" })
    const yTo = gsap.quickTo(glowRef.current, "top", { duration: 0.6, ease: "power3" })

    const handleMouseMove = (e: MouseEvent) => {
      const rect = footerRef.current!.getBoundingClientRect()
      xTo(e.clientX - rect.left)
      yTo(e.clientY - rect.top)
    }

    const handleMouseEnter = () => {
      gsap.to(glowRef.current, { opacity: 1, duration: 0.4, ease: "power2.out" })
    }

    const handleMouseLeave = () => {
      gsap.to(glowRef.current, { opacity: 0, duration: 0.4, ease: "power2.in" })
    }

    const footer = footerRef.current
    footer.addEventListener('mousemove', handleMouseMove)
    footer.addEventListener('mouseenter', handleMouseEnter)
    footer.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      footer.removeEventListener('mousemove', handleMouseMove)
      footer.removeEventListener('mouseenter', handleMouseEnter)
      footer.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <footer 
      id="footer" 
      ref={footerRef}
      className="section-padding" 
      style={{ 
        borderTop: '1px solid var(--color-hairline)', 
        backgroundColor: 'var(--color-bg)',
        position: 'relative',
        zIndex: 10,
        overflow: 'hidden'
      }}
    >
      <div ref={glowRef} className="footer-spotlight" aria-hidden="true" />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '2rem' }}>
          <div>
            <h2 style={{ marginBottom: '0.5rem' }}>{settings?.heading || 'Stay Connected'}</h2>
            <p style={{ color: 'var(--muted)', maxWidth: '500px', margin: '0 auto' }}>
              {settings?.subtitle || 'Have a project in mind or just want to say hi? Feel free to reach out across any of the platforms below.'}
            </p>
          </div>
          
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '1.5rem 2.5rem', 
            justifyContent: 'center',
            maxWidth: '800px',
            marginTop: '1rem'
          }}>
            {links.map((link, i) => (
              <a 
                key={link.id || i} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-link"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div style={{ marginTop: '3rem', color: 'var(--color-muted)', fontSize: '0.875rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span>{settings?.copyright_text || `© ${new Date().getFullYear()} CK Yong. All rights reserved.`}</span>
            <span style={{ opacity: 0.5 }}>|</span>
            <a href="/privacy" className="footer-link" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: '4px' }}>Privacy Policy</a>
            <span style={{ opacity: 0.5 }}>|</span>
            <a href="/admin/login" className="footer-link" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: '4px' }}>Admin Panel</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
