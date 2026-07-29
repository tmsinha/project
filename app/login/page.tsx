'use client'

import { useActionState } from 'react'
import { loginAction } from '@/actions/login'

const initialState = {
  error: ''
}

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState)

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-white min-h-screen">
      <main className="flex flex-col w-full max-w-md items-center justify-center p-8 bg-[#F7FAFC] rounded-2xl shadow-sm border border-gray-200">
        <div className="flex flex-col items-center gap-6 text-center w-full mb-6">
          <div className="w-16 h-16 bg-[#2B6CB0] rounded-full flex items-center justify-center mb-2">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold leading-10 tracking-tight text-[#1A202C]">
            Budget App Login
          </h1>
          <p className="text-lg leading-8 text-[#718096]">
            Enter your email to receive a magic login link
          </p>
        </div>
        
        <div className="bg-[#F7FAFC] border border-[#9F7AEA] rounded-lg p-4 mb-6 w-full">
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
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all"
            />
          </div>
          
          {state.error && (
            <div className="bg-[#FFF5F5] border border-[#E53E3E] rounded-lg p-3">
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
            className="w-full h-12 items-center justify-center gap-2 rounded-lg bg-[#2B6CB0] hover:bg-[#2C5282] text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex shadow-sm hover:shadow-md"
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
          <p>Secure, passwordless authentication powered by Resend</p>
        </div>
      </main>
    </div>
  )
}