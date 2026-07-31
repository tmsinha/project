import { NextResponse } from 'next/server'
import { getCurrentUser, getUserByEmail } from '@/lib/db'

export async function GET() {
  try {
    const email = await getCurrentUser()
    
    if (!email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    const user = await getUserByEmail(email)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // For security, we don't return the actual password
    // We return a masked version for display purposes
    return NextResponse.json({ 
      hasPassword: !!user.password,
      maskedPassword: '••••••••',
      email,
      name: user.name
    })
  } catch (error) {
    console.error('Error fetching user password:', error)
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 })
  }
}