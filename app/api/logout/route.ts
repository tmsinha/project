import { NextResponse } from 'next/server'
import { clearAuthSession } from '@/lib/db'

export async function POST() {
  try {
    await clearAuthSession()
    
    // Create response with instructions to clear client-side storage
    const response = NextResponse.json({ success: true })
    
    // Set cookie to signal client to clear localStorage
    response.cookies.set('clear-storage', 'true', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 // Short-lived cookie just to trigger the clear
    })
    
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}