import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://xcyamnjuxnsavnesourn.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjeWFtbmp1eG5zYXZuZXNvdXJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTQyNTcsImV4cCI6MjA2NTY3MDI1N30.4mdDnmSkCCwjwRM_xfw0plLDK8L2lIirbXn4d52SE_0"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url?: string
  vendor_id: string
  created_at: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  product: Product
}
