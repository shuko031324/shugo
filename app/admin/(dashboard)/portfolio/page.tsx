import { createClient } from '@/lib/supabase/server'
import { PortfolioClient } from './portfolio-client'

export const dynamic = 'force-dynamic'

export default async function AdminPortfolioPage() {
  const supabase = await createClient()
  
  const { data: projects } = await supabase
    .from('portfolio_projects')
    .select('*')
    .order('sort_order', { ascending: true })

  return <PortfolioClient initialProjects={projects || []} />
}
