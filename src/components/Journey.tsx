'use client'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import journeyData from '@/data/journey.json'

gsap.registerPlugin(ScrollTrigger)

export function Journey() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !sectionRef.current) return

    const ctx = gsap.context(() => {
      const totalCards = journeyData.length
      const rotationStep = 120 
      const yStep = 400

      gsap.set('.journey-track', { 
        transformStyle: 'preserve-3d',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0
      })

      // The barber-pole scroll rotation
      gsap.to('.journey-track', {
        rotationY: (totalCards - 1) * rotationStep,
        y: -(totalCards - 1) * yStep,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5
        }
      })

      // Parallax Galaxy Background
      gsap.to('.galaxy-bg', {
        y: '20%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5
        }
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // Component to render the continuous galaxy ribbon
  const RibbonNodes = () => {
    return (
      <>
        {Array.from({ length: 140 }).map((_, i) => {
          // Starts at +120 degrees to give a leading tail before Card 0
          const angle = 120 - i * 15
          // 120 degrees of drop = 400px of drop
          const yPos = ((120 - angle) / 120) * 400 - 400
          
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '6px',
                height: '6px',
                backgroundColor: '#d8b4fe',
                borderRadius: '50%',
                boxShadow: '0 0 15px 4px rgba(216, 180, 254, 0.5)',
                transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(350px) translateY(${yPos}px)`,
                opacity: 0.5 + Math.random() * 0.5
              }}
            />
          )
        })}
      </>
    )
  }

  // Calculate dynamic section height based on number of items to keep scroll speed smooth
  const sectionHeight = `${journeyData.length * 150}vh`

  return (
    <section id="journey" className="journey-section" ref={sectionRef} style={{ height: sectionHeight, position: 'relative' }}>
      
      {/* Sticky Camera Viewport */}
      <div 
        className="sticky-wrapper" 
        style={{ 
          position: 'sticky', 
          top: 0, 
          height: '100vh', 
          overflow: 'hidden', 
          perspective: '1200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Galaxy Background Element */}
        <div 
          className="galaxy-bg"
          style={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            right: '-10%',
            bottom: '-20%',
            zIndex: 0,
            opacity: 0.35,
            pointerEvents: 'none',
            backgroundImage: 'url(/assets/Photo/galaxy_background.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />

        {/* Title Overlay */}
        <div className="container" style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', zIndex: 2, pointerEvents: 'none', width: '100%', textAlign: 'center' }}>
          <h2>My Journey</h2>
        </div>

        {/* 3D Track & Ribbon */}
        <div className="journey-track" style={{ zIndex: 1 }}>
          <RibbonNodes />
          
          {journeyData.map((item, i) => {
            const angle = -i * 120
            const yPos = i * 400
            
            return (
              <div 
                key={i} 
                className="journey-card" 
                style={{ 
                  width: '400px', 
                  maxWidth: '85vw',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(350px) translateY(${yPos}px)`,
                  backfaceVisibility: 'hidden'
                }}
              >
                <div className="journey-year">{item.year}</div>
                <div className="journey-content">
                  <h3>{item.title}</h3>
                  <span className="journey-company">{item.company}</span>
                  <p>{item.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
