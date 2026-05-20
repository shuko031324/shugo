import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mail, Facebook, Phone, Calendar, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminRequestsPage() {
  const supabase = await createClient()
  
  const { data: requests } = await supabase
    .from('project_requests')
    .select('*, service:services(name)')
    .order('created_at', { ascending: false })

  const pendingCount = requests?.filter(r => r.status === 'pending').length || 0
  const acceptedCount = requests?.filter(r => r.status === 'accepted').length || 0
  const rejectedCount = requests?.filter(r => r.status === 'rejected').length || 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[var(--font-pixel)] text-xl text-foreground mb-2">
          PROJECT REQUESTS
        </h1>
        <p className="text-muted-foreground">
          Review and manage client project requests.
        </p>
      </div>

      {/* Filter Stats */}
      <div className="flex gap-4">
        <Badge variant="outline" className="px-4 py-2 border-2 border-yellow-500 text-yellow-500">
          {pendingCount} Pending
        </Badge>
        <Badge variant="outline" className="px-4 py-2 border-2 border-green-500 text-green-500">
          {acceptedCount} Accepted
        </Badge>
        <Badge variant="outline" className="px-4 py-2 border-2 border-red-500 text-red-500">
          {rejectedCount} Rejected
        </Badge>
      </div>

      {/* Requests List */}
      {requests && requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request) => (
            <Link key={request.id} href={`/admin/requests/${request.id}`}>
              <Card className="bg-card border-4 border-border hover:border-primary transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-foreground">
                        {request.client_name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {request.service?.name || request.custom_request || 'Custom Request'}
                      </p>
                    </div>
                    <span className={`font-[var(--font-pixel)] text-[10px] px-3 py-1 ${
                      request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                      request.status === 'accepted' ? 'bg-green-500/20 text-green-500' :
                      'bg-red-500/20 text-red-500'
                    }`}>
                      {request.status.toUpperCase()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                    {request.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="size-4" />
                        {request.email}
                      </span>
                    )}
                    {request.facebook_name && (
                      <span className="flex items-center gap-1">
                        <Facebook className="size-4" />
                        {request.facebook_name}
                      </span>
                    )}
                    {request.mobile_number && (
                      <span className="flex items-center gap-1">
                        <Phone className="size-4" />
                        {request.mobile_number}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="size-4" />
                      {new Date(request.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {request.project_details && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {request.project_details}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    {request.budget_range && (
                      <Badge variant="secondary" className="text-xs">
                        Budget: {request.budget_range.replace('-', ' - $').replace('under', 'Under $').replace('over', 'Over $')}
                      </Badge>
                    )}
                    <span className="text-xs text-primary flex items-center gap-1">
                      View Details <ArrowRight className="size-3" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="bg-card border-4 border-border">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No requests yet. They will appear here when clients submit them.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
