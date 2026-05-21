"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { RequestDetailClient } from './request-detail-client'
import { Card, CardContent } from '@/components/ui/card'

export default function RequestDetailPage() {
  const { id } = useParams()
  const [request, setRequest] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const supabase = createClient()

    let mounted = true
    ;(async () => {
      try {
        const { data, error } = await supabase
          .from('project_requests')
          .select('*, service:services(name, starting_price)')
          .eq('id', id)
          .single()

        if (!mounted) return
        if (error || !data) {
          setError('Request not found')
          setRequest(null)
        } else {
          setRequest(data)
        }
      } catch (err) {
        console.error('Failed to load request', err)
        setError('Failed to load request')
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => { mounted = false }
  }, [id])

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="bg-card border-4 border-border animate-pulse"><CardContent className="h-48" /></Card>
      </div>
    )
  }

  if (error || !request) {
    return (
      <div className="py-12 text-center text-muted-foreground">{error || 'Not found'}</div>
    )
  }

  return <RequestDetailClient request={request} />
}
