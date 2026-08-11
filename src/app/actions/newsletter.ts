'use server'

import { Resend } from 'resend'

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get('email')
  const apiKey = process.env.BUTTONDOWN_API_KEY

  if (!email || typeof email !== 'string') {
    return { error: 'Please provide a valid email address.' }
  }

  if (!apiKey) {
    return { error: 'Newsletter service is not configured yet.' }
  }

  try {
    const response = await fetch('https://api.buttondown.email/v1/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
        'X-Buttondown-Collision-Behavior': 'add'
      },
      body: JSON.stringify({
        email_address: email,
      }),
    })

    if (!response.ok) {
      const data = await response.json()
      // Buttondown returns an array of errors for the email field if it's invalid or already subscribed
      if (Array.isArray(data) && data.length > 0) {
        return { error: data[0] }
      }
      if (data.email_address && Array.isArray(data.email_address)) {
         return { error: data.email_address[0] }
      }
      if (data.detail) {
        return { error: typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail) }
      }
      return { error: `Failed to subscribe: ${JSON.stringify(data)}` }
    }

    // Try to send a welcome email via Resend if successful
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: 'CK Yong <ckyong@portfolio.kitabuild.com>',
          to: email,
          subject: `Welcome to the Newsletter!`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; borderRadius: 8px;">
              <h2 style="color: #111; margin-bottom: 24px;">Welcome aboard! 👋</h2>
              <p style="color: #666; font-size: 16px; line-height: 24px;">
                Hi there,<br/><br/>
                Thank you for subscribing to my newsletter! I'm thrilled to have you here. I'll be sharing my latest thoughts on design, engineering, entrepreneurship, and building products.
              </p>
              <p style="color: #666; font-size: 16px; line-height: 24px;">
                If you ever want to get in touch, just hit reply to this email. I read every single one.
              </p>
              <p style="color: #666; font-size: 16px; line-height: 24px; margin-top: 32px;">
                Cheers,<br/>
                <strong>CK Yong</strong>
              </p>
              <hr style="border: none; border-top: 1px solid #eaeaea; margin: 32px 0;" />
              <p style="color: #999; font-size: 12px; text-align: center;">
                You are receiving this email because you subscribed on YCK Portfolio.
              </p>
            </div>
          `
        })
      } catch (emailErr) {
        console.error('Failed to dispatch welcome email:', emailErr)
      }
    }

    return { success: true }
  } catch (error) {
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}
