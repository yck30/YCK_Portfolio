'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export type ImageItem = {
  src: string;
  position?: string;
  fit?: 'cover' | 'contain' | string;
  filePath?: string;
}

interface ImageManagerProps {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
  label?: string;
  bucketName?: string;
}

export function ImageManager({
  images = [],
  onChange,
  label = "Uploaded Photos / Screenshots",
  bucketName = "portfolio-images"
}: ImageManagerProps) {
  const [uploading, setUploading] = useState(false)
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null)
  const [deleteTargetIndex, setDeleteTargetIndex] = useState<number | null>(null)
  const supabase = createClient()

  // Helper to extract storage path from full Supabase CDN URL
  const getStoragePathFromUrl = (url: string): string | null => {
    if (!url) return null
    const marker = `/storage/v1/object/public/${bucketName}/`
    if (url.includes(marker)) {
      return url.split(marker)[1]
    }
    return null
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const uploadedItems: ImageItem[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file)

        if (uploadError) {
          throw uploadError
        }

        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath)

        uploadedItems.push({
          src: publicUrl,
          position: 'center 15%',
          fit: 'contain',
          filePath: filePath
        })
      }

      onChange([...images, ...uploadedItems])
    } catch (error: any) {
      alert('Error uploading image: ' + (error.message || error))
    } finally {
      setUploading(false)
      // reset file input
      e.target.value = ''
    }
  }

  const confirmDelete = async () => {
    if (deleteTargetIndex === null) return
    const index = deleteTargetIndex
    const itemToDelete = images[index]
    if (!itemToDelete) {
      setDeleteTargetIndex(null)
      return
    }

    setDeletingIndex(index)
    setDeleteTargetIndex(null)

    try {
      const pathToDelete = itemToDelete.filePath || getStoragePathFromUrl(itemToDelete.src)
      
      if (pathToDelete) {
        // Attempt to remove from Supabase Storage bucket
        const { error } = await supabase.storage
          .from(bucketName)
          .remove([pathToDelete])

        if (error) {
          console.warn('Storage deletion warning:', error.message)
        }
      }

      // Filter out from local state
      const updated = images.filter((_, idx) => idx !== index)
      onChange(updated)
    } catch (error: any) {
      console.error('Error deleting image:', error)
      // Still remove from state if user wants to detach broken image
      const updated = images.filter((_, idx) => idx !== index)
      onChange(updated)
    } finally {
      setDeletingIndex(null)
    }
  }

  const handlePositionChange = (index: number, newPosition: string) => {
    const updated = images.map((img, idx) => {
      if (idx === index) {
        return { ...img, position: newPosition }
      }
      return img
    })
    onChange(updated)
  }

  const handleFitChange = (index: number, newFit: string) => {
    const updated = images.map((img, idx) => {
      if (idx === index) {
        return { ...img, fit: newFit }
      }
      return img
    })
    onChange(updated)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-paper)' }}>{label}</label>

      {/* Upload button area */}
      <div style={{
        border: '2px dashed var(--color-hairline)',
        borderRadius: '8px',
        padding: '16px',
        textAlign: 'center',
        background: 'var(--color-glass)',
        cursor: uploading ? 'not-allowed' : 'pointer',
        transition: 'border-color 0.2s ease'
      }}>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          disabled={uploading}
          style={{ display: 'none' }}
          id="image-manager-file-input"
        />
        <label htmlFor="image-manager-file-input" style={{ cursor: uploading ? 'not-allowed' : 'pointer', display: 'block' }}>
          <div style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>
            {uploading ? '⏳ Uploading files to storage...' : '📁 Click or Drag files to upload photos'}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '4px', display: 'block' }}>
            Supports PNG, JPG, WEBP, GIF (Default: Full Uncropped Fit)
          </span>
        </label>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '12px',
          marginTop: '8px'
        }}>
          {images.map((img, idx) => (
            <div
              key={idx}
              style={{
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid var(--color-hairline)',
                background: '#0a0a0a',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Image Preview */}
              <div style={{ position: 'relative', width: '100%', height: '110px', background: 'rgba(255,255,255,0.03)' }}>
                <img
                  src={img.src}
                  alt={`Photo ${idx + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: (img.fit as any) || 'contain',
                    objectPosition: img.position || 'center 15%'
                  }}
                />
                
                {/* Delete Button Overlay */}
                <button
                  type="button"
                  onClick={() => setDeleteTargetIndex(idx)}
                  disabled={deletingIndex === idx}
                  title="Delete Photo"
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    background: 'rgba(220, 38, 38, 0.9)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    transition: 'transform 0.16s ease-out, background 0.16s ease-out',
                    zIndex: 2
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {deletingIndex === idx ? '...' : '🗑 Delete'}
                </button>
              </div>

              {/* Fit & Position selector controls */}
              <div style={{
                padding: '8px',
                background: 'var(--color-bg)',
                borderTop: '1px solid var(--color-hairline)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontSize: '11px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--color-muted)' }}>Fit:</span>
                  <select
                    value={img.fit || 'contain'}
                    onChange={(e) => handleFitChange(idx, e.target.value)}
                    style={{
                      background: 'var(--color-glass)',
                      color: 'var(--color-paper)',
                      border: '1px solid var(--color-hairline)',
                      borderRadius: '4px',
                      fontSize: '11px',
                      padding: '2px 4px',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    <option value="contain" style={{ background: 'var(--color-bg)', color: 'var(--color-paper)' }}>Full Original (Contain)</option>
                    <option value="cover" style={{ background: 'var(--color-bg)', color: 'var(--color-paper)' }}>Crop to Fill (Cover)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--color-muted)' }}>Align:</span>
                  <select
                    value={img.position || 'center 15%'}
                    onChange={(e) => handlePositionChange(idx, e.target.value)}
                    style={{
                      background: 'var(--color-glass)',
                      color: 'var(--color-paper)',
                      border: '1px solid var(--color-hairline)',
                      borderRadius: '4px',
                      fontSize: '11px',
                      padding: '2px 4px',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    <option value="center 15%" style={{ background: 'var(--color-bg)', color: 'var(--color-paper)' }}>Top Focus (15%)</option>
                    <option value="center 25%" style={{ background: 'var(--color-bg)', color: 'var(--color-paper)' }}>Upper-Center (25%)</option>
                    <option value="center" style={{ background: 'var(--color-bg)', color: 'var(--color-paper)' }}>Center</option>
                    <option value="center 85%" style={{ background: 'var(--color-bg)', color: 'var(--color-paper)' }}>Bottom Focus (85%)</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteTargetIndex !== null}
        title="Delete Photo"
        message="Are you sure you want to permanently delete this photo from storage?"
        confirmText="Delete"
        isDanger={true}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTargetIndex(null)}
      />
    </div>
  )
}
