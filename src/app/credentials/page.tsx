import React from 'react';
import { Navigation } from '@/components/Navigation';
import { BackButton } from '@/components/BackButton';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Credentials | CK Yong',
  description: 'Credentials and certifications.',
};

export default function CredentialsPage() {
  const credentialsData = [
    {
      category: "Academic & Research",
      items: [
        { title: "\"A Critical Review of Sustainability Outcomes and Measurement Challenges in ESG Frameworks\"", issuer: "Scopus-indexed, MSW Management Journal", year: "2026" },
        { title: "Master of Business Administration (In Progress)", issuer: "INTI International University", year: "2025" },
        { title: "Bachelor of Economics (Hons), Planning and Development Economics", issuer: "Universiti Malaysia Sabah", year: "2019" },
        { title: "Commissioned 2nd Lieutenant", issuer: "Royal Malaysian Air Force (Volunteer Reserve)", year: "2019" }
      ]
    },
    {
      category: "AI & Software Development",
      items: [
        { title: "Full-Stack AI Developer Certificate", issuer: "Gamuda AI Academy (Sabah), Cohort 3", year: "2026" },
        { title: "2nd Runner-Up, Capstone Project", issuer: "Gamuda AI Academy (Sabah), Cohort 3", year: "2026" },
        { title: "Certified User: Programmer (Unity)", issuer: "Unity Technologies", year: "2025" },
        { title: "Android Certified Application Developer", issuer: "ATC", year: "2023" }
      ]
    },
    {
      category: "Project Management",
      items: [
        { title: "PMI Certified Associate in Project Management (CAPM)", year: "2026" },
        { title: "PMI Project Management Ready®", year: "2025" }
      ]
    },
    {
      category: "Digital Content & Design (Adobe Certified Professional)",
      items: [
        { title: "Document Creation & Management using Adobe Acrobat Pro", year: "2025" },
        { title: "Print & Digital Media Publication using Adobe InDesign", year: "2025" },
        { title: "Content Creation & Marketing using Adobe Express", year: "2025" },
        { title: "Visual Design using Adobe Photoshop", year: "2024" },
        { title: "Multiplatform Animation using Adobe Animate", year: "2024" },
        { title: "Visual Effects & Motion Graphics using Adobe After Effects", year: "2024" },
        { title: "Graphic Design & Illustration using Adobe Illustrator", year: "2023" },
        { title: "Digital Video using Adobe Premiere Pro", year: "2023" }
      ]
    },
    {
      category: "Business & Office Productivity",
      items: [
        { title: "Microsoft Office Specialist – Word Expert", year: "2024" },
        { title: "Microsoft Office Specialist – Excel Expert", year: "2024" },
        { title: "Access UBS Certificate – Accounting", year: "2024" },
        { title: "Access UBS Certificate – Inventory", year: "2024" },
        { title: "Microsoft Office Specialist – Associate (Word, Excel, PowerPoint)", year: "2023" }
      ]
    },
    {
      category: "Data Strategy & Automation",
      items: [
        { title: "Microsoft Certified: Power Platform Fundamentals", year: "2023" },
        { title: "Microsoft Certified: Power BI Data Analyst Associate", year: "2023" }
      ]
    },
    {
      category: "Digital Marketing",
      items: [
        { title: "Digital Marketing Certificate", issuer: "Google Digital Garage", year: "2023" },
        { title: "Meta Certified Digital Marketing Associate", year: "2023" }
      ]
    }
  ];

  return (
    <main className="page-shell" style={{ position: 'relative', zIndex: 0 }}>
      <Navigation />
      
      {/* Background Composition */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: -1, pointerEvents: 'none' }}>
        {/* Commissioned 2nd Lieutenant */}
        <div style={{ position: 'absolute', top: '5%', left: '-5%', width: '45vw', minWidth: '350px', opacity: 0.18, transform: 'rotate(-4deg)', filter: 'grayscale(35%)' }}>
          <img src="/assets/Commissioned_2nd_Lieutenant.jpeg" alt="" style={{ width: '100%', height: 'auto', borderRadius: '32px', objectFit: 'cover' }} />
        </div>

        {/* Gamuda Trophy */}
        <div style={{ position: 'absolute', bottom: '-2%', right: '-8%', width: '55vw', minWidth: '450px', opacity: 0.22, transform: 'rotate(6deg)', filter: 'grayscale(25%) blur(1px)' }}>
          <img src="/assets/Gamuda_AI_Academy-2nd_Runner_up_Trophy.jpg" alt="" style={{ width: '100%', height: 'auto', borderRadius: '40px', objectFit: 'cover' }} />
        </div>

        {/* Scattered Wandering Digital Badges */}
        {[
          "/assets/Digital_Badge (1).png", "/assets/Digital_Badge (2).png", "/assets/Digital_Badge (3).png", "/assets/Digital_Badge (4).png", 
          "/assets/Digital_Badge (5).png", "/assets/Digital_Badge (6).png", "/assets/Digital_Badge (7).png", "/assets/Digital_Badge (8).png",
          "/assets/Digital_Badge (9).png", "/assets/Digital_Badge (10).png", "/assets/Digital_Badge (11).png", "/assets/Digital_Badge (12).png",
          "/assets/Digital_Badge (13).png", "/assets/Digital_Badge (14).png", "/assets/Digital_Badge (15).png", "/assets/Digital_Badge (16).png",
          "/assets/Digital_Badge (17).png", "/assets/Digital_Badge (18).png", "/assets/Digital_Badge (19).PNG", "/assets/Digital_Badge (20).png",
          "/assets/Digital_Badge (21).png", "/assets/Digital_Badge (22).png", "/assets/Digital_Badge (23).png"
        ].map((src, i) => {
          // Deterministic pseudo-random generation to prevent hydration mismatches
          const pseudoRand = (seed: number) => {
            const x = Math.sin(seed * 9999) * 10000;
            return x - Math.floor(x);
          };
          
          const left = 5 + pseudoRand(i) * 90; 
          const top = 5 + pseudoRand(i + 100) * 90; 
          const size = 60 + pseudoRand(i + 200) * 70; 
          const opacity = 0.08 + pseudoRand(i + 300) * 0.12; 
          const blur = pseudoRand(i + 400) > 0.6 ? 2 : (pseudoRand(i + 400) > 0.3 ? 1 : 0); 
          const moveX = (pseudoRand(i + 500) - 0.5) * 120; 
          const moveY = (pseudoRand(i + 600) - 0.5) * 160; 
          
          const durX = 15 + pseudoRand(i + 700) * 30; // 15s to 45s
          const durY = 19 + pseudoRand(i + 800) * 35; // 19s to 54s (Prime offsets for non-repeating Lissajous curves)
          const delay = pseudoRand(i + 900) * -40;
          
          return (
            <div key={i} style={{
              position: 'absolute',
              left: `${left}%`, top: `${top}%`,
              width: `${size}px`,
              opacity,
              filter: `blur(${blur}px)`,
              ['--moveX' as string]: `${moveX}px`,
              ['--moveY' as string]: `${moveY}px`,
              animation: `floatX ${durX}s ease-in-out infinite alternate ${delay}s`
            }}>
              <img src={src} alt="" style={{ width: '100%', height: 'auto', animation: `floatY ${durY}s ease-in-out infinite alternate ${delay}s` }} />
            </div>
          );
        })}
        
        {/* Deep ambient glow overlays to integrate the images */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 0%, var(--color-bg) 100%)', opacity: 0.85 }} />
      </div>

      <section className="section-padding">
        <div className="container">
          <header style={{ maxWidth: '600px', marginBottom: '4rem', position: 'relative' }}>
            <BackButton href="/" label="Back to Home" />
            <h1 style={{ marginBottom: '1rem', fontSize: 'clamp(40px, 5vw, 64px)', textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}>Credentials</h1>
            <p style={{ color: 'var(--muted)', fontSize: 'clamp(16px, 1.5vw, 20px)', lineHeight: 1.6, margin: 0, textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
              A chronologically arranged record of my academic background, professional certifications, and technical qualifications.
            </p>
          </header>
          
          <style dangerouslySetInnerHTML={{__html: `
            .credential-card {
              transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease), border-color 0.4s var(--ease);
              background: rgba(10, 13, 18, 0.45) !important;
              backdrop-filter: blur(16px);
              -webkit-backdrop-filter: blur(16px);
              border: 1px solid rgba(255, 255, 255, 0.06);
            }
            .credential-card:hover {
              transform: translateY(-4px);
              border-color: rgba(255, 255, 255, 0.15);
              box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.03) inset;
            }
            @keyframes floatX {
              0% { transform: translateX(0); }
              100% { transform: translateX(var(--moveX)); }
            }
            @keyframes floatY {
              0% { transform: translateY(0) rotate(0deg); }
              100% { transform: translateY(var(--moveY)) rotate(15deg); }
            }
          `}} />

          <div className="pipeline-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem', position: 'relative' }}>
            {credentialsData.map((section, idx) => (
              <div key={idx} className="pipeline-card credential-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', cursor: 'default' }}>
                <h2 style={{ fontSize: '1.25rem', margin: 0, paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-primary)', fontWeight: 500, letterSpacing: '-0.01em' }}>
                  {section.category}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {section.items.map((item, itemIdx) => (
                    <div key={itemIdx} style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 500, margin: 0, lineHeight: 1.4, color: '#fff' }}>{item.title}</h3>
                        {item.issuer && <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>{item.issuer}</span>}
                      </div>
                      <div style={{ color: 'var(--muted)', fontFamily: 'var(--font-display)', fontSize: '1.125rem', whiteSpace: 'nowrap', opacity: 0.8 }}>
                        {item.year}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
