'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'

export function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only run if prefers-reduced-motion is false
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches || !footerRef.current || !glowRef.current) return

    const xTo = gsap.quickTo(glowRef.current, "left", { duration: 0.6, ease: "power3" })
    const yTo = gsap.quickTo(glowRef.current, "top", { duration: 0.6, ease: "power3" })

    const handleMouseMove = (e: MouseEvent) => {
      const rect = footerRef.current!.getBoundingClientRect()
      // Center the glow exactly on the cursor
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
        borderTop: '1px solid rgba(255, 255, 255, 0.05)', 
        backgroundColor: 'rgba(0,0,0,0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* GSAP Spotlight Element */}
      <div ref={glowRef} className="footer-spotlight" aria-hidden="true" />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '2rem' }}>
          <div>
            <h2 style={{ marginBottom: '0.5rem' }}>Stay Connected</h2>
            <p style={{ color: 'var(--muted)', maxWidth: '500px', margin: '0 auto' }}>
              Have a project in mind or just want to say hi? Feel free to reach out across any of the platforms below.
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
            <a href="mailto:ckyong@kitabuild.com" target="_blank" rel="noopener noreferrer" className="footer-link">Email</a>
            <a href="https://wa.me/60164221791" target="_blank" rel="noopener noreferrer" className="footer-link">WhatsApp</a>
            <a href="https://github.com/yck30" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
            <a href="https://www.linkedin.com/in/chunkityong" target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
            <a href="https://www.tiktok.com/@yck96" target="_blank" rel="noopener noreferrer" className="footer-link">TikTok</a>
            <a href="https://www.instagram.com/ck_yong96/" target="_blank" rel="noopener noreferrer" className="footer-link">Instagram</a>
            <a href="https://www.threads.com/@ck_yong96" target="_blank" rel="noopener noreferrer" className="footer-link">Threads</a>
            <a href="https://web.facebook.com/YCK96/" target="_blank" rel="noopener noreferrer" className="footer-link">Facebook</a>
          </div>

          <div style={{ marginTop: '3rem', color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem' }}>
            &copy; {new Date().getFullYear()} CK Yong. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
