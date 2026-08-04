'use client'

import { useState } from 'react'
import { subscribeToNewsletter } from '@/app/actions/newsletter'

export function Newsletter() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setStatus('')
    const result = await subscribeToNewsletter(formData)
    
    if (result?.error) {
      setStatus(result.error)
    } else {
      setStatus('Successfully subscribed!')
    }
    setLoading(false)
  }

  return (
    <div style={{ marginTop: '4rem', padding: '2rem', border: '1px solid var(--hairline, rgba(255,255,255,0.1))', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Subscribe to the Newsletter</h3>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Get updates on new posts, side projects, and learnings.</p>
      <form action={handleSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <input 
          type="email" 
          name="email" 
          placeholder="Enter your email" 
          required 
          style={{ flex: '1', minWidth: '200px', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--hairline, rgba(255,255,255,0.2))', backgroundColor: 'transparent', color: 'white', fontSize: '1rem' }}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: 'white', color: 'black', fontSize: '1rem', fontWeight: 500, cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {status && (
        <p style={{ marginTop: '1rem', color: status === 'Successfully subscribed!' ? '#4ade80' : '#f87171', fontSize: '0.875rem' }}>
          {status}
        </p>
      )}
    </div>
  )
}
