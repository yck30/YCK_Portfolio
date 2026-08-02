export function BlogPreview() {
  return (
    <section id="writing" className="section-padding blog-preview-section">
      <div className="container">
        <div className="blog-preview-header">
          <h2>Writing</h2>
          <a href="/blog" className="view-all">View all posts →</a>
        </div>
        <div className="blog-preview-grid">
          <a href="/blog/first-post" className="blog-card">
            <span className="blog-date">Aug 02, 2026</span>
            <h3>Merging Strategy & Motion</h3>
            <p>Exploring how tactile motion design influences user conversion paths.</p>
          </a>
        </div>
      </div>
    </section>
  )
}
