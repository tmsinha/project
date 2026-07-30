'use server'

import { redirect } from 'next/navigation'
import { createVerificationCode, createOrUpdateUser } from '@/lib/db'

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  
  if (!email || !email.includes('@')) {
    return { error: 'Please enter a valid email address' }
  }

  // Generate a 6-digit verification code
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  
  // Set expiration to 15 minutes from now
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

  try {
    // Store in database
    await createOrUpdateUser(email)
    await createVerificationCode(email, code, expiresAt)
    
    console.log(`Login code generated for ${email}: ${code}`)
    
  } catch (error) {
    console.error('Database error:', error)
    return { error: 'Failed to process login. Please try again.' }
  }

  // Redirect outside try-catch to avoid catching the redirect error
  redirect(`/verify?email=${encodeURIComponent(email)}&code=${code}`)
}