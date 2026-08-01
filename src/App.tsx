import { FormEvent, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const Arrow = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 19 19 5M9 5h10v10" />
  </svg>
)

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const submitButton = useRef<HTMLButtonElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !root.current) return

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })

      timeline
        .from('[data-motion="frame"]', { opacity: 0, scale: 0.985, duration: 1.15 })
        .from('[data-motion="video"]', { opacity: 0, scale: 1.08, duration: 1.8 }, 0)
        .from('[data-motion="nav"]', { opacity: 0, y: -22, duration: 0.75 }, 0.35)
        .from('[data-motion="eyebrow"]', { opacity: 0, x: -24, duration: 0.7 }, 0.5)
        .from('[data-motion="line"]', { yPercent: 110, rotate: 2, stagger: 0.1, duration: 0.9 }, 0.56)
        .from('[data-motion="email"]', { opacity: 0, y: 18, duration: 0.65 }, 0.95)
        .from('[data-motion="contact"]', { opacity: 0, x: 34, duration: 0.85 }, 0.72)
        .from('[data-motion="field"]', { opacity: 0, y: 16, stagger: 0.08, duration: 0.62 }, 0.96)
        .from('[data-motion="footer"]', { opacity: 0, y: 12, duration: 0.6 }, 1.1)
    }, root)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const button = submitButton.current
    if (!button || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const xTo = gsap.quickTo(button, 'x', { duration: 0.35, ease: 'power3.out' })
    const yTo = gsap.quickTo(button, 'y', { duration: 0.35, ease: 'power3.out' })
    const move = (event: PointerEvent) => {
      const rect = button.getBoundingClientRect()
      xTo((event.clientX - rect.left - rect.width / 2) * 0.16)
      yTo((event.clientY - rect.top - rect.height / 2) * 0.16)
    }
    const leave = () => {
      xTo(0)
      yTo(0)
    }

    button.addEventListener('pointermove', move)
    button.addEventListener('pointerleave', leave)
    return () => {
      button.removeEventListener('pointermove', move)
      button.removeEventListener('pointerleave', leave)
    }
  }, [])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('Request received — we’ll be in touch shortly.')
    gsap.fromTo('[data-status]', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45 })
  }

  return (
    <main className="page-shell" ref={root}>
      <section className="hero-frame" data-motion="frame" aria-label="Aurel creative studio introduction">
        <video
          className="hero-video"
          data-motion="video"
          autoPlay
          muted
          loop
          playsInline
          poster="/assets/aurel-water-poster.png"
          aria-label="A glowing Aurel symbol reflected in dark water"
        >
          <source src="/assets/aurel-water.mp4" type="video/mp4" />
        </video>
        <div className="video-scrim" aria-hidden="true" />

        <header className="topbar" data-motion="nav">
          <a className="brand" href="#signal" aria-label="Aurel home">
            <span className="brand-mark">A</span>
            <span>Aurel®</span>
          </a>

          <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label="Main navigation">
            <a href="#studio" onClick={() => setMenuOpen(false)}>Studio</a>
            <a href="#signal" onClick={() => setMenuOpen(false)}>Signal</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </nav>

          <button
            className="menu-button"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>

          <a className="top-cta" href="#contact">Start a project <Arrow /></a>
        </header>

        <div className="hero-grid">
          <section className="intro" id="studio" aria-labelledby="hero-title">
            <p className="eyebrow" data-motion="eyebrow"><span /> Independent creative studio</p>
            <h1 id="hero-title">
              <span className="line-clip"><span data-motion="line">We shape</span></span>
              <span className="line-clip"><span data-motion="line">identities that</span></span>
              <span className="line-clip"><span data-motion="line"><em>move.</em></span></span>
            </h1>
            <div className="intro-meta" data-motion="email">
              <p>Strategy, design and motion<br />for brands entering their next era.</p>
              <a href="mailto:hello@aurel.studio">hello@aurel.studio</a>
            </div>
          </section>

          <div className="signal" id="signal" aria-label="Aurel visual signal">
            <span>Signal 001</span>
            <span className="signal-line" />
            <span>Water / Light</span>
          </div>

          <section className="contact" id="contact" data-motion="contact" aria-labelledby="contact-title">
            <div className="contact-heading">
              <p><span /> New business</p>
              <span>01—03</span>
            </div>
            <h2 id="contact-title">Let’s make<br />something <em>felt.</em></h2>
            <form onSubmit={submit}>
              <label data-motion="field">
                <span>Your name</span>
                <input name="name" type="text" autoComplete="name" placeholder="Name" required />
              </label>
              <label data-motion="field">
                <span>Your email</span>
                <input name="email" type="email" autoComplete="email" placeholder="Email" required />
              </label>
              <div className="form-action" data-motion="field">
                <p>By sending, you agree to be contacted about your project.</p>
                <button ref={submitButton} type="submit" aria-label="Send project request"><Arrow /></button>
              </div>
              <p className="form-status" data-status aria-live="polite">{status}</p>
            </form>
          </section>
        </div>

        <footer className="hero-footer" data-motion="footer">
          <span>Selected worldwide</span>
          <span>Scroll to feel the signal</span>
          <span>© 2026 Aurel</span>
        </footer>
      </section>
    </main>
  )
}
