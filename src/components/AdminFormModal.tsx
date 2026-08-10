import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { ImageManager } from '@/components/ImageManager'

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
  type: 'project' | 'blog'; 
  initialData: any; 
  onSuccess: (data: any) => void;
}) {
  const supabase = createClient()
  const router = useRouter()
  const [formData, setFormData] = useState(initialData || {})
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      let result;
      const table = type === 'project' ? 'projects' : 'blog_posts'
      
      // Parse features string back to array if it's a project
      const dataToSave = { ...formData }
      if (type === 'project' && typeof dataToSave.features === 'string') {
        dataToSave.features = dataToSave.features.split(',').map((f: string) => f.trim()).filter((f: string) => f)
      }
      if (type === 'blog' && typeof dataToSave.tags === 'string') {
        dataToSave.tags = dataToSave.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t)
      }

      // Ensure id/slug match depending on type
      if (type === 'project') {
         dataToSave.id = formData.id || formData.slug;
         delete dataToSave.slug;
      } else {
         dataToSave.slug = formData.slug || formData.id;
         dataToSave.id = dataToSave.slug;
      }

      if (mode === 'add') {
        result = await supabase.from(table).insert(dataToSave).select().single()
      } else {
        result = await supabase.from(table).update(dataToSave).eq('id', formData.id).select().single()
      }

      if (result.error) throw result.error
      onSuccess(result.data)
      onClose()
      router.refresh()
    } catch (error: any) {
      alert('Error saving: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ background: 'var(--color-bg)', padding: '32px', borderRadius: '12px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--color-hairline)' }}>
        <h2 style={{ marginTop: 0 }}>{mode === 'add' ? 'Add' : 'Edit'} {type === 'project' ? 'Project' : 'Blog Post'}</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>ID / Slug</label>
            <input required name="id" value={formData.id || formData.slug || ''} onChange={(e) => {
              setFormData({ ...formData, id: e.target.value, slug: e.target.value })
            }} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} disabled={mode === 'edit'} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Title</label>
            <input required name="title" value={formData.title || ''} onChange={handleChange} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
          </div>

          {type === 'project' && (
            <>
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
              
              <ImageManager
                images={formData.images || []}
                onChange={(images) => setFormData({ ...formData, images })}
                label="Project Screenshots & Photos"
              />
            </>
          )}

          {type === 'blog' && (
             <>
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

              <ImageManager
                images={formData.images || []}
                onChange={(images) => setFormData({ ...formData, images })}
                label="Blog Post Photos / Images (displayed on detail page)"
              />
             </>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Detailed Content (Markdown)</label>
            <textarea name="content" value={formData.content || ''} onChange={handleChange} rows={8} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', fontFamily: 'monospace', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
            <button type="button" onClick={onClose} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--color-hairline)', color: 'var(--color-paper)', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={isSubmitting} style={{ padding: '8px 16px', background: 'var(--color-paper)', border: 'none', color: 'var(--color-bg)', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
