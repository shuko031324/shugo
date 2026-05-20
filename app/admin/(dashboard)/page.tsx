'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Inbox, FolderKanban, Image, Clock } from 'lucide-react'

interface RecentRequest {
  id: string
  client_name: string
  status: string
  created_at: string
  custom_request?: string | null
  service?: { name: string } | null
}

export default function AdminDashboardPage() {
  const [pendingCount, setPendingCount] = useState(0)
  const [totalRequests, setTotalRequests] = useState(0)
  const [servicesCount, setServicesCount] = useState(0)
  const [portfolioCount, setPortfolioCount] = useState(0)
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      const supabase = createClient()

      try {
        const [pending, total, services, portfolio, recent] = await Promise.all([
          supabase.from('project_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('project_requests').select('*', { count: 'exact', head: true }),
          supabase.from('services').select('*', { count: 'exact', head: true }),
          supabase.from('portfolio_projects').select('*', { count: 'exact', head: true }),
          supabase.from('project_requests')
            .select('*, service:services(name)')
            .order('created_at', { ascending: false })
            .limit(5),
        ])

        setPendingCount(pending.count || 0)
        setTotalRequests(total.count || 0)
        setServicesCount(services.count || 0)
        setPortfolioCount(portfolio.count || 0)
        setRecentRequests(recent.data || [])
      } catch (err) {
        console.error('Error loading dashboard:', err)
        setError('Unable to load dashboard data.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const stats = [
    {
      label: 'Pending Requests',
      value: pendingCount,
      icon: Clock,
      href: '/admin/requests',
      color: 'text-yellow-500',
    },
    {
      label: 'Total Requests',
      value: totalRequests,
      icon: Inbox,
      href: '/admin/requests',
      color: 'text-primary',
    },
    {
      label: 'Services',
      value: servicesCount,
      icon: FolderKanban,
      href: '/admin/services',
      color: 'text-accent',
    },
    {
      label: 'Portfolio',
      value: portfolioCount,
      icon: Image,
      href: '/admin/portfolio',
      color: 'text-secondary',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[var(--font-pixel)] text-xl text-foreground mb-2">
          DASHBOARD
        </h1>
        <p className="text-muted-foreground">
          Welcome to your admin dashboard. Manage your services, portfolio, and client requests.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="bg-card border-4 border-border hover:border-primary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-muted-foreground">{stat.label}</CardTitle>
                <stat.icon className={`size-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-12 animate-pulse rounded bg-muted" />
                ) : (
                  <p className="font-[var(--font-pixel)] text-2xl text-foreground">{stat.value}</p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="bg-card border-4 border-border">
        <CardHeader>
          <CardTitle className="font-[var(--font-pixel)] text-sm text-foreground">
            RECENT REQUESTS
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-destructive text-center py-8">{error}</p>
          ) : isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-24 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : recentRequests.length > 0 ? (
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <Link
                  key={request.id}
                  href={`/admin/requests/${request.id}`}
                  className="flex items-center justify-between p-4 bg-muted hover:bg-muted/80 transition-colors"
                >
                  <div>
                    <p className="font-medium text-foreground">{request.client_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {request.service?.name || request.custom_request || 'Custom Request'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-[var(--font-pixel)] text-[10px] px-2 py-1 ${
                        request.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : request.status === 'accepted'
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}
                    >
                      {request.status.toUpperCase()}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No requests yet. They will appear here when clients submit them.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
