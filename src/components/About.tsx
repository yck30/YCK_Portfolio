import aboutData from '@/data/about.json'

export function About() {
  return (
    <section id="about" className="section-padding about-section">
      <div className="container about-grid">
        <h2 className="about-heading">{aboutData.headline}</h2>
        <div className="about-content">
          {aboutData.bio.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
