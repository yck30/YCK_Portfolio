import projectsData from '@/data/projects.json'
import { ProjectImageSlider } from './ProjectImageSlider'

export function Projects() {
  return (
    <section id="projects" className="section-padding projects-section">
      <div className="container">
        <h2>Key Projects</h2>
        <div className="bento-grid">
          {projectsData.map((p, index) => (
            <a key={p.id} href={p.link} className={`bento-card item-${index}`}>
              <ProjectImageSlider images={p.images} alt={p.title} />
              <div className="bento-content">
                <div className="bento-meta">
                  <h3>{p.title}</h3>
                  <span className="bento-role">{p.role}</span>
                </div>
                <p>{p.description}</p>
                {p.features && p.features.length > 0 && (
                  <ul className="bento-features">
                    {p.features.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
