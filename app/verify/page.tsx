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
    <div className="flex flex-col flex-1 items-center justify-center bg-white min-h-screen">
      <main className="flex flex-col w-full max-w-md items-center justify-center p-8 bg-[#F7FAFC] rounded-2xl shadow-sm border border-gray-200">
        <div className="flex flex-col items-center gap-6 text-center w-full mb-6">
          <div className="w-16 h-16 bg-[#2B6CB0] rounded-full flex items-center justify-center mb-2">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold leading-10 tracking-tight text-[#1A202C]">
            Verify Your Email
          </h1>
          <p className="text-lg leading-8 text-[#718096]">
            Your verification code is: <span className="font-mono font-bold text-[#2B6CB0]">{code}</span>
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
              defaultValue={code}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all text-center text-2xl tracking-widest"
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
            className="w-full h-12 items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 text-[#1A202C] transition-colors hover:bg-[#F7FAFC] mt-2"
          >
            Back to Login
          </button>
        </form>
      </main>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col flex-1 items-center justify-center bg-white min-h-screen">
        <main className="flex flex-col w-full max-w-md items-center justify-center p-8 bg-[#F7FAFC] rounded-2xl shadow-sm border border-gray-200">
          <div className="flex flex-col items-center gap-6 text-center w-full">
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