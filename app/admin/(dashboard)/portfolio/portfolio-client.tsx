'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { PortfolioProject } from '@/lib/types'
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
import { Plus, Pencil, Trash2, Loader2, Upload, Star, Eye, EyeOff, ExternalLink } from 'lucide-react'
import Image from 'next/image'

interface PortfolioClientProps {
  initialProjects: PortfolioProject[]
}

const emptyProject = {
  title: '',
  description: '',
  client_name: '',
  image_pathname: '',
  project_url: '',
  is_featured: false,
  is_visible: true,
  sort_order: 0,
}

export function PortfolioClient({ initialProjects }: PortfolioClientProps) {
  const [projects, setProjects] = useState<PortfolioProject[]>(initialProjects)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null)
  const [formData, setFormData] = useState(emptyProject)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleOpenDialog = (project?: PortfolioProject) => {
    if (project) {
      setEditingProject(project)
      setFormData({
        title: project.title,
        description: project.description || '',
        client_name: project.client_name || '',
        image_pathname: project.image_pathname || '',
        project_url: project.project_url || '',
        is_featured: project.is_featured,
        is_visible: project.is_visible,
        sort_order: project.sort_order,
      })
    } else {
      setEditingProject(null)
      setFormData({ ...emptyProject, sort_order: projects.length })
    }
    setIsDialogOpen(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    setIsUploading(true)

    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      if (!response.ok) throw new Error('Upload failed')

      const { pathname } = await response.json()
      setFormData({ ...formData, image_pathname: pathname })
      toast.success('Image uploaded!')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Project title is required')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      if (editingProject) {
        const { data, error } = await supabase
          .from('portfolio_projects')
          .update({
            title: formData.title,
            description: formData.description || null,
            client_name: formData.client_name || null,
            image_pathname: formData.image_pathname || null,
            project_url: formData.project_url || null,
            is_featured: formData.is_featured,
            is_visible: formData.is_visible,
            sort_order: formData.sort_order,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingProject.id)
          .select()
          .single()

        if (error) throw error
        
        setProjects(projects.map(p => p.id === editingProject.id ? data : p))
        toast.success('Project updated!')
      } else {
        const { data, error } = await supabase
          .from('portfolio_projects')
          .insert({
            title: formData.title,
            description: formData.description || null,
            client_name: formData.client_name || null,
            image_pathname: formData.image_pathname || null,
            project_url: formData.project_url || null,
            is_featured: formData.is_featured,
            is_visible: formData.is_visible,
            sort_order: formData.sort_order,
          })
          .select()
          .single()

        if (error) throw error
        
        setProjects([...projects, data])
        toast.success('Project created!')
      }
      
      setIsDialogOpen(false)
      setFormData(emptyProject)
      setEditingProject(null)
    } catch (error) {
      console.error('Error saving project:', error)
      toast.error('Failed to save project')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    
    try {
      const { error } = await supabase
        .from('portfolio_projects')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setProjects(projects.filter(p => p.id !== id))
      toast.success('Project deleted!')
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Failed to delete project')
    }
  }

  const toggleVisibility = async (project: PortfolioProject) => {
    try {
      const { error } = await supabase
        .from('portfolio_projects')
        .update({ is_visible: !project.is_visible })
        .eq('id', project.id)

      if (error) throw error
      
      setProjects(projects.map(p => 
        p.id === project.id ? { ...p, is_visible: !p.is_visible } : p
      ))
      toast.success(`Project ${project.is_visible ? 'hidden' : 'visible'}!`)
    } catch (error) {
      console.error('Error toggling visibility:', error)
      toast.error('Failed to update project')
    }
  }

  const toggleFeatured = async (project: PortfolioProject) => {
    try {
      const { error } = await supabase
        .from('portfolio_projects')
        .update({ is_featured: !project.is_featured })
        .eq('id', project.id)

      if (error) throw error
      
      setProjects(projects.map(p => 
        p.id === project.id ? { ...p, is_featured: !p.is_featured } : p
      ))
      toast.success(`Project ${project.is_featured ? 'unfeatured' : 'featured'}!`)
    } catch (error) {
      console.error('Error toggling featured:', error)
      toast.error('Failed to update project')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[var(--font-pixel)] text-xl text-foreground mb-2">
            PORTFOLIO
          </h1>
          <p className="text-muted-foreground">
            Manage your portfolio projects to showcase your work.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => handleOpenDialog()}
              className="font-[var(--font-pixel)] text-xs"
            >
              <Plus className="size-4 mr-2" />
              ADD PROJECT
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-4 border-border max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogTitle className="sr-only">
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </DialogTitle>
            <DialogHeader>
              <h2 className="font-[var(--font-pixel)] text-sm text-primary">
                {editingProject ? 'EDIT PROJECT' : 'NEW PROJECT'}
              </h2>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload */}
              <div>
                <Label>Project Image</Label>
                <div 
                  className="mt-2 border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {formData.image_pathname ? (
                    <div className="relative aspect-video">
                      <Image
                        src={`/api/files?pathname=${encodeURIComponent(formData.image_pathname)}`}
                        alt="Project preview"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <p className="text-white text-sm">Click to change</p>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video flex flex-col items-center justify-center text-muted-foreground">
                      {isUploading ? (
                        <Loader2 className="size-8 animate-spin" />
                      ) : (
                        <>
                          <Upload className="size-8 mb-2" />
                          <p className="text-sm">Click to upload image</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              <div>
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., E-commerce Website"
                  className="bg-input border-2 border-border"
                />
              </div>
              <div>
                <Label htmlFor="client_name">Client Name</Label>
                <Input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  placeholder="e.g., Acme Corp"
                  className="bg-input border-2 border-border"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this project..."
                  className="bg-input border-2 border-border resize-none"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="project_url">Project URL (optional)</Label>
                <Input
                  id="project_url"
                  type="url"
                  value={formData.project_url}
                  onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                  placeholder="https://example.com"
                  className="bg-input border-2 border-border"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Featured</Label>
                <Switch
                  id="featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="visible">Visible to public</Label>
                <Switch
                  id="visible"
                  checked={formData.is_visible}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_visible: checked })}
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
                  {editingProject ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className={`bg-card border-4 ${project.is_visible ? 'border-border' : 'border-border/50 opacity-60'} overflow-hidden`}>
              <div className="relative aspect-video bg-muted">
                {project.image_pathname ? (
                  <Image
                    src={`/api/files?pathname=${encodeURIComponent(project.image_pathname)}`}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <span className="font-[var(--font-pixel)] text-xs">NO IMAGE</span>
                  </div>
                )}
                {project.is_featured && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-yellow-950">
                    <Star className="size-3" />
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-md text-foreground">
                    {project.title}
                  </CardTitle>
                </div>
                {project.client_name && (
                  <p className="text-xs text-muted-foreground">
                    Client: {project.client_name}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {project.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {project.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFeatured(project)}
                      className={project.is_featured ? 'text-yellow-500' : ''}
                    >
                      <Star className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleVisibility(project)}
                    >
                      {project.is_visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                    </Button>
                    {project.project_url && (
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="size-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(project)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(project.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-card border-4 border-border">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              No portfolio projects yet. Add your first project to showcase your work.
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="size-4 mr-2" />
              Add Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
