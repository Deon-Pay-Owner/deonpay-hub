'use server'

import { createClient } from '@/lib/supabase'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  // First, check if the user exists in hub_users table
  const { data: hubUser, error: hubUserError } = await supabase
    .from('hub_users')
    .select('id, email, role, is_active')
    .eq('email', email)
    .single()

  if (hubUserError || !hubUser) {
    return { error: 'Invalid credentials or access denied' }
  }

  if (!hubUser.is_active) {
    return { error: 'Your account has been deactivated. Please contact an administrator.' }
  }

  // Authenticate with Supabase Auth
  const { error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (authError) {
    return { error: 'Invalid credentials' }
  }

  // Return success - let the client handle redirect
  return { success: true }
}
