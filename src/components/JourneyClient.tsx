'use client'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function JourneyClient({ items }: { items: any[] }) {
  const sectionRef = useRef<HTMLElement>(null)

  const totalCards = items.length
  const rotationStep = totalCards > 0 ? 360 / totalCards : 360
  const radius = Math.max(850, (700 * Math.max(totalCards, 1)) / (2 * Math.PI))

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !sectionRef.current || totalCards === 0) return

    const ctx = gsap.context(() => {
      gsap.set('.journey-track', { 
        transformStyle: 'preserve-3d',
        width: '100%',
        height: '100%',
        position: 'relative',
        z: -radius
      })

      gsap.to('.journey-track', {
        rotationY: 360,
        duration: totalCards * 6,
        ease: 'none',
        repeat: -1,
        onUpdate: function(this: any) {
          const currentRotation = this.progress() * 360;
          const cards = gsap.utils.toArray('.journey-card');
          
          cards.forEach((card: any, index: number) => {
            const targetRotation = index * rotationStep;
            
            let diff = Math.abs((currentRotation - targetRotation) % 360);
            if (diff > 180) diff = 360 - diff;
            
            let opacity = 0;
            if (diff < rotationStep) {
              opacity = 1 - (diff / rotationStep);
            }
            
            gsap.set(card, { opacity });
          });
        }
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [radius, rotationStep, totalCards])

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

  return (
    <section id="journey" className="journey-section" ref={sectionRef} style={{ height: '100vh', position: 'relative' }}>
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

        <div className="container" style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', zIndex: 2, pointerEvents: 'none', width: '100%', textAlign: 'center' }}>
          <h2>My Journey</h2>
        </div>

        <div className="journey-track" style={{ zIndex: 1 }}>
          <RibbonNodes />
          
          {items.map((item, i) => {
            const angle = -i * rotationStep
            
            return (
              <div 
                key={item.id || i} 
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
                  {item.link && (
                    <a 
                      href={item.link} 
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
