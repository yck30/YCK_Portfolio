'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight
      const winHeight = window.innerHeight
      
      if (docHeight === winHeight) {
        setProgress(100)
      } else {
        const percent = (scrollY / (docHeight - winHeight)) * 100
        setProgress(Math.min(100, Math.max(0, percent)))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // initial call
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (pathname === '/blog') {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '3px',
        background: 'var(--color-paper)',
        zIndex: 9999,
        width: `${progress}%`,
        transition: 'width 0.1s ease-out'
      }}
    />
  )
}
