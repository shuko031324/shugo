'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  FolderKanban, 
  Image, 
  Inbox, 
  LogOut,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface AdminSidebarProps {
  userEmail: string
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/requests', label: 'Requests', icon: Inbox },
  { href: '/admin/services', label: 'Services', icon: FolderKanban },
  { href: '/admin/portfolio', label: 'Portfolio', icon: Image },
]

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    toast.success('Signed out successfully')
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r-4 border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b-4 border-border">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="size-8 bg-primary" />
          <div>
            <span className="font-[var(--font-pixel)] text-[10px] text-primary block">
              SHUGO
            </span>
            <span className="text-xs text-muted-foreground">Admin Panel</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 text-sm transition-colors',
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="size-5" />
              {item.label}
              {isActive && <ChevronRight className="size-4 ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* User Info & Sign Out */}
      <div className="p-4 border-t-4 border-border">
        <div className="mb-3">
          <p className="text-xs text-muted-foreground">Signed in as</p>
          <p className="text-sm text-foreground truncate">{userEmail}</p>
        </div>
        <Button
          variant="outline"
          onClick={handleSignOut}
          className="w-full justify-start gap-2 border-2 border-border hover:border-destructive hover:text-destructive"
        >
          <LogOut className="size-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
