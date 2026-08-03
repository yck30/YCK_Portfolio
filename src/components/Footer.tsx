export function Footer() {
  return (
    <footer id="footer" className="section-padding" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
      <div className="container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '2rem' }}>
          <div>
            <h2 style={{ marginBottom: '0.5rem' }}>Stay Connected</h2>
            <p style={{ color: 'var(--muted)', maxWidth: '500px', margin: '0 auto' }}>
              Have a project in mind or just want to say hi? Feel free to reach out across any of the platforms below.
            </p>
          </div>
          
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '1.5rem 2.5rem', 
            justifyContent: 'center',
            maxWidth: '800px',
            marginTop: '1rem'
          }}>
            <a href="mailto:ckyong@kitabuild.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#d8b4fe', fontWeight: '500', transition: 'color 0.2s' }}>Email</a>
            <a href="https://wa.me/60164221791" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#d8b4fe', fontWeight: '500', transition: 'color 0.2s' }}>WhatsApp</a>
            <a href="https://github.com/yck30" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#d8b4fe', fontWeight: '500', transition: 'color 0.2s' }}>GitHub</a>
            <a href="https://www.linkedin.com/in/chunkityong" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#d8b4fe', fontWeight: '500', transition: 'color 0.2s' }}>LinkedIn</a>
            <a href="https://www.tiktok.com/@yck96" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#d8b4fe', fontWeight: '500', transition: 'color 0.2s' }}>TikTok</a>
            <a href="https://www.instagram.com/ck_yong96/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#d8b4fe', fontWeight: '500', transition: 'color 0.2s' }}>Instagram</a>
            <a href="https://www.threads.com/@ck_yong96" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#d8b4fe', fontWeight: '500', transition: 'color 0.2s' }}>Threads</a>
            <a href="https://web.facebook.com/YCK96/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#d8b4fe', fontWeight: '500', transition: 'color 0.2s' }}>Facebook</a>
          </div>

          <div style={{ marginTop: '3rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem' }}>
            &copy; {new Date().getFullYear()} CK Yong. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
