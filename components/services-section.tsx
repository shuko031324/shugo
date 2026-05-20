import type { Service } from '@/lib/types'
import { Code, Palette, Smartphone, Globe, Database, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const iconMap: Record<string, React.ReactNode> = {
  code: <Code className="size-8" />,
  palette: <Palette className="size-8" />,
  smartphone: <Smartphone className="size-8" />,
  globe: <Globe className="size-8" />,
  database: <Database className="size-8" />,
  sparkles: <Sparkles className="size-8" />,
}

function getIconForService(name: string): React.ReactNode {
  const nameLower = name.toLowerCase()
  if (nameLower.includes('web') || nameLower.includes('site')) return iconMap.globe
  if (nameLower.includes('app') || nameLower.includes('mobile')) return iconMap.smartphone
  if (nameLower.includes('design') || nameLower.includes('ui')) return iconMap.palette
  if (nameLower.includes('backend') || nameLower.includes('api') || nameLower.includes('database')) return iconMap.database
  if (nameLower.includes('custom') || nameLower.includes('special')) return iconMap.sparkles
  return iconMap.code
}

interface ServicesSectionProps {
  services: Service[]
}

export function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section id="services" className="py-24 relative">
      <div className="absolute inset-0 pixel-grid opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="flex justify-center gap-2 mb-4">
            <div className="size-3 bg-accent" />
            <div className="size-3 bg-primary" />
            <div className="size-3 bg-secondary" />
          </div>
          <h2 className="font-[var(--font-pixel)] text-xl md:text-2xl text-foreground mb-4">
            <span className="text-accent">SHUGO</span> SERVICES
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Premium digital services with pixel-perfect design and creative excellence.
          </p>
        </div>
        
        {services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No services available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card 
                key={service.id}
                className="bg-card border-4 border-border hover:border-primary transition-all group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="size-16 bg-muted flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {getIconForService(service.name)}
                  </div>
                  <CardTitle className="font-[var(--font-pixel)] text-sm text-foreground">
                    {service.name.toUpperCase()}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {service.description || 'Professional service tailored to your needs.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-muted-foreground">Starting at</span>
                    <span className="font-[var(--font-pixel)] text-lg text-primary">
                      ${service.starting_price.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
