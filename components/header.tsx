import Link from 'next/link'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b-4 border-primary">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="size-8 bg-primary pixel-border-primary" />
            <span className="font-[var(--font-pixel)] text-xs text-primary tracking-wider">
              SHUGO
            </span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link 
              href="#services" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Services
            </Link>
            <Link 
              href="#portfolio" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Portfolio
            </Link>
            <Link 
              href="#request" 
              className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors pixel-border-primary"
            >
              Request Project
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
