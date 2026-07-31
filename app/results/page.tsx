'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatCurrency, formatPercentage } from '@/lib/financialCalculator'
import type { AdjustedFinancials } from '@/lib/financialCalculator'
import RevenueProjectionChart from '@/components/RevenueProjectionChart'
import ExpenseBreakdownChart from '@/components/ExpenseBreakdownChart'
import GoalAchievementInsights from '@/components/GoalAchievementInsights'
import { getFinancialResults } from '@/lib/storage'

export default function ResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<AdjustedFinancials & { advice: string[]; inputs: any; goal: any; detailedInputs?: any } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Retrieve results from localStorage
    const storedResults = getFinancialResults()
    if (storedResults) {
      setResults(storedResults)
    } else {
      // No results found, redirect to input page
      router.push('/input')
    }
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        <div className="text-center relative z-10">
          <div className="w-16 h-16 border-4 border-[#2B6CB0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#718096]">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        <div className="text-center relative z-10">
          <p className="text-[#718096] mb-4">No results found. Please enter your financial data first.</p>
          <button
            onClick={() => router.push('/input')}
            className="px-6 py-3 bg-gradient-to-r from-[#2B6CB0] to-[#4299E1] hover:from-[#2C5282] hover:to-[#3182CE] text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-105"
          >
            Go to Input Page
          </button>
        </div>
      </div>
    )
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-green-500'
      case 'Moderate': return 'bg-yellow-500'
      case 'High': return 'bg-orange-500'
      case 'Critical': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getRiskTextColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600'
      case 'Moderate': return 'text-yellow-600'
      case 'High': return 'text-orange-600'
      case 'Critical': return 'text-red-600'
      default: return 'text-gray-600'
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
          <h1 className="text-3xl font-bold text-[#1A202C] mb-2">Results & Advice</h1>
          <p className="text-[#718096]">Financial risk analysis and strategic recommendations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Detailed Breakdown */}
          {results.detailedInputs && (
            <div className="lg:col-span-3">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-[#1A202C]">Detailed Financial Breakdown</h2>
                  <span className="text-sm font-medium text-[#2B6CB0] bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-1 rounded-full border border-blue-200">
                    {results.detailedInputs.timePeriod.charAt(0).toUpperCase() + results.detailedInputs.timePeriod.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Revenue & COGS */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-[#1A202C] border-b border-gray-200 pb-2">Revenue & COGS</h3>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#718096]">Revenue</span>
                      <span className="font-medium text-[#1A202C]">{formatCurrency(results.detailedInputs.revenue)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#718096]">COGS</span>
                      <span className="font-medium text-[#1A202C]">{formatCurrency(results.detailedInputs.cogs)}</span>
                    </div>
                  </div>

                  {/* Facility Costs */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-[#1A202C] border-b border-gray-200 pb-2">Facility Costs</h3>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#718096]">Rent</span>
                      <span className="font-medium text-[#1A202C]">{formatCurrency(results.detailedInputs.rent)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#718096]">Utilities</span>
                      <span className="font-medium text-[#1A202C]">{formatCurrency(results.detailedInputs.utilities)}</span>
                    </div>
                    {results.detailedInputs.otherFacilityCosts > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[#718096]">Other Facility</span>
                        <span className="font-medium text-[#1A202C]">{formatCurrency(results.detailedInputs.otherFacilityCosts)}</span>
                      </div>
                    )}
                  </div>

                  {/* Payroll */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-[#1A202C] border-b border-gray-200 pb-2">Payroll</h3>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#718096]">Employees</span>
                      <span className="font-medium text-[#1A202C]">{results.detailedInputs.numberOfEmployees}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#718096]">Personal Salary</span>
                      <span className="font-medium text-[#1A202C]">{formatCurrency(results.detailedInputs.personalSalary)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#718096]">Other Payroll</span>
                      <span className="font-medium text-[#1A202C]">{formatCurrency(results.detailedInputs.otherPayrollExpenses)}</span>
                    </div>
                  </div>

                  {/* Other */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-[#1A202C] border-b border-gray-200 pb-2">Other</h3>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#718096]">Taxes</span>
                      <span className="font-medium text-[#1A202C]">{formatCurrency(results.detailedInputs.taxes)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#718096]">Custom Expenses</span>
                      <span className="font-medium text-[#1A202C]">{formatCurrency(results.detailedInputs.customExpenses)}</span>
                    </div>
                    {results.detailedInputs.cashReserves > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[#718096]">Cash Reserves</span>
                        <span className="font-medium text-[#1A202C]">{formatCurrency(results.detailedInputs.cashReserves)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Risk Scorecard */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold text-[#1A202C] mb-6 pb-4 border-b border-gray-200">
                Risk Scorecard
              </h2>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#1A202C]">Overall Risk Level</span>
                    <span className={`text-sm font-semibold ${getRiskTextColor(results.risk.riskLevel)}`}>
                      {results.risk.riskLevel}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className={`${getRiskColor(results.risk.riskLevel)} h-3 rounded-full transition-all`} style={{ width: `${results.risk.riskScore}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#1A202C]">Profit Margin</span>
                    <span className="text-sm font-semibold text-[#2B6CB0]">
                      {formatPercentage(results.adjusted.netProfitMargin)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-[#2B6CB0] to-[#4299E1] h-3 rounded-full" style={{ width: `${Math.min(100, results.risk.factors.profitMargin)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#1A202C]">Safety Buffer</span>
                    <span className="text-sm font-semibold text-[#9F7AEA]">
                      {results.adjusted.safetyBuffer.toFixed(1)} months
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-[#9F7AEA] to-[#B794F4] h-3 rounded-full" style={{ width: `${Math.min(100, results.risk.factors.safetyBuffer)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#1A202C]">Cash Flow Health</span>
                    <span className="text-sm font-semibold text-[#2B6CB0]">
                      {results.adjusted.netIncome >= 0 ? 'Positive' : 'Negative'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-[#2B6CB0] to-[#9F7AEA] h-3 rounded-full" style={{ width: `${Math.min(100, results.risk.factors.cashFlowHealth)}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#2B6CB0] to-[#9F7AEA] shadow-md">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A202C]">Risk Assessment</p>
                    <p className="text-xs text-[#718096]">Based on goal-adjusted projections</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Adjusted Financial Plan */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold text-[#1A202C] mb-6 pb-4 border-b border-gray-200">
                Adjusted Financial Plan
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#1A202C]">Category</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-[#1A202C]">Current</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-[#1A202C]">Adjusted</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-[#1A202C]">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 text-sm text-[#1A202C]">Revenue</td>
                      <td className="py-3 px-4 text-sm text-right text-[#718096]">{formatCurrency(results.inputs.revenue)}</td>
                      <td className="py-3 px-4 text-sm text-right text-[#1A202C]">{formatCurrency(results.inputs.revenue)}</td>
                      <td className="py-3 px-4 text-sm text-right text-[#718096]">-</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 text-sm text-[#1A202C]">COGS</td>
                      <td className="py-3 px-4 text-sm text-right text-[#718096]">{formatCurrency(results.inputs.cogs)}</td>
                      <td className="py-3 px-4 text-sm text-right text-[#1A202C]">{formatCurrency(results.inputs.cogs)}</td>
                      <td className="py-3 px-4 text-sm text-right text-[#718096]">-</td>
                    </tr>
                    {results.detailedInputs ? (
                      <>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 px-4 text-sm text-[#1A202C] pl-8">Rent</td>
                          <td className="py-3 px-4 text-sm text-right text-[#718096]">{formatCurrency(results.detailedInputs.rent)}</td>
                          <td className="py-3 px-4 text-sm text-right text-[#1A202C]">{formatCurrency(results.detailedInputs.rent)}</td>
                          <td className="py-3 px-4 text-sm text-right text-[#718096]">-</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 px-4 text-sm text-[#1A202C] pl-8">Utilities</td>
                          <td className="py-3 px-4 text-sm text-right text-[#718096]">{formatCurrency(results.detailedInputs.utilities)}</td>
                          <td className="py-3 px-4 text-sm text-right text-[#1A202C]">{formatCurrency(results.detailedInputs.utilities)}</td>
                          <td className="py-3 px-4 text-sm text-right text-[#718096]">-</td>
                        </tr>
                        {results.detailedInputs.otherFacilityCosts > 0 && (
                          <tr className="border-b border-gray-200">
                            <td className="py-3 px-4 text-sm text-[#1A202C] pl-8">Other Facility</td>
                            <td className="py-3 px-4 text-sm text-right text-[#718096]">{formatCurrency(results.detailedInputs.otherFacilityCosts)}</td>
                            <td className="py-3 px-4 text-sm text-right text-[#1A202C]">{formatCurrency(results.detailedInputs.otherFacilityCosts)}</td>
                            <td className="py-3 px-4 text-sm text-right text-[#718096]">-</td>
                          </tr>
                        )}
                        <tr className="border-b border-gray-200">
                          <td className="py-3 px-4 text-sm text-[#1A202C] pl-8">Personal Salary</td>
                          <td className="py-3 px-4 text-sm text-right text-[#718096]">{formatCurrency(results.detailedInputs.personalSalary)}</td>
                          <td className="py-3 px-4 text-sm text-right text-[#1A202C]">{formatCurrency(results.detailedInputs.personalSalary)}</td>
                          <td className="py-3 px-4 text-sm text-right text-[#718096]">-</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 px-4 text-sm text-[#1A202C] pl-8">Other Payroll</td>
                          <td className="py-3 px-4 text-sm text-right text-[#718096]">{formatCurrency(results.detailedInputs.otherPayrollExpenses)}</td>
                          <td className="py-3 px-4 text-sm text-right text-[#1A202C]">{formatCurrency(results.detailedInputs.otherPayrollExpenses)}</td>
                          <td className="py-3 px-4 text-sm text-right text-[#718096]">-</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 px-4 text-sm text-[#1A202C] pl-8">Taxes</td>
                          <td className="py-3 px-4 text-sm text-right text-[#718096]">{formatCurrency(results.detailedInputs.taxes)}</td>
                          <td className="py-3 px-4 text-sm text-right text-[#1A202C]">{formatCurrency(results.detailedInputs.taxes)}</td>
                          <td className="py-3 px-4 text-sm text-right text-[#718096]">-</td>
                        </tr>
                      </>
                    ) : (
                      <>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 px-4 text-sm text-[#1A202C]">Rent & Utilities</td>
                          <td className="py-3 px-4 text-sm text-right text-[#718096]">{formatCurrency(results.inputs.rentUtilities)}</td>
                          <td className="py-3 px-4 text-sm text-right text-[#1A202C]">{formatCurrency(results.inputs.rentUtilities)}</td>
                          <td className="py-3 px-4 text-sm text-right text-[#718096]">-</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 px-4 text-sm text-[#1A202C]">Taxes & Payroll</td>
                          <td className="py-3 px-4 text-sm text-right text-[#718096]">{formatCurrency(results.inputs.taxesPayroll)}</td>
                          <td className="py-3 px-4 text-sm text-right text-[#1A202C]">{formatCurrency(results.inputs.taxesPayroll)}</td>
                          <td className="py-3 px-4 text-sm text-right text-[#718096]">-</td>
                        </tr>
                      </>
                    )}
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 text-sm text-[#1A202C]">Custom Expenses</td>
                      <td className="py-3 px-4 text-sm text-right text-[#718096]">{formatCurrency(results.inputs.customExpenses)}</td>
                      <td className="py-3 px-4 text-sm text-right text-[#1A202C]">{formatCurrency(results.inputs.customExpenses)}</td>
                      <td className="py-3 px-4 text-sm text-right text-[#718096]">-</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 text-sm text-[#1A202C]">Goal Ongoing Cost</td>
                      <td className="py-3 px-4 text-sm text-right text-[#718096]">{formatCurrency(0)}</td>
                      <td className="py-3 px-4 text-sm text-right text-[#1A202C]">{formatCurrency(results.goalImpact.monthlyOngoingCost)}</td>
                      <td className="py-3 px-4 text-sm text-right text-[#9F7AEA]">+{formatCurrency(results.goalImpact.monthlyOngoingCost)}</td>
                    </tr>
                    <tr className="border-b-2 border-gray-300">
                      <td className="py-3 px-4 text-sm font-semibold text-[#1A202C]">Net Profit</td>
                      <td className="py-3 px-4 text-sm text-right font-semibold text-[#718096]">{formatCurrency(results.baseline.netIncome)}</td>
                      <td className={`py-3 px-4 text-sm text-right font-semibold ${results.adjusted.netIncome >= 0 ? 'text-[#2B6CB0]' : 'text-red-600'}`}>
                        {formatCurrency(results.adjusted.netIncome)}
                      </td>
                      <td className={`py-3 px-4 text-sm text-right font-semibold ${results.adjusted.netIncome >= results.baseline.netIncome ? 'text-green-600' : 'text-red-600'}`}>
                        {results.adjusted.netIncome >= results.baseline.netIncome ? '+' : ''}{formatCurrency(results.adjusted.netIncome - results.baseline.netIncome)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-purple-200">
                <h3 className="text-sm font-semibold text-[#1A202C] mb-3">Goal Impact Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-[#718096] mb-1">Upfront Cost</p>
                    <p className="text-sm font-semibold text-[#1A202C]">{formatCurrency(results.goalImpact.upfrontCost)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#718096] mb-1">Monthly Ongoing</p>
                    <p className="text-sm font-semibold text-[#1A202C]">{formatCurrency(results.goalImpact.monthlyOngoingCost)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#718096] mb-1">Total Over {results.goal.goalTimeline} months</p>
                    <p className="text-sm font-semibold text-[#1A202C]">{formatCurrency(results.goalImpact.totalCostOverTimeline)}</p>
                  </div>
                </div>
                {results.detailedInputs && (
                  <div className="mt-4 pt-4 border-t border-purple-200">
                    <p className="text-xs text-[#718096]">
                      Analysis based on <span className="font-semibold text-[#1A202C]">{results.detailedInputs.timePeriod}</span> financial data
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Insights Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Projection Chart */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
            <RevenueProjectionChart 
              currentRevenue={results.inputs.revenue}
              timeline={results.goal.goalTimeline}
              profitMargin={results.adjusted.netProfitMargin}
            />
          </div>

          {/* Expense Breakdown Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
            <ExpenseBreakdownChart 
              detailedInputs={results.detailedInputs}
              rentUtilities={results.inputs.rentUtilities}
              taxesPayroll={results.inputs.taxesPayroll}
              customExpenses={results.inputs.customExpenses}
            />
          </div>

          {/* Goal Achievement Insights */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
            <GoalAchievementInsights 
              goalType={results.goal.goalType}
              goalAmount={results.goal.goalAmount}
              goalTimeline={results.goal.goalTimeline}
              riskLevel={results.risk.riskLevel}
              netProfitMargin={results.adjusted.netProfitMargin}
              safetyBuffer={results.adjusted.safetyBuffer}
              detailedInputs={results.detailedInputs}
              customDescription={results.goal.customDescription}
            />
          </div>
        </div>

        {/* General Financial Advice */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-[#9F7AEA] shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#9F7AEA] to-[#B794F4] shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[#1A202C] mb-3">General Financial Advice & Risk Mitigation</h3>
              <div className="space-y-3">
                {results.advice.map((advice, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${index % 2 === 0 ? 'bg-[#2B6CB0]' : 'bg-[#9F7AEA]'}`}></div>
                    <p className="text-sm text-[#1A202C]">
                      {advice}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 border border-gray-300 text-[#1A202C] font-semibold rounded-lg hover:bg-[#F7FAFC] transition-colors"
          >
            Back to Dashboard
          </button>
          <button 
            onClick={() => router.push('/input')}
            className="px-6 py-3 bg-[#2B6CB0] hover:bg-[#2C5282] text-white font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md"
          >
            Adjust Financial Parameters
          </button>
        </div>
      </div>
    </div>
  )
}