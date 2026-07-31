/**
 * Client-side storage utilities for persisting user data
 * Uses localStorage with user-specific keys for persistence across sessions
 */

export async function getCurrentUserEmail(): Promise<string | null> {
  try {
    // Try to get user email from localStorage
    const userEmail = localStorage.getItem('userEmail')
    if (userEmail) {
      return userEmail
    }
    
    // If not in localStorage, check with server
    const response = await fetch('/api/user')
    if (response.ok) {
      const data = await response.json()
      if (data.email) {
        localStorage.setItem('userEmail', data.email)
        localStorage.setItem('userName', data.name || data.email.split('@')[0])
        return data.email
      }
    }
    
    return null
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export function getUserStorageKey(baseKey: string): string {
  const userEmail = localStorage.getItem('userEmail')
  return userEmail ? `${baseKey}_${userEmail}` : baseKey
}

export function setUserEmail(email: string): void {
  localStorage.setItem('userEmail', email)
}

export function setUserName(name: string): void {
  localStorage.setItem('userName', name)
}

export function getUserName(): string | null {
  return localStorage.getItem('userName')
}

export function clearUserEmail(): void {
  localStorage.removeItem('userEmail')
  localStorage.removeItem('userName')
}

export function setFinancialResults(results: any): void {
  const key = getUserStorageKey('financialResults')
  localStorage.setItem(key, JSON.stringify(results))
}

export function getFinancialResults(): any | null {
  const key = getUserStorageKey('financialResults')
  const stored = localStorage.getItem(key)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (error) {
      console.error('Error parsing financial results:', error)
      return null
    }
  }
  return null
}

export function clearFinancialResults(): void {
  const key = getUserStorageKey('financialResults')
  localStorage.removeItem(key)
}

export function clearAllUserData(): void {
  const userEmail = localStorage.getItem('userEmail')
  if (userEmail) {
    // Clear all user-specific data
    Object.keys(localStorage).forEach(key => {
      if (key.endsWith(`_${userEmail}`)) {
        localStorage.removeItem(key)
      }
    })
  }
  clearUserEmail()
  localStorage.removeItem('userName')
}
