'use client'

import { useActionState } from 'react'
import { verifyAction } from '@/actions/verify'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'

const initialState = {
  error: ''
}

function VerifyForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get('email') || ''
  const code = searchParams.get('code') || ''
  const [state, formAction, pending] = useActionState(verifyAction, initialState)

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
          <div className="w-16 h-16 bg-gradient-to-br from-[#2B6CB0] to-[#4299E1] rounded-full flex items-center justify-center mb-2 shadow-lg animate-float">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold leading-10 tracking-tight text-[#1A202C]">
            Verify Your Email
          </h1>
          <p className="text-lg leading-8 text-[#718096]">
            Enter the 6-digit code sent to <span className="font-semibold text-[#2B6CB0]">{email}</span>
          </p>
        </div>
        
        <form action={formAction} className="flex flex-col gap-4 w-full">
          <input type="hidden" name="email" value={email} />
          
          <div className="flex flex-col gap-2">
            <label htmlFor="code" className="text-sm font-semibold text-[#1A202C]">
              Verification Code
            </label>
            <input
              type="text"
              id="code"
              name="code"
              required
              maxLength={6}
              pattern="[0-9]{6}"
              placeholder="123456"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all text-center text-2xl tracking-widest shadow-sm"
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
                <svg className="h-5 w-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Verify Code
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="w-full h-12 items-center justify-center gap-2 rounded-lg border-2 border-[#2B6CB0] text-[#2B6CB0] font-semibold hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-colors mt-2"
          >
            Back to Login
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-[#718096]">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p>Secure, passwordless authentication powered by Val</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col flex-1 items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        <main className="flex flex-col w-full max-w-md items-center justify-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 relative z-10">
          <div className="flex flex-col items-center gap-6 text-center w-full">
            <div className="w-16 h-16 border-4 border-[#2B6CB0] border-t-transparent rounded-full animate-spin"></div>
            <h1 className="text-3xl font-semibold leading-10 tracking-tight text-[#1A202C]">
              Loading...
            </h1>
          </div>
        </main>
      </div>
    }>
      <VerifyForm />
    </Suspense>
  )
}