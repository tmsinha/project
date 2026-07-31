import { NextResponse } from 'next/server'
import { getCurrentUser, userHasPassword } from '@/lib/db'

export async function GET() {
  try {
    const email = await getCurrentUser()
    
    if (!email) {
      return NextResponse.json({ hasPassword: false, requiresPassword: true }, { status: 401 })
    }
    
    const hasPassword = await userHasPassword(email)
    
    return NextResponse.json({ 
      hasPassword, 
      requiresPassword: !hasPassword,
      email 
    })
  } catch (error) {
    console.error('Error checking password status:', error)
    return NextResponse.json({ hasPassword: false, requiresPassword: true }, { status: 500 })
  }
}