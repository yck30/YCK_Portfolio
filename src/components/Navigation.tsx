'use client'

import { useState } from 'react'

const Arrow = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" width="24" height="24">
    <path d="M5 19 19 5M9 5h10v10" stroke="currentColor" fill="none" strokeWidth="2" />
  </svg>
)

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="topbar" data-motion="nav">
      <a className="brand" href="#signal" aria-label="CK Yong home">
        <span className="brand-mark">C</span>
        <span>CK YONG</span>
      </a>

      <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label="Main navigation">
        <a href="#studio" onClick={() => setMenuOpen(false)}>Studio</a>
        <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        <a href="#projects" onClick={() => setMenuOpen(false)}>Projects</a>
        <a href="/blog" onClick={() => setMenuOpen(false)}>Blog</a>
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
  )
}
