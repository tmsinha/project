import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-10 blur-2xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-10 blur-2xl"></div>
      </div>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2B6CB0] to-[#4299E1] flex items-center justify-center shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105">
              <span className="text-white font-bold text-5xl" style={{ fontFamily: 'Arial Black, Impact, sans-serif', fontWeight: '900', letterSpacing: '-2px' }}>V</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-[#1A202C] mb-6 leading-tight">
            Smart Financial Planning for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2B6CB0] to-[#9F7AEA]">Business Owners</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-[#718096] mb-12 max-w-2xl mx-auto leading-relaxed">
            Take control of your business finances with intuitive financial planning, risk analysis, and goal tracking. Make informed decisions for sustainable growth.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-left shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#2B6CB0] to-[#4299E1] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#1A202C] mb-2">Financial Planning</h3>
              <p className="text-sm text-[#718096]">Create detailed financial plans with ease</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-left shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 group">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#9F7AEA] to-[#B794F4] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#1A202C] mb-2">Risk Analysis</h3>
              <p className="text-sm text-[#718096]">Identify and mitigate financial risks</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-left shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#2B6CB0] to-[#9F7AEA] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#1A202C] mb-2">Goal Tracking</h3>
              <p className="text-sm text-[#718096]">Set and monitor your business goals</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-gradient-to-r from-[#2B6CB0] to-[#4299E1] text-white font-semibold rounded-lg hover:from-[#2C5282] hover:to-[#3182CE] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 text-lg transform hover:scale-105"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 border-2 border-[#2B6CB0] text-[#2B6CB0] font-semibold rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 text-lg"
            >
              Log In
            </Link>
          </div>

          {/* Trust indicator */}
          <div className="mt-12 flex items-center justify-center gap-2 text-sm text-[#718096]">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white"></div>
            </div>
            <p>Trusted by business owners for financial clarity</p>
          </div>
        </div>
      </main>
    </div>
  )
}
