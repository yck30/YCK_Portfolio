'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { AdminFormModal, ContentType } from '@/components/AdminFormModal'
import { ConfirmModal } from '@/components/ConfirmModal'
import { revalidateCMSContent } from '@/app/actions/revalidate'
import { GripVertical, ChevronUp, ChevronDown, Check, Loader2, Link as LinkIcon } from 'lucide-react'
import { parseCustomLinks } from '@/utils/links'

interface AdminDashboardProps {
  initialProjects: any[];
  initialBlogPosts: any[];
  initialHero: any | null;
  initialAbout: any | null;
  initialJourney: any[];
  initialPipeline: any[];
  initialCredentials: any[];
  initialFooterLinks: any[];
  initialFooterSettings: any | null;
  initialPrivacy: any | null;
}

export type AdminTab = 'hero' | 'projects' | 'blog' | 'about' | 'journey' | 'pipeline' | 'credential' | 'footer' | 'privacy';

export function AdminDashboardClient({
  initialProjects,
  initialBlogPosts,
  initialHero,
  initialAbout,
  initialJourney,
  initialPipeline,
  initialCredentials,
  initialFooterLinks,
  initialFooterSettings,
  initialPrivacy,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('hero')
  
  const [hero, setHero] = useState(initialHero || { 
    id: 'main', 
    eyebrow: 'Web Developer & AI Builder', 
    line1: 'Strategy,', 
    line2: 'design &', 
    line3: 'motion.', 
    subtitle: 'Bridging the gap between creative vision and technical execution.',
    location_badge: 'Based in Malaysia',
    scroll_badge: 'Scroll to explore',
    copyright_text: '© 2026 CK Yong',
    images: ["/assets/Personal_1.JPG", "/assets/Personal_2.JPG", "/assets/Personal_3.JPG"]
  })
  const [projects, setProjects] = useState(initialProjects)
  const [blogPosts, setBlogPosts] = useState(initialBlogPosts)
  const [about, setAbout] = useState(initialAbout || { id: 'main', headline: '', bio: [] })
  const [journey, setJourney] = useState(initialJourney)
  const [pipeline, setPipeline] = useState(initialPipeline)
  const [credentials, setCredentials] = useState(initialCredentials)
  const [footerLinks, setFooterLinks] = useState(initialFooterLinks)
  const [footerSettings, setFooterSettings] = useState(initialFooterSettings || {
    id: 'main',
    heading: 'Stay Connected',
    subtitle: 'Have a project in mind or just want to say hi? Feel free to reach out across any of the platforms below.',
    copyright_text: '© 2026 CK Yong. All rights reserved.'
  })
  const [privacy, setPrivacy] = useState(initialPrivacy || {
    id: 'main',
    title: 'Privacy Policy',
    last_updated: 'August 2026',
    contact_email: 'ckyong@kitabuild.com',
    content: ''
  })

  // Drag and drop reordering state
  const [draggedItem, setDraggedItem] = useState<{ type: AdminTab; index: number } | null>(null)
  const [dragOverItem, setDragOverItem] = useState<{ type: AdminTab; index: number } | null>(null)
  const [orderSaveStatus, setOrderSaveStatus] = useState<{ type: AdminTab; status: 'saving' | 'saved' | 'error'; message?: string } | null>(null)

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
      case 'hero': return 'hero_content'
      case 'about': return 'about_content'
      case 'journey': return 'journey_entries'
      case 'pipeline': return 'kitabuild_pipeline'
      case 'credential': return 'credentials'
      case 'footer': return 'footer_links'
      case 'footer_settings': return 'footer_settings'
      case 'privacy': return 'privacy_policy'
    }
  }

  const handleReorder = async (
    tabType: AdminTab,
    fromIndex: number,
    toIndex: number
  ) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return

    let currentList: any[] = []
    let setList: (items: any[]) => void = () => {}
    let contentType: ContentType = 'project'

    if (tabType === 'projects') {
      currentList = [...projects]
      setList = setProjects
      contentType = 'project'
    } else if (tabType === 'pipeline') {
      currentList = [...pipeline]
      setList = setPipeline
      contentType = 'pipeline'
    } else if (tabType === 'journey') {
      currentList = [...journey]
      setList = setJourney
      contentType = 'journey'
    } else if (tabType === 'credential') {
      currentList = [...credentials]
      setList = setCredentials
      contentType = 'credential'
    } else if (tabType === 'footer') {
      currentList = [...footerLinks]
      setList = setFooterLinks
      contentType = 'footer'
    } else {
      return
    }

    if (toIndex >= currentList.length) return

    const reordered = [...currentList]
    const [movedItem] = reordered.splice(fromIndex, 1)
    reordered.splice(toIndex, 0, movedItem)

    // Re-assign 1-based order_index
    const updatedList = reordered.map((item, idx) => ({
      ...item,
      order_index: idx + 1
    }))

    // Optimistic update
    setList(updatedList)
    setOrderSaveStatus({ type: tabType, status: 'saving' })

    try {
      const tableName = getTableName(contentType)
      const updatePromises = updatedList.map((item) =>
        supabase.from(tableName).update({ order_index: item.order_index }).eq('id', item.id)
      )
      const results = await Promise.all(updatePromises)
      const hasError = results.some(r => r.error)
      if (hasError) {
        const err = results.find(r => r.error)?.error
        throw err || new Error('Failed to update arrangement')
      }

      await revalidateCMSContent()
      setOrderSaveStatus({ type: tabType, status: 'saved' })
      setTimeout(() => {
        setOrderSaveStatus(prev => prev?.type === tabType ? null : prev)
      }, 2500)
      router.refresh()
    } catch (err: any) {
      // Revert optimistic update on failure
      setList(currentList)
      setOrderSaveStatus({ type: tabType, status: 'error', message: err.message })
      setTimeout(() => {
        setOrderSaveStatus(prev => prev?.type === tabType ? null : prev)
      }, 4000)
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
      case 'hero':
        setHero(data)
        break;
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
      case 'footer_settings':
        setFooterSettings(data)
        break;
      case 'privacy':
        setPrivacy(data)
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
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap' as const
  })

  const renderOrderFeedback = (tab: AdminTab) => {
    if (orderSaveStatus?.type === tab) {
      if (orderSaveStatus.status === 'saving') {
        return (
          <span style={{ fontSize: '13px', color: 'var(--color-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '6px' }}>
            <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving arrangement...
          </span>
        )
      }
      if (orderSaveStatus.status === 'saved') {
        return (
          <span style={{ fontSize: '13px', color: '#34d399', display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(52, 211, 153, 0.12)', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
            <Check size={14} /> Arrangement saved & live
          </span>
        )
      }
      if (orderSaveStatus.status === 'error') {
        return (
          <span style={{ fontSize: '13px', color: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(239, 68, 68, 0.12)', padding: '4px 10px', borderRadius: '6px' }}>
            Error saving: {orderSaveStatus.message}
          </span>
        )
      }
    }
    return (
      <span style={{ fontSize: '13px', color: 'var(--color-muted)', opacity: 0.8 }}>
        💡 Drag cards or use ↑ ↓ to rearrange live chronology
      </span>
    )
  }

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .drag-handle:hover {
          color: var(--color-paper) !important;
        }
        .order-arrow-btn {
          background: transparent;
          border: 1px solid var(--color-hairline);
          color: var(--color-muted);
          border-radius: 4px;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
          padding: 0;
        }
        .order-arrow-btn:hover:not(:disabled) {
          background: var(--color-paper);
          color: var(--color-bg);
          border-color: var(--color-paper);
        }
        .order-arrow-btn:disabled {
          opacity: 0.25;
          cursor: not-allowed;
        }
      `}} />

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '32px', borderBottom: '1px solid var(--color-hairline)', overflowX: 'auto', paddingBottom: '4px' }}>
        <button onClick={() => setActiveTab('hero')} style={navTabStyle('hero')}>Hero Section</button>
        <button onClick={() => setActiveTab('projects')} style={navTabStyle('projects')}>Projects ({projects.length})</button>
        <button onClick={() => setActiveTab('blog')} style={navTabStyle('blog')}>Blog Posts ({blogPosts.length})</button>
        <button onClick={() => setActiveTab('about')} style={navTabStyle('about')}>About Section</button>
        <button onClick={() => setActiveTab('journey')} style={navTabStyle('journey')}>Journey ({journey.length})</button>
        <button onClick={() => setActiveTab('pipeline')} style={navTabStyle('pipeline')}>KitaBuild ({pipeline.length})</button>
        <button onClick={() => setActiveTab('credential')} style={navTabStyle('credential')}>Credentials ({credentials.length})</button>
        <button onClick={() => setActiveTab('footer')} style={navTabStyle('footer')}>Footer ({footerLinks.length})</button>
        <button onClick={() => setActiveTab('privacy')} style={navTabStyle('privacy')}>Privacy Policy</button>
      </div>

      {/* Hero Section Tab */}
      {activeTab === 'hero' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2>Hero Banner Section</h2>
            <button onClick={() => handleOpenEdit('hero', hero)} style={{ padding: '8px 16px', background: 'var(--color-paper)', color: 'var(--color-bg)', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              Edit Hero Section
            </button>
          </div>
          <div style={{ padding: '24px', border: '1px solid var(--color-hairline)', borderRadius: '12px', background: 'var(--color-glass)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Eyebrow Badge</span>
              <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: 600 }}>{hero?.eyebrow || 'Web Developer & AI Builder'}</p>
            </div>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Headline Lines</span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', fontFamily: 'Instrument Serif, serif' }}>
                {hero?.line1 || 'Strategy,'} {hero?.line2 || 'design &'} <em>{hero?.line3 || 'motion.'}</em>
              </h3>
            </div>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subtitle</span>
              <p style={{ margin: '4px 0 0 0', color: 'var(--color-muted)', fontSize: '15px' }}>{hero?.subtitle || 'Bridging the gap between creative vision and technical execution.'}</p>
            </div>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</span>
                <p style={{ margin: '2px 0 0 0', fontSize: '14px' }}>{hero?.location_badge || 'Based in Malaysia'}</p>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scroll Text</span>
                <p style={{ margin: '2px 0 0 0', fontSize: '14px' }}>{hero?.scroll_badge || 'Scroll to explore'}</p>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Copyright</span>
                <p style={{ margin: '2px 0 0 0', fontSize: '14px' }}>{hero?.copyright_text || '© 2026 CK Yong'}</p>
              </div>
            </div>
            {hero?.images && Array.isArray(hero.images) && hero.images.length > 0 && (
              <div>
                <span style={{ fontSize: '12px', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Slider Images ({hero.images.length})</span>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
                  {hero.images.map((img: any, idx: number) => {
                    const src = typeof img === 'string' ? img : img.src;
                    return (
                      <div key={idx} style={{ width: '80px', height: '100px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--color-hairline)', position: 'relative', background: '#222' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt={`Slider ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0 }}>Key Projects ({projects.length})</h2>
              {renderOrderFeedback('projects')}
            </div>
            <button onClick={() => handleOpenAdd('project')} style={{ padding: '8px 16px', background: 'var(--color-paper)', color: 'var(--color-bg)', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              + Add Project
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {projects.map((p, index) => {
              const isDragging = draggedItem?.type === 'projects' && draggedItem.index === index;
              const isDragOver = dragOverItem?.type === 'projects' && dragOverItem.index === index && !isDragging;

              return (
                <div 
                  key={p.id}
                  draggable
                  onDragStart={(e) => {
                    setDraggedItem({ type: 'projects', index })
                    e.dataTransfer.effectAllowed = 'move'
                    e.dataTransfer.setData('text/plain', String(index))
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.dataTransfer.dropEffect = 'move'
                    if (dragOverItem?.index !== index || dragOverItem?.type !== 'projects') {
                      setDragOverItem({ type: 'projects', index })
                    }
                  }}
                  onDragLeave={() => {
                    if (dragOverItem?.index === index && dragOverItem?.type === 'projects') {
                      setDragOverItem(null)
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    if (draggedItem && draggedItem.type === 'projects') {
                      handleReorder('projects', draggedItem.index, index)
                    }
                    setDraggedItem(null)
                    setDragOverItem(null)
                  }}
                  onDragEnd={() => {
                    setDraggedItem(null)
                    setDragOverItem(null)
                  }}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '16px 20px', 
                    border: isDragOver ? '2px solid var(--color-paper)' : (isDragging ? '1px dashed var(--color-paper)' : '1px solid var(--color-hairline)'), 
                    borderRadius: '12px', 
                    background: isDragOver ? 'rgba(255,255,255,0.08)' : 'var(--color-glass)',
                    opacity: isDragging ? 0.35 : 1,
                    transform: isDragOver ? 'translateY(-2px)' : (isDragging ? 'scale(0.98)' : 'none'),
                    boxShadow: isDragOver ? '0 8px 24px rgba(0,0,0,0.35)' : 'none',
                    transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'grab'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Drag Handle & Order Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="drag-handle" title="Drag to rearrange" style={{ color: 'var(--color-muted)', display: 'flex', alignItems: 'center', cursor: 'grab' }}>
                        <GripVertical size={18} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', color: 'var(--color-paper)', fontVariantNumeric: 'tabular-nums' }}>
                        #{index + 1}
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <button 
                          className="order-arrow-btn" 
                          disabled={index === 0} 
                          onClick={(e) => { e.stopPropagation(); handleReorder('projects', index, index - 1); }}
                          title="Move Up"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button 
                          className="order-arrow-btn" 
                          disabled={index === projects.length - 1} 
                          onClick={(e) => { e.stopPropagation(); handleReorder('projects', index, index + 1); }}
                          title="Move Down"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 600 }}>{p.title}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '14px' }}>{p.role} · ID: {p.id}</p>
                        {(() => {
                          const links = parseCustomLinks(p.link);
                          if (links.length === 0) return null;
                          return (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-paper)', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px' }}>
                              <LinkIcon size={12} /> {links.length} {links.length === 1 ? 'URL' : 'URLs'}
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleOpenEdit('project', p)} style={{ padding: '6px 14px', background: 'transparent', border: '1px solid var(--color-hairline)', color: 'var(--color-paper)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Edit</button>
                    <button onClick={() => setDeleteTarget({ type: 'project', id: p.id, title: p.title })} style={{ padding: '6px 14px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
                  </div>
                </div>
              )
            })}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0 }}>Journey Entries ({journey.length})</h2>
              {renderOrderFeedback('journey')}
            </div>
            <button onClick={() => handleOpenAdd('journey')} style={{ padding: '8px 16px', background: 'var(--color-paper)', color: 'var(--color-bg)', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              + Add Journey Entry
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {journey.map((j, index) => {
              const isDragging = draggedItem?.type === 'journey' && draggedItem.index === index;
              const isDragOver = dragOverItem?.type === 'journey' && dragOverItem.index === index && !isDragging;

              return (
                <div 
                  key={j.id}
                  draggable
                  onDragStart={(e) => {
                    setDraggedItem({ type: 'journey', index })
                    e.dataTransfer.effectAllowed = 'move'
                    e.dataTransfer.setData('text/plain', String(index))
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.dataTransfer.dropEffect = 'move'
                    if (dragOverItem?.index !== index || dragOverItem?.type !== 'journey') {
                      setDragOverItem({ type: 'journey', index })
                    }
                  }}
                  onDragLeave={() => {
                    if (dragOverItem?.index === index && dragOverItem?.type === 'journey') {
                      setDragOverItem(null)
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    if (draggedItem && draggedItem.type === 'journey') {
                      handleReorder('journey', draggedItem.index, index)
                    }
                    setDraggedItem(null)
                    setDragOverItem(null)
                  }}
                  onDragEnd={() => {
                    setDraggedItem(null)
                    setDragOverItem(null)
                  }}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '16px 20px', 
                    border: isDragOver ? '2px solid var(--color-paper)' : (isDragging ? '1px dashed var(--color-paper)' : '1px solid var(--color-hairline)'), 
                    borderRadius: '12px', 
                    background: isDragOver ? 'rgba(255,255,255,0.08)' : 'var(--color-glass)',
                    opacity: isDragging ? 0.35 : 1,
                    transform: isDragOver ? 'translateY(-2px)' : (isDragging ? 'scale(0.98)' : 'none'),
                    boxShadow: isDragOver ? '0 8px 24px rgba(0,0,0,0.35)' : 'none',
                    transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'grab'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="drag-handle" title="Drag to rearrange" style={{ color: 'var(--color-muted)', display: 'flex', alignItems: 'center', cursor: 'grab' }}>
                        <GripVertical size={18} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', color: 'var(--color-paper)', fontVariantNumeric: 'tabular-nums' }}>
                        #{index + 1}
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <button 
                          className="order-arrow-btn" 
                          disabled={index === 0} 
                          onClick={(e) => { e.stopPropagation(); handleReorder('journey', index, index - 1); }}
                          title="Move Up"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button 
                          className="order-arrow-btn" 
                          disabled={index === journey.length - 1} 
                          onClick={(e) => { e.stopPropagation(); handleReorder('journey', index, index + 1); }}
                          title="Move Down"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 600 }}>{j.title} <span style={{ fontSize: '14px', color: 'var(--color-muted)' }}>({j.year})</span></h3>
                      <p style={{ margin: '0 0 4px 0', color: 'var(--color-paper)', opacity: 0.9, fontSize: '14px' }}>{j.company}</p>
                      <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '13px' }}>{j.description}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleOpenEdit('journey', j)} style={{ padding: '6px 14px', background: 'transparent', border: '1px solid var(--color-hairline)', color: 'var(--color-paper)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Edit</button>
                    <button onClick={() => setDeleteTarget({ type: 'journey', id: j.id, title: j.title })} style={{ padding: '6px 14px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* KitaBuild Pipeline Tab */}
      {activeTab === 'pipeline' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0 }}>KitaBuild LLP Pipeline ({pipeline.length})</h2>
              {renderOrderFeedback('pipeline')}
            </div>
            <button onClick={() => handleOpenAdd('pipeline')} style={{ padding: '8px 16px', background: 'var(--color-paper)', color: 'var(--color-bg)', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              + Add Pipeline Item
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pipeline.map((p, index) => {
              const isDragging = draggedItem?.type === 'pipeline' && draggedItem.index === index;
              const isDragOver = dragOverItem?.type === 'pipeline' && dragOverItem.index === index && !isDragging;

              return (
                <div 
                  key={p.id}
                  draggable
                  onDragStart={(e) => {
                    setDraggedItem({ type: 'pipeline', index })
                    e.dataTransfer.effectAllowed = 'move'
                    e.dataTransfer.setData('text/plain', String(index))
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.dataTransfer.dropEffect = 'move'
                    if (dragOverItem?.index !== index || dragOverItem?.type !== 'pipeline') {
                      setDragOverItem({ type: 'pipeline', index })
                    }
                  }}
                  onDragLeave={() => {
                    if (dragOverItem?.index === index && dragOverItem?.type === 'pipeline') {
                      setDragOverItem(null)
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    if (draggedItem && draggedItem.type === 'pipeline') {
                      handleReorder('pipeline', draggedItem.index, index)
                    }
                    setDraggedItem(null)
                    setDragOverItem(null)
                  }}
                  onDragEnd={() => {
                    setDraggedItem(null)
                    setDragOverItem(null)
                  }}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '16px 20px', 
                    border: isDragOver ? '2px solid var(--color-paper)' : (isDragging ? '1px dashed var(--color-paper)' : '1px solid var(--color-hairline)'), 
                    borderRadius: '12px', 
                    background: isDragOver ? 'rgba(255,255,255,0.08)' : 'var(--color-glass)',
                    opacity: isDragging ? 0.35 : 1,
                    transform: isDragOver ? 'translateY(-2px)' : (isDragging ? 'scale(0.98)' : 'none'),
                    boxShadow: isDragOver ? '0 8px 24px rgba(0,0,0,0.35)' : 'none',
                    transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'grab'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="drag-handle" title="Drag to rearrange" style={{ color: 'var(--color-muted)', display: 'flex', alignItems: 'center', cursor: 'grab' }}>
                        <GripVertical size={18} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', color: 'var(--color-paper)', fontVariantNumeric: 'tabular-nums' }}>
                        #{index + 1}
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <button 
                          className="order-arrow-btn" 
                          disabled={index === 0} 
                          onClick={(e) => { e.stopPropagation(); handleReorder('pipeline', index, index - 1); }}
                          title="Move Up"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button 
                          className="order-arrow-btn" 
                          disabled={index === pipeline.length - 1} 
                          onClick={(e) => { e.stopPropagation(); handleReorder('pipeline', index, index + 1); }}
                          title="Move Down"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{p.title}</h3>
                        <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: 'var(--color-paper)', fontWeight: 600 }}>{p.status}</span>
                        {(() => {
                          const links = parseCustomLinks(p.link, p.cta);
                          if (links.length === 0) return null;
                          return (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-paper)', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px' }}>
                              <LinkIcon size={12} /> {links.length} {links.length === 1 ? 'URL' : 'URLs'}
                            </span>
                          );
                        })()}
                      </div>
                      <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '13px' }}>{p.description}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleOpenEdit('pipeline', p)} style={{ padding: '6px 14px', background: 'transparent', border: '1px solid var(--color-hairline)', color: 'var(--color-paper)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Edit</button>
                    <button onClick={() => setDeleteTarget({ type: 'pipeline', id: p.id, title: p.title })} style={{ padding: '6px 14px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Credentials Tab */}
      {activeTab === 'credential' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0 }}>Credentials ({credentials.length})</h2>
              {renderOrderFeedback('credential')}
            </div>
            <button onClick={() => handleOpenAdd('credential')} style={{ padding: '8px 16px', background: 'var(--color-paper)', color: 'var(--color-bg)', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              + Add Credential
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {credentials.map((c, index) => {
              const isDragging = draggedItem?.type === 'credential' && draggedItem.index === index;
              const isDragOver = dragOverItem?.type === 'credential' && dragOverItem.index === index && !isDragging;

              return (
                <div 
                  key={c.id}
                  draggable
                  onDragStart={(e) => {
                    setDraggedItem({ type: 'credential', index })
                    e.dataTransfer.effectAllowed = 'move'
                    e.dataTransfer.setData('text/plain', String(index))
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.dataTransfer.dropEffect = 'move'
                    if (dragOverItem?.index !== index || dragOverItem?.type !== 'credential') {
                      setDragOverItem({ type: 'credential', index })
                    }
                  }}
                  onDragLeave={() => {
                    if (dragOverItem?.index === index && dragOverItem?.type === 'credential') {
                      setDragOverItem(null)
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    if (draggedItem && draggedItem.type === 'credential') {
                      handleReorder('credential', draggedItem.index, index)
                    }
                    setDraggedItem(null)
                    setDragOverItem(null)
                  }}
                  onDragEnd={() => {
                    setDraggedItem(null)
                    setDragOverItem(null)
                  }}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '16px 20px', 
                    border: isDragOver ? '2px solid var(--color-paper)' : (isDragging ? '1px dashed var(--color-paper)' : '1px solid var(--color-hairline)'), 
                    borderRadius: '12px', 
                    background: isDragOver ? 'rgba(255,255,255,0.08)' : 'var(--color-glass)',
                    opacity: isDragging ? 0.35 : 1,
                    transform: isDragOver ? 'translateY(-2px)' : (isDragging ? 'scale(0.98)' : 'none'),
                    boxShadow: isDragOver ? '0 8px 24px rgba(0,0,0,0.35)' : 'none',
                    transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'grab'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="drag-handle" title="Drag to rearrange" style={{ color: 'var(--color-muted)', display: 'flex', alignItems: 'center', cursor: 'grab' }}>
                        <GripVertical size={18} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', color: 'var(--color-paper)', fontVariantNumeric: 'tabular-nums' }}>
                        #{index + 1}
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <button 
                          className="order-arrow-btn" 
                          disabled={index === 0} 
                          onClick={(e) => { e.stopPropagation(); handleReorder('credential', index, index - 1); }}
                          title="Move Up"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button 
                          className="order-arrow-btn" 
                          disabled={index === credentials.length - 1} 
                          onClick={(e) => { e.stopPropagation(); handleReorder('credential', index, index + 1); }}
                          title="Move Down"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: '12px', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.category}</span>
                      <h3 style={{ margin: '2px 0 4px 0', fontSize: '16px', fontWeight: 600 }}>{c.title}</h3>
                      <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '13px' }}>{c.issuer ? `${c.issuer} · ` : ''}{c.year}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleOpenEdit('credential', c)} style={{ padding: '6px 14px', background: 'transparent', border: '1px solid var(--color-hairline)', color: 'var(--color-paper)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Edit</button>
                    <button onClick={() => setDeleteTarget({ type: 'credential', id: c.id, title: c.title })} style={{ padding: '6px 14px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Footer Tab */}
      {activeTab === 'footer' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Footer Settings Card */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2>Footer Main Settings</h2>
              <button onClick={() => handleOpenEdit('footer_settings', footerSettings)} style={{ padding: '8px 16px', background: 'var(--color-paper)', color: 'var(--color-bg)', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                Edit Footer Settings
              </button>
            </div>
            <div style={{ padding: '24px', border: '1px solid var(--color-hairline)', borderRadius: '12px', background: 'var(--color-glass)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Heading</span>
                <p style={{ margin: '2px 0 0 0', fontSize: '18px', fontWeight: 600 }}>{footerSettings?.heading || 'Stay Connected'}</p>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subtitle</span>
                <p style={{ margin: '2px 0 0 0', color: 'var(--color-muted)', fontSize: '14px' }}>{footerSettings?.subtitle || 'Have a project in mind or just want to say hi? Feel free to reach out across any of the platforms below.'}</p>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Copyright Notice</span>
                <p style={{ margin: '2px 0 0 0', fontSize: '14px' }}>{footerSettings?.copyright_text || '© 2026 CK Yong. All rights reserved.'}</p>
              </div>
            </div>
          </div>

          {/* Footer Links Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0 }}>Footer Links ({footerLinks.length})</h2>
                {renderOrderFeedback('footer')}
              </div>
              <button onClick={() => handleOpenAdd('footer')} style={{ padding: '8px 16px', background: 'var(--color-paper)', color: 'var(--color-bg)', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                + Add Footer Link
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {footerLinks.map((f, index) => {
                const isDragging = draggedItem?.type === 'footer' && draggedItem.index === index;
                const isDragOver = dragOverItem?.type === 'footer' && dragOverItem.index === index && !isDragging;

                return (
                  <div 
                    key={f.id}
                    draggable
                    onDragStart={(e) => {
                      setDraggedItem({ type: 'footer', index })
                      e.dataTransfer.effectAllowed = 'move'
                      e.dataTransfer.setData('text/plain', String(index))
                    }}
                    onDragOver={(e) => {
                      e.preventDefault()
                      e.dataTransfer.dropEffect = 'move'
                      if (dragOverItem?.index !== index || dragOverItem?.type !== 'footer') {
                        setDragOverItem({ type: 'footer', index })
                      }
                    }}
                    onDragLeave={() => {
                      if (dragOverItem?.index === index && dragOverItem?.type === 'footer') {
                        setDragOverItem(null)
                      }
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      if (draggedItem && draggedItem.type === 'footer') {
                        handleReorder('footer', draggedItem.index, index)
                      }
                      setDraggedItem(null)
                      setDragOverItem(null)
                    }}
                    onDragEnd={() => {
                      setDraggedItem(null)
                      setDragOverItem(null)
                    }}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '16px 20px', 
                      border: isDragOver ? '2px solid var(--color-paper)' : (isDragging ? '1px dashed var(--color-paper)' : '1px solid var(--color-hairline)'), 
                      borderRadius: '12px', 
                      background: isDragOver ? 'rgba(255,255,255,0.08)' : 'var(--color-glass)',
                      opacity: isDragging ? 0.35 : 1,
                      transform: isDragOver ? 'translateY(-2px)' : (isDragging ? 'scale(0.98)' : 'none'),
                      boxShadow: isDragOver ? '0 8px 24px rgba(0,0,0,0.35)' : 'none',
                      transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                      cursor: 'grab'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="drag-handle" title="Drag to rearrange" style={{ color: 'var(--color-muted)', display: 'flex', alignItems: 'center', cursor: 'grab' }}>
                          <GripVertical size={18} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', color: 'var(--color-paper)', fontVariantNumeric: 'tabular-nums' }}>
                          #{index + 1}
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <button 
                            className="order-arrow-btn" 
                            disabled={index === 0} 
                            onClick={(e) => { e.stopPropagation(); handleReorder('footer', index, index - 1); }}
                            title="Move Up"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button 
                            className="order-arrow-btn" 
                            disabled={index === footerLinks.length - 1} 
                            onClick={(e) => { e.stopPropagation(); handleReorder('footer', index, index + 1); }}
                            title="Move Down"
                          >
                            <ChevronDown size={14} />
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 600 }}>{f.label} <span style={{ fontSize: '12px', opacity: 0.6, fontWeight: 400 }}>({f.type})</span></h3>
                        <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '13px' }}>{f.url}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleOpenEdit('footer', f)} style={{ padding: '6px 14px', background: 'transparent', border: '1px solid var(--color-hairline)', color: 'var(--color-paper)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Edit</button>
                      <button onClick={() => setDeleteTarget({ type: 'footer', id: f.id, title: f.label })} style={{ padding: '6px 14px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Tab */}
      {activeTab === 'privacy' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2>Privacy Policy Content</h2>
            <button onClick={() => handleOpenEdit('privacy', privacy)} style={{ padding: '8px 16px', background: 'var(--color-paper)', color: 'var(--color-bg)', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              Edit Privacy Policy
            </button>
          </div>
          <div style={{ padding: '24px', border: '1px solid var(--color-hairline)', borderRadius: '12px', background: 'var(--color-glass)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Page Title</span>
              <h3 style={{ margin: '2px 0 0 0', fontSize: '20px' }}>{privacy?.title || 'Privacy Policy'}</h3>
            </div>
            <div style={{ display: 'flex', gap: '32px' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Updated</span>
                <p style={{ margin: '2px 0 0 0', fontSize: '14px' }}>{privacy?.last_updated || 'August 2026'}</p>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact Email</span>
                <p style={{ margin: '2px 0 0 0', fontSize: '14px' }}>{privacy?.contact_email || 'ckyong@kitabuild.com'}</p>
              </div>
            </div>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Policy Body Preview</span>
              <div style={{ marginTop: '8px', padding: '16px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-hairline)', fontSize: '13px', color: 'var(--color-muted)', maxHeight: '200px', overflowY: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                {privacy?.content || 'No custom privacy content set.'}
              </div>
            </div>
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
