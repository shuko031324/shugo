'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { AlertCircle } from 'lucide-react'

interface RequestConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isSubmitting: boolean
}

export function RequestConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting,
}: RequestConfirmationDialogProps) {
  const [consentChecked, setConsentChecked] = useState(false)

  const handleConfirm = () => {
    if (consentChecked) {
      onConfirm()
      setConsentChecked(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-4 border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-[var(--font-pixel)] text-sm text-primary">
            CONFIRM REQUEST SUBMISSION
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs mt-2">
            Please review the important information below before submitting your request.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning Box */}
          <div className="bg-amber-500/10 border-2 border-amber-500/50 rounded p-4">
            <div className="flex gap-3">
              <AlertCircle className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900 space-y-2">
                <p className="font-semibold">Important Information About Your Request</p>
                <p>
                  To deploy your project online, I will need access to your <strong>GitHub account</strong> for setting up <strong>Vercel deployment</strong>, and potentially your <strong>Gmail credentials</strong> (email address and password) for integrating services like <strong>Supabase</strong> and other necessary deployment tools.
                </p>
                <p className="text-xs mt-2 opacity-90">
                  Your credentials will be used <strong>exclusively</strong> for project deployment purposes only and will not be shared with any third parties.
                </p>
              </div>
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-start gap-3 p-4 bg-primary/10 rounded border-2 border-primary">
            <Checkbox
              id="consent"
              checked={consentChecked}
              onCheckedChange={(checked) => setConsentChecked(checked as boolean)}
              className="mt-1 border-2 border-primary w-5 h-5"
            />
            <label
              htmlFor="consent"
              className="text-sm text-foreground cursor-pointer flex-1 leading-relaxed"
            >
              I understand and consent that <span className="font-semibold">SHUGO may use my GitHub account and Gmail credentials (email and project-specific password)</span> exclusively for the deployment and integration of my project online. I acknowledge that these will be used only for Vercel, Supabase, and other necessary deployment tools.
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-2 border-border"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={!consentChecked || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            You must check the box above to proceed with your request submission.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
