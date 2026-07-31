'use server'

import { redirect } from 'next/navigation'
import { getValidVerificationCode, markVerificationCodeUsed, setAuthSession } from '@/lib/db'

export async function verifyAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const code = formData.get('code') as string
  
  console.log(`Verifying: email=${email}, code=${code}`)
  
  if (!email || !code) {
    return { error: 'Email and code are required' }
  }
  
  if (code.length !== 6) {
    return { error: 'Please enter a valid 6-digit code' }
  }
  
  try {
    const validCode = await getValidVerificationCode(email, code)
    
    console.log('Valid code found:', validCode)
    
    if (!validCode) {
      return { error: 'Invalid or expired code' }
    }
    
    // Mark the code as used
    await markVerificationCodeUsed(validCode.id)
    
    // Set auth session
    await setAuthSession(email)
    
    console.log('Code marked as used, session set, redirecting to dashboard')
    
    // Return success with email for client-side storage
    return { success: true, email }
    
  } catch (error) {
    console.error('Verification error:', error)
    return { error: 'Verification failed. Please try again.' }
  }
}