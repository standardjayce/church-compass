import { supabase } from './supabaseClient'
import type {
  Church,
  ChurchFilters,
  ChurchClaimForm,
  ContactMessageForm,
  SavedChurch,
} from '@/types/church'

/**
 * Get churches with optional filters
 */
export async function getChurches(filters?: ChurchFilters) {
  let query = supabase.from('churches').select('*')

  if (filters?.denomination && filters.denomination !== 'All') {
    query = query.eq('denomination', filters.denomination)
  }

  if (filters?.city) {
    query = query.eq('city', filters.city)
  }

  if (filters?.state) {
    query = query.eq('state', filters.state)
  }

  if (filters?.worship_style) {
    query = query.eq('worship_style', filters.worship_style)
  }

  if (filters?.kids_ministry) {
    query = query.eq('kids_ministry', true)
  }

  if (filters?.youth_ministry) {
    query = query.eq('youth_ministry', true)
  }

  if (filters?.college_ministry) {
    query = query.eq('college_ministry', true)
  }

  if (filters?.small_groups) {
    query = query.eq('small_groups', true)
  }

  if (filters?.online_service) {
    query = query.eq('online_service', true)
  }

  if (filters?.featured) {
    query = query.eq('featured', true)
  }

  // Pagination
  const offset = filters?.offset || 0
  const limit = filters?.limit || 50

  query = query.range(offset, offset + limit - 1)
  query = query.order('created_at', { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching churches:', error)
    return { churches: [], error }
  }

  return { churches: data as Church[], error: null }
}

/**
 * Get a single church by slug
 */
export async function getChurchBySlug(slug: string) {
  const { data, error } = await supabase
    .from('churches')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching church:', error)
    return { church: null, error }
  }

  return { church: data as Church, error: null }
}

/**
 * Search churches using full-text search
 */
export async function searchChurches(query: string, filters?: ChurchFilters) {
  if (!query || query.trim().length === 0) {
    return getChurches(filters)
  }

  let dbQuery = supabase
    .from('churches')
    .select('*')
    .textSearch('search_vector', query)

  // Apply other filters
  if (filters?.denomination && filters.denomination !== 'All') {
    dbQuery = dbQuery.eq('denomination', filters.denomination)
  }

  if (filters?.city) {
    dbQuery = dbQuery.eq('city', filters.city)
  }

  const offset = filters?.offset || 0
  const limit = filters?.limit || 50

  dbQuery = dbQuery.range(offset, offset + limit - 1)
  dbQuery = dbQuery.order('created_at', { ascending: false })

  const { data, error } = await dbQuery

  if (error) {
    console.error('Error searching churches:', error)
    return { churches: [], error }
  }

  return { churches: data as Church[], error: null }
}

/**
 * Get featured churches for a city or all featured churches
 */
export async function getFeaturedChurches(city?: string, state?: string) {
  let query = supabase
    .from('churches')
    .select('*')
    .eq('featured', true)
    .eq('active', true)
    .limit(12)

  if (city) {
    query = query.eq('city', city)
  }

  if (state) {
    query = query.eq('state', state)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching featured churches:', error)
    return { churches: [], error }
  }

  return { churches: data as Church[], error: null }
}

/**
 * Submit a church claim request
 */
export async function submitChurchClaim(formData: ChurchClaimForm) {
  const { data, error } = await supabase
    .from('church_claims')
    .insert([
      {
        church_id: formData.church_id || null,
        claimant_name: formData.claimant_name,
        claimant_role: formData.claimant_role || null,
        claimant_email: formData.claimant_email,
        claimant_phone: formData.claimant_phone || null,
        church_website: formData.church_website || null,
        message: formData.message || null,
        status: 'pending',
      },
    ])
    .select()

  if (error) {
    console.error('Error submitting church claim:', error)
    return { claim: null, error }
  }

  return { claim: data?.[0], error: null }
}

/**
 * Save a church for a user (requires authentication)
 */
export async function saveChurch(userId: string, churchId: string) {
  const { data, error } = await supabase
    .from('saved_churches')
    .insert([
      {
        user_id: userId,
        church_id: churchId,
      },
    ])
    .select()

  if (error) {
    console.error('Error saving church:', error)
    return { saved: null, error }
  }

  return { saved: data?.[0] as SavedChurch, error: null }
}

/**
 * Unsave a church for a user (requires authentication)
 */
export async function unsaveChurch(userId: string, churchId: string) {
  const { error } = await supabase
    .from('saved_churches')
    .delete()
    .eq('user_id', userId)
    .eq('church_id', churchId)

  if (error) {
    console.error('Error unsaving church:', error)
    return { error }
  }

  return { error: null }
}

/**
 * Get saved churches for a user (requires authentication)
 */
export async function getSavedChurches(userId: string) {
  const { data, error } = await supabase
    .from('saved_churches')
    .select('church_id, churches(*)')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching saved churches:', error)
    return { churches: [], error }
  }

  return {
    churches: data
      ?.map((item: any) => item.churches)
      .filter((church): church is Church => church !== null) || [],
    error: null,
  }
}

/**
 * Check if a church is saved by a user
 */
export async function isChurchSaved(userId: string, churchId: string) {
  const { data, error } = await supabase
    .from('saved_churches')
    .select('id')
    .eq('user_id', userId)
    .eq('church_id', churchId)
    .single()

  if (error && error.code !== 'PGRST116') {
    // PGRST116 means no rows found, which is expected
    console.error('Error checking if church is saved:', error)
  }

  return !!data
}

/**
 * Submit a contact message
 */
export async function submitContactMessage(formData: ContactMessageForm) {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert([
      {
        church_id: formData.church_id || null,
        sender_name: formData.sender_name || null,
        sender_email: formData.sender_email || null,
        sender_phone: formData.sender_phone || null,
        message: formData.message,
      },
    ])
    .select()

  if (error) {
    console.error('Error submitting contact message:', error)
    return { message: null, error }
  }

  return { message: data?.[0], error: null }
}

/**
 * Get church statistics (for dashboard)
 */
export async function getChurchStats() {
  const { count: totalChurches } = await supabase
    .from('churches')
    .select('id', { count: 'exact', head: true })
    .eq('active', true)

  const { count: verifiedChurches } = await supabase
    .from('churches')
    .select('id', { count: 'exact', head: true })
    .eq('verified', true)

  const { count: claimedChurches } = await supabase
    .from('churches')
    .select('id', { count: 'exact', head: true })
    .eq('claimed', true)

  const { count: pendingClaims } = await supabase
    .from('church_claims')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending')

  return {
    totalChurches: totalChurches || 0,
    verifiedChurches: verifiedChurches || 0,
    claimedChurches: claimedChurches || 0,
    pendingClaims: pendingClaims || 0,
  }
}
