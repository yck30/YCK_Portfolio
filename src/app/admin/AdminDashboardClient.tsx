'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { AdminFormModal, ContentType } from '@/components/AdminFormModal'
import { ConfirmModal } from '@/components/ConfirmModal'
import { revalidateCMSContent } from '@/app/actions/revalidate'

interface AdminDashboardProps {
  initialProjects: any[];
  initialBlogPosts: any[];
  initialAbout: any | null;
  initialJourney: any[];
  initialPipeline: any[];
  initialCredentials: any[];
  initialFooterLinks: any[];
}

export type AdminTab = 'projects' | 'blog' | 'about' | 'journey' | 'pipeline' | 'credential' | 'footer';

export function AdminDashboardClient({
  initialProjects,
  initialBlogPosts,
  initialAbout,
  initialJourney,
  initialPipeline,
  initialCredentials,
  initialFooterLinks,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('projects')
  
  const [projects, setProjects] = useState(initialProjects)
  const [blogPosts, setBlogPosts] = useState(initialBlogPosts)
  const [about, setAbout] = useState(initialAbout || { id: 'main', headline: '', bio: [] })
  const [journey, setJourney] = useState(initialJourney)
  const [pipeline, setPipeline] = useState(initialPipeline)
  const [credentials, setCredentials] = useState(initialCredentials)
  const [footerLinks, setFooterLinks] = useState(initialFooterLinks)

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [modalType, setModalType] = useState<ContentType>('project')
  const [editingItem, setEditingItem] = useState<any>(null)

  // Confirm modal state
  const [deleteTarget, setDeleteTarget] = useState<{ type: ContentType; id: string; title: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()

  const getTableName = (t: ContentType) => {
    switch (t) {
      case 'project': return 'projects'
      case 'blog': return 'blog_posts'
      case 'about': return 'about_content'
      case 'journey': return 'journey_entries'
      case 'pipeline': return 'kitabuild_pipeline'
      case 'credential': return 'credentials'
      case 'footer': return 'footer_links'
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)

    try {
      const table = getTableName(deleteTarget.type)
      const { error } = await supabase.from(table).delete().eq('id', deleteTarget.id)
      
      if (!error) {
        switch (deleteTarget.type) {
          case 'project': setProjects(projects.filter(p => p.id !== deleteTarget.id)); break;
          case 'blog': setBlogPosts(blogPosts.filter(b => b.id !== deleteTarget.id)); break;
          case 'journey': setJourney(journey.filter(j => j.id !== deleteTarget.id)); break;
          case 'pipeline': setPipeline(pipeline.filter(p => p.id !== deleteTarget.id)); break;
          case 'credential': setCredentials(credentials.filter(c => c.id !== deleteTarget.id)); break;
          case 'footer': setFooterLinks(footerLinks.filter(f => f.id !== deleteTarget.id)); break;
        }
        await revalidateCMSContent()
        router.refresh()
      } else {
        alert('Error deleting item: ' + error.message)
      }
    } finally {
      setIsDeleting(false)
      setDeleteTarget(null)
    }
  }

  const handleOpenAdd = (type: ContentType) => {
    setModalType(type)
    setModalMode('add')
    setEditingItem(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (type: ContentType, item: any) => {
    setModalType(type)
    setModalMode('edit')
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleModalSuccess = (data: any) => {
    switch (modalType) {
      case 'project':
        setProjects(modalMode === 'add' ? [...projects, data] : projects.map(p => p.id === data.id ? data : p))
        break;
      case 'blog':
        setBlogPosts(modalMode === 'add' ? [data, ...blogPosts] : blogPosts.map(b => b.id === data.id ? data : b))
        break;
      case 'about':
        setAbout(data)
        break;
      case 'journey':
        setJourney(modalMode === 'add' ? [...journey, data] : journey.map(j => j.id === data.id ? data : j))
        break;
      case 'pipeline':
        setPipeline(modalMode === 'add' ? [...pipeline, data] : pipeline.map(p => p.id === data.id ? data : p))
        break;
      case 'credential':
        setCredentials(modalMode === 'add' ? [...credentials, data] : credentials.map(c => c.id === data.id ? data : c))
        break;
      case 'footer':
        setFooterLinks(modalMode === 'add' ? [...footerLinks, data] : footerLinks.map(f => f.id === data.id ? data : f))
        break;
    }
  }

  const navTabStyle = (tab: AdminTab) => ({
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    color: activeTab === tab ? 'var(--color-paper)' : 'var(--color-muted)',
    fontWeight: activeTab === tab ? 600 : 400,
    borderBottom: activeTab === tab ? '2px solid var(--color-paper)' : '2px solid transparent',
    paddingBottom: '8px',
    transition: 'all 0.2s ease'
  })

  return (
    <div>
      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '32px', borderBottom: '1px solid var(--color-hairline)', overflowX: 'auto', paddingBottom: '4px' }}>
        <button onClick={() => setActiveTab('projects')} style={navTabStyle('projects')}>Projects ({projects.length})</button>
        <button onClick={() => setActiveTab('blog')} style={navTabStyle('blog')}>Blog Posts ({blogPosts.length})</button>
        <button onClick={() => setActiveTab('about')} style={navTabStyle('about')}>About Section</button>
        <button onClick={() => setActiveTab('journey')} style={navTabStyle('journey')}>Journey ({journey.length})</button>
        <button onClick={() => setActiveTab('pipeline')} style={navTabStyle('pipeline')}>KitaBuild ({pipeline.length})</button>
        <button onClick={() => setActiveTab('credential')} style={navTabStyle('credential')}>Credentials ({credentials.length})</button>
        <button onClick={() => setActiveTab('footer')} style={navTabStyle('footer')}>Footer Links ({footerLinks.length})</button>
      </div>

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2>Projects ({projects.length})</h2>
            <button onClick={() => handleOpenAdd('project')} style={{ padding: '8px 16px', background: 'var(--color-paper)', color: 'var(--color-bg)', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              + Add Project
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {projects.map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', border: '1px solid var(--color-hairline)', borderRadius: '12px', background: 'var(--color-glass)' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 600 }}>{p.title}</h3>
                  <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '14px' }}>{p.role} · ID: {p.id}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleOpenEdit('project', p)} style={{ padding: '6px 14px', background: 'transparent', border: '1px solid var(--color-hairline)', color: 'var(--color-paper)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Edit</button>
                  <button onClick={() => setDeleteTarget({ type: 'project', id: p.id, title: p.title })} style={{ padding: '6px 14px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blog Tab */}
      {activeTab === 'blog' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2>Blog Posts ({blogPosts.length})</h2>
            <button onClick={() => handleOpenAdd('blog')} style={{ padding: '8px 16px', background: 'var(--color-paper)', color: 'var(--color-bg)', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              + Add Post
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {blogPosts.map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', border: '1px solid var(--color-hairline)', borderRadius: '12px', background: 'var(--color-glass)' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 600 }}>{p.title}</h3>
                  <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '14px' }}>Slug: {p.slug} · Read time: {p.read_time}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleOpenEdit('blog', p)} style={{ padding: '6px 14px', background: 'transparent', border: '1px solid var(--color-hairline)', color: 'var(--color-paper)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Edit</button>
                  <button onClick={() => setDeleteTarget({ type: 'blog', id: p.id, title: p.title })} style={{ padding: '6px 14px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* About Section Tab */}
      {activeTab === 'about' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2>About Section Headline & Bio</h2>
            <button onClick={() => handleOpenEdit('about', about)} style={{ padding: '8px 16px', background: 'var(--color-paper)', color: 'var(--color-bg)', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              Edit About Content
            </button>
          </div>
          <div style={{ padding: '24px', border: '1px solid var(--color-hairline)', borderRadius: '12px', background: 'var(--color-glass)' }}>
            <h3 style={{ fontSize: '20px', marginTop: 0, marginBottom: '16px' }}>{about?.headline || 'No headline set'}</h3>
            <div style={{ color: 'var(--color-muted)', fontSize: '15px', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Array.isArray(about?.bio) && about.bio.map((paragraph: string, i: number) => (
                <p key={i} style={{ margin: 0 }}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Journey Tab */}
      {activeTab === 'journey' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2>Journey Entries ({journey.length})</h2>
            <button onClick={() => handleOpenAdd('journey')} style={{ padding: '8px 16px', background: 'var(--color-paper)', color: 'var(--color-bg)', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              + Add Journey Entry
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {journey.map(j => (
              <div key={j.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', border: '1px solid var(--color-hairline)', borderRadius: '12px', background: 'var(--color-glass)' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 600 }}>{j.title} <span style={{ fontSize: '14px', color: 'var(--color-muted)' }}>({j.year})</span></h3>
                  <p style={{ margin: '0 0 4px 0', color: 'var(--color-paper)', opacity: 0.9, fontSize: '14px' }}>{j.company}</p>
                  <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '13px' }}>{j.description}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleOpenEdit('journey', j)} style={{ padding: '6px 14px', background: 'transparent', border: '1px solid var(--color-hairline)', color: 'var(--color-paper)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Edit</button>
                  <button onClick={() => setDeleteTarget({ type: 'journey', id: j.id, title: j.title })} style={{ padding: '6px 14px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KitaBuild Pipeline Tab */}
      {activeTab === 'pipeline' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2>KitaBuild LLP Pipeline ({pipeline.length})</h2>
            <button onClick={() => handleOpenAdd('pipeline')} style={{ padding: '8px 16px', background: 'var(--color-paper)', color: 'var(--color-bg)', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              + Add Pipeline Item
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pipeline.map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', border: '1px solid var(--color-hairline)', borderRadius: '12px', background: 'var(--color-glass)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{p.title}</h3>
                    <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: 'var(--color-paper)', fontWeight: 600 }}>{p.status}</span>
                  </div>
                  <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '13px' }}>{p.description}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleOpenEdit('pipeline', p)} style={{ padding: '6px 14px', background: 'transparent', border: '1px solid var(--color-hairline)', color: 'var(--color-paper)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Edit</button>
                  <button onClick={() => setDeleteTarget({ type: 'pipeline', id: p.id, title: p.title })} style={{ padding: '6px 14px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Credentials Tab */}
      {activeTab === 'credential' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2>Credentials ({credentials.length})</h2>
            <button onClick={() => handleOpenAdd('credential')} style={{ padding: '8px 16px', background: 'var(--color-paper)', color: 'var(--color-bg)', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              + Add Credential
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {credentials.map(c => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', border: '1px solid var(--color-hairline)', borderRadius: '12px', background: 'var(--color-glass)' }}>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.category}</span>
                  <h3 style={{ margin: '2px 0 4px 0', fontSize: '16px', fontWeight: 600 }}>{c.title}</h3>
                  <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '13px' }}>{c.issuer ? `${c.issuer} · ` : ''}{c.year}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleOpenEdit('credential', c)} style={{ padding: '6px 14px', background: 'transparent', border: '1px solid var(--color-hairline)', color: 'var(--color-paper)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Edit</button>
                  <button onClick={() => setDeleteTarget({ type: 'credential', id: c.id, title: c.title })} style={{ padding: '6px 14px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Links Tab */}
      {activeTab === 'footer' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2>Footer Links ({footerLinks.length})</h2>
            <button onClick={() => handleOpenAdd('footer')} style={{ padding: '8px 16px', background: 'var(--color-paper)', color: 'var(--color-bg)', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              + Add Footer Link
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {footerLinks.map(f => (
              <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', border: '1px solid var(--color-hairline)', borderRadius: '12px', background: 'var(--color-glass)' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 600 }}>{f.label} <span style={{ fontSize: '12px', opacity: 0.6, fontWeight: 400 }}>({f.type})</span></h3>
                  <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '13px' }}>{f.url}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleOpenEdit('footer', f)} style={{ padding: '6px 14px', background: 'transparent', border: '1px solid var(--color-hairline)', color: 'var(--color-paper)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Edit</button>
                  <button onClick={() => setDeleteTarget({ type: 'footer', id: f.id, title: f.label })} style={{ padding: '6px 14px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Form Modal */}
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        title={`Delete Item`}
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
