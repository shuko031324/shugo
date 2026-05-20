import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Inbox, FolderKanban, Image, Clock } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch counts
  const [
    { count: pendingCount },
    { count: totalRequests },
    { count: servicesCount },
    { count: portfolioCount },
  ] = await Promise.all([
    supabase.from('project_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('project_requests').select('*', { count: 'exact', head: true }),
    supabase.from('services').select('*', { count: 'exact', head: true }),
    supabase.from('portfolio_projects').select('*', { count: 'exact', head: true }),
  ])

  // Fetch recent requests
  const { data: recentRequests } = await supabase
    .from('project_requests')
    .select('*, service:services(name)')
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    { 
      label: 'Pending Requests', 
      value: pendingCount || 0, 
      icon: Clock,
      href: '/admin/requests',
      color: 'text-yellow-500'
    },
    { 
      label: 'Total Requests', 
      value: totalRequests || 0, 
      icon: Inbox,
      href: '/admin/requests',
      color: 'text-primary'
    },
    { 
      label: 'Services', 
      value: servicesCount || 0, 
      icon: FolderKanban,
      href: '/admin/services',
      color: 'text-accent'
    },
    { 
      label: 'Portfolio', 
      value: portfolioCount || 0, 
      icon: Image,
      href: '/admin/portfolio',
      color: 'text-secondary'
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="bg-card border-4 border-border hover:border-primary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`size-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <p className="font-[var(--font-pixel)] text-2xl text-foreground">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Requests */}
      <Card className="bg-card border-4 border-border">
        <CardHeader>
          <CardTitle className="font-[var(--font-pixel)] text-sm text-foreground">
            RECENT REQUESTS
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentRequests && recentRequests.length > 0 ? (
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
                    <span className={`font-[var(--font-pixel)] text-[10px] px-2 py-1 ${
                      request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                      request.status === 'accepted' ? 'bg-green-500/20 text-green-500' :
                      'bg-red-500/20 text-red-500'
                    }`}>
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
