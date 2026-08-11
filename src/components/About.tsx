import fallbackAbout from '@/data/about.json'
import { createClient } from '@/utils/supabase/server'

export async function About() {
  const supabase = createClient()
  const { data: dbAbout } = await supabase.from('about_content').select('*').single()
  
  const headline = dbAbout?.headline || fallbackAbout.headline
  const bio = Array.isArray(dbAbout?.bio) && dbAbout.bio.length > 0 ? dbAbout.bio : fallbackAbout.bio

  return (
    <section id="about" className="section-padding about-section">
      <div className="container about-grid">
        <h2 className="about-heading">{headline}</h2>
        <div className="about-content">
          {bio.map((para: string, i: number) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
