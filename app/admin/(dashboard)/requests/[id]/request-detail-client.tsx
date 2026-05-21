'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { ProjectRequest } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  Mail, 
  Facebook, 
  Phone, 
  Calendar, 
  Check, 
  X, 
  Loader2,
  PhilippinePeso,
  MessageSquare
} from 'lucide-react'
import Link from 'next/link'

const formatBudgetRange = (budgetRange?: string) => {
  if (!budgetRange) return 'Not specified'
  if (budgetRange.startsWith('under-')) return `Under ₱${budgetRange.split('-')[1]}`
  if (budgetRange.startsWith('over-')) return `Over ₱${budgetRange.split('-')[1]}`

  const [min, max] = budgetRange.split('-')
  return `₱${min} - ₱${max}`
}

const formatReferralSource = (referralSource?: string | null) => {
  if (!referralSource) return 'Not specified'
  return referralSource === 'from-someone' ? 'From Someone' : 'Just found out myself'
}

interface RequestDetailClientProps {
  request: ProjectRequest & {
    service?: { name: string; starting_price: number } | null
  }
}

export function RequestDetailClient({ request: initialRequest }: RequestDetailClientProps) {
  const [request, setRequest] = useState(initialRequest)
  const [adminComment, setAdminComment] = useState(request.admin_comment || '')
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleStatusUpdate = async (status: 'accepted' | 'rejected' | 'completed') => {
    setIsUpdating(true)
    
    try {
      const { error } = await supabase
        .from('project_requests')
        .update({
          status,
          admin_comment: adminComment,
          updated_at: new Date().toISOString(),
        })
        .eq('id', request.id)

      if (error) throw error

      setRequest({ ...request, status, admin_comment: adminComment })
      toast.success(`Request ${status}!`)
      router.refresh()
    } catch (error) {
      console.error('Error updating request:', error)
      toast.error('Failed to update request')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCommentSave = async () => {
    setIsUpdating(true)
    
    try {
      const { error } = await supabase
        .from('project_requests')
        .update({
          admin_comment: adminComment,
          updated_at: new Date().toISOString(),
        })
        .eq('id', request.id)

      if (error) throw error

      setRequest({ ...request, admin_comment: adminComment })
      toast.success('Comment saved!')
    } catch (error) {
      console.error('Error saving comment:', error)
      toast.error('Failed to save comment')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/requests">
          <Button variant="outline" size="icon" className="border-2 border-border">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-[var(--font-pixel)] text-xl text-foreground">
            REQUEST DETAILS
          </h1>
          <p className="text-muted-foreground">
            Review and manage this project request
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Info */}
          <Card className="bg-card border-4 border-border">
            <CardHeader>
              <CardTitle className="font-[var(--font-pixel)] text-sm text-primary">
                CLIENT INFORMATION
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-2xl font-bold text-foreground">{request.client_name}</p>
                <span className={`font-[var(--font-pixel)] text-[10px] px-3 py-1 inline-block mt-2 ${
                  request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                  request.status === 'accepted' ? 'bg-green-500/20 text-green-500' :
                  'bg-red-500/20 text-red-500'
                }`}>
                  {request.status.toUpperCase()}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {request.email && (
                  <a 
                    href={`mailto:${request.email}`}
                    className="flex items-center gap-2 p-3 bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <Mail className="size-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm text-foreground">{request.email}</p>
                    </div>
                  </a>
                )}
                {request.facebook_name && (
                  <div className="flex items-center gap-2 p-3 bg-muted">
                    <Facebook className="size-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Facebook</p>
                      <p className="text-sm text-foreground">{request.facebook_name}</p>
                    </div>
                  </div>
                )}
                {request.mobile_number && (
                  <a 
                    href={`tel:${request.mobile_number}`}
                    className="flex items-center gap-2 p-3 bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <Phone className="size-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Mobile</p>
                      <p className="text-sm text-foreground">{request.mobile_number}</p>
                    </div>
                  </a>
                )}
                <div className="flex items-center gap-2 p-3 bg-muted">
                  <Calendar className="size-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Submitted</p>
                    <p className="text-sm text-foreground">
                      {new Date(request.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card className="bg-card border-4 border-border">
            <CardHeader>
              <CardTitle className="font-[var(--font-pixel)] text-sm text-accent">
                PROJECT DETAILS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted">
                  <p className="text-xs text-muted-foreground mb-1">Service</p>
                  <p className="text-foreground">
                    {request.service?.name || 'Not specified'}
                  </p>
                </div>
                <div className="p-3 bg-muted">
                  <p className="text-xs text-muted-foreground mb-1">Starting Price</p>
                  <p className="text-foreground flex items-center gap-1">
                    <PhilippinePeso className="size-4" />
                    {request.service?.starting_price?.toLocaleString() || 'N/A'}
                  </p>
                </div>
              </div>

              {request.custom_request && (
                <div className="p-3 bg-muted">
                  <p className="text-xs text-muted-foreground mb-1">Custom Request</p>
                  <p className="text-foreground">{request.custom_request}</p>
                </div>
              )}

              {request.budget_range && (
                <div className="p-3 bg-muted">
                  <p className="text-xs text-muted-foreground mb-1">Budget Range</p>
                  <p className="text-foreground">
                    {formatBudgetRange(request.budget_range)}
                  </p>
                </div>
              )}

              <div className="p-3 bg-muted">
                <p className="text-xs text-muted-foreground mb-1">How they heard about me</p>
                <p className="text-foreground">
                  {formatReferralSource(request.referral_source)}
                </p>
              </div>

              {request.commissioned_by && (
                <div className="p-3 bg-muted">
                  <p className="text-xs text-muted-foreground mb-1">Commissioned by</p>
                  <p className="text-foreground">{request.commissioned_by}</p>
                </div>
              )}

              {request.project_details && (
                <div className="p-3 bg-muted">
                  <p className="text-xs text-muted-foreground mb-1">Project Description & Specifics</p>
                  <p className="text-foreground whitespace-pre-wrap">{request.project_details}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          {/* Admin Comment */}
          <Card className="bg-card border-4 border-border">
            <CardHeader>
              <CardTitle className="font-[var(--font-pixel)] text-sm text-secondary flex items-center gap-2">
                <MessageSquare className="size-4" />
                ADMIN NOTES
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="comment" className="text-sm">Comment / Notes</Label>
                <Textarea
                  id="comment"
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  placeholder="Add notes about this request..."
                  rows={4}
                  className="bg-input border-2 border-border focus:border-primary resize-none"
                />
              </div>
              <Button
                onClick={handleCommentSave}
                disabled={isUpdating}
                variant="outline"
                className="w-full border-2 border-border"
              >
                {isUpdating ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                Save Notes
              </Button>
            </CardContent>
          </Card>

          {/* Consent Status */}
          <Card className={`bg-card border-4 ${request.consent_given ? 'border-green-500/50' : 'border-amber-500/50'}`}>
            <CardHeader>
              <CardTitle className="font-[var(--font-pixel)] text-sm flex items-center gap-2">
                {request.consent_given ? (
                  <>
                    <Check className="size-4 text-green-500" />
                    <span className="text-green-500">CONSENT GIVEN</span>
                  </>
                ) : (
                  <>
                    <X className="size-4 text-amber-500" />
                    <span className="text-amber-500">NO CONSENT</span>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`p-3 rounded ${request.consent_given ? 'bg-green-500/10' : 'bg-amber-500/10'}`}>
                <p className="text-xs leading-relaxed">
                  <strong>GitHub & Gmail Access:</strong> Client has{' '}
                  {request.consent_given ? (
                    <span className="text-green-600">✓ consented</span>
                  ) : (
                    <span className="text-amber-600">✗ not consented</span>
                  )}{' '}
                  to the use of their GitHub account and Gmail credentials for Vercel deployment and Supabase integration.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Status Actions */}
          <Card className="bg-card border-4 border-border">
            <CardHeader>
              <CardTitle className="font-[var(--font-pixel)] text-sm text-foreground">
                UPDATE STATUS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => handleStatusUpdate('accepted')}
                disabled={isUpdating || request.status === 'accepted' || request.status === 'completed'}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {isUpdating ? <Loader2 className="size-4 animate-spin mr-2" /> : <Check className="size-4 mr-2" />}
                Accept Request
              </Button>
              <Button
                onClick={() => handleStatusUpdate('rejected')}
                disabled={isUpdating || request.status === 'rejected' || request.status === 'completed'}
                variant="destructive"
                className="w-full"
              >
                {isUpdating ? <Loader2 className="size-4 animate-spin mr-2" /> : <X className="size-4 mr-2" />}
                Reject Request
              </Button>
              <Button
                onClick={() => handleStatusUpdate('completed')}
                disabled={isUpdating || request.status === 'completed'}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white"
              >
                {isUpdating ? <Loader2 className="size-4 animate-spin mr-2" /> : <Check className="size-4 mr-2" />}
                Mark Completed
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
