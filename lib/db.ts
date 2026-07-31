import { cookies } from 'next/headers'

// In-memory storage for development (won't persist across server restarts)
// For production, this should be replaced with a proper database
let verificationCodes: Map<string, { code: string; expiresAt: Date; used: boolean }> = new Map()
let users: Map<string, { email: string; password?: string }> = new Map()

export async function createVerificationCode(email: string, code: string, expiresAt: Date): Promise<void> {
  verificationCodes.set(`${email}_${code}`, {
    code,
    expiresAt,
    used: false
  })
  console.log(`Created verification code for ${email}: ${code}`)
}

export async function getValidVerificationCode(email: string, code: string): Promise<any> {
  const key = `${email}_${code}`
  const storedCode = verificationCodes.get(key)
  
  if (!storedCode) {
    console.log(`No code found for ${email} with code ${code}`)
    return null
  }
  
  const now = new Date()
  
  if (storedCode.used) {
    console.log(`Code for ${email} already used`)
    return null
  }
  
  if (storedCode.expiresAt < now) {
    console.log(`Code for ${email} expired`)
    verificationCodes.delete(key)
    return null
  }
  
  console.log(`Valid code found for ${email}`)
  return { id: key, email, code: storedCode.code, expires_at: storedCode.expiresAt }
}

export async function markVerificationCodeUsed(id: string): Promise<void> {
  const storedCode = verificationCodes.get(id)
  if (storedCode) {
    storedCode.used = true
    console.log(`Marked code ${id} as used`)
  }
}

export async function createOrUpdateUser(email: string, password?: string): Promise<void> {
  const existingUser = users.get(email)
  if (existingUser) {
    if (password) {
      existingUser.password = password
    }
  } else {
    users.set(email, { email, password })
  }
  console.log(`User created/updated: ${email}`)
}

export async function getUserByEmail(email: string): Promise<{ email: string; password?: string } | null> {
  return users.get(email) || null
}

export async function userHasPassword(email: string): Promise<boolean> {
  const user = users.get(email)
  return !!user?.password
}

export async function isUserAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')
  return !!sessionCookie
}

export async function setAuthSession(email: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('session', email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  })
}

export async function clearAuthSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export async function getCurrentUser(): Promise<string | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')
  return sessionCookie?.value || null
}