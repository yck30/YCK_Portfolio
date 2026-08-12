import fallbackHero from '@/data/hero.json'
import { createClient } from '@/utils/supabase/server'
import { HeroClient } from './HeroClient'

export async function Hero() {
  const supabase = createClient()
  const { data: dbHero } = await supabase.from('hero_content').select('*').single()

  const heroData = {
    eyebrow: dbHero?.eyebrow || fallbackHero.eyebrow,
    line1: dbHero?.line1 || fallbackHero.line1,
    line2: dbHero?.line2 || fallbackHero.line2,
    line3: dbHero?.line3 || fallbackHero.line3,
    subtitle: dbHero?.subtitle || fallbackHero.subtitle,
    location_badge: dbHero?.location_badge || fallbackHero.location_badge,
    scroll_badge: dbHero?.scroll_badge || fallbackHero.scroll_badge,
    copyright_text: dbHero?.copyright_text || fallbackHero.copyright_text,
    images: Array.isArray(dbHero?.images) && dbHero.images.length > 0 ? dbHero.images : fallbackHero.images,
  }

  return <HeroClient data={heroData} />
}
