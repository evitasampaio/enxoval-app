import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://jstwxgzvgubbzehjimdh.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzdHd4Z3p2Z3ViYnplaGppbWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyODM1MDcsImV4cCI6MjA5NDg1OTUwN30.U4wVrmHbp0j4WxH4MYWSAqVxZns7hrE71tbLERGOGuc'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)