import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { ImageManager } from '@/components/ImageManager'
import { revalidateCMSContent } from '@/app/actions/revalidate'

export type ContentType = 'project' | 'blog' | 'about' | 'journey' | 'pipeline' | 'credential' | 'footer';

export function AdminFormModal({ 
  isOpen, 
  onClose, 
  mode, 
  type, 
  initialData, 
  onSuccess 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  mode: 'add' | 'edit'; 
  type: ContentType; 
  initialData: any; 
  onSuccess: (data: any) => void;
}) {
  const supabase = createClient()
  const router = useRouter()
  const [formData, setFormData] = useState(initialData || {})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    
    // Set default initial state for 'about' or formatting arrays
    if (type === 'about') {
      const bioText = Array.isArray(initialData?.bio) ? initialData.bio.join('\n\n') : (initialData?.bio || '')
      setFormData({ id: 'main', headline: '', ...initialData, bioText })
    } else {
      setFormData(initialData || {})
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const formElement = document.getElementById('admin-form-element') as HTMLFormElement
        if (formElement) {
          formElement.requestSubmit()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, initialData, type])

  if (!isOpen) return null

  const handleChange = (e: any) => {
    const { name, value, type: inputType } = e.target;
    setFormData({ 
      ...formData, 
      [name]: inputType === 'number' ? parseInt(value) || 0 : value 
    })
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      let result;
      const table = getTableName(type)
      const dataToSave = { ...formData }

      if (type === 'project') {
        if (typeof dataToSave.features === 'string') {
          dataToSave.features = dataToSave.features.split(',').map((f: string) => f.trim()).filter((f: string) => f)
        }
        delete dataToSave.slug;
      }

      if (type === 'blog') {
        if (typeof dataToSave.tags === 'string') {
          dataToSave.tags = dataToSave.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t)
        }
      }

      if (type === 'about') {
        dataToSave.id = 'main';
        dataToSave.bio = (dataToSave.bioText || '').split(/\n\n+/).map((p: string) => p.trim()).filter((p: string) => p);
        delete dataToSave.bioText;
        dataToSave.updated_at = new Date().toISOString();
      }

      if (mode === 'add') {
        result = await supabase.from(table).insert(dataToSave).select().single()
      } else {
        result = await supabase.from(table).update(dataToSave).eq('id', formData.id).select().single()
      }

      if (result.error) throw result.error
      onSuccess(result.data)
      await revalidateCMSContent()
      onClose()
      router.refresh()
    } catch (error: any) {
      alert('Error saving: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTitleLabel = () => {
    switch (type) {
      case 'project': return 'Project'
      case 'blog': return 'Blog Post'
      case 'about': return 'About Section'
      case 'journey': return 'Journey Entry'
      case 'pipeline': return 'KitaBuild Item'
      case 'credential': return 'Credential'
      case 'footer': return 'Footer Link'
    }
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ background: 'var(--color-bg)', padding: '32px', borderRadius: '12px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--color-hairline)' }}>
        <h2 style={{ marginTop: 0 }}>{mode === 'add' ? 'Add' : 'Edit'} {getTitleLabel()}</h2>
        
        <form id="admin-form-element" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {type !== 'about' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>ID / Key</label>
              <input required name="id" value={formData.id || formData.slug || ''} onChange={(e) => {
                setFormData({ ...formData, id: e.target.value, slug: e.target.value })
              }} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} disabled={mode === 'edit'} />
            </div>
          )}

          {/* Project Form */}
          {type === 'project' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Title</label>
                <input required name="title" value={formData.title || ''} onChange={handleChange} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Role</label>
                <input required name="role" value={formData.role || ''} onChange={handleChange} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Link (URL)</label>
                <input required name="link" value={formData.link || ''} onChange={handleChange} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Short Description (Main Page)</label>
                <textarea required name="description" value={formData.description || ''} onChange={handleChange} rows={3} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Features (comma separated)</label>
                <textarea name="features" value={typeof formData.features === 'string' ? formData.features : (formData.features?.join(', ') || '')} onChange={handleChange} rows={2} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Order Index</label>
                <input type="number" name="order_index" value={formData.order_index ?? 0} onChange={handleChange} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <ImageManager
                images={formData.images || []}
                onChange={(images) => setFormData({ ...formData, images })}
                label="Project Screenshots & Photos"
              />
            </>
          )}

          {/* Blog Form */}
          {type === 'blog' && (
             <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Title</label>
                <input required name="title" value={formData.title || ''} onChange={handleChange} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Excerpt</label>
                <textarea required name="excerpt" value={formData.excerpt || ''} onChange={handleChange} rows={2} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Read Time (e.g. 5 min read)</label>
                <input required name="read_time" value={formData.read_time || ''} onChange={handleChange} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Tags (comma separated)</label>
                <input name="tags" value={typeof formData.tags === 'string' ? formData.tags : (formData.tags?.join(', ') || '')} onChange={handleChange} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Detailed Content (Markdown)</label>
                <textarea name="content" value={formData.content || ''} onChange={handleChange} rows={8} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', fontFamily: 'monospace', outline: 'none' }} />
              </div>
              <ImageManager
                images={formData.images || []}
                onChange={(images) => setFormData({ ...formData, images })}
                label="Blog Post Photos / Images (displayed on detail page)"
              />
             </>
          )}

          {/* About Form */}
          {type === 'about' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Main Headline</label>
                <input required name="headline" value={formData.headline || ''} onChange={handleChange} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Bio Paragraphs (Separate paragraphs with a blank line)</label>
                <textarea required name="bioText" value={formData.bioText || ''} onChange={handleChange} rows={6} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none', lineHeight: 1.5 }} />
              </div>
            </>
          )}

          {/* Journey Form */}
          {type === 'journey' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Year / Timeline (e.g., 2026–Present)</label>
                <input required name="year" value={formData.year || ''} onChange={handleChange} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Role / Title</label>
                <input required name="title" value={formData.title || ''} onChange={handleChange} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Organization / Company</label>
                <input required name="company" value={formData.company || ''} onChange={handleChange} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Description</label>
                <textarea required name="description" value={formData.description || ''} onChange={handleChange} rows={3} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Website Link (Optional)</label>
                <input name="link" value={formData.link || ''} onChange={handleChange} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Order Index</label>
                <input type="number" name="order_index" value={formData.order_index ?? 0} onChange={handleChange} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
            </>
          )}

          {/* Pipeline Form */}
          {type === 'pipeline' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Project Title</label>
                <input required name="title" value={formData.title || ''} onChange={handleChange} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Description</label>
                <textarea required name="description" value={formData.description || ''} onChange={handleChange} rows={3} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Status</label>
                <select name="status" value={formData.status || 'Coming Soon'} onChange={handleChange} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }}>
                  <option value="LIVE" style={{ background: '#1c1c1e' }}>LIVE</option>
                  <option value="Available Now" style={{ background: '#1c1c1e' }}>Available Now</option>
                  <option value="Ongoing" style={{ background: '#1c1c1e' }}>Ongoing</option>
                  <option value="Coming Soon" style={{ background: '#1c1c1e' }}>Coming Soon</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>URL Link (Optional)</label>
                <input name="link" value={formData.link || ''} onChange={handleChange} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>CTA Button Text (Optional)</label>
                <input name="cta" value={formData.cta || ''} onChange={handleChange} placeholder="e.g. Explore the Map" style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Order Index</label>
                <input type="number" name="order_index" value={formData.order_index ?? 0} onChange={handleChange} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
            </>
          )}

          {/* Credential Form */}
          {type === 'credential' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Category Name (Freeform string)</label>
                <input required name="category" value={formData.category || ''} onChange={handleChange} placeholder="e.g. Academic & Research" style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Title</label>
                <input required name="title" value={formData.title || ''} onChange={handleChange} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Issuer (Optional)</label>
                <input name="issuer" value={formData.issuer || ''} onChange={handleChange} placeholder="e.g. Universiti Malaysia Sabah" style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Year</label>
                <input required name="year" value={formData.year || ''} onChange={handleChange} placeholder="e.g. 2026" style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Order Index</label>
                <input type="number" name="order_index" value={formData.order_index ?? 0} onChange={handleChange} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
            </>
          )}

          {/* Footer Link Form */}
          {type === 'footer' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Label</label>
                <input required name="label" value={formData.label || ''} onChange={handleChange} placeholder="e.g. Email / LinkedIn" style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>URL / Link</label>
                <input required name="url" value={formData.url || ''} onChange={handleChange} placeholder="e.g. mailto:... or https://..." style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Link Type</label>
                <select name="type" value={formData.type || 'social'} onChange={handleChange} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }}>
                  <option value="contact" style={{ background: '#1c1c1e' }}>Contact Link (e.g. Email, WhatsApp)</option>
                  <option value="social" style={{ background: '#1c1c1e' }}>Social Media Link (e.g. GitHub, LinkedIn)</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Order Index</label>
                <input type="number" name="order_index" value={formData.order_index ?? 0} onChange={handleChange} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-muted)' }}>💡 Press Esc to cancel · Ctrl+Enter to save</span>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="button" 
                onClick={onClose} 
                style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--color-hairline)', color: 'var(--color-paper)', borderRadius: '6px', cursor: 'pointer', transition: 'transform 160ms ease-out' }}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting} 
                style={{ padding: '8px 16px', background: 'var(--color-paper)', border: 'none', color: 'var(--color-bg)', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, transition: 'transform 160ms ease-out, opacity 160ms ease-out', opacity: isSubmitting ? 0.7 : 1 }}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
