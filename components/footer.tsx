import Link from 'next/link'

export function Footer() {
  return (
    <footer className="py-12 border-t-4 border-border bg-card/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="size-6 bg-primary" />
            <span className="font-[var(--font-pixel)] text-[10px] text-primary">
              SHUGO
            </span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#services" className="hover:text-primary transition-colors">
              Services
            </Link>
            <Link href="#portfolio" className="hover:text-primary transition-colors">
              Portfolio
            </Link>
            <Link href="#request" className="hover:text-primary transition-colors">
              Request
            </Link>
          </div>
          
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} SHUGO. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
