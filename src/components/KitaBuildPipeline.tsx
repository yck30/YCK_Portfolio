import fallbackPipeline from '@/data/pipeline.json'
import { createClient } from '@/utils/supabase/server'
import { parseCustomLinks } from '@/utils/links'

export async function KitaBuildPipeline() {
  const supabase = createClient()
  const { data: dbPipeline } = await supabase.from('kitabuild_pipeline').select('*').order('order_index', { ascending: true })
  
  const pipelineData = (dbPipeline && dbPipeline.length > 0) ? dbPipeline : fallbackPipeline

  return (
    <section id="pipeline" className="section-padding pipeline-section">
      <div className="container">
        <h2>Building at KitaBuild LLP</h2>
        <div className="pipeline-grid">
          {pipelineData.map((item: any) => {
            const links = parseCustomLinks(item.link, item.cta);

            return (
              <div key={item.id} className="pipeline-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="pipeline-header">
                  <h3>{item.title}</h3>
                  <span className={`status-tag status-${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {item.status}
                  </span>
                </div>
                <p style={{ flex: 1 }}>{item.description}</p>
                {links.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    {links.map((linkItem, idx) => {
                      const fullUrl = linkItem.url.startsWith('http') ? linkItem.url : `https://${linkItem.url}`;
                      const label = linkItem.label || (links.length === 1 && item.cta ? item.cta : `Visit ${item.title}`);

                      return (
                        <a 
                          key={idx} 
                          href={fullUrl} 
                          className="pipeline-link" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          {label} →
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  )
}
