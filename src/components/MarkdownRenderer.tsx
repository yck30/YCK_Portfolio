import React from 'react';

interface MarkdownRendererProps {
  content?: string | null;
  className?: string;
  style?: React.CSSProperties;
}

// Helper to parse inline markdown elements: **bold**, *italic*, `code`, [link](url)
export function parseInlineMarkdown(text: string): React.ReactNode[] {
  // Regex matches:
  // 1. `code`
  // 2. **bold** or __bold__
  // 3. *italic* or _italic_
  // 4. [text](url)
  const tokenRegex = /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Inline code
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={index}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.9em',
            fontFamily: 'monospace',
            color: 'var(--color-paper)',
            border: '1px solid var(--color-hairline)',
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Bold (**text** or __text__)
    if (
      (part.startsWith('**') && part.endsWith('**') && part.length >= 4) ||
      (part.startsWith('__') && part.endsWith('__') && part.length >= 4)
    ) {
      return (
        <strong key={index} style={{ color: 'var(--color-paper)', fontWeight: 600 }}>
          {parseInlineMarkdown(part.slice(2, -2))}
        </strong>
      );
    }

    // Italic (*text* or _text_)
    if (
      (part.startsWith('*') && part.endsWith('*') && part.length >= 2) ||
      (part.startsWith('_') && part.endsWith('_') && part.length >= 2)
    ) {
      return (
        <em key={index} style={{ color: 'var(--color-paper)', fontStyle: 'italic' }}>
          {parseInlineMarkdown(part.slice(1, -1))}
        </em>
      );
    }

    // Links [text](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const linkText = linkMatch[1];
      let linkUrl = linkMatch[2].trim();
      const isExternal = linkUrl.startsWith('http://') || linkUrl.startsWith('https://');
      if (!isExternal && !linkUrl.startsWith('/') && !linkUrl.startsWith('#') && !linkUrl.startsWith('mailto:')) {
        linkUrl = `https://${linkUrl}`;
      }

      return (
        <a
          key={index}
          href={linkUrl}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          style={{
            color: 'var(--color-paper)',
            textDecoration: 'underline',
            textUnderlineOffset: '4px',
            fontWeight: 500,
            transition: 'opacity 0.2s ease',
          }}
        >
          {linkText}
        </a>
      );
    }

    return part;
  });
}

type BlockType =
  | { type: 'h1'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'h4'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'quote'; text: string }
  | { type: 'codeblock'; code: string; language?: string }
  | { type: 'hr' }
  | { type: 'p'; text: string };

function parseMarkdownBlocks(rawContent: string): BlockType[] {
  // Normalize Windows \r\n to standard \n
  const normalized = rawContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalized.split('\n');
  const blocks: BlockType[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      i++;
      continue;
    }

    // Code block ```
    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // skip closing ```
      blocks.push({
        type: 'codeblock',
        code: codeLines.join('\n'),
        language: lang,
      });
      continue;
    }

    // Horizontal rule --- or ***
    if (/^(\-{3,}|\*{3,})$/.test(trimmed)) {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    // Headings
    if (trimmed.startsWith('#### ')) {
      blocks.push({ type: 'h4', text: trimmed.slice(5).trim() });
      i++;
      continue;
    }
    if (trimmed.startsWith('### ')) {
      blocks.push({ type: 'h3', text: trimmed.slice(4).trim() });
      i++;
      continue;
    }
    if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'h2', text: trimmed.slice(3).trim() });
      i++;
      continue;
    }
    if (trimmed.startsWith('# ')) {
      blocks.push({ type: 'h1', text: trimmed.slice(2).trim() });
      i++;
      continue;
    }

    // Blockquote >
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [trimmed.replace(/^>\s?/, '')];
      i++;
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      blocks.push({ type: 'quote', text: quoteLines.join(' ') });
      continue;
    }

    // Unordered list (- or * or •)
    if (/^[-*•]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*•]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*•]\s+/, ''));
        i++;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }

    // Ordered list (1. , 2. )
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      blocks.push({ type: 'ol', items });
      continue;
    }

    // Paragraph (collect contiguous non-empty lines that aren't special markdown blocks)
    const pLines: string[] = [trimmed];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('>') &&
      !/^(\-{3,}|\*{3,})$/.test(lines[i].trim()) &&
      !/^[-*•]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim())
    ) {
      pLines.push(lines[i].trim());
      i++;
    }
    blocks.push({ type: 'p', text: pLines.join(' ') });
  }

  return blocks;
}

