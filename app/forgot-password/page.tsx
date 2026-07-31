'use client'

import { useActionState, Suspense } from 'react'
import { sendCodeAction } from '@/actions/send-code'
import { useSearchParams, useRouter } from 'next/navigation'

const initialState = {
  error: ''
}

function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(sendCodeAction, initialState)
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold leading-10 tracking-tight text-[#1A202C]">
            Forgot Password?
          </h1>
          <p className="text-lg leading-8 text-[#718096]">
            Enter your email to receive a login code
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-[#2B6CB0] rounded-lg p-4 mb-6 w-full">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-[#2B6CB0] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-[#1A202C]">
              We'll send a 6-digit code to your email. You can use this code to log in to your account.
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
              defaultValue={email}
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
          
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="w-full h-12 items-center justify-center gap-2 rounded-lg border-2 border-[#2B6CB0] text-[#2B6CB0] font-semibold hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-colors mt-2"
          >
            Back to Login
          </button>
        </form>
      </main>
    </div>
  )
}

export default function ForgotPasswordPage() {
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
      <ForgotPasswordForm />
    </Suspense>
  )
}