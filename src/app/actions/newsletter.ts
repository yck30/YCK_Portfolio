'use server'

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
      },
      body: JSON.stringify({
        email_address: email,
        type: 'unactivated',
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
      return { error: 'Failed to subscribe. Please try again.' }
    }

    return { success: true }
  } catch (error) {
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}
