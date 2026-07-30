'use server'

import { redirect } from 'next/navigation'
import { createVerificationCode, createOrUpdateUser } from '@/lib/db'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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
    
  } catch (error) {
    console.error('Database error:', error)
    return { error: 'Failed to process login. Please try again.' }
  }

  // Redirect to verify page without showing code in URL
  redirect(`/verify?email=${encodeURIComponent(email)}`)
}