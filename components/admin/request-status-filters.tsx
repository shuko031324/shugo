'use client'

import { cn } from '@/lib/utils'

interface RequestStatusFiltersProps {
  selectedStatus: string
  counts: {
    all: number
    pending: number
    accepted: number
    rejected: number
    completed: number
  }
  onSelect?: (status: string) => void
}

export function RequestStatusFilters({ selectedStatus, counts, onSelect }: RequestStatusFiltersProps) {
  const handleSelect = (status: string) => onSelect?.(status)

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => handleSelect('all')}
        className={cn(
          'px-4 py-2 rounded border-2 transition',
          selectedStatus === 'all'
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-border text-muted-foreground hover:border-primary'
        )}
      >
        All ({counts.all})
      </button>
      <button
        type="button"
        onClick={() => handleSelect('pending')}
        className={cn(
          'px-4 py-2 rounded border-2 transition',
          selectedStatus === 'pending'
            ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500'
            : 'border-border text-muted-foreground hover:border-yellow-500'
        )}
      >
        Pending ({counts.pending})
      </button>
      <button
        type="button"
        onClick={() => handleSelect('accepted')}
        className={cn(
          'px-4 py-2 rounded border-2 transition',
          selectedStatus === 'accepted'
            ? 'border-green-500 bg-green-500/10 text-green-500'
            : 'border-border text-muted-foreground hover:border-green-500'
        )}
      >
        Accepted ({counts.accepted})
      </button>
      <button
        type="button"
        onClick={() => handleSelect('rejected')}
        className={cn(
          'px-4 py-2 rounded border-2 transition',
          selectedStatus === 'rejected'
            ? 'border-red-500 bg-red-500/10 text-red-500'
            : 'border-border text-muted-foreground hover:border-red-500'
        )}
      >
        Rejected ({counts.rejected})
      </button>
      <button
        type="button"
        onClick={() => handleSelect('completed')}
        className={cn(
          'px-4 py-2 rounded border-2 transition',
          selectedStatus === 'completed'
            ? 'border-sky-500 bg-sky-500/10 text-sky-500'
            : 'border-border text-muted-foreground hover:border-sky-500'
        )}
      >
        Completed ({counts.completed})
      </button>
    </div>
  )
}
