'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { AdminFormModal } from '@/components/AdminFormModal'
import { ConfirmModal } from '@/components/ConfirmModal'
import { revalidateCMSContent } from '@/app/actions/revalidate'

export function AdminDashboardClient({ initialProjects, initialBlogPosts }: { initialProjects: any[], initialBlogPosts: any[] }) {
  const [activeTab, setActiveTab] = useState<'projects' | 'blog'>('projects')
  const [projects, setProjects] = useState(initialProjects)
  const [blogPosts, setBlogPosts] = useState(initialBlogPosts)
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [modalType, setModalType] = useState<'project' | 'blog'>('project')
  const [editingItem, setEditingItem] = useState<any>(null)

  // Confirm modal state
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'project' | 'blog'; id: string; title: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)

    try {
      if (deleteTarget.type === 'project') {
        const { error } = await supabase.from('projects').delete().eq('id', deleteTarget.id)
        if (!error) {
          setProjects(projects.filter(p => p.id !== deleteTarget.id))
          await revalidateCMSContent()
          router.refresh()
        } else {
          alert('Error deleting project: ' + error.message)
        }
      } else {
        const { error } = await supabase.from('blog_posts').delete().eq('id', deleteTarget.id)
        if (!error) {
          setBlogPosts(blogPosts.filter(p => p.id !== deleteTarget.id))
          await revalidateCMSContent()
          router.refresh()
        } else {
          alert('Error deleting post: ' + error.message)
        }
      }
    } finally {
      setIsDeleting(false)
      setDeleteTarget(null)
    }
  }

  const handleOpenAddProject = () => {
    setModalType('project')
    setModalMode('add')
    setEditingItem(null)
    setIsModalOpen(true)
  }

  const handleOpenEditProject = (project: any) => {
    setModalType('project')
    setModalMode('edit')
    setEditingItem(project)
    setIsModalOpen(true)
  }

  const handleOpenAddPost = () => {
    setModalType('blog')
    setModalMode('add')
    setEditingItem(null)
    setIsModalOpen(true)
  }

  const handleOpenEditPost = (post: any) => {
    setModalType('blog')
    setModalMode('edit')
    setEditingItem(post)
    setIsModalOpen(true)
  }

  const handleModalSuccess = (data: any) => {
    if (modalType === 'project') {
      if (modalMode === 'add') {
        setProjects([...projects, data])
      } else {
        setProjects(projects.map(p => p.id === data.id ? data : p))
      }
    } else {
      if (modalMode === 'add') {
        setBlogPosts([data, ...blogPosts])
      } else {
        setBlogPosts(blogPosts.map(p => p.id === data.id ? data : p))
      }
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
            <button 
              onClick={handleOpenAddProject} 
              style={{ padding: '8px 16px', background: 'var(--color-paper)', color: 'var(--color-bg)', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'transform 160ms ease-out' }}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              + Add Project
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {projects.map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', border: '1px solid var(--color-hairline)', borderRadius: '12px', background: 'var(--color-glass)', transition: 'border-color 0.2s ease' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 600 }}>{p.title}</h3>
                  <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '14px' }}>{p.role} · ID: {p.id}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => handleOpenEditProject(p)} 
                    style={{ padding: '6px 14px', background: 'transparent', border: '1px solid var(--color-hairline)', color: 'var(--color-paper)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', transition: 'transform 160ms ease-out' }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
                    onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => setDeleteTarget({ type: 'project', id: p.id, title: p.title })} 
                    style={{ padding: '6px 14px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', transition: 'transform 160ms ease-out' }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
                    onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    Delete
                  </button>
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
            <button 
              onClick={handleOpenAddPost} 
              style={{ padding: '8px 16px', background: 'var(--color-paper)', color: 'var(--color-bg)', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'transform 160ms ease-out' }}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              + Add Post
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {blogPosts.map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', border: '1px solid var(--color-hairline)', borderRadius: '12px', background: 'var(--color-glass)', transition: 'border-color 0.2s ease' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 600 }}>{p.title}</h3>
                  <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '14px' }}>Slug: {p.slug} · Read time: {p.read_time}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => handleOpenEditPost(p)} 
                    style={{ padding: '6px 14px', background: 'transparent', border: '1px solid var(--color-hairline)', color: 'var(--color-paper)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', transition: 'transform 160ms ease-out' }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
                    onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => setDeleteTarget({ type: 'blog', id: p.id, title: p.title })} 
                    style={{ padding: '6px 14px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', transition: 'transform 160ms ease-out' }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
                    onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isModalOpen && (
        <AdminFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mode={modalMode}
          type={modalType}
          initialData={editingItem}
          onSuccess={handleModalSuccess}
        />
      )}

      <ConfirmModal
        isOpen={deleteTarget !== null}
        title={`Delete ${deleteTarget?.type === 'project' ? 'Project' : 'Blog Post'}`}
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This operation cannot be undone.`}
        confirmText="Delete"
        isDanger={true}
        isSubmitting={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
