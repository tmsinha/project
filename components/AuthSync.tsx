'use client'

import { useEffect } from 'react'
import { setUserEmail, getCurrentUserEmail } from '@/lib/storage'

export default function AuthSync() {
  useEffect(() => {
    const syncAuth = async () => {
      // Check if we already have the user email in localStorage
      const localEmail = localStorage.getItem('userEmail')
      
      if (!localEmail) {
        // Try to get the email from the server
        const serverEmail = await getCurrentUserEmail()
        if (serverEmail) {
          setUserEmail(serverEmail)
        }
      }
    }
    
    syncAuth()
  }, [])

  return null // This component doesn't render anything
}