export function MarkdownRenderer({ content, className = '', style = {} }: MarkdownRendererProps) {
  if (!content || !content.trim()) {
    return null;
  }

  const blocks = parseMarkdownBlocks(content);

  return (
    <div
      className={`markdown-content ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        fontSize: '1.05rem',
        lineHeight: 1.7,
        color: 'var(--color-paper)',
        ...style,
      }}
    >
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'h1':
            return (
              <h1
                key={idx}
                style={{
                  fontSize: 'clamp(2rem, 3.5vw, 2.5rem)',
                  marginTop: idx === 0 ? 0 : '1.5rem',
                  marginBottom: '0.25rem',
                  color: 'var(--color-paper)',
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                }}
              >
                {parseInlineMarkdown(block.text)}
              </h1>
            );
          case 'h2':
            return (
              <h2
                key={idx}
                style={{
                  fontSize: '1.6rem',
                  marginTop: idx === 0 ? 0 : '2rem',
                  marginBottom: '0.25rem',
                  color: 'var(--color-paper)',
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 600,
                  borderBottom: '1px solid var(--color-hairline)',
                  paddingBottom: '0.4rem',
                }}
              >
                {parseInlineMarkdown(block.text)}
              </h2>
            );
          case 'h3':
            return (
              <h3
                key={idx}
                style={{
                  fontSize: '1.25rem',
                  marginTop: idx === 0 ? 0 : '1.25rem',
                  marginBottom: '0.1rem',
                  color: 'var(--color-paper)',
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 600,
                }}
              >
                {parseInlineMarkdown(block.text)}
              </h3>
            );
          case 'h4':
            return (
              <h4
                key={idx}
                style={{
                  fontSize: '1.1rem',
                  marginTop: idx === 0 ? 0 : '1rem',
                  marginBottom: '0.1rem',
                  color: 'var(--color-paper)',
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 600,
                }}
              >
                {parseInlineMarkdown(block.text)}
              </h4>
            );
          case 'ul':
            return (
              <ul
                key={idx}
                style={{
                  margin: '0.25rem 0',
                  paddingLeft: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  color: 'var(--color-paper)',
                }}
              >
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx} style={{ lineHeight: 1.6 }}>
                    {parseInlineMarkdown(item)}
                  </li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol
                key={idx}
                style={{
                  margin: '0.25rem 0',
                  paddingLeft: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  color: 'var(--color-paper)',
                }}
              >
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx} style={{ lineHeight: 1.6 }}>
                    {parseInlineMarkdown(item)}
                  </li>
                ))}
              </ol>
            );
          case 'quote':
            return (
              <blockquote
                key={idx}
                style={{
                  margin: '0.75rem 0',
                  padding: '12px 20px',
                  borderLeft: '4px solid var(--color-paper)',
                  background: 'var(--color-glass)',
                  borderRadius: '0 8px 8px 0',
                  color: 'var(--color-muted)',
                  fontStyle: 'italic',
                }}
              >
                {parseInlineMarkdown(block.text)}
              </blockquote>
            );
          case 'codeblock':
            return (
              <div
                key={idx}
                style={{
                  margin: '0.75rem 0',
                  padding: '16px',
                  borderRadius: '8px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid var(--color-hairline)',
                  overflowX: 'auto',
                }}
              >
                {block.language && (
                  <div
                    style={{
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      color: 'var(--color-muted)',
                      marginBottom: '8px',
                      fontFamily: 'monospace',
                    }}
                  >
                    {block.language}
                  </div>
                )}
                <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '13px', lineHeight: 1.5, color: '#f0f0f0' }}>
                  <code>{block.code}</code>
                </pre>
              </div>
            );
          case 'hr':
            return (
              <hr
                key={idx}
                style={{
                  border: 'none',
                  borderTop: '1px solid var(--color-hairline)',
                  margin: '1.5rem 0',
                }}
              />
            );
          case 'p':
          default:
            return (
              <p key={idx} style={{ margin: 0, color: 'inherit', lineHeight: 1.7 }}>
                {parseInlineMarkdown(block.text)}
              </p>
            );
        }
      })}
    </div>
  );
}
