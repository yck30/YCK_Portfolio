'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export function AdminDashboardClient({ initialProjects, initialBlogPosts }: { initialProjects: any[], initialBlogPosts: any[] }) {
  const [activeTab, setActiveTab] = useState<'projects' | 'blog'>('projects')
  const [projects, setProjects] = useState(initialProjects)
  const [blogPosts, setBlogPosts] = useState(initialBlogPosts)
  const supabase = createClient()
  const router = useRouter()

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (!error) {
      setProjects(projects.filter(p => p.id !== id))
      router.refresh()
    } else {
      alert('Error deleting project: ' + error.message)
    }
  }

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return
    const { error } = await supabase.from('blog_posts').delete().eq('id', id)
    if (!error) {
      setBlogPosts(blogPosts.filter(p => p.id !== id))
      router.refresh()
    } else {
      alert('Error deleting post: ' + error.message)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', borderBottom: '1px solid var(--color-hairline)', paddingBottom: '16px' }}>
        <button 
          onClick={() => setActiveTab('projects')}
          style={{ 
            background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', 
            color: activeTab === 'projects' ? 'var(--color-paper)' : 'var(--color-muted)',
            fontWeight: activeTab === 'projects' ? 600 : 400
          }}
        >
          Projects
        </button>
        <button 
          onClick={() => setActiveTab('blog')}
          style={{ 
            background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', 
            color: activeTab === 'blog' ? 'var(--color-paper)' : 'var(--color-muted)',
            fontWeight: activeTab === 'blog' ? 600 : 400
          }}
        >
          Blog Posts
        </button>
      </div>

      {activeTab === 'projects' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2>Projects ({projects.length})</h2>
            {/* Future improvement: Add new project form modal */}
            <button style={{ padding: '8px 16px', background: 'var(--color-paper)', color: 'var(--color-bg)', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
              + Add Project
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {projects.map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--color-hairline)', borderRadius: '8px', background: 'var(--color-glass)' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0' }}>{p.title}</h3>
                  <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '14px' }}>{p.role} · ID: {p.id}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{ padding: '6px 12px', background: 'transparent', border: '1px solid var(--color-hairline)', color: 'var(--color-paper)', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDeleteProject(p.id)} style={{ padding: '6px 12px', background: 'rgba(255,0,0,0.1)', border: '1px solid red', color: 'red', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'blog' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2>Blog Posts ({blogPosts.length})</h2>
            {/* Future improvement: Add new post form modal */}
            <button style={{ padding: '8px 16px', background: 'var(--color-paper)', color: 'var(--color-bg)', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
              + Add Post
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {blogPosts.map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--color-hairline)', borderRadius: '8px', background: 'var(--color-glass)' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0' }}>{p.title}</h3>
                  <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '14px' }}>Slug: {p.slug} · Read time: {p.read_time}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{ padding: '6px 12px', background: 'transparent', border: '1px solid var(--color-hairline)', color: 'var(--color-paper)', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDeletePost(p.id)} style={{ padding: '6px 12px', background: 'rgba(255,0,0,0.1)', border: '1px solid red', color: 'red', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
