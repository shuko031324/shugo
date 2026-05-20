import Link from 'next/link'
import { PixelParticles } from './pixel-particles'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <PixelParticles />
      
      {/* Grid Background */}
      <div className="absolute inset-0 pixel-grid opacity-20" />
      
      {/* Scanlines Effect */}
      <div className="absolute inset-0 scanlines" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Pixel Art Decoration */}
          <div className="flex justify-center gap-2 mb-8">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className="size-4 bg-primary animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          
          <h1 className="font-[var(--font-pixel)] text-2xl md:text-4xl text-foreground mb-6 leading-relaxed pixel-text-shadow">
            <span className="text-primary">SHUGO</span>
            <br />
            <span className="text-accent">CREATIVE STUDIO</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Crafting digital experiences with retro pixel art innovation. 
            From websites to applications, we bring your ideas to life 
            with creative pixel precision.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#request"
              className="px-8 py-4 bg-primary text-primary-foreground font-[var(--font-pixel)] text-xs hover:bg-primary/90 transition-all pixel-border-primary pixel-glow"
            >
              START PROJECT
            </Link>
            <Link
              href="#portfolio"
              className="px-8 py-4 bg-card text-foreground font-[var(--font-pixel)] text-xs border-4 border-border hover:border-accent transition-all"
            >
              VIEW WORK
            </Link>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-xs text-muted-foreground">SCROLL</span>
            <div className="w-1 h-8 bg-muted overflow-hidden">
              <div className="w-full h-2 bg-primary animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
