import fallbackJourney from '@/data/journey.json'
import { createClient } from '@/utils/supabase/server'
import { JourneyClient } from './JourneyClient'

export async function Journey() {
  const supabase = createClient()
  const { data: dbJourney } = await supabase.from('journey_entries').select('*').order('order_index', { ascending: true })

  const items = (dbJourney && dbJourney.length > 0) ? dbJourney : fallbackJourney

  return <JourneyClient items={items} />
}
