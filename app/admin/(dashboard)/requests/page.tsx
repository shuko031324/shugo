'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { ProjectRequest } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mail, Facebook, Phone, Calendar, ArrowRight } from 'lucide-react'
import { RequestStatusFilters } from '@/components/admin/request-status-filters'

const formatBudgetRange = (budgetRange?: string) => {
  if (!budgetRange) return 'Not specified'
  if (budgetRange.startsWith('under-')) return `Under ₱${budgetRange.split('-')[1]}`
  if (budgetRange.startsWith('over-')) return `Over ₱${budgetRange.split('-')[1]}`

  const [min, max] = budgetRange.split('-')
  return `₱${min} - ₱${max}`
}

const statusBadgeClass = (status?: string) => {
  if (status === 'pending') return 'bg-yellow-500/20 text-yellow-500'
  if (status === 'accepted') return 'bg-green-500/20 text-green-500'
  if (status === 'rejected') return 'bg-red-500/20 text-red-500'
  return 'bg-sky-500/20 text-sky-500'
}

interface RequestWithService extends ProjectRequest {
  service?: { name: string } | null
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<RequestWithService[]>([])
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('project_requests')
        .select('id, client_name, status, created_at, custom_request, project_details, budget_range, referral_source, commissioned_by, email, facebook_name, mobile_number, service:services(name)')
        .order('created_at', { ascending: false })
        .limit(200)

      if (error) {
        console.error('Failed to load requests:', error)
        setError('Failed to load requests')
        setRequests([])
      } else {
        setRequests(data || [])
      }
      setIsLoading(false)
    }

    fetchRequests()
  }, [])

  const counts = useMemo(() => ({
    all: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    accepted: requests.filter((r) => r.status === 'accepted').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
    completed: requests.filter((r) => r.status === 'completed').length,
  }), [requests])

  const filteredRequests = useMemo(
    () => selectedStatus === 'all'
      ? requests
      : requests.filter((r) => r.status === selectedStatus),
    [requests, selectedStatus],
  )

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

      <RequestStatusFilters
        selectedStatus={selectedStatus}
        counts={counts}
        onSelect={setSelectedStatus}
      />

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="bg-card border-4 border-border animate-pulse">
              <CardContent className="h-28" />
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="bg-card border-4 border-border">
          <CardContent className="py-12 text-center text-destructive">{error}</CardContent>
        </Card>
      ) : filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
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
                    <span className={`font-[var(--font-pixel)] text-[10px] px-3 py-1 ${statusBadgeClass(request.status)}`}>
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

                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    {request.budget_range && (
                      <Badge variant="secondary" className="text-xs">
                        Budget: {formatBudgetRange(request.budget_range)}
                      </Badge>
                    )}
                    {request.referral_source && (
                      <Badge variant="outline" className="text-xs">
                        {request.referral_source === 'from-someone' ? 'Referred' : 'Found Myself'}
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
              No requests found for this filter.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
