'use client'

import { useState } from 'react'
import type { Service } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RequestConfirmationDialog } from './request-confirmation-dialog'
import { toast } from 'sonner'
import { Loader2, Send, CheckCircle } from 'lucide-react'

interface RequestFormProps {
  services: Service[]
}

export function RequestForm({ services }: RequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [formData, setFormData] = useState({
    client_name: '',
    email: '',
    facebook_name: '',
    mobile_number: '',
    service_id: '',
    custom_request: '',
    project_details: '',
    budget_range: '',
    referral_source: '',
    commissioned_by: '',
  })

  const validateForm = () => {
    if (!formData.client_name.trim()) {
      toast.error('Please enter your name')
      return false
    }
    
    if (!formData.email && !formData.facebook_name && !formData.mobile_number) {
      toast.error('Please provide at least one contact method (email, Facebook, or mobile)')
      return false
    }
    
    if (!formData.service_id && !formData.custom_request.trim()) {
      toast.error('Please select a service or describe your custom request')
      return false
    }

    if (!formData.referral_source) {
      toast.error('Please tell me how you heard about me')
      return false
    }

    if (formData.referral_source === 'from-someone' && !formData.commissioned_by.trim()) {
      toast.error('Please enter who commissioned you')
      return false
    }

    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      setShowConfirmation(true)
    }
  }

  const handleConfirmedSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          referral_source: formData.referral_source,
          commissioned_by: formData.referral_source === 'from-someone' ? formData.commissioned_by : null,
          consent_given: true,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit request')
      }
      
      setShowConfirmation(false)
      setIsSubmitted(true)
      toast.success('Request submitted successfully! I will get back to you soon.')
      
      // Reset form
      setFormData({
        client_name: '',
        email: '',
        facebook_name: '',
        mobile_number: '',
        service_id: '',
        custom_request: '',
        project_details: '',
        budget_range: '',
        referral_source: '',
        commissioned_by: '',
      })
    } catch (error) {
      console.error('Error submitting request:', error)
      toast.error('Failed to submit request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <section id="request" className="py-24 relative">
        <div className="absolute inset-0 pixel-grid opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="size-20 bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="size-10 text-primary" />
            </div>
            <h2 className="font-[var(--font-pixel)] text-xl text-foreground mb-4">
              REQUEST SENT!
            </h2>
            <p className="text-muted-foreground mb-8">
              Thank you for your interest! I have received your project request and will review it shortly. 
              You will hear back from me via your provided contact method.
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)}
              className="font-[var(--font-pixel)] text-xs"
            >
              SUBMIT ANOTHER REQUEST
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="request" className="py-24 relative">
      <div className="absolute inset-0 pixel-grid opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="flex justify-center gap-2 mb-4">
            <div className="size-3 bg-secondary" />
            <div className="size-3 bg-accent" />
            <div className="size-3 bg-primary" />
          </div>
          <h2 className="font-[var(--font-pixel)] text-xl md:text-2xl text-foreground mb-4">
            <span className="text-secondary">REQUEST</span> A PROJECT
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Fill out the form below to start your project. I will review your request and get back to you shortly.
          </p>
        </div>

        <RequestConfirmationDialog
          open={showConfirmation}
          onOpenChange={setShowConfirmation}
          onConfirm={handleConfirmedSubmit}
          isSubmitting={isSubmitting}
        />

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
          {/* Contact Information */}
          <div className="bg-card border-4 border-border p-6">
            <h3 className="font-[var(--font-pixel)] text-xs text-primary mb-4">CONTACT INFO</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="client_name" className="text-sm">
                  Your Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  placeholder="Enter your full name"
                  className="bg-input border-2 border-border focus:border-primary"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="email" className="text-sm">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="bg-input border-2 border-border focus:border-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook_name" className="text-sm">Facebook Name</Label>
                  <Input
                    id="facebook_name"
                    value={formData.facebook_name}
                    onChange={(e) => setFormData({ ...formData, facebook_name: e.target.value })}
                    placeholder="Your Facebook name"
                    className="bg-input border-2 border-border focus:border-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="mobile_number" className="text-sm">Mobile Number</Label>
                  <Input
                    id="mobile_number"
                    value={formData.mobile_number}
                    onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                    placeholder="+1 234 567 8900"
                    className="bg-input border-2 border-border focus:border-primary"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Provide at least one contact method so I can reach you.
              </p>

              <div className="border-t border-border pt-5">
                <Label className="text-sm mb-3 block">How did you hear from me?</Label>
                <RadioGroup
                  value={formData.referral_source}
                  onValueChange={(value) => setFormData({ ...formData, referral_source: value })}
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-input p-4 text-sm transition hover:border-primary">
                      <RadioGroupItem value="from-someone" />
                      <span>From Someone</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-input p-4 text-sm transition hover:border-primary">
                      <RadioGroupItem value="found-myself" />
                      <span>Just found out myself</span>
                    </label>
                  </div>
                </RadioGroup>

                {formData.referral_source === 'from-someone' && (
                  <div className="mt-4">
                    <Label htmlFor="commissioned_by" className="text-sm">
                      Commissioned by <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="commissioned_by"
                      value={formData.commissioned_by}
                      onChange={(e) => setFormData({ ...formData, commissioned_by: e.target.value })}
                      placeholder="Enter the name who referred you"
                      className="bg-input border-2 border-border focus:border-primary"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="bg-card border-4 border-border p-6">
            <h3 className="font-[var(--font-pixel)] text-xs text-accent mb-4">PROJECT DETAILS</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="service_id" className="text-sm">Select a Service</Label>
                <Select 
                  value={formData.service_id} 
                  onValueChange={(value) => setFormData({ ...formData, service_id: value })}
                >
                  <SelectTrigger className="bg-input border-2 border-border focus:border-primary">
                    <SelectValue placeholder="Choose a service..." />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} - Starting at ₱{service.starting_price.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="custom_request" className="text-sm">
                  Custom Request (if not listed above)
                </Label>
                <Input
                  id="custom_request"
                  value={formData.custom_request}
                  onChange={(e) => setFormData({ ...formData, custom_request: e.target.value })}
                  placeholder="Describe your custom project request"
                  className="bg-input border-2 border-border focus:border-primary"
                />
              </div>
              
              <div>
                <Label htmlFor="project_details" className="text-sm">Project Description</Label>
                <Textarea
                  id="project_details"
                  value={formData.project_details}
                  onChange={(e) => setFormData({ ...formData, project_details: e.target.value })}
                  placeholder="Tell me more about your project - goals, features, timeline, etc."
                  rows={4}
                  className="bg-input border-2 border-border focus:border-primary resize-none"
                />
              </div>
              
              <div>
                <Label htmlFor="budget_range" className="text-sm">Budget Range</Label>
                <Select 
                  value={formData.budget_range} 
                  onValueChange={(value) => setFormData({ ...formData, budget_range: value })}
                >
                  <SelectTrigger className="bg-input border-2 border-border focus:border-primary">
                    <SelectValue placeholder="Select your budget range..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-500">Under ₱500</SelectItem>
                    <SelectItem value="500-1000">₱500 - ₱1,000</SelectItem>
                    <SelectItem value="1000-2500">₱1,000 - ₱2,500</SelectItem>
                    <SelectItem value="2500-5000">₱2,500 - ₱5,000</SelectItem>
                    <SelectItem value="5000-10000">₱5,000 - ₱10,000</SelectItem>
                    <SelectItem value="over-10000">Over ₱10,000</SelectItem>
                    <SelectItem value="discuss">Let&apos;s Discuss</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-6 font-[var(--font-pixel)] text-xs bg-primary hover:bg-primary/90 pixel-border-primary"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                SENDING...
              </>
            ) : (
              <>
                <Send className="size-4 mr-2" />
                SUBMIT REQUEST
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  )
}
