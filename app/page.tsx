import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { HeroSection } from '@/components/hero-section'
import { ServicesSection } from '@/components/services-section'
import { PortfolioCarousel } from '@/components/portfolio-carousel'
import { RequestForm } from '@/components/request-form'
import { Footer } from '@/components/footer'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = await createClient()
  
  // Fetch active services
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  
  // Fetch visible portfolio projects
  const { data: portfolioProjects } = await supabase
    .from('portfolio_projects')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true })

  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ServicesSection services={services || []} />
      <PortfolioCarousel projects={portfolioProjects || []} />
      <RequestForm services={services || []} />
      <Footer />
    </main>
  )
}
