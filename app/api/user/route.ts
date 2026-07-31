import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/db'

export async function GET() {
  try {
    const userEmail = await getCurrentUser()
    if (userEmail) {
      return NextResponse.json({ email: userEmail })
    }
    return NextResponse.json({ email: null }, { status: 401 })
  } catch (error) {
    console.error('Error getting current user:', error)
    return NextResponse.json({ email: null }, { status: 500 })
  }
}
