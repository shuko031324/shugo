import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { RequestDetailClient } from './request-detail-client'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function RequestDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: request, error } = await supabase
    .from('project_requests')
    .select('*, service:services(name, starting_price)')
    .eq('id', id)
    .single()

  if (error || !request) {
    notFound()
  }

  return <RequestDetailClient request={request} />
}
