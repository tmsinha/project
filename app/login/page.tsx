'use client'

import { useActionState } from 'react'
import { loginAction } from '@/actions/login'

const initialState = {
  error: ''
}

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState)

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-10 blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <main className="flex flex-col w-full max-w-md items-center justify-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 relative z-10">
        <div className="flex flex-col items-center gap-6 text-center w-full mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[#2B6CB0] to-[#4299E1] rounded-full flex items-center justify-center mb-2 shadow-lg shadow-blue-500/30 animate-float">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold leading-10 tracking-tight text-[#1A202C]">
            Val Login
          </h1>
          <p className="text-lg leading-8 text-[#718096]">
            Enter your email to receive a magic login link
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-[#9F7AEA] rounded-lg p-4 mb-6 w-full">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-[#9F7AEA] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-[#1A202C]">
              We'll send a 6-digit code to your email. No password needed!
            </p>
          </div>
        </div>
        
        <form action={formAction} className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-semibold text-[#1A202C]">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all shadow-sm"
            />
          </div>
          
          {state.error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-[#E53E3E] rounded-lg p-3">
              <p className="text-[#E53E3E] text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {state.error}
              </p>
            </div>
          )}
          
          <button
            type="submit"
            disabled={pending}
            className="w-full h-12 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#2B6CB0] to-[#4299E1] hover:from-[#2C5282] hover:to-[#3182CE] text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-105"
          >
            {pending ? (
              <>
                <svg className="h-5 w-5 text-white" style={{ animation: 'spin 1s linear infinite' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending Code...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Login Code
              </>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-[#718096]">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p>Secure, passwordless authentication powered by Resend</p>
          </div>
        </div>
      </main>
    </div>
  )
}