'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatCurrency, formatPercentage } from '@/lib/financialCalculator'
import type { AdjustedFinancials } from '@/lib/financialCalculator'

export default function DashboardPage() {
  const [results, setResults] = useState<AdjustedFinancials & { advice: string[]; inputs: any; goal: any } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored results
    const storedResults = sessionStorage.getItem('financialResults')
    if (storedResults) {
      try {
        setResults(JSON.parse(storedResults))
      } catch (err) {
        console.error('Failed to parse stored results:', err)
      }
    }
    setLoading(false)
  }, [])

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
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1A202C] mb-2">Dashboard</h1>
          <p className="text-[#718096]">Manage your business budget and financial planning</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-[#2B6CB0] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : results ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-[#F7FAFC] rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-[#718096]">Total Revenue</span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(43, 108, 176, 0.1)' }}>
                    <span className="text-[#2B6CB0]">$</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-[#1A202C]">{formatCurrency(results.inputs.revenue)}</p>
                <p className="text-sm text-[#718096] mt-1">Monthly revenue</p>
              </div>

              <div className="bg-[#F7FAFC] rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-[#718096]">Net Profit</span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(159, 122, 234, 0.1)' }}>
                    <span className="text-[#9F7AEA]">📈</span>
                  </div>
                </div>
                <p className={`text-2xl font-bold ${results.adjusted.netIncome >= 0 ? 'text-[#2B6CB0]' : 'text-red-600'}`}>
                  {formatCurrency(results.adjusted.netIncome)}
                </p>
                <p className="text-sm text-[#718096] mt-1">After goal adjustments</p>
              </div>

              <div className="bg-[#F7FAFC] rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-[#718096]">Profit Margin</span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(43, 108, 176, 0.1)' }}>
                    <span className="text-[#2B6CB0]">%</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-[#1A202C]">{formatPercentage(results.adjusted.netProfitMargin)}</p>
                <p className="text-sm text-[#718096] mt-1">Net profit margin</p>
              </div>

              <div className="bg-[#F7FAFC] rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-[#718096]">Risk Level</span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(159, 122, 234, 0.1)' }}>
                    <span className="text-[#9F7AEA]">⚠️</span>
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
              <div className="bg-[#F7FAFC] rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-[#1A202C] mb-4 pb-4 border-b border-gray-200">
                  Current Goal Analysis
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#718096]">Goal Type</span>
                    <span className="text-sm font-semibold text-[#1A202C] capitalize">{results.goal.goalType}</span>
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

              <div className="bg-[#F7FAFC] rounded-xl p-6 shadow-sm border border-gray-200">
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
                      <div className="bg-[#9F7AEA] h-2 rounded-full" style={{ width: `${Math.min(100, (results.adjusted.safetyBuffer / 12) * 100)}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-[#718096]">Profit Margin Score</span>
                      <span className="text-sm font-semibold text-[#1A202C]">{results.risk.factors.profitMargin}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#2B6CB0] h-2 rounded-full" style={{ width: `${results.risk.factors.profitMargin}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-[#718096]">Cash Flow Health</span>
                      <span className="text-sm font-semibold text-[#1A202C]">{results.risk.factors.cashFlowHealth}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#2B6CB0] h-2 rounded-full" style={{ width: `${results.risk.factors.cashFlowHealth}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-4">
              <Link
                href="/input"
                className="px-6 py-3 bg-[#2B6CB0] hover:bg-[#2C5282] text-white font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md"
              >
                Update Financial Data
              </Link>
              <Link
                href="/results"
                className="px-6 py-3 border border-gray-300 text-[#1A202C] font-semibold rounded-lg hover:bg-[#F7FAFC] transition-colors"
              >
                View Detailed Results
              </Link>
            </div>
          </>
        ) : (
          <div className="bg-[#F7FAFC] rounded-xl p-12 shadow-sm border border-gray-200 border-dashed">
            <div className="flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#F7FAFC] border-2 border-[#2B6CB0] flex items-center justify-center mb-4">
                <span className="text-3xl">🛠️</span>
              </div>
              <h3 className="text-xl font-semibold text-[#1A202C] mb-2">Get Started</h3>
              <p className="text-[#718096] max-w-md mb-6">
                Begin by entering your financial data and setting your business goals.
              </p>
              <Link
                href="/input"
                className="px-6 py-3 bg-[#2B6CB0] hover:bg-[#2C5282] text-white font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md"
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