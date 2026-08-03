'use client'

import { FormEvent, useRef, useState, useEffect } from 'react'
import gsap from 'gsap'

const Arrow = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" width="24" height="24">
    <path d="M5 19 19 5M9 5h10v10" stroke="currentColor" fill="none" strokeWidth="2" />
  </svg>
)

export function Contact() {
  const submitButton = useRef<HTMLButtonElement>(null)
  const [status, setStatus] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const button = submitButton.current
    if (!button || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const xTo = gsap.quickTo(button, 'x', { duration: 0.35, ease: 'power3.out' })
    const yTo = gsap.quickTo(button, 'y', { duration: 0.35, ease: 'power3.out' })
    const move = (event: PointerEvent) => {
      const rect = button.getBoundingClientRect()
      xTo((event.clientX - rect.left - rect.width / 2) * 0.16)
      yTo((event.clientY - rect.top - rect.height / 2) * 0.16)
    }
    const leave = () => {
      xTo(0)
      yTo(0)
    }

    button.addEventListener('pointermove', move)
    button.addEventListener('pointerleave', leave)
    return () => {
      button.removeEventListener('pointermove', move)
      button.removeEventListener('pointerleave', leave)
    }
  }, [])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('Sending...')
    
    const form = event.currentTarget
    const formData = new FormData(form)
    
    try {
      const response = await fetch(`https://formsubmit.co/ajax/ckyong@kitabuild.com`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      
      if (response.ok) {
        setStatus('Request received — we’ll be in touch shortly.')
        form.reset()
        setMessage('')
      } else {
        setStatus('Oops! There was a problem submitting your form.')
      }
    } catch (error) {
      setStatus('Oops! There was a problem submitting your form.')
    }
    
    gsap.fromTo('[data-status]', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45 })
  }

  return (
    <section className="contact" id="contact" data-motion="contact" aria-labelledby="contact-title">
      <>
        <div className="contact-heading">
          <p><span /> Get in touch</p>
          <span>01—01</span>
        </div>
        <h2 id="contact-title">Let’s build<br />something <em>great.</em></h2>
        <form onSubmit={submit}>
          <label data-motion="field">
            <span>Your name</span>
            <input name="name" type="text" autoComplete="name" placeholder="Name" required />
          </label>
          <label data-motion="field">
            <span>Your email</span>
            <input 
              name="email" 
              type="email" 
              autoComplete="email" 
              placeholder="Email" 
              required 
              pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
              title="Please enter a valid email address (e.g. name@domain.com)"
            />
          </label>
          <label data-motion="field">
            <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              Your message
              <span style={{ opacity: message.length >= 500 ? 1 : 0.5, color: message.length >= 500 ? '#f87171' : 'inherit' }}>
                {message.length} / 500
              </span>
            </span>
            <textarea 
              name="message" 
              placeholder="Message" 
              required 
              rows={3} 
              maxLength={500}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>
          <div className="form-action" data-motion="field">
            <p>By sending, you agree to be contacted about your project.</p>
            <button ref={submitButton} type="submit" aria-label="Send project request"><Arrow /></button>
          </div>
          <p className="form-status" data-status aria-live="polite">{status}</p>
        </form>
      </>
    </section>
  )
}
