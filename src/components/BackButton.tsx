import Link from 'next/link';

export function BackButton({ href, label }: { href: string; label: string }) {
  return (
    <Link 
      href={href}
      className="back-button"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        color: 'var(--muted)',
        textDecoration: 'none',
        marginBottom: '2rem',
        fontSize: '0.95rem',
        fontWeight: 500,
        transition: 'all 0.2s ease',
      }}
    >
      <svg 
        width="18" 
        height="18" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={{ transition: 'transform 0.2s ease' }}
      >
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      {label}
      <style>{`
        .back-button:hover {
          color: #fff !important;
        }
        .back-button:hover svg {
          transform: translateX(-4px);
        }
      `}</style>
    </Link>
  );
}
