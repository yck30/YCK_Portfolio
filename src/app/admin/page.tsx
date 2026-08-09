import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AdminDashboardClient } from './AdminDashboardClient'

export default async function AdminPage() {
  const supabase = createClient()

  // Protect the dashboard
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/admin/login')
  }

  // Fetch initial data
  const { data: projects } = await supabase.from('projects').select('*').order('order_index', { ascending: true })
  const { data: blogPosts } = await supabase.from('blog_posts').select('*').order('published_at', { ascending: false })

  return (
    <div style={{ padding: '48px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '32px', margin: 0, fontFamily: 'var(--font-primary)' }}>CMS Dashboard</h1>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ color: 'var(--color-muted)', fontSize: '14px' }}>Logged in as {user.email}</span>
          <Link 
            href="/" 
            style={{ 
              color: 'var(--color-paper)', 
              textDecoration: 'none', 
              border: '1px solid var(--color-hairline)',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            Back to Home
          </Link>
          <form action="/auth/signout" method="post">
            <button type="submit" style={{ background: 'transparent', border: '1px solid var(--color-hairline)', color: 'var(--color-paper)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <AdminDashboardClient initialProjects={projects || []} initialBlogPosts={blogPosts || []} />
    </div>
  )
}
