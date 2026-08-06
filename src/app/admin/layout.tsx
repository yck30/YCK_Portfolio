import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()

  // Protect all /admin routes except for /admin/login
  // The layout doesn't know the exact path, but we can handle that via middleware or here.
  // Actually, layout runs for all nested routes. So if we protect here, we can't show /admin/login.
  // Let's create a separate layout for the dashboard or just protect the dashboard page.
  // We will pass the user to the children if needed, or handle protection in the page components.

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', color: 'var(--color-paper)' }}>
      {children}
    </div>
  )
}
