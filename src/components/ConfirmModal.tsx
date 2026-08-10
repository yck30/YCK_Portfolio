'use client'

import { useEffect } from 'react'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDanger?: boolean
  isSubmitting?: boolean
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = true,
  isSubmitting = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'Enter') {
        onConfirm()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, onConfirm])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
        animation: 'modalFadeIn 200ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-bg)',
          border: '1px solid var(--color-hairline)',
          borderRadius: '16px',
          padding: '28px',
          maxWidth: '440px',
          width: '100%',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          color: 'var(--color-paper)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isDanger && (
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 'bold',
                flexShrink: 0,
              }}
            >
              !
            </div>
          )}
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-primary)' }}>
            {title}
          </h3>
        </div>

        <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '14px', lineHeight: 1.6 }}>
          {message}
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              border: '1px solid var(--color-hairline)',
              color: 'var(--color-paper)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              transition: 'transform 160ms ease-out, background 160ms ease-out',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            style={{
              padding: '8px 16px',
              background: isDanger ? '#dc2626' : 'var(--color-paper)',
              color: isDanger ? '#ffffff' : 'var(--color-bg)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              transition: 'transform 160ms ease-out, opacity 160ms ease-out',
              opacity: isSubmitting ? 0.7 : 1,
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {isSubmitting ? 'Deleting...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
