import { supabase } from './supabaseClient'

export const testConnection = async () => {
  const { data, error } = await supabase.from('videos').select('*').limit(1)
  console.log("SUPABASE TEST:", data, error)
}
