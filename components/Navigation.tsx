'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  // Don't show navigation on login, verify, and welcome pages
  const hideNav = pathname === '/' || pathname === '/login' || pathname === '/verify'
  
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

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Name */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#2B6CB0] to-[#4299E1] shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#1A202C]">Budget Pro</h1>
              <p className="text-sm text-[#718096]">Business Budget Planning</p>
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
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-[#2B6CB0] to-[#9F7AEA] shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <span className="text-white text-sm font-medium">U</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
