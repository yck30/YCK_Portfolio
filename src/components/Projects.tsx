import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { ProjectImageSlider } from './ProjectImageSlider'

export async function Projects() {
  const supabase = createClient()
  const { data: projectsData } = await supabase.from('projects').select('*').order('order_index', { ascending: true })

  return (
    <section id="projects" className="section-padding projects-section">
      <div className="container">
        <h2>Key Projects</h2>
        <div className="bento-grid">
          {projectsData?.map((p, index) => (
            <Link key={p.id} href={`/projects/${p.id}`} className={`bento-card item-${index}`}>
              <ProjectImageSlider images={p.images} alt={p.title} />
              <div className="bento-content">
                <div className="bento-meta">
                  <h3>{p.title}</h3>
                  <span className="bento-role">{p.role}</span>
                </div>
                <p>{p.description}</p>
                {p.features && p.features.length > 0 && (
                  <ul className="bento-features">
                    {p.features.map((f: string, i: number) => <li key={i}>{f}</li>)}
                  </ul>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
