'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Image from 'next/image'
import { Navigation } from './Navigation'
import { Contact } from './Contact'

export interface HeroData {
  eyebrow?: string;
  line1?: string;
  line2?: string;
  line3?: string;
  subtitle?: string;
  location_badge?: string;
  scroll_badge?: string;
  copyright_text?: string;
  images?: Array<string | { src: string; position?: string }>;
}

const defaultImages = [
  { src: '/assets/Personal_1.JPG', position: 'center 15%' },
  { src: '/assets/Personal_2.JPG', position: 'center 20%' },
  { src: '/assets/Personal_3.JPG', position: 'center 20%' }
]

export function HeroClient({ data }: { data: HeroData }) {
  const root = useRef<HTMLElement>(null)
  const [currentStep, setCurrentStep] = useState(0)

  const rawImages = data.images && data.images.length > 0 ? data.images : defaultImages
  const heroImages = rawImages.map((img) => {
    if (typeof img === 'string') {
      return { src: img, position: 'center 20%' }
    }
    return { src: img.src, position: img.position || 'center 20%' }
  })

  const [order, setOrder] = useState<number[]>([])

  useEffect(() => {
    const indices = Array.from({ length: heroImages.length }, (_, i) => i)
    setOrder(indices.sort(() => Math.random() - 0.5))
  }, [heroImages.length])

  useEffect(() => {
    if (heroImages.length <= 1) return
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % heroImages.length)
    }, 4500)
    return () => clearInterval(interval)
  }, [heroImages.length])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !root.current) return

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })

      timeline
        .from('[data-motion="frame"]', { opacity: 0, scale: 0.985, duration: 1.15 })
        .from('[data-motion="nav"]', { opacity: 0, y: -22, duration: 0.75 }, 0.2)
        .from('[data-motion="visual"]', { opacity: 0, scale: 0.95, x: 30, duration: 1.4 }, 0.3)
        .from('[data-motion="eyebrow"]', { opacity: 0, x: -24, duration: 0.7 }, 0.5)
        .from('[data-motion="line"]', { yPercent: 110, rotate: 2, stagger: 0.1, duration: 0.9 }, 0.56)
        .from('[data-motion="email"]', { opacity: 0, y: 18, duration: 0.65 }, 0.95)
        .from('[data-motion="contact"]', { opacity: 0, y: 34, duration: 0.85 }, 0.72)
        .from('[data-motion="field"]', { opacity: 0, y: 16, stagger: 0.08, duration: 0.62 }, 0.96)
        .from('[data-motion="footer"]', { opacity: 0, y: 12, duration: 0.6 }, 1.1)
    }, root)

    return () => ctx.revert()
  }, [])

  const activeIndex = order.length > 0 ? order[currentStep % order.length] : 0

  return (
    <section className="hero-frame" ref={root} data-motion="frame" aria-label="CK Yong Portfolio Introduction">
      <Navigation />

      <div className="hero-grid">
        <div className="hero-content">
          <section className="intro" id="studio" aria-labelledby="hero-title">
            <p className="eyebrow" data-motion="eyebrow">
              <span /> {data.eyebrow || 'Web Developer & AI Builder'}
            </p>
            <h1 id="hero-title">
              <span className="line-clip"><span data-motion="line">{data.line1 || 'Strategy,'}</span></span>
              <span className="line-clip"><span data-motion="line">{data.line2 || 'design &'}</span></span>
              <span className="line-clip"><span data-motion="line"><em>{data.line3 || 'motion.'}</em></span></span>
            </h1>
            <div className="intro-meta" data-motion="email">
              <p>{data.subtitle || 'Bridging the gap between creative vision and technical execution.'}</p>
              <a href="#contact">Get in touch</a>
            </div>
          </section>
          
          <Contact />
        </div>

        <div className="hero-visual" data-motion="visual">
          {heroImages.map((img, index) => (
            <Image
              key={img.src + index}
              src={img.src}
              alt={`CK Yong Portrait ${index + 1}`}
              className="hero-video"
              fill
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 480px"
              style={{ 
                objectPosition: img.position,
                opacity: index === activeIndex ? 1 : 0,
                transition: 'opacity 1.2s ease-in-out',
                objectFit: 'cover'
              }}
            />
          ))}
        </div>
      </div>

      <footer className="hero-footer" data-motion="footer">
        <span>{data.location_badge || 'Based in Malaysia'}</span>
        <span>{data.scroll_badge || 'Scroll to explore'}</span>
        <span>{data.copyright_text || '© 2026 CK Yong'}</span>
      </footer>
    </section>
  )
}
