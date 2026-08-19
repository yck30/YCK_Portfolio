import React, { useState } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Eye, Edit3, HelpCircle, Code, List, Heading, Bold, Italic, Link as LinkIcon, Quote } from 'lucide-react';

interface MarkdownFieldEditorProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  hint?: string;
}

export function MarkdownFieldEditor({
  label,
  name,
  value,
  onChange,
  rows = 10,
  placeholder = 'Write content in Markdown format...',
  required = false,
  hint,
}: MarkdownFieldEditorProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [showGuide, setShowGuide] = useState(false);

  // Helper to insert markdown syntax at cursor position
  const insertSyntax = (prefix: string, suffix: string = '') => {
    const textarea = document.querySelector(`textarea[name="${name}"]`) as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = textarea.value;
    const selectedText = currentVal.substring(start, end);

    const replacement = prefix + (selectedText || (prefix.startsWith('#') ? 'Heading' : 'text')) + suffix;
    const newVal = currentVal.substring(0, start) + replacement + currentVal.substring(end);

    // Trigger synthetic change event
    const event = {
      target: {
        name,
        value: newVal,
        type: 'textarea',
      },
    } as unknown as React.ChangeEvent<HTMLTextAreaElement>;

    onChange(event);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + replacement.length - suffix.length);
    }, 0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Header & Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <label style={{ fontSize: '14px', color: 'var(--color-paper)', fontWeight: 500 }}>
            {label}
          </label>
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            title="Markdown syntax cheat sheet"
            style={{
              background: 'none',
              border: 'none',
              color: showGuide ? 'var(--color-paper)' : 'var(--color-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
              transition: 'color 0.2s ease',
            }}
          >
            <HelpCircle size={14} />
          </button>
        </div>

        {/* Tab switch */}
        <div
          style={{
            display: 'inline-flex',
            background: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '6px',
            padding: '2px',
            border: '1px solid var(--color-hairline)',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            style={{
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: 500,
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: activeTab === 'write' ? 'var(--color-paper)' : 'transparent',
              color: activeTab === 'write' ? 'var(--color-bg)' : 'var(--color-muted)',
              transition: 'all 0.15s ease',
            }}
          >
            <Edit3 size={12} /> Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            style={{
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: 500,
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: activeTab === 'preview' ? 'var(--color-paper)' : 'transparent',
              color: activeTab === 'preview' ? 'var(--color-bg)' : 'var(--color-muted)',
              transition: 'all 0.15s ease',
            }}
          >
            <Eye size={12} /> Live Preview
          </button>
        </div>
      </div>

      {/* Formatting Toolbar */}
      {activeTab === 'write' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            flexWrap: 'wrap',
            padding: '6px 8px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '6px',
            border: '1px solid var(--color-hairline)',
          }}
        >
          <button
            type="button"
            onClick={() => insertSyntax('## ')}
            title="Section Header (H2)"
            style={toolbarBtnStyle}
          >
            <Heading size={13} /> H2
          </button>
          <button
            type="button"
            onClick={() => insertSyntax('### ')}
            title="Subheader (H3)"
            style={toolbarBtnStyle}
          >
            <Heading size={12} /> H3
          </button>
          <div style={{ width: '1px', height: '14px', background: 'var(--color-hairline)', margin: '0 2px' }} />
          <button
            type="button"
            onClick={() => insertSyntax('**', '**')}
            title="Bold (**text**)"
            style={toolbarBtnStyle}
          >
            <Bold size={13} />
          </button>
          <button
            type="button"
            onClick={() => insertSyntax('*', '*')}
            title="Italic (*text*)"
            style={toolbarBtnStyle}
          >
            <Italic size={13} />
          </button>
          <button
            type="button"
            onClick={() => insertSyntax('[Link Text](', ')')}
            title="Link ([text](url))"
            style={toolbarBtnStyle}
          >
            <LinkIcon size={13} />
          </button>
          <div style={{ width: '1px', height: '14px', background: 'var(--color-hairline)', margin: '0 2px' }} />
          <button
            type="button"
            onClick={() => insertSyntax('- ')}
            title="Bullet list (- item)"
            style={toolbarBtnStyle}
          >
            <List size={13} /> List
          </button>
          <button
            type="button"
            onClick={() => insertSyntax('1. ')}
            title="Numbered list (1. item)"
            style={toolbarBtnStyle}
          >
            1. List
          </button>
          <button
            type="button"
            onClick={() => insertSyntax('> ')}
            title="Blockquote (> quote)"
            style={toolbarBtnStyle}
          >
            <Quote size={13} />
          </button>
          <button
            type="button"
            onClick={() => insertSyntax('`', '`')}
            title="Inline code (`code`)"
            style={toolbarBtnStyle}
          >
            <Code size={13} />
          </button>
        </div>
      )}

      {/* Syntax Guide Cheat Sheet (expandable) */}
      {(showGuide || hint) && (
        <div
          style={{
            padding: '10px 14px',
            background: 'var(--color-glass)',
            borderRadius: '8px',
            border: '1px solid var(--color-hairline)',
            fontSize: '12px',
            color: 'var(--color-muted)',
            lineHeight: 1.6,
          }}
        >
          {hint && <p style={{ margin: '0 0 6px 0', color: 'var(--color-paper)' }}>{hint}</p>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '6px' }}>
            <div><code>## Heading 2</code> $\rightarrow$ Section</div>
            <div><code>### Heading 3</code> $\rightarrow$ Subhead</div>
            <div><code>**Bold Text**</code> $\rightarrow$ <strong>Bold</strong></div>
            <div><code>*Italic Text*</code> $\rightarrow$ <em>Italic</em></div>
            <div><code>[Title](https://...)</code> $\rightarrow$ Link</div>
            <div><code>- Item</code> $\rightarrow$ Bullet List</div>
            <div><code>1. Item</code> $\rightarrow$ Numbered List</div>
            <div><code>&gt; Quote</code> $\rightarrow$ Blockquote</div>
            <div><code>`code`</code> $\rightarrow$ Inline Code</div>
            <div><code>```lang ... ```</code> $\rightarrow$ Code Block</div>
          </div>
        </div>
      )}

      {/* Write Area vs Live Preview Area */}
      {activeTab === 'write' ? (
        <textarea
          required={required}
          name={name}
          value={value || ''}
          onChange={onChange}
          rows={rows}
          placeholder={placeholder}
          style={{
            padding: '12px 14px',
            borderRadius: '8px',
            background: 'var(--color-glass)',
            color: 'var(--color-paper)',
            border: '1px solid var(--color-hairline)',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontSize: '13px',
            lineHeight: 1.6,
            outline: 'none',
            resize: 'vertical',
            width: '100%',
            boxSizing: 'border-box',
          }}
        />
      ) : (
        <div
          style={{
            minHeight: `${rows * 24}px`,
            maxHeight: '450px',
            overflowY: 'auto',
            padding: '16px 20px',
            borderRadius: '8px',
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid var(--color-hairline)',
            boxSizing: 'border-box',
          }}
        >
          {value && value.trim() ? (
            <MarkdownRenderer content={value} />
          ) : (
            <div style={{ color: 'var(--color-muted)', fontStyle: 'italic', fontSize: '13px', textAlign: 'center', padding: '30px 0' }}>
              No content entered yet. Switch back to &quot;Write&quot; tab to add content.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const toolbarBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid transparent',
  color: 'var(--color-paper)',
  borderRadius: '4px',
  padding: '3px 7px',
  fontSize: '11px',
  fontWeight: 500,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  transition: 'all 0.15s ease',
  opacity: 0.85,
};
