'use client'

import { parseCustomLinks, formatDisplayUrl } from '@/utils/links'

export function ProjectUrlLink({ link }: { link: any }) {
  const links = parseCustomLinks(link);
  if (links.length === 0) return null;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
      {links.map((item, idx) => {
        const fullUrl = item.url.startsWith('http') ? item.url : `https://${item.url}`;
        const displayLabel = item.label || formatDisplayUrl(item.url);

        return (
          <span 
            key={idx}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(fullUrl, '_blank');
            }}
            style={{ 
              fontSize: '13px', 
              color: 'var(--color-muted)', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '4px',
              cursor: 'pointer',
              position: 'relative',
              zIndex: 10,
              padding: '2px 8px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--color-hairline)',
              transition: 'all 0.2s ease',
              textDecoration: 'none'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = 'var(--color-paper)';
              e.currentTarget.style.borderColor = 'var(--color-paper)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = 'var(--color-muted)';
              e.currentTarget.style.borderColor = 'var(--color-hairline)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
            title={item.label ? `${item.label}: ${fullUrl}` : `Visit ${fullUrl}`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            {displayLabel}
          </span>
        );
      })}
    </div>
  )
}
