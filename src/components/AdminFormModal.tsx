import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { ImageManager } from '@/components/ImageManager'
import { CustomLinksEditor } from '@/components/CustomLinksEditor'
import { parseCustomLinks, serializeCustomLinks } from '@/utils/links'
import { revalidateCMSContent } from '@/app/actions/revalidate'

export type ContentType = 'project' | 'blog' | 'hero' | 'about' | 'journey' | 'pipeline' | 'credential' | 'footer' | 'footer_settings' | 'privacy';

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
    
    // Set default initial state for single-record tables or special formatting
    if (type === 'about') {
      const bioText = Array.isArray(initialData?.bio) ? initialData.bio.join('\n\n') : (initialData?.bio || '')
      setFormData({ id: 'main', headline: '', ...initialData, bioText })
    } else if (type === 'hero' || type === 'privacy' || type === 'footer_settings') {
      setFormData({ id: 'main', ...initialData })
    } else if (type === 'project') {
      const links = parseCustomLinks(initialData?.link)
      setFormData({ ...initialData, links })
    } else if (type === 'pipeline') {
      const links = parseCustomLinks(initialData?.link, initialData?.cta)
      setFormData({ ...initialData, links })
    } else if (type === 'blog') {
      const links = parseCustomLinks(initialData?.link)
      setFormData({ ...initialData, links })
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      let result;
      const table = getTableName(type)
      let dataToSave: any = {}

      if (type === 'project') {
        const features = typeof formData.features === 'string'
          ? formData.features.split(',').map((f: string) => f.trim()).filter(Boolean)
          : (Array.isArray(formData.features) ? formData.features : [])
        
        const serializedLink = serializeCustomLinks(formData.links || []) || formData.link || ''

        dataToSave = {
          id: formData.id,
          title: formData.title || '',
          role: formData.role || '',
          link: serializedLink,
          description: formData.description || '',
          content: formData.content || '',
          features: features,
          images: Array.isArray(formData.images) ? formData.images : [],
          order_index: typeof formData.order_index === 'number' ? formData.order_index : parseInt(formData.order_index, 10) || 0
        }
      } else if (type === 'blog') {
        const tags = typeof formData.tags === 'string'
          ? formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
          : (Array.isArray(formData.tags) ? formData.tags : [])
        
        const serializedLink = serializeCustomLinks(formData.links || []) || formData.link || null

        dataToSave = {
          id: formData.id,
          slug: formData.slug || formData.id,
          title: formData.title || '',
          excerpt: formData.excerpt || '',
          read_time: formData.read_time || '',
          tags: tags,
          link: serializedLink,
          content: formData.content || '',
          images: Array.isArray(formData.images) ? formData.images : []
        }
      } else if (type === 'hero') {
        dataToSave = {
          id: 'main',
          eyebrow: formData.eyebrow || '',
          line1: formData.line1 || '',
          line2: formData.line2 || '',
          line3: formData.line3 || '',
          subtitle: formData.subtitle || '',
          location_badge: formData.location_badge || '',
          scroll_badge: formData.scroll_badge || '',
          copyright_text: formData.copyright_text || '',
          images: Array.isArray(formData.images) ? formData.images : [],
          updated_at: new Date().toISOString()
        }
      } else if (type === 'about') {
        const bio = (formData.bioText || '')
          .split(/\n\n+/)
          .map((p: string) => p.trim())
          .filter(Boolean)

        dataToSave = {
          id: 'main',
          headline: formData.headline || '',
          bio: bio.length > 0 ? bio : (Array.isArray(formData.bio) ? formData.bio : []),
          updated_at: new Date().toISOString()
        }
      } else if (type === 'journey') {
        dataToSave = {
          id: formData.id,
          year: formData.year || '',
          title: formData.title || '',
          company: formData.company || '',
          description: formData.description || '',
          link: formData.link ? formData.link.trim() : null,
          order_index: typeof formData.order_index === 'number' ? formData.order_index : parseInt(formData.order_index, 10) || 0
        }
      } else if (type === 'pipeline') {
        const serializedLink = serializeCustomLinks(formData.links || []) || formData.link || null
        const primaryCta = (formData.links && formData.links.length > 0 && formData.links[0].label)
          ? formData.links[0].label
          : (formData.cta ? formData.cta.trim() : null)

        dataToSave = {
          id: formData.id,
          title: formData.title || '',
          description: formData.description || '',
          content: formData.content ? formData.content.trim() : null,
          status: formData.status || 'Coming Soon',
          link: serializedLink,
          cta: primaryCta,
          order_index: typeof formData.order_index === 'number' ? formData.order_index : parseInt(formData.order_index, 10) || 0
        }
      } else if (type === 'credential') {
        dataToSave = {
          id: formData.id,
          category: formData.category || '',
          title: formData.title || '',
          issuer: formData.issuer ? formData.issuer.trim() : null,
          year: formData.year || '',
          order_index: typeof formData.order_index === 'number' ? formData.order_index : parseInt(formData.order_index, 10) || 0
        }
      } else if (type === 'footer') {
        dataToSave = {
          id: formData.id,
          label: formData.label || '',
          url: formData.url || '',
          type: formData.type || 'social',
          order_index: typeof formData.order_index === 'number' ? formData.order_index : parseInt(formData.order_index, 10) || 0
        }
      } else if (type === 'footer_settings') {
        dataToSave = {
          id: 'main',
          heading: formData.heading || '',
          subtitle: formData.subtitle || '',
          copyright_text: formData.copyright_text || '',
          updated_at: new Date().toISOString()
        }
      } else if (type === 'privacy') {
        dataToSave = {
          id: 'main',
          title: formData.title || '',
          last_updated: formData.last_updated || '',
          contact_email: formData.contact_email || '',
          content: formData.content || '',
          updated_at: new Date().toISOString()
        }
      }

      if (mode === 'add') {
        result = await supabase.from(table).insert(dataToSave).select().single()
      } else {
        result = await supabase.from(table).upsert(dataToSave).select().single()
      }

      // If content or link column is missing in Supabase schema, retry without them and prompt
      if (result.error && (result.error.message?.includes("'content' column") || result.error.message?.includes("'link' column"))) {
        const missingCol = result.error.message?.includes("'content' column") ? 'content' : 'link';
        delete dataToSave[missingCol];
        if (mode === 'add') {
          result = await supabase.from(table).insert(dataToSave).select().single();
        } else {
          result = await supabase.from(table).upsert(dataToSave).select().single();
        }
        if (!result.error) {
          alert("Saved successfully! Note: To save the '" + missingCol + "' field in database, please run this in Supabase SQL editor: ALTER TABLE public." + table + " ADD COLUMN IF NOT EXISTS " + missingCol + " text;");
        }
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
      case 'hero': return 'Hero Section'
      case 'about': return 'About Section'
      case 'journey': return 'Journey Entry'
      case 'pipeline': return 'KitaBuild Item'
      case 'credential': return 'Credential'
      case 'footer': return 'Footer Link'
      case 'footer_settings': return 'Footer Settings'
      case 'privacy': return 'Privacy Policy'
    }
  }

  const isSingleRecordType = type === 'hero' || type === 'about' || type === 'privacy' || type === 'footer_settings';

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ background: 'var(--color-bg)', padding: '32px', borderRadius: '12px', width: '100%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--color-hairline)' }}>
        <h2 style={{ marginTop: 0 }}>{mode === 'add' ? 'Add' : 'Edit'} {getTitleLabel()}</h2>
        
        <form id="admin-form-element" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {!isSingleRecordType && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>ID / Key</label>
              <input required name="id" value={formData.id || (type === 'blog' ? formData.slug : '') || ''} onChange={(e) => {
                const val = e.target.value;
                if (type === 'blog') {
                  setFormData({ ...formData, id: val, slug: val });
                } else {
                  setFormData({ ...formData, id: val });
                }
              }} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} disabled={mode === 'edit'} />
            </div>
          )}

          {/* Hero Form */}
          {type === 'hero' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Eyebrow Badge Text</label>
                <input required name="eyebrow" value={formData.eyebrow || ''} onChange={handleChange} placeholder="e.g. Web Developer & AI Builder" style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Headline Line 1</label>
                  <input required name="line1" value={formData.line1 || ''} onChange={handleChange} placeholder="Strategy," style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Headline Line 2</label>
                  <input required name="line2" value={formData.line2 || ''} onChange={handleChange} placeholder="design &" style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Headline Line 3 (Italicized)</label>
                  <input required name="line3" value={formData.line3 || ''} onChange={handleChange} placeholder="motion." style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Subtitle Description</label>
                <textarea required name="subtitle" value={formData.subtitle || ''} onChange={handleChange} rows={3} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Location Badge</label>
                  <input name="location_badge" value={formData.location_badge || ''} onChange={handleChange} placeholder="Based in Malaysia" style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Scroll Badge</label>
                  <input name="scroll_badge" value={formData.scroll_badge || ''} onChange={handleChange} placeholder="Scroll to explore" style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Copyright Text</label>
                  <input name="copyright_text" value={formData.copyright_text || ''} onChange={handleChange} placeholder="© 2026 CK Yong" style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
                </div>
              </div>
              <ImageManager
                images={formData.images || []}
                onChange={(images) => setFormData({ ...formData, images })}
                label="Hero Slider Photos / Portraits"
              />
            </>
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
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Short Description (Homepage Bento Card)</label>
                <textarea required name="description" value={formData.description || ''} onChange={handleChange} rows={3} placeholder="Brief 1-2 sentence overview for the homepage card..." style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Details Page Full Description / Case Study Content (Markdown)</label>
                <span style={{ fontSize: '12px', color: 'var(--color-muted)' }}>Detailed text, project background, or case study displayed on the project page (<code>/projects/[slug]</code>)</span>
                <textarea name="content" value={formData.content || ''} onChange={handleChange} rows={7} placeholder="Write detailed background, case study overview, problem/solution, architecture, or outcomes..." style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', fontFamily: 'monospace', outline: 'none', lineHeight: 1.5 }} />
              </div>
              <CustomLinksEditor
                links={formData.links || []}
                onChange={(links) => setFormData({ ...formData, links, link: serializeCustomLinks(links) || '' })}
                label="Project URLs & Descriptions"
                urlPlaceholder="https://your-project.com"
                descPlaceholder="e.g. Live Demo / Source Code / Web App"
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Key Features (comma separated)</label>
                <textarea name="features" value={typeof formData.features === 'string' ? formData.features : (formData.features?.join(', ') || '')} onChange={handleChange} rows={2} placeholder="Feature 1, Feature 2, Feature 3..." style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
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
              <CustomLinksEditor
                links={formData.links || []}
                onChange={(links) => setFormData({ ...formData, links, link: serializeCustomLinks(links) || '' })}
                label="Resource & Reference URLs (with Descriptions)"
                urlPlaceholder="https://..."
                descPlaceholder="e.g. Live Demo / Source Code / Original Paper / Documentation"
              />
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

          {/* Privacy Policy Form */}
          {type === 'privacy' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Page Title</label>
                <input required name="title" value={formData.title || ''} onChange={handleChange} placeholder="Privacy Policy" style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Last Updated Date</label>
                  <input required name="last_updated" value={formData.last_updated || ''} onChange={handleChange} placeholder="e.g. August 2026" style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Contact Email</label>
                  <input required name="contact_email" value={formData.contact_email || ''} onChange={handleChange} placeholder="ckyong@kitabuild.com" style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Policy Body Content (Markdown format)</label>
                <span style={{ fontSize: '12px', color: 'var(--color-muted)' }}>Use <code>## Section Header</code>, <code>### Subheader</code>, and <code>**bold text**</code></span>
                <textarea required name="content" value={formData.content || ''} onChange={handleChange} rows={12} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', fontFamily: 'monospace', outline: 'none', lineHeight: 1.5 }} />
              </div>
            </>
          )}

          {/* Footer Settings Form */}
          {type === 'footer_settings' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Footer Heading</label>
                <input required name="heading" value={formData.heading || ''} onChange={handleChange} placeholder="Stay Connected" style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Footer Subtitle / Description</label>
                <textarea required name="subtitle" value={formData.subtitle || ''} onChange={handleChange} rows={3} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Copyright Text</label>
                <input required name="copyright_text" value={formData.copyright_text || ''} onChange={handleChange} placeholder="© 2026 CK Yong. All rights reserved." style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
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
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Short Description (Homepage Card)</label>
                <textarea required name="description" value={formData.description || ''} onChange={handleChange} rows={3} placeholder="Brief summary of what this pipeline item is..." style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>Extended / Detailed Description (Optional)</label>
                <textarea name="content" value={formData.content || ''} onChange={handleChange} rows={5} placeholder="Additional details, scope, launch notes, or target audience..." style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-glass)', color: 'var(--color-paper)', border: '1px solid var(--color-hairline)', outline: 'none', lineHeight: 1.5 }} />
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
              <CustomLinksEditor
                links={formData.links || []}
                onChange={(links) => setFormData({ ...formData, links, link: serializeCustomLinks(links) || '', cta: links[0]?.label || '' })}
                label="Pipeline Action URLs & Descriptions"
                urlPlaceholder="https://kitabuild.com/..."
                descPlaceholder="e.g. Explore the Map / Visit Website / Enquire"
              />
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
