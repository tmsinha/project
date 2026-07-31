'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatCurrency, formatPercentage } from '@/lib/financialCalculator'
import type { AdjustedFinancials } from '@/lib/financialCalculator'
import { getFinancialResults, getCurrentUserEmail } from '@/lib/storage'

export default function DashboardPage() {
  const router = useRouter()
  const [results, setResults] = useState<AdjustedFinancials & { advice: string[]; inputs: any; goal: any } | null>(null)
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const loadUserData = async () => {
      // Get current user email
      const email = await getCurrentUserEmail()
      setUserEmail(email)
      
      // Check if user has password set
      try {
        const response = await fetch('/api/check-password')
        const data = await response.json()
        
        if (data.requiresPassword) {
          router.push('/set-password')
          return
        }
      } catch (error) {
        console.error('Error checking password status:', error)
      }
      
      // Check for stored results
      const storedResults = getFinancialResults()
      if (storedResults) {
        setResults(storedResults)
      }
      setLoading(false)
    }
    
    loadUserData()
  }, [router])

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-50'
      case 'Moderate': return 'text-yellow-600 bg-yellow-50'
      case 'High': return 'text-orange-600 bg-orange-50'
      case 'Critical': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-10 blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1A202C] mb-2">Dashboard</h1>
          <p className="text-[#718096]">Manage your business finances and financial planning</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-[#2B6CB0] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : results ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-[#718096]">Total Revenue</span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#2B6CB0] to-[#4299E1] shadow-md group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white">$</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-[#1A202C]">{formatCurrency(results.inputs.revenue)}</p>
                <p className="text-sm text-[#718096] mt-1">Monthly revenue</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-[#718096]">Net Profit</span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#9F7AEA] to-[#B794F4] shadow-md group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white">📈</span>
                  </div>
                </div>
                <p className={`text-2xl font-bold ${results.adjusted.netIncome >= 0 ? 'text-[#2B6CB0]' : 'text-red-600'}`}>
                  {formatCurrency(results.adjusted.netIncome)}
                </p>
                <p className="text-sm text-[#718096] mt-1">After goal adjustments</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-[#718096]">Profit Margin</span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#2B6CB0] to-[#9F7AEA] shadow-md group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white">%</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-[#1A202C]">{formatPercentage(results.adjusted.netProfitMargin)}</p>
                <p className="text-sm text-[#718096] mt-1">Net profit margin</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-[#718096]">Risk Level</span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#9F7AEA] to-[#EC4899] shadow-md group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white">⚠️</span>
                  </div>
                </div>
                <p className={`text-2xl font-bold ${getRiskColor(results.risk.riskLevel).split(' ')[0]}`}>
                  {results.risk.riskLevel}
                </p>
                <p className="text-sm text-[#718096] mt-1">Current risk assessment</p>
              </div>
            </div>

            {/* Recent Analysis Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <h2 className="text-xl font-semibold text-[#1A202C] mb-4 pb-4 border-b border-gray-200">
                  Current Goal Analysis
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#718096]">Goal Type</span>
                    <span className="text-sm font-semibold text-[#1A202C] capitalize">
                      {results.goal.goalType === 'continuity' ? 'Business Continuity' : 
                       results.goal.goalType === 'custom' ? 'Custom Goal' :
                       results.goal.goalType}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#718096]">Target Amount</span>
                    <span className="text-sm font-semibold text-[#1A202C]">{formatCurrency(results.goal.goalAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#718096]">Timeline</span>
                    <span className="text-sm font-semibold text-[#1A202C]">{results.goal.goalTimeline} months</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#718096]">Monthly Impact</span>
                    <span className="text-sm font-semibold text-[#9F7AEA]">{formatCurrency(results.goalImpact.monthlyOngoingCost)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <h2 className="text-xl font-semibold text-[#1A202C] mb-4 pb-4 border-gray-200">
                  Financial Health Metrics
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-[#718096]">Safety Buffer</span>
                      <span className="text-sm font-semibold text-[#1A202C]">{results.adjusted.safetyBuffer.toFixed(1)} months</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-[#9F7AEA] to-[#B794F4] h-2 rounded-full" style={{ width: `${Math.min(100, (results.adjusted.safetyBuffer / 12) * 100)}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-[#718096]">Profit Margin Score</span>
                      <span className="text-sm font-semibold text-[#1A202C]">{results.risk.factors.profitMargin}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-[#2B6CB0] to-[#4299E1] h-2 rounded-full" style={{ width: `${results.risk.factors.profitMargin}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-[#718096]">Cash Flow Health</span>
                      <span className="text-sm font-semibold text-[#1A202C]">{results.risk.factors.cashFlowHealth}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-[#2B6CB0] to-[#9F7AEA] h-2 rounded-full" style={{ width: `${results.risk.factors.cashFlowHealth}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-4">
              <Link
                href="/input"
                className="px-6 py-3 bg-gradient-to-r from-[#2B6CB0] to-[#4299E1] hover:from-[#2C5282] hover:to-[#3182CE] text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-105"
              >
                Update Financial Data
              </Link>
              <Link
                href="/results"
                className="px-6 py-3 border-2 border-[#2B6CB0] text-[#2B6CB0] font-semibold rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all"
              >
                View Detailed Results
              </Link>
            </div>
          </>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-12 shadow-lg border border-gray-100 border-dashed">
            <div className="flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2B6CB0] to-[#9F7AEA] flex items-center justify-center mb-4 shadow-lg animate-float">
                <span className="text-3xl">🛠️</span>
              </div>
              <h3 className="text-xl font-semibold text-[#1A202C] mb-2">Get Started</h3>
              <p className="text-[#718096] max-w-md mb-6">
                Begin by entering your financial data and setting your business goals.
              </p>
              <Link
                href="/input"
                className="px-6 py-3 bg-gradient-to-r from-[#2B6CB0] to-[#4299E1] hover:from-[#2C5282] hover:to-[#3182CE] text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-105"
              >
                Input Financial Data
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}