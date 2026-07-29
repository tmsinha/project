import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'database.json')

interface Database {
  users: Array<{ id: number; email: string; created_at: string }>;
  verification_codes: Array<{ id: number; email: string; code: string; expires_at: string; used: boolean; created_at: string }>;
}

let db: Database | null = null

export async function getDb(): Promise<Database> {
  if (db) return db

  // Ensure data directory exists
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  console.log('Initializing JSON database...')
  
  if (fs.existsSync(DB_PATH)) {
    const data = fs.readFileSync(DB_PATH, 'utf-8')
    db = JSON.parse(data)
  } else {
    db = {
      users: [],
      verification_codes: []
    }
    saveDb()
  }

  console.log('Database initialized successfully')
  return db! // Use non-null assertion since we've initialized db above
}

export function saveDb() {
  if (db) {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
  }
}

export async function createVerificationCode(email: string, code: string, expiresAt: Date): Promise<void> {
  const database = await getDb()
  const newCode = {
    id: database.verification_codes.length + 1,
    email,
    code,
    expires_at: expiresAt.toISOString(),
    used: false,
    created_at: new Date().toISOString()
  }
  database.verification_codes.push(newCode)
  saveDb()
}

export async function getValidVerificationCode(email: string, code: string): Promise<any> {
  const database = await getDb()
  const now = new Date().toISOString()
  const validCode = database.verification_codes.find(
    vc => vc.email === email && 
         vc.code === code && 
         !vc.used && 
         vc.expires_at > now
  )
  return validCode || null
}

export async function markVerificationCodeUsed(id: number): Promise<void> {
  const database = await getDb()
  const codeIndex = database.verification_codes.findIndex(vc => vc.id === id)
  if (codeIndex !== -1) {
    database.verification_codes[codeIndex].used = true
    saveDb()
  }
}

export async function createOrUpdateUser(email: string): Promise<void> {
  const database = await getDb()
  const existingUser = database.users.find(u => u.email === email)
  
  if (!existingUser) {
    const newUser = {
      id: database.users.length + 1,
      email,
      created_at: new Date().toISOString()
    }
    database.users.push(newUser)
    saveDb()
  }
}