'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { clearAllUserData, getCurrentUserEmail } from '@/lib/storage'
import { useState, useEffect, useRef } from 'react'

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [userPassword, setUserPassword] = useState<string>('')
  const accountMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadUserEmail = async () => {
      const email = await getCurrentUserEmail()
      setUserEmail(email)
    }
    loadUserEmail()
  }, [])

  const handleShowPassword = async () => {
    if (!showPassword && userEmail) {
      try {
        const response = await fetch('/api/user-password')
        const data = await response.json()
        if (data.hasPassword) {
          setUserPassword(data.maskedPassword)
        }
      } catch (error) {
        console.error('Error fetching password:', error)
      }
    }
    setShowPassword(!showPassword)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Don't show navigation on login, verify, signup, and forgot-password pages
  const hideNav = pathname === '/' || pathname === '/login' || pathname === '/verify' || pathname === '/signup' || pathname === '/forgot-password'
  
  if (hideNav) {
    return null
  }

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/input', label: 'Input Data' },
    { href: '/results', label: 'Results & Goals' },
    { href: '/progress', label: 'Progress' },
  ]

  const isActive = (href: string) => pathname === href

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' })
      clearAllUserData()
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const getUserInitial = () => {
    if (userEmail) {
      // Get first character of email (before @)
      return userEmail.charAt(0).toUpperCase()
    }
    return 'U'
  }

  const getUserName = () => {
    if (userEmail) {
      // Get the part before @ as the "name"
      return userEmail.split('@')[0]
    }
    return 'User'
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Name */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#2B6CB0] to-[#4299E1] shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#1A202C]">Val</h1>
              <p className="text-sm text-[#718096]">Budgeting</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-all duration-300 relative ${
                  isActive(link.href)
                    ? 'text-[#2B6CB0] font-semibold'
                    : 'text-[#718096] hover:text-[#2B6CB0]'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#2B6CB0] to-[#9F7AEA]" />
                )}
              </Link>
            ))}
          </nav>

          {/* User Profile / Logout */}
          <div className="flex items-center gap-4">
            <div className="relative" ref={accountMenuRef}>
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-[#2B6CB0] to-[#9F7AEA] shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                <span className="text-white text-sm font-bold">{getUserInitial()}</span>
              </button>
              
              {/* Account Menu Dropdown */}
              {showAccountMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#2B6CB0] to-[#9F7AEA] shadow-md">
                        <span className="text-white text-lg font-bold">{getUserInitial()}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-[#1A202C]">{getUserName()}</p>
                        <p className="text-sm text-[#718096]">{userEmail}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="mb-4">
                      <label className="text-xs font-semibold text-[#718096] uppercase tracking-wide mb-2 block">
                        Account Details
                      </label>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#1A202C]">Email:</span>
                          <span className="text-sm text-[#718096]">{userEmail}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4">
                      <button
                        onClick={handleShowPassword}
                        className="w-full text-left text-sm text-[#2B6CB0] hover:text-[#4299E1] font-medium mb-2"
                      >
                        {showPassword ? 'Hide Password' : 'Show Password'}
                      </button>
                      
                      {showPassword && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-[#718096] mb-1">Your password:</p>
                          <p className="text-sm font-mono text-[#1A202C]">{userPassword || '••••••••'}</p>
                          <p className="text-xs text-[#718096] mt-1">For security, your actual password is not displayed</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
