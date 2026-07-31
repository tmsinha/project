'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatCurrency, formatPercentage } from '@/lib/financialCalculator'
import type { AdjustedFinancials } from '@/lib/financialCalculator'
import { getFinancialResults, setFinancialResults } from '@/lib/storage'

interface ProgressData {
  goal: {
    goalType: string
    goalAmount: number
    goalTimeline: number
    customDescription?: string
    startDate: string
    targetDate: string
  }
  progress: {
    currentAmount: number
    percentageComplete: number
    monthlyContribution: number
    monthsRemaining: number
    onTrack: boolean
  }
  historicalData: {
    month: string
    revenue: number
    netIncome: number
    goalProgress: number
  }[]
  metrics: {
    totalRevenue: number
    averageMonthlyRevenue: number
    revenueGrowth: number
    goalRemaining: number
    projectedCompletion: string
  }
}

export default function ProgressPage() {
  const router = useRouter()
  const [progressData, setProgressData] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [newGoalType, setNewGoalType] = useState('')
  const [newGoalAmount, setNewGoalAmount] = useState('')
  const [newGoalTimeline, setNewGoalTimeline] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    // Load progress data from localStorage or initialize with sample data
    const storedResults = getFinancialResults()
    if (storedResults) {
      const progress = generateProgressData(storedResults)
      setProgressData(progress)
    } else {
      // Generate sample progress data for demonstration
      setProgressData(generateSampleProgressData())
    }
    setLoading(false)
  }, [])

  const generateProgressData = (results: any): ProgressData => {
    const goal = results.goal
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - 3) // Started 3 months ago
    const targetDate = new Date()
    targetDate.setMonth(targetDate.getMonth() + goal.goalTimeline)

    // Generate historical data
    const historicalData = []
    for (let i = 0; i < 4; i++) {
      const date = new Date()
      date.setMonth(date.getMonth() - (3 - i))
      historicalData.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        revenue: results.inputs.revenue * (0.9 + Math.random() * 0.2), // Some variation
        netIncome: results.adjusted.netIncome * (0.8 + Math.random() * 0.4),
        goalProgress: (goal.goalAmount * 0.25 * (i + 1)) // Linear progress
      })
    }

    const currentAmount = historicalData[historicalData.length - 1].goalProgress
    const percentageComplete = (currentAmount / goal.goalAmount) * 100
    const monthsRemaining = goal.goalTimeline - 3 // 3 months have passed
    const monthlyContribution = goal.goalAmount / goal.goalTimeline

    const totalRevenue = historicalData.reduce((sum, d) => sum + d.revenue, 0)
    const averageMonthlyRevenue = totalRevenue / historicalData.length
    const revenueGrowth = ((historicalData[historicalData.length - 1].revenue - historicalData[0].revenue) / historicalData[0].revenue) * 100

    return {
      goal: {
        ...goal,
        startDate: startDate.toISOString(),
        targetDate: targetDate.toISOString()
      },
      progress: {
        currentAmount,
        percentageComplete,
        monthlyContribution,
        monthsRemaining,
        onTrack: percentageComplete >= 25 // Basic on-track calculation
      },
      historicalData,
      metrics: {
        totalRevenue,
        averageMonthlyRevenue,
        revenueGrowth,
        goalRemaining: goal.goalAmount - currentAmount,
        projectedCompletion: percentageComplete >= 100 ? 'Completed' : 
                          percentageComplete >= 75 ? 'Ahead of Schedule' :
                          percentageComplete >= 50 ? 'On Track' : 'Behind Schedule'
      }
    }
  }

  const generateSampleProgressData = (): ProgressData => {
    const goal = {
      goalType: 'growth',
      goalAmount: 150000,
      goalTimeline: 12,
      startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      targetDate: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000).toISOString()
    }

    const historicalData = [
      { month: 'Oct 23', revenue: 45000, netIncome: 8500, goalProgress: 25000 },
      { month: 'Nov 23', revenue: 47500, netIncome: 9200, goalProgress: 50000 },
      { month: 'Dec 23', revenue: 49000, netIncome: 9800, goalProgress: 75000 },
      { month: 'Jan 24', revenue: 52000, netIncome: 10500, goalProgress: 100000 }
    ]

    const currentAmount = 100000
    const percentageComplete = 66.67
    const monthsRemaining = 9
    const monthlyContribution = 12500

    return {
      goal,
      progress: {
        currentAmount,
        percentageComplete,
        monthlyContribution,
        monthsRemaining,
        onTrack: true
      },
      historicalData,
      metrics: {
        totalRevenue: 193500,
        averageMonthlyRevenue: 48375,
        revenueGrowth: 15.56,
        goalRemaining: 50000,
        projectedCompletion: 'On Track'
      }
    }
  }

  const handleGoalChange = async () => {
    if (!newGoalType || !newGoalAmount || !newGoalTimeline) {
      alert('Please fill in all goal fields')
      return
    }

    setIsUpdating(true)

    // Update the goal in progress data
    if (progressData) {
      const updatedGoal = {
        ...progressData.goal,
        goalType: newGoalType,
        goalAmount: parseFloat(newGoalAmount),
        goalTimeline: parseFloat(newGoalTimeline)
      }

      const targetDate = new Date()
      targetDate.setMonth(targetDate.getMonth() + parseFloat(newGoalTimeline))

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setProgressData({
        ...progressData,
        goal: {
          ...updatedGoal,
          targetDate: targetDate.toISOString()
        }
      })

      // Update localStorage with new goal
      const storedResults = getFinancialResults()
      if (storedResults) {
        storedResults.goal = updatedGoal
        setFinancialResults(storedResults)
      }

      setShowGoalModal(false)
      // Reset form
      setNewGoalType('')
      setNewGoalAmount('')
      setNewGoalTimeline('')
    }

    setIsUpdating(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        <div className="text-center relative z-10">
          <div className="w-16 h-16 border-4 border-[#2B6CB0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#718096]">Loading progress data...</p>
        </div>
      </div>
    )
  }

  if (!progressData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        <div className="text-center relative z-10">
          <p className="text-[#718096] mb-4">No progress data found. Please set a goal first.</p>
          <button
            onClick={() => router.push('/input')}
            className="px-6 py-3 bg-gradient-to-r from-[#2B6CB0] to-[#4299E1] hover:from-[#2C5282] hover:to-[#3182CE] text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-105"
          >
            Set a Goal
          </button>
        </div>
      </div>
    )
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1A202C] mb-2">Val Progress</h1>
            <p className="text-[#718096]">Track your business goal progress and financial metrics</p>
          </div>
          <button
            onClick={() => setShowGoalModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-[#9F7AEA] to-[#B794F4] hover:from-[#805AD5] hover:to-[#9F7AEA] text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Change Goal
          </button>
        </div>

        {/* Goal Overview Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-[#1A202C] mb-1">
                {progressData.goal.goalType === 'continuity' ? 'Business Continuity' : 
                 progressData.goal.goalType === 'custom' ? 'Custom Goal' :
                 progressData.goal.goalType.charAt(0).toUpperCase() + progressData.goal.goalType.slice(1)} Goal
              </h2>
              {progressData.goal.customDescription && (
                <p className="text-sm text-[#718096] italic">"{progressData.goal.customDescription}"</p>
              )}
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
              progressData.progress.onTrack ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {progressData.metrics.projectedCompletion}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-[#718096]">Progress</span>
              <span className="text-sm font-semibold text-[#1A202C]">{progressData.progress.percentageComplete.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full transition-all duration-500 ${
                  progressData.progress.percentageComplete >= 75 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                  progressData.progress.percentageComplete >= 50 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                  progressData.progress.percentageComplete >= 25 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                  'bg-gradient-to-r from-red-400 to-red-600'
                }`}
                style={{ width: `${Math.min(100, progressData.progress.percentageComplete)}%` }}
              ></div>
            </div>
          </div>

          {/* Goal Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
              <p className="text-xs text-[#718096] mb-1">Target Amount</p>
              <p className="text-lg font-bold text-[#1A202C]">{formatCurrency(progressData.goal.goalAmount)}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
              <p className="text-xs text-[#718096] mb-1">Current Progress</p>
              <p className="text-lg font-bold text-[#2B6CB0]">{formatCurrency(progressData.progress.currentAmount)}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
              <p className="text-xs text-[#718096] mb-1">Remaining</p>
              <p className="text-lg font-bold text-[#9F7AEA]">{formatCurrency(progressData.metrics.goalRemaining)}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
              <p className="text-xs text-[#718096] mb-1">Timeline</p>
              <p className="text-lg font-bold text-[#1A202C]">{progressData.progress.monthsRemaining} months left</p>
            </div>
          </div>
        </div>

        {/* Historical Revenue Chart */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100 mb-8">
          <h3 className="text-xl font-semibold text-[#1A202C] mb-6">Historical Revenue & Progress</h3>
          <div className="h-64 flex items-end justify-between gap-4">
            {progressData.historicalData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full relative">
                  {/* Revenue Bar */}
                  <div 
                    className="bg-gradient-to-t from-[#2B6CB0] to-[#4299E1] rounded-t-lg transition-all duration-300 hover:shadow-lg"
                    style={{ 
                      height: `${(data.revenue / Math.max(...progressData.historicalData.map(d => d.revenue))) * 100}%`,
                      minHeight: '20px'
                    }}
                  ></div>
                  {/* Goal Progress Bar */}
                  <div 
                    className="bg-gradient-to-t from-[#9F7AEA] to-[#B794F4] rounded-t-lg mt-1 transition-all duration-300 hover:shadow-lg"
                    style={{ 
                      height: `${(data.goalProgress / progressData.goal.goalAmount) * 100}%`,
                      minHeight: '8px'
                    }}
                  ></div>
                </div>
                <p className="text-xs text-[#718096] mt-2">{data.month}</p>
                <div className="flex gap-1 mt-1">
                  <div className="w-2 h-2 rounded-full bg-[#2B6CB0]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#9F7AEA]"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#2B6CB0]"></div>
              <span className="text-xs text-[#718096]">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#9F7AEA]"></div>
              <span className="text-xs text-[#718096]">Goal Progress</span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-[#718096]">Total Revenue</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#2B6CB0] to-[#4299E1] shadow-md">
                <span className="text-white">$</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-[#1A202C]">{formatCurrency(progressData.metrics.totalRevenue)}</p>
            <p className="text-sm text-[#718096] mt-1">Last 4 months</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-[#718096]">Average Monthly Revenue</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#9F7AEA] to-[#B794F4] shadow-md">
                <span className="text-white">📊</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-[#1A202C]">{formatCurrency(progressData.metrics.averageMonthlyRevenue)}</p>
            <p className="text-sm text-[#718096] mt-1">Per month average</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-[#718096]">Revenue Growth</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#2B6CB0] to-[#9F7AEA] shadow-md">
                <span className="text-white">📈</span>
              </div>
            </div>
            <p className={`text-2xl font-bold ${progressData.metrics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {progressData.metrics.revenueGrowth >= 0 ? '+' : ''}{progressData.metrics.revenueGrowth.toFixed(1)}%
            </p>
            <p className="text-sm text-[#718096] mt-1">Since start</p>
          </div>
        </div>

        {/* Monthly Breakdown Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-[#1A202C] mb-6">Monthly Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#1A202C]">Month</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-[#1A202C]">Revenue</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-[#1A202C]">Net Income</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-[#1A202C]">Goal Progress</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-[#1A202C]">Contribution</th>
                </tr>
              </thead>
              <tbody>
                {progressData.historicalData.map((data, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm text-[#1A202C]">{data.month}</td>
                    <td className="py-3 px-4 text-sm text-right text-[#1A202C]">{formatCurrency(data.revenue)}</td>
                    <td className={`py-3 px-4 text-sm text-right ${data.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(data.netIncome)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-[#9F7AEA]">{formatCurrency(data.goalProgress)}</td>
                    <td className="py-3 px-4 text-sm text-right text-[#718096]">
                      {((data.goalProgress / progressData.goal.goalAmount) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Goal Change Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full">
            <h3 className="text-xl font-semibold text-[#1A202C] mb-4">Change Your Goal</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#1A202C] mb-2">Goal Type</label>
                <select
                  value={newGoalType}
                  onChange={(e) => setNewGoalType(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all"
                >
                  <option value="">Select a goal type</option>
                  <option value="growth">Growth</option>
                  <option value="profit">Profit Target</option>
                  <option value="employees">Employee Count</option>
                  <option value="renovations">Renovations</option>
                  <option value="marketing">Marketing Project</option>
                  <option value="continuity">Business Continuity</option>
                  <option value="custom">Custom Goal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1A202C] mb-2">Goal Amount</label>
                <input
                  type="text"
                  value={newGoalAmount}
                  onChange={(e) => setNewGoalAmount(e.target.value)}
                  placeholder="Enter target amount"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1A202C] mb-2">Timeline (months)</label>
                <input
                  type="text"
                  value={newGoalTimeline}
                  onChange={(e) => setNewGoalTimeline(e.target.value)}
                  placeholder="Enter timeline in months"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowGoalModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-[#1A202C] font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGoalChange}
                disabled={isUpdating}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#2B6CB0] to-[#4299E1] hover:from-[#2C5282] hover:to-[#3182CE] text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <svg className="h-4 w-4 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  'Update Goal'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}