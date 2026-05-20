'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please enter both email and password')
      return
    }
    
    setIsLoading(true)
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        toast.error(error.message)
        return
      }
      
      toast.success('Welcome back!')
      router.push('/admin')
      router.refresh()
    } catch (error) {
      console.error('Login error:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background pixel-grid">
      <div className="absolute inset-0 scanlines" />
      
      <div className="relative z-10 w-full max-w-md p-8">
        <div className="bg-card border-4 border-border p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center gap-2 mb-4">
              <div className="size-4 bg-primary animate-pulse" />
              <div className="size-4 bg-accent animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="size-4 bg-secondary animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
            <h1 className="font-[var(--font-pixel)] text-lg text-foreground mb-2">
              ADMIN <span className="text-primary">LOGIN</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Access your dashboard
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="bg-input border-2 border-border focus:border-primary"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-sm">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="bg-input border-2 border-border focus:border-primary"
                disabled={isLoading}
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full font-[var(--font-pixel)] text-xs py-6 bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  LOGGING IN...
                </>
              ) : (
                'LOGIN'
              )}
            </Button>
          </form>
          
          <p className="text-xs text-muted-foreground text-center mt-6">
            Only authorized administrators can access this area.
          </p>
        </div>
      </div>
    </main>
  )
}
