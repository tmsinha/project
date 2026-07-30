import { NextResponse } from 'next/server'
import { clearAuthSession } from '@/lib/db'

export async function POST() {
  try {
    await clearAuthSession()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}