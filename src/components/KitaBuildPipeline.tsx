import pipelineData from '@/data/pipeline.json'

export function KitaBuildPipeline() {
  return (
    <section id="pipeline" className="section-padding pipeline-section">
      <div className="container">
        <h2>Building at KitaBuild LLP</h2>
        <div className="pipeline-grid">
          {pipelineData.map(item => (
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
                  Visit {item.title} →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
