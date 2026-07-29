'use server'

import { redirect } from 'next/navigation'
import { getValidVerificationCode, markVerificationCodeUsed } from '@/lib/db'

export async function verifyAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const code = formData.get('code') as string
  
  if (!email || !code) {
    return { error: 'Email and code are required' }
  }
  
  if (code.length !== 6) {
    return { error: 'Please enter a valid 6-digit code' }
  }
  
  try {
    const validCode = await getValidVerificationCode(email, code)
    
    if (!validCode) {
      return { error: 'Invalid or expired code' }
    }
    
    // Mark the code as used
    await markVerificationCodeUsed(validCode.id)
    
  } catch (error) {
    console.error('Verification error:', error)
    return { error: 'Verification failed. Please try again.' }
  }

  // Redirect outside try-catch to avoid catching the redirect error
  redirect('/dashboard')
}