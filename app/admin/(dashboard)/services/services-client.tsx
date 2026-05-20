'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Service } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Loader2, PhilippinePeso } from 'lucide-react'

interface ServicesClientProps {
  initialServices?: Service[]
}

const emptyService = {
  name: '',
  description: '',
  starting_price: 0,
  is_active: true,
  sort_order: 0,
}

export function ServicesClient({ initialServices = [] }: ServicesClientProps) {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [isFetching, setIsFetching] = useState(initialServices.length === 0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState(emptyService)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchServices = async () => {
      setIsFetching(true)
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('sort_order', { ascending: true })

      if (!error) {
        setServices(data || [])
      } else {
        console.error('Error loading services:', error)
      }
      setIsFetching(false)
    }

    fetchServices()
  }, [])

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      setEditingService(service)
      setFormData({
        name: service.name,
        description: service.description || '',
        starting_price: service.starting_price,
        is_active: service.is_active,
        sort_order: service.sort_order,
      })
    } else {
      setEditingService(null)
      setFormData({ ...emptyService, sort_order: services.length })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Service name is required')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      if (editingService) {
        const { data, error } = await supabase
          .from('services')
          .update({
            name: formData.name,
            description: formData.description || null,
            starting_price: formData.starting_price,
            is_active: formData.is_active,
            sort_order: formData.sort_order,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingService.id)
          .select()
          .single()

        if (error) throw error
        
        setServices(services.map(s => s.id === editingService.id ? data : s))
        toast.success('Service updated!')
      } else {
        const { data, error } = await supabase
          .from('services')
          .insert({
            name: formData.name,
            description: formData.description || null,
            starting_price: formData.starting_price,
            is_active: formData.is_active,
            sort_order: formData.sort_order,
          })
          .select()
          .single()

        if (error) throw error
        
        setServices([...services, data])
        toast.success('Service created!')
      }
      
      setIsDialogOpen(false)
      setFormData(emptyService)
      setEditingService(null)
    } catch (error) {
      console.error('Error saving service:', error)
      toast.error('Failed to save service')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return
    
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setServices(services.filter(s => s.id !== id))
      toast.success('Service deleted!')
    } catch (error) {
      console.error('Error deleting service:', error)
      toast.error('Failed to delete service')
    }
  }

  const toggleActive = async (service: Service) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_active: !service.is_active })
        .eq('id', service.id)

      if (error) throw error
      
      setServices(services.map(s => 
        s.id === service.id ? { ...s, is_active: !s.is_active } : s
      ))
      toast.success(`Service ${service.is_active ? 'deactivated' : 'activated'}!`)
    } catch (error) {
      console.error('Error toggling service:', error)
      toast.error('Failed to update service')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[var(--font-pixel)] text-xl text-foreground mb-2">
            SERVICES
          </h1>
          <p className="text-muted-foreground">
            Manage the services you offer to clients.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => handleOpenDialog()}
              className="font-[var(--font-pixel)] text-xs"
            >
              <Plus className="size-4 mr-2" />
              ADD SERVICE
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-4 border-border">
            <DialogTitle className="sr-only">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </DialogTitle>
            <DialogHeader>
              <h2 className="font-[var(--font-pixel)] text-sm text-primary">
                {editingService ? 'EDIT SERVICE' : 'NEW SERVICE'}
              </h2>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Website Development"
                  className="bg-input border-2 border-border"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this service..."
                  className="bg-input border-2 border-border resize-none"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="price">Starting Price (₱)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.starting_price}
                  onChange={(e) => setFormData({ ...formData, starting_price: parseFloat(e.target.value) || 0 })}
                  className="bg-input border-2 border-border"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="active">Active (visible to clients)</Label>
                <Switch
                  id="active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1 border-2 border-border"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting && <Loader2 className="size-4 animate-spin mr-2" />}
                  {editingService ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Services List */}
      {isFetching ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="bg-card border-4 border-border animate-pulse h-28" />
          ))}
        </div>
      ) : services.length > 0 ? (
        <div className="grid gap-4">
          {services.map((service) => (
            <Card key={service.id} className={`bg-card border-4 ${service.is_active ? 'border-border' : 'border-border/50 opacity-60'}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg text-foreground">
                      {service.name}
                    </CardTitle>
                    {!service.is_active && (
                      <span className="font-[var(--font-pixel)] text-[8px] px-2 py-1 bg-muted text-muted-foreground">
                        INACTIVE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={service.is_active}
                      onCheckedChange={() => toggleActive(service)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(service)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(service.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {service.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {service.description}
                  </p>
                )}
                <div className="flex items-center gap-1 text-primary">
                  <PhilippinePeso className="size-4" />
                  <span className="font-[var(--font-pixel)] text-sm">
                    {service.starting_price.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">starting</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-card border-4 border-border">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              No services yet. Add your first service to get started.
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="size-4 mr-2" />
              Add Service
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
