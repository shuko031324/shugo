import { createClient } from '@/lib/supabase/server'
import { ServicesClient } from './services-client'

export const dynamic = 'force-dynamic'

export default async function AdminServicesPage() {
  const supabase = await createClient()
  
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true })

  return <ServicesClient initialServices={services || []} />
}
