import fallbackPipeline from '@/data/pipeline.json'
import { createClient } from '@/utils/supabase/server'

export async function KitaBuildPipeline() {
  const supabase = createClient()
  const { data: dbPipeline } = await supabase.from('kitabuild_pipeline').select('*').order('order_index', { ascending: true })
  
  const pipelineData = (dbPipeline && dbPipeline.length > 0) ? dbPipeline : fallbackPipeline

  return (
    <section id="pipeline" className="section-padding pipeline-section">
      <div className="container">
        <h2>Building at KitaBuild LLP</h2>
        <div className="pipeline-grid">
          {pipelineData.map((item: any) => (
            <div key={item.id} className="pipeline-card">
              <div className="pipeline-header">
                <h3>{item.title}</h3>
                <span className={`status-tag status-${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {item.status}
                </span>
              </div>
              <p>{item.description}</p>
              {item.link && (
                <a href={item.link} className="pipeline-link" target="_blank" rel="noopener noreferrer">
                  {item.cta ? `${item.cta} →` : `Visit ${item.title} →`}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
