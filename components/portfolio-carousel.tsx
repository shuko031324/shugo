'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import type { PortfolioProject } from '@/lib/types'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
  const [previewProject, setPreviewProject] = useState<PortfolioProject | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const openPreview = useCallback((project: PortfolioProject) => {
    setPreviewProject(project)
    setIsPreviewOpen(true)
  }, [])

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
           Here are some of the works I have done for my past clients.
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
                    <div
                    className={
                      `relative aspect-video bg-muted overflow-hidden ${project.is_featured && project.image_pathname ? 'cursor-pointer' : ''}`
                    }
                    onClick={() => project.is_featured && project.image_pathname && openPreview(project)}
                    onKeyDown={(event) => {
                      if (!project.is_featured || !project.image_pathname) return
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        openPreview(project)
                      }
                    }}
                    role={project.is_featured && project.image_pathname ? 'button' : undefined}
                    tabIndex={project.is_featured && project.image_pathname ? 0 : undefined}
                  >
                    {project.image_pathname ? (
                      <Image
                        src={project.image_preview_url || `/api/files?pathname=${encodeURIComponent(project.image_pathname)}`}
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

                    {project.is_featured && project.image_pathname && (
                      <div className="absolute inset-0 flex items-end justify-end p-3 pointer-events-none">
                        <span className="rounded-full bg-background/90 px-2 py-1 text-[10px] uppercase text-foreground pointer-events-none">
                          Click to preview
                        </span>
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

          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogContent className="!fixed !inset-0 !w-screen !h-screen !max-w-none !max-h-none !m-0 !p-0 !rounded-none !top-0 !left-0 !translate-x-0 !translate-y-0 bg-card border-4 border-border">
                  {previewProject && (
                <div className="relative bg-black w-full h-full">
                  <DialogHeader className="p-4">
                    <DialogTitle className="text-white text-sm">
                      {previewProject.title}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="relative h-[calc(100vh-4rem)] w-full">
                    {previewProject.image_pathname ? (
                      <img
                        src={previewProject.image_preview_url || `/api/files?pathname=${encodeURIComponent(previewProject.image_pathname)}`}
                        alt={previewProject.title}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-white">
                        No preview available
                      </div>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

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
