import { NextResponse } from 'next/server'
import { getCurrentUser, getUserByEmail } from '@/lib/db'

export async function GET() {
  try {
    const userEmail = await getCurrentUser()
    if (userEmail) {
      const user = await getUserByEmail(userEmail)
      if (user) {
        return NextResponse.json({ email: user.email, name: user.name })
      }
      return NextResponse.json({ email: userEmail, name: userEmail.split('@')[0] })
    }
    return NextResponse.json({ email: null, name: null }, { status: 401 })
  } catch (error) {
    console.error('Error getting current user:', error)
    return NextResponse.json({ email: null, name: null }, { status: 500 })
  }
}
