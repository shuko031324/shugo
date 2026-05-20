'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import type { PortfolioProject } from '@/lib/types'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface PortfolioCarouselProps {
  projects: PortfolioProject[]
}

export function PortfolioCarousel({ projects }: PortfolioCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center' },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  )
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }
    
    emblaApi.on('select', onSelect)
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi])

  if (projects.length === 0) {
    return (
      <section id="portfolio" className="py-24 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center gap-2 mb-4">
              <div className="size-3 bg-primary" />
              <div className="size-3 bg-accent" />
              <div className="size-3 bg-secondary" />
            </div>
            <h2 className="font-[var(--font-pixel)] text-xl md:text-2xl text-foreground mb-4">
              <span className="text-primary">SHUGO</span> PORTFOLIO
            </h2>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Portfolio coming soon. Check back later!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="portfolio" className="py-24 bg-card/50 relative overflow-hidden">
      <div className="absolute inset-0 pixel-grid opacity-5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="flex justify-center gap-2 mb-4">
            <div className="size-3 bg-primary" />
            <div className="size-3 bg-accent" />
            <div className="size-3 bg-secondary" />
          </div>
          <h2 className="font-[var(--font-pixel)] text-xl md:text-2xl text-foreground mb-4">
            <span className="text-primary">SHUGO</span> PORTFOLIO
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A showcase of creative pixel art projects crafted with artistic vision and technical excellence.
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background border-4 border-border hover:border-primary size-12"
          >
            <ChevronLeft className="size-6" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background border-4 border-border hover:border-primary size-12"
          >
            <ChevronRight className="size-6" />
          </Button>

          {/* Carousel */}
          <div className="overflow-hidden mx-12" ref={emblaRef}>
            <div className="flex">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 px-4"
                >
                  <div className="bg-card border-4 border-border hover:border-primary transition-all group overflow-hidden">
                    <div className="relative aspect-video bg-muted overflow-hidden">
                      {project.image_pathname ? (
                        <Image
                          src={`/api/files?pathname=${encodeURIComponent(project.image_pathname)}`}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="font-[var(--font-pixel)] text-xs text-muted-foreground">
                            NO IMAGE
                          </div>
                        </div>
                      )}
                      
                      {project.is_featured && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-primary-foreground font-[var(--font-pixel)] text-[8px]">
                          FEATURED
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-[var(--font-pixel)] text-xs text-foreground mb-2">
                        {project.title.toUpperCase()}
                      </h3>
                      {project.client_name && (
                        <p className="text-xs text-muted-foreground mb-2">
                          Client: {project.client_name}
                        </p>
                      )}
                      {project.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                      {project.project_url && (
                        <a
                          href={project.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                        >
                          View Project <ExternalLink className="size-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`size-3 transition-colors ${
                  index === selectedIndex ? 'bg-primary' : 'bg-muted hover:bg-muted-foreground'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
