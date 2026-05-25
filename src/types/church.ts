// Church database types

export type Church = {
  id: string
  name: string
  slug: string
  description: string | null
  address: string | null
  city: string
  state: string
  zip: string | null
  country: string
  latitude: number | null
  longitude: number | null
  phone: string | null
  email: string | null
  website: string | null
  denomination: string | null
  church_network: string | null
  worship_style: string | null
  service_times: ServiceTime[]
  ministries: string[]
  languages: string[]
  kids_ministry: boolean
  youth_ministry: boolean
  college_ministry: boolean
  small_groups: boolean
  online_service: boolean
  online_service_url: string | null
  accessibility: string[]
  parking_info: string | null
  profile_image_url: string | null
  gallery_urls: string[]
  verified: boolean
  claimed: boolean
  featured: boolean
  active: boolean
  created_at: string
  updated_at: string
}

export type ServiceTime = {
  day: string
  time: string
}

export type ChurchClaim = {
  id: string
  church_id: string | null
  claimant_name: string
  claimant_role: string | null
  claimant_email: string
  claimant_phone: string | null
  church_website: string | null
  message: string | null
  status: 'pending' | 'approved' | 'rejected'
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
}

export type SponsoredListing = {
  id: string
  church_id: string
  plan_name: string
  placement_area: string | null
  start_date: string | null
  end_date: string | null
  active: boolean
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string
  updated_at: string
}

export type SavedChurch = {
  id: string
  user_id: string
  church_id: string
  created_at: string
}

export type ContactMessage = {
  id: string
  church_id: string | null
  sender_name: string | null
  sender_email: string | null
  sender_phone: string | null
  message: string
  created_at: string
}

export type ChurchFilters = {
  denomination?: string
  city?: string
  state?: string
  zip?: string
  worship_style?: string
  ministries?: string[]
  languages?: string[]
  kids_ministry?: boolean
  youth_ministry?: boolean
  college_ministry?: boolean
  small_groups?: boolean
  online_service?: boolean
  featured?: boolean
  verified?: boolean
  search?: string
  limit?: number
  offset?: number
}

export type ChurchClaimForm = {
  church_id?: string
  claimant_name: string
  claimant_role?: string
  claimant_email: string
  claimant_phone?: string
  church_website?: string
  message?: string
}

export type ContactMessageForm = {
  church_id?: string
  sender_name?: string
  sender_email?: string
  sender_phone?: string
  message: string
}
