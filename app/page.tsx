import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-[#2B6CB0] flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-4xl">B</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-[#1A202C] mb-6 leading-tight">
            Smart Budget Planning for <br />
            <span className="text-[#2B6CB0]">Small Business Owners</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-[#718096] mb-12 max-w-2xl mx-auto leading-relaxed">
            Take control of your business finances with intuitive budgeting, risk analysis, and goal tracking. Make informed decisions for sustainable growth.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="bg-[#F7FAFC] rounded-xl p-6 text-left">
              <div className="w-12 h-12 rounded-lg bg-[#2B6CB0] flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#1A202C] mb-2">Budget Planning</h3>
              <p className="text-sm text-[#718096]">Create detailed financial plans with ease</p>
            </div>

            <div className="bg-[#F7FAFC] rounded-xl p-6 text-left">
              <div className="w-12 h-12 rounded-lg bg-[#9F7AEA] flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#1A202C] mb-2">Risk Analysis</h3>
              <p className="text-sm text-[#718096]">Identify and mitigate financial risks</p>
            </div>

            <div className="bg-[#F7FAFC] rounded-xl p-6 text-left">
              <div className="w-12 h-12 rounded-lg bg-[#2B6CB0] flex items-center justify-center mb-4">
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
              href="/login"
              className="px-8 py-4 bg-[#2B6CB0] text-white font-semibold rounded-lg hover:bg-[#2C5282] transition-colors shadow-lg hover:shadow-xl text-lg"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 border-2 border-[#2B6CB0] text-[#2B6CB0] font-semibold rounded-lg hover:bg-[#F7FAFC] transition-colors text-lg"
            >
              Learn More
            </Link>
          </div>

          {/* Trust indicator */}
          <p className="mt-12 text-sm text-[#718096]">
            Trusted by small business owners for financial clarity
          </p>
        </div>
      </main>
    </div>
  )
}
