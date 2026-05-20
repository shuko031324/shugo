export interface Service {
  id: string
  name: string
  description: string | null
  starting_price: number
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface PortfolioProject {
  id: string
  title: string
  description: string | null
  client_name: string | null
  image_url: string | null
  image_pathname: string | null
  project_url: string | null
  is_featured: boolean
  is_visible: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ProjectRequest {
  id: string
  client_name: string
  email: string | null
  facebook_name: string | null
  mobile_number: string | null
  service_id: string | null
  custom_request: string | null
  project_details: string | null
  budget_range: string | null
  referral_source?: string | null
  commissioned_by?: string | null
  consent_given: boolean
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
  admin_comment: string | null
  created_at: string
  updated_at: string
  service?: Service | null
}
