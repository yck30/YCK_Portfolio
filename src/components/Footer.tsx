import fallbackFooterSettings from '@/data/footer.json'
import { createClient } from '@/utils/supabase/server'
import { FooterClient } from './FooterClient'

const fallbackLinks = [
  { label: 'Email', url: 'mailto:ckyong@kitabuild.com', type: 'contact' },
  { label: 'WhatsApp', url: 'https://wa.me/60164221791', type: 'contact' },
  { label: 'GitHub', url: 'https://github.com/yck30', type: 'social' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/chunkityong', type: 'social' },
  { label: 'TikTok', url: 'https://www.tiktok.com/@yck96', type: 'social' },
  { label: 'Instagram', url: 'https://www.instagram.com/ck_yong96/', type: 'social' },
  { label: 'Threads', url: 'https://www.threads.com/@ck_yong96', type: 'social' },
  { label: 'Facebook', url: 'https://web.facebook.com/YCK96/', type: 'social' },
]

export async function Footer() {
  const supabase = createClient()
  const { data: dbFooterLinks } = await supabase.from('footer_links').select('*').order('order_index', { ascending: true })
  const { data: dbFooterSettings } = await supabase.from('footer_settings').select('*').single()

  const links = (dbFooterLinks && dbFooterLinks.length > 0) ? dbFooterLinks : fallbackLinks
  const settings = {
    heading: dbFooterSettings?.heading || fallbackFooterSettings.heading,
    subtitle: dbFooterSettings?.subtitle || fallbackFooterSettings.subtitle,
    copyright_text: dbFooterSettings?.copyright_text || fallbackFooterSettings.copyright_text,
  }

  return <FooterClient links={links} settings={settings} />
}
