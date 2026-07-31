'use server'

import { createOrUpdateUser, getUserByEmail, setAuthSession } from '@/lib/db'
import { hashPassword, validatePasswordStrength } from '@/lib/password'

export async function setPasswordAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  
  if (!email || !password || !confirmPassword) {
    return { error: 'All fields are required' }
  }
  
  // Validate password strength
  const passwordValidation = validatePasswordStrength(password)
  if (!passwordValidation.valid) {
    return { error: passwordValidation.message }
  }
  
  // Check if passwords match
  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' }
  }
  
  try {
    // Hash the password
    const hashedPassword = await hashPassword(password)
    
    // Store the hashed password
    await createOrUpdateUser(email, hashedPassword)
    
    // Set auth session
    await setAuthSession(email)
    
    console.log(`Password set for ${email}`)
    
    return { success: true, email }
    
  } catch (error) {
    console.error('Password setting error:', error)
    return { error: 'Failed to set password. Please try again.' }
  }
}