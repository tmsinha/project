'use server'

import { redirect } from 'next/navigation'
import { createVerificationCode, createOrUpdateUser, getUserByEmail, setAuthSession, userHasPassword } from '@/lib/db'
import { verifyPassword, hashPassword, validatePasswordStrength } from '@/lib/password'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const loginMethod = formData.get('loginMethod') as string
  
  if (!email || !email.includes('@')) {
    return { error: 'Please enter a valid email address' }
  }

  try {
    // Check if user exists and has password
    const user = await getUserByEmail(email)
    const hasPassword = await userHasPassword(email)
    
    // Password-based login
    if (loginMethod === 'password' && password) {
      if (!user) {
        return { error: 'No account found with this email. Please sign up first.' }
      }
      
      if (!hasPassword) {
        return { error: 'This account uses email codes. Please use the code login method.' }
      }
      
      const isValidPassword = await verifyPassword(password, user.password!)
      
      if (!isValidPassword) {
        return { error: 'Invalid password' }
      }
      
      // Set auth session
      await setAuthSession(email)
      
      console.log(`Password login successful for ${email}`)
      
      return { success: true, email, method: 'password', name: user.name }
    }
    
    // Signup flow - send verification code
    if (loginMethod === 'signup') {
      // Validate password strength
      if (!password) {
        return { error: 'Password is required' }
      }
      
      const passwordValidation = validatePasswordStrength(password)
      if (!passwordValidation.valid) {
        return { error: passwordValidation.message }
      }
      
      // Hash the password
      const hashedPassword = await hashPassword(password)
      
      // Generate a 6-digit verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      
      // Set expiration to 15 minutes from now
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

      // Store in database with password and generated name
      const userName = email.split('@')[0]
      await createOrUpdateUser(email, hashedPassword, userName)
      await createVerificationCode(email, code, expiresAt)
      
      console.log(`Signup code generated for ${email}: ${code}`)
      
      // Send email using Resend
      try {
        await resend.emails.send({
          from: 'Val <onboarding@resend.dev>',
          to: email,
          subject: 'Your Val Verification Code',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2B6CB0;">Welcome to Val!</h2>
              <p>Your verification code is:</p>
              <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                ${code}
              </div>
              <p style="color: #666;">This code will expire in 15 minutes.</p>
              <p style="color: #666;">If you didn't request this code, please ignore this email.</p>
            </div>
          `,
        })
        console.log(`Email sent to ${email}`)
      } catch (emailError) {
        console.error('Failed to send email:', emailError)
        // Continue with the flow even if email fails (for development)
      }
      
      return { success: true, email, method: 'code', name: userName }
    }
    
    // Code-based login (forgot password flow)
    if (loginMethod === 'code' || !loginMethod) {
      // Generate a 6-digit verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      
      // Set expiration to 15 minutes from now
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

      // Store in database
      const existingUser = await getUserByEmail(email)
      const userName = existingUser?.name || email.split('@')[0]
      await createOrUpdateUser(email, undefined, userName)
      await createVerificationCode(email, code, expiresAt)
      
      console.log(`Login code generated for ${email}: ${code}`)
      
      // Send email using Resend
      try {
        await resend.emails.send({
          from: 'Val <onboarding@resend.dev>',
          to: email,
          subject: 'Your Val Login Code',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2B6CB0;">Your Login Code</h2>
              <p>Your verification code is:</p>
              <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                ${code}
              </div>
              <p style="color: #666;">This code will expire in 15 minutes.</p>
              <p style="color: #666;">If you didn't request this code, please ignore this email.</p>
            </div>
          `,
        })
        console.log(`Email sent to ${email}`)
      } catch (emailError) {
        console.error('Failed to send email:', emailError)
        // Continue with the flow even if email fails (for development)
      }
      
      // Redirect to verify page without showing code in URL
      redirect(`/verify?email=${encodeURIComponent(email)}`)
    }
    
    return { error: 'Invalid login method' }
    
  } catch (error) {
    console.error('Database error:', error)
    return { error: 'Failed to process login. Please try again.' }
  }
}