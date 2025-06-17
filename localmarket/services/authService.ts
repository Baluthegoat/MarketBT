// services/authService.ts

import { supabase } from "../lib/supabase"

export async function registerUser(email: string, password: string) {
  if (!email || !password) {
    throw new Error("Email and password are required")
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters")
  }

  const { error } = await supabase.auth.signUp({ email, password })
  if (error) throw error

  return true
}

export async function loginUser(email: string, password: string) {
  if (!email || !password) {
    throw new Error("Email and password are required")
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error

  return true
}
