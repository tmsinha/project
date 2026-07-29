import { NextRequest, NextResponse } from 'next/server'
import { getValidVerificationCode, markVerificationCodeUsed } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()
    
    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 })
    }
    
    const validCode = await getValidVerificationCode(email, code)
    
    if (!validCode) {
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 })
    }
    
    // Mark the code as used
    await markVerificationCodeUsed(validCode.id)
    
    // In a real app, you would set a session cookie here
    // For now, we'll just return success
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}