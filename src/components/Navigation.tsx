'use client'

import { useState } from 'react'
import Link from 'next/link'

const Arrow = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" width="24" height="24">
    <path d="M5 19 19 5M9 5h10v10" stroke="currentColor" fill="none" strokeWidth="2" />
  </svg>
)

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="topbar" data-motion="nav">
      <Link className="brand" href="/" aria-label="CK Yong home" onClick={() => setMenuOpen(false)}>
        <span className="brand-mark">CK</span>
        <span>CK YONG</span>
      </Link>

      <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label="Main navigation">
        <Link href="/#about" onClick={() => setMenuOpen(false)}>About</Link>
        <Link href="/#journey" onClick={() => setMenuOpen(false)}>Journey</Link>
        <Link href="/#projects" onClick={() => setMenuOpen(false)}>Projects</Link>
        <Link href="/credentials" onClick={() => setMenuOpen(false)}>Credentials</Link>
        <Link href="/blog" onClick={() => setMenuOpen(false)}>Blog</Link>
        <Link href="/#footer" onClick={() => setMenuOpen(false)}>Contact</Link>
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

      <Link className="top-cta" href="/#contact">Start a project <Arrow /></Link>
    </header>
  )
}
