import { createClient } from '@supabase/supabase-js'

// These environment variables should be set in your .env or .env.local file
// VITE_SUPABASE_URL - Your Supabase project URL
// VITE_SUPABASE_ANON_KEY - Your Supabase anonymous key (safe for client-side use)

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

export type Database = any // Update with generated types from supabase-js when ready
