'use client'

import { Plus, Trash2, ChevronUp, ChevronDown, ExternalLink, Link as LinkIcon } from 'lucide-react'
import { CustomLink } from '@/utils/links'

interface CustomLinksEditorProps {
  links: CustomLink[];
  onChange: (links: CustomLink[]) => void;
  label?: string;
  urlPlaceholder?: string;
  descPlaceholder?: string;
}

export function CustomLinksEditor({
  links,
  onChange,
  label = 'Project Links & URLs',
  urlPlaceholder = 'https://example.com',
  descPlaceholder = 'e.g. Live Demo, Explore Map, GitHub Repo'
}: CustomLinksEditorProps) {
  const currentLinks = Array.isArray(links) ? links : [];

  const handleAdd = () => {
    onChange([...currentLinks, { url: '', label: '' }]);
  };

  const handleRemove = (index: number) => {
    const updated = [...currentLinks];
    updated.splice(index, 1);
    onChange(updated);
  };

  const handleChange = (index: number, field: 'url' | 'label', value: string) => {
    const updated = currentLinks.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onChange(updated);
  };

  const handleMove = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= currentLinks.length) return;
    const updated = [...currentLinks];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onChange(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <LinkIcon size={16} />
          {label} ({currentLinks.length})
        </label>
        <button
          type="button"
          onClick={handleAdd}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--color-hairline)',
            color: 'var(--color-paper)',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: 'pointer',
            fontWeight: 500,
            transition: 'background 0.15s ease'
          }}
        >
          <Plus size={14} /> Add URL
        </button>
      </div>

      {currentLinks.length === 0 ? (
        <div 
          onClick={handleAdd}
          style={{
            padding: '16px',
            border: '1px dashed var(--color-hairline)',
            borderRadius: '8px',
            textAlign: 'center',
            color: 'var(--color-muted)',
            fontSize: '13px',
            cursor: 'pointer',
            background: 'rgba(255,255,255,0.02)'
          }}
        >
          No links added yet. Click <strong>+ Add URL</strong> to add multiple URLs with custom descriptions.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {currentLinks.map((link, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--color-hairline)',
                borderRadius: '8px'
              }}
            >
              {/* Order buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, idx - 1)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-muted)',
                    cursor: idx === 0 ? 'not-allowed' : 'pointer',
                    opacity: idx === 0 ? 0.3 : 0.8,
                    padding: 0
                  }}
                  title="Move Up"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  type="button"
                  disabled={idx === currentLinks.length - 1}
                  onClick={() => handleMove(idx, idx + 1)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-muted)',
                    cursor: idx === currentLinks.length - 1 ? 'not-allowed' : 'pointer',
                    opacity: idx === currentLinks.length - 1 ? 0.3 : 0.8,
                    padding: 0
                  }}
                  title="Move Down"
                >
                  <ChevronDown size={14} />
                </button>
              </div>

              {/* Inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '8px', flex: 1 }}>
                <input
                  type="text"
                  value={link.label || ''}
                  onChange={(e) => handleChange(idx, 'label', e.target.value)}
                  placeholder={descPlaceholder}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: 'var(--color-glass)',
                    color: 'var(--color-paper)',
                    border: '1px solid var(--color-hairline)',
                    outline: 'none',
                    fontSize: '13px'
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="text"
                    value={link.url || ''}
                    onChange={(e) => handleChange(idx, 'url', e.target.value)}
                    placeholder={urlPlaceholder}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      borderRadius: '6px',
                      background: 'var(--color-glass)',
                      color: 'var(--color-paper)',
                      border: '1px solid var(--color-hairline)',
                      outline: 'none',
                      fontSize: '13px'
                    }}
                  />
                  {link.url && link.url.trim() !== '' && (
                    <a
                      href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Preview URL"
                      style={{ color: 'var(--color-muted)', display: 'flex', alignItems: 'center' }}
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>

              {/* Delete button */}
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  borderRadius: '6px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0
                }}
                title="Remove URL"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
