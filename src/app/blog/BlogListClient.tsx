'use client'

import { useState } from 'react'
import Link from 'next/link'

type BlogPost = {
  id: string;
  slug: string;
  published_at: string;
  title: string;
  excerpt: string;
  tags?: string[];
  read_time?: string;
}

export function BlogListClient({ posts }: { posts: BlogPost[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // Extract all unique tags
  const allTags = Array.from(
    new Set(posts.flatMap(post => post.tags || []))
  ).sort()

  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      
    const matchesTag = selectedTag ? post.tags?.includes(selectedTag) : true
    
    return matchesSearch && matchesTag
  })

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '48px' }}>
        <input 
          type="text" 
          placeholder="Search articles..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '16px 24px',
            borderRadius: '8px',
            border: '1px solid var(--color-hairline)',
            background: 'var(--color-glass)',
            color: 'var(--color-paper)',
            fontSize: '16px',
            outline: 'none',
            fontFamily: 'var(--font-primary)'
          }}
        />
        
        {allTags.length > 0 && (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedTag(null)}
              style={{
                padding: '8px 16px',
                borderRadius: '999px',
                border: '1px solid',
                borderColor: selectedTag === null ? 'var(--color-paper)' : 'var(--color-hairline)',
                background: selectedTag === null ? 'var(--color-paper)' : 'transparent',
                color: selectedTag === null ? 'var(--color-bg)' : 'var(--color-muted)',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s ease'
              }}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '999px',
                  border: '1px solid',
                  borderColor: selectedTag === tag ? 'var(--color-paper)' : 'var(--color-hairline)',
                  background: selectedTag === tag ? 'var(--color-paper)' : 'transparent',
                  color: selectedTag === tag ? 'var(--color-bg)' : 'var(--color-muted)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s ease'
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="editorial-list">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="editorial-item">
              <span className="editorial-date">
                {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                {post.read_time && <span style={{ marginLeft: '12px', opacity: 0.6 }}>· {post.read_time}</span>}
              </span>
              <div className="editorial-content">
                <h2 className="editorial-title">
                  {post.title}
                  <span className="editorial-arrow">→</span>
                </h2>
                <p className="editorial-excerpt">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p style={{ color: 'var(--color-muted)' }}>No articles found matching your criteria.</p>
        )}
      </div>
    </>
  )
}
