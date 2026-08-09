'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactConfirmation(formData: FormData) {
  const name = formData.get('name')
  const email = formData.get('email')
  const message = formData.get('message')

  if (!name || !email || !message || typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
    return { error: 'Invalid form data provided.' }
  }

  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not defined. Skipping confirmation email.')
    return { error: 'Confirmation service is not configured.' }
  }

  try {
    // Send email using Resend
    // Note: If domain is not verified, Resend free tier restricts sending emails from "onboarding@resend.dev"
    // and can only send to your own registered email address.
    // If you have verified your custom domain, change "onboarding@resend.dev" to e.g., "no-reply@yourdomain.com"
    const { data, error } = await resend.emails.send({
      from: 'CK Yong <ckyong@kitabuild.com>',
      to: email,
      subject: `We received your message, ${name}!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; borderRadius: 8px;">
          <h2 style="color: #111; margin-bottom: 24px;">Thank you for getting in touch!</h2>
          <p style="color: #666; font-size: 16px; line-height: 24px;">
            Hi ${name},<br/><br/>
            Thanks for reaching out! This is a confirmation that we have received your message. Here is a summary of the details you submitted:
          </p>
          <div style="background-color: #f9f9f9; padding: 16px; border-radius: 6px; margin: 24px 0;">
            <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 0; font-size: 14px;"><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
          </div>
          <p style="color: #666; font-size: 16px; line-height: 24px;">
            We will review your inquiry and get back to you as soon as possible.
          </p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 32px 0;" />
          <p style="color: #999; font-size: 12px; text-align: center;">
            This is an automated receipt for your contact form submission on YCK Portfolio.
          </p>
        </div>
      `
    })

    if (error) {
      console.error('Resend error:', error)
      return { error: error.message }
    }

    return { success: true, data }
  } catch (err: any) {
    console.error('Failed to send contact confirmation email:', err)
    return { error: 'An unexpected error occurred while sending confirmation email.' }
  }
}
