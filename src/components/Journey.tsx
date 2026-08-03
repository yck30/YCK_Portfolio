'use client'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import journeyData from '@/data/journey.json'

gsap.registerPlugin(ScrollTrigger)

export function Journey() {
  const sectionRef = useRef<HTMLElement>(null)

  const totalCards = journeyData.length
  const rotationStep = 360 / totalCards
  const radius = Math.max(850, (700 * totalCards) / (2 * Math.PI))

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.set('.journey-track', { 
        transformStyle: 'preserve-3d',
        width: '100%',
        height: '100%',
        position: 'relative',
        z: -radius // Push the track back so the front card is perfectly at Z=0 (actual size)
      })

      // Automatic continuous rotation
      gsap.to('.journey-track', {
        rotationY: 360,
        duration: totalCards * 6, // 6 seconds per card for a balanced reading pace
        ease: 'none',
        repeat: -1,
        onUpdate: function(this: any) {
          const currentRotation = this.progress() * 360;
          const cards = gsap.utils.toArray('.journey-card');
          
          cards.forEach((card: any, index: number) => {
            const targetRotation = index * rotationStep;
            
            // Calculate shortest distance in degrees
            let diff = Math.abs((currentRotation - targetRotation) % 360);
            if (diff > 180) diff = 360 - diff;
            
            // Only fade in when it is the active or adjacent card
            let opacity = 0;
            if (diff < rotationStep) {
              // Fades smoothly from 1 to 0 as it rotates away
              opacity = 1 - (diff / rotationStep);
            }
            
            gsap.set(card, { opacity });
          });
        }
      })

      // Removing parallax from galaxy-bg to keep the SVG background fully framed without clipping
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // Component to render the continuous galaxy ring
  const RibbonNodes = () => {
    return (
      <>
        {Array.from({ length: 140 }).map((_, i) => {
          const angle = i * (360 / 140)
          
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
                transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px)`,
                opacity: 0.15 + Math.random() * 0.3
              }}
            />
          )
        })}
      </>
    )
  }

  // Normal section height since it's no longer scroll-based
  const sectionHeight = '100vh'

  return (
    <section id="journey" className="journey-section" ref={sectionRef} style={{ height: sectionHeight, position: 'relative' }}>
      
      {/* Camera Viewport */}
      <div 
        className="viewport-wrapper" 
        style={{ 
          position: 'relative', 
          height: '100%', 
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
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: 0,
            opacity: 0.15,
            pointerEvents: 'none',
            backgroundImage: 'url(/assets/My_Journey_Background.svg)',
            backgroundSize: 'contain',
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
            const angle = -i * rotationStep
            
            return (
              <div 
                key={i} 
                className="journey-card" 
                style={{ 
                  width: '650px', 
                  maxWidth: '90vw',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: 'hidden',
                  opacity: i === 0 ? 1 : 0
                }}
              >
                <div className="journey-year">{item.year}</div>
                <div className="journey-content">
                  <h3>{item.title}</h3>
                  <span className="journey-company">{item.company}</span>
                  <p>{item.description}</p>
                  {(item as any).link && (
                    <a 
                      href={(item as any).link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ 
                        color: '#d8b4fe', 
                        textDecoration: 'none', 
                        fontWeight: '600', 
                        marginTop: '12px', 
                        display: 'inline-block',
                        borderBottom: '1px solid rgba(216, 180, 254, 0.4)',
                        paddingBottom: '2px'
                      }}
                    >
                      View Live Website ↗
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
