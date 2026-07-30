'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { analyzeFinancialImage, FinancialData } from '@/lib/imageAnalyzer'
import IllustratedLoader from '@/components/IllustratedLoader'
import ErrorBanner from '@/components/ErrorBanner'
import { 
  FinancialInputs, 
  DetailedFinancialInputs,
  GoalInputs, 
  TimePeriodData,
  TimeSeriesFinancialData,
  calculateGoalImpact,
  generateStrategicAdvice,
  normalizeToMonthly,
  analyzeTimeSeriesTrends,
  calculateGoalProgress
} from '@/lib/financialCalculator'

interface PeriodFormData {
  id: string
  periodType: 'month' | 'quarter' | 'year'
  periodValue: string
  revenue: string
  cogs: string
  rent: string
  utilities: string
  otherFacilityCosts: string
  numberOfEmployees: string
  personalSalary: string
  otherPayrollExpenses: string
  taxes: string
  customExpenses: string
  cashReserves: string
  timePeriod: 'monthly' | 'quarterly' | 'annually'
}

export default function InputPage() {
  const router = useRouter()
  
  const [periods, setPeriods] = useState<PeriodFormData[]>([
    {
      id: '1',
      periodType: 'month',
      periodValue: 'January 2024',
      revenue: '',
      cogs: '',
      rent: '',
      utilities: '',
      otherFacilityCosts: '',
      numberOfEmployees: '',
      personalSalary: '',
      otherPayrollExpenses: '',
      taxes: '',
      customExpenses: '',
      cashReserves: '',
      timePeriod: 'monthly'
    }
  ])
  
  const [currentPeriodId, setCurrentPeriodId] = useState('1')
  const [goalType, setGoalType] = useState('')
  const [goalAmount, setGoalAmount] = useState('')
  const [goalTimeline, setGoalTimeline] = useState('')

  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<FinancialData | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setPeriods(prev => prev.map(period => 
      period.id === currentPeriodId 
        ? { ...period, [name]: value }
        : period
    ))
  }

  const handlePeriodChange = (periodId: string) => {
    setCurrentPeriodId(periodId)
    setFile(null)
    setAnalysisResult(null)
  }

  const addPeriod = () => {
    const newId = (periods.length + 1).toString()
    const lastPeriod = periods[periods.length - 1]
    
    // Auto-increment period value
    let newPeriodValue = lastPeriod.periodValue
    if (lastPeriod.periodType === 'month') {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December']
      const currentMonthIndex = months.findIndex(m => lastPeriod.periodValue.startsWith(m))
      if (currentMonthIndex !== -1) {
        const nextMonthIndex = (currentMonthIndex + 1) % 12
        const year = lastPeriod.periodValue.includes('2024') ? '2024' : '2025'
        newPeriodValue = `${months[nextMonthIndex]} ${year}`
      }
    } else if (lastPeriod.periodType === 'quarter') {
      const quarters = ['Q1', 'Q2', 'Q3', 'Q4']
      const currentQuarterIndex = quarters.findIndex(q => lastPeriod.periodValue.startsWith(q))
      if (currentQuarterIndex !== -1) {
        const nextQuarterIndex = (currentQuarterIndex + 1) % 4
        const year = lastPeriod.periodValue.includes('2024') ? '2024' : '2025'
        newPeriodValue = `${quarters[nextQuarterIndex]} ${year}`
      }
    } else {
      const currentYear = parseInt(lastPeriod.periodValue)
      newPeriodValue = (currentYear + 1).toString()
    }

    setPeriods(prev => [...prev, {
      id: newId,
      periodType: lastPeriod.periodType,
      periodValue: newPeriodValue,
      revenue: '',
      cogs: '',
      rent: '',
      utilities: '',
      otherFacilityCosts: '',
      numberOfEmployees: '',
      personalSalary: '',
      otherPayrollExpenses: '',
      taxes: '',
      customExpenses: '',
      cashReserves: '',
      timePeriod: lastPeriod.timePeriod
    }])
    setCurrentPeriodId(newId)
  }

  const removePeriod = (periodId: string) => {
    if (periods.length === 1) {
      setError('Cannot remove the last period')
      return
    }
    setPeriods(prev => {
      const newPeriods = prev.filter(p => p.id !== periodId)
      if (currentPeriodId === periodId) {
        setCurrentPeriodId(newPeriods[0].id)
      }
      return newPeriods
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleAnalyzeImage = async () => {
    if (!file) {
      setError('Please select a file to analyze')
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const result = await analyzeFinancialImage(file)
      
      if (result.success && result.data) {
        setAnalysisResult(result.data)
        
        // Auto-fill current period form with extracted data
        setPeriods(prev => prev.map(period => 
          period.id === currentPeriodId 
            ? {
                ...period,
                revenue: result.data?.revenue?.toString() || period.revenue,
                cogs: result.data?.cogs?.toString() || period.cogs,
                rent: result.data?.rent?.toString() || period.rent,
                utilities: result.data?.utilities?.toString() || period.utilities,
                otherFacilityCosts: result.data?.otherFacilityCosts?.toString() || period.otherFacilityCosts,
                numberOfEmployees: result.data?.numberOfEmployees?.toString() || period.numberOfEmployees,
                personalSalary: result.data?.personalSalary?.toString() || result.data?.ownerSalary?.toString() || period.personalSalary,
                otherPayrollExpenses: result.data?.otherPayrollExpenses?.toString() || result.data?.employeeWages?.toString() || period.otherPayrollExpenses,
                taxes: result.data?.taxes?.toString() || period.taxes,
                customExpenses: result.data?.customExpenses?.toString() || result.data?.miscellaneousOverhead?.toString() || period.customExpenses
              }
            : period
        ))
      } else {
        setError(result.error || 'Failed to analyze image')
      }
    } catch (err) {
      setError('An error occurred during image analysis')
      console.error(err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleCalculate = () => {
    // Validate all periods have required fields
    for (const period of periods) {
      if (!period.revenue || !period.cogs || !period.rent || 
          !period.numberOfEmployees || !period.personalSalary ||
          !period.otherPayrollExpenses || !period.taxes || !period.customExpenses) {
        setError(`Please fill in all required financial information fields for ${period.periodValue}`)
        return
      }
    }

    if (!goalType || !goalAmount || !goalTimeline) {
      setError('Please fill in all goal information fields')
      return
    }

    try {
      // Convert all periods to TimePeriodData
      const timePeriodData: TimePeriodData[] = periods.map(period => {
        const revenue = parseFloat(period.revenue)
        const cogs = parseFloat(period.cogs)
        const rent = parseFloat(period.rent)
        const utilities = period.utilities ? parseFloat(period.utilities) : 0
        const otherFacilityCosts = period.otherFacilityCosts ? parseFloat(period.otherFacilityCosts) : 0
        const numberOfEmployees = parseFloat(period.numberOfEmployees)
        const personalSalary = parseFloat(period.personalSalary)
        const otherPayrollExpenses = parseFloat(period.otherPayrollExpenses)
        const taxes = parseFloat(period.taxes)
        const customExpenses = parseFloat(period.customExpenses)
        const cashReserves = period.cashReserves ? parseFloat(period.cashReserves) : 0

        // Validate numeric values
        if (isNaN(revenue) || isNaN(cogs) || isNaN(rent) || 
            isNaN(numberOfEmployees) || isNaN(personalSalary) || isNaN(otherPayrollExpenses) ||
            isNaN(taxes) || isNaN(customExpenses)) {
          throw new Error(`Invalid numeric values in ${period.periodValue}`)
        }

        // Check for negative values
        if (revenue < 0 || cogs < 0 || rent < 0 || utilities < 0 || otherFacilityCosts < 0 ||
            numberOfEmployees < 0 || personalSalary < 0 || otherPayrollExpenses < 0 || 
            taxes < 0 || customExpenses < 0) {
          throw new Error(`Financial values cannot be negative in ${period.periodValue}`)
        }

        const detailedInputs: DetailedFinancialInputs = {
          revenue,
          cogs,
          rent,
          utilities,
          otherFacilityCosts,
          numberOfEmployees,
          personalSalary,
          otherPayrollExpenses,
          taxes,
          customExpenses,
          cashReserves,
          timePeriod: period.timePeriod
        }

        return {
          id: period.id,
          periodType: period.periodType,
          periodValue: period.periodValue,
          financialData: detailedInputs
        }
      })

      const goalAmountNum = parseFloat(goalAmount)
      const goalTimelineNum = parseFloat(goalTimeline)

      if (isNaN(goalAmountNum) || isNaN(goalTimelineNum) || goalAmountNum <= 0 || goalTimelineNum <= 0) {
        setError('Goal amount and timeline must be positive values')
        return
      }

      const goalInputs: GoalInputs = {
        goalType: goalType as any,
        goalAmount: goalAmountNum,
        goalTimeline: goalTimelineNum
      }

      // Add goal inputs to each period
      const timePeriodsWithGoals = timePeriodData.map(period => ({
        ...period,
        goalInputs
      }))

      const timeSeriesData: TimeSeriesFinancialData = {
        periods: timePeriodsWithGoals,
        currentPeriodId: currentPeriodId
      }

      // Calculate for the most recent period
      const currentPeriod = timePeriodsWithGoals[timePeriodsWithGoals.length - 1]
      const normalizedInputs = normalizeToMonthly(currentPeriod.financialData)
      const results = calculateGoalImpact(normalizedInputs, goalInputs)
      
      // Generate strategic advice
      const advice = generateStrategicAdvice(
        results.baseline,
        results.adjusted,
        results.risk,
        goalInputs
      )

      // Calculate trends
      const trends = analyzeTimeSeriesTrends(timeSeriesData)
      const progress = calculateGoalProgress(timeSeriesData, goalInputs)

      // Store results in sessionStorage for the results page
      sessionStorage.setItem('financialResults', JSON.stringify({
        ...results,
        advice,
        inputs: normalizedInputs,
        goal: goalInputs,
        detailedInputs: currentPeriod.financialData,
        timeSeriesData,
        trends,
        progress
      }))

      // Navigate to results page
      router.push('/results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during calculation. Please check your inputs.')
      console.error(err)
    }
  }

  const currentPeriod = periods.find(p => p.id === currentPeriodId) || periods[0]

  return (
    <div className="min-h-screen bg-white">
      {isAnalyzing && (
        <IllustratedLoader message="Analyzing financial document..." />
      )}
      
      {error && (
        <ErrorBanner 
          message={error} 
          onDismiss={() => setError(null)} 
        />
      )}
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1A202C] mb-2">Input Financial Data</h1>
          <p className="text-[#718096]">Enter your business financial information across multiple time periods and set your goals</p>
        </div>

        {/* Period Selector */}
        <div className="mb-6 bg-[#F7FAFC] rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="text-sm font-semibold text-[#1A202C]">Time Period:</label>
              <div className="flex gap-2">
                {periods.map((period) => (
                  <button
                    key={period.id}
                    onClick={() => handlePeriodChange(period.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentPeriodId === period.id
                        ? 'bg-[#2B6CB0] text-white'
                        : 'bg-white text-[#1A202C] border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {period.periodValue}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addPeriod}
                className="px-4 py-2 bg-[#48BB78] hover:bg-[#38A169] text-white font-semibold rounded-lg transition-colors text-sm"
              >
                + Add Period
              </button>
              {periods.length > 1 && (
                <button
                  onClick={() => removePeriod(currentPeriodId)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors text-sm"
                >
                  Remove Period
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Financial Inputs */}
          <div className="bg-[#F7FAFC] rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-[#1A202C]">
                Financial Information - {currentPeriod.periodValue}
              </h2>
              <div className="flex items-center gap-2">
                <select
                  name="periodType"
                  value={currentPeriod.periodType}
                  onChange={handleInputChange}
                  className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all text-sm"
                >
                  <option value="month">Month</option>
                  <option value="quarter">Quarter</option>
                  <option value="year">Year</option>
                </select>
                <input
                  type="text"
                  name="periodValue"
                  value={currentPeriod.periodValue}
                  onChange={handleInputChange}
                  placeholder="e.g., January 2024"
                  className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all text-sm w-40"
                />
              </div>
            </div>

            {/* File Upload Section */}
            <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
              <label className="block text-sm font-semibold text-[#1A202C] mb-2">
                Upload Financial Document (PDF, Image)
              </label>
              <div className="flex gap-3">
                <input
                  type="file"
                  id="financialDocument"
                  accept=".pdf,.jpg,.jpeg,.png,.tiff"
                  onChange={handleFileChange}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={handleAnalyzeImage}
                  disabled={!file || isAnalyzing}
                  className="px-4 py-2 bg-[#9F7AEA] hover:bg-[#805AD5] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Analyze
                </button>
              </div>
              {analysisResult && (
                <div className="mt-2 text-xs text-[#718096]">
                  ✓ Document analyzed successfully. Data has been auto-filled below.
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Time Period Selection */}
              <div>
                <label htmlFor="timePeriod" className="block text-sm font-semibold text-[#1A202C] mb-2">
                  Data Type
                </label>
                <select
                  id="timePeriod"
                  name="timePeriod"
                  value={currentPeriod.timePeriod}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all"
                >
                  <option value="monthly">Monthly Data</option>
                  <option value="quarterly">Quarterly Data</option>
                  <option value="annually">Annual Data</option>
                </select>
              </div>

              <div>
                <label htmlFor="revenue" className="block text-sm font-semibold text-[#1A202C] mb-2">
                  Revenue
                </label>
                <input
                  type="text"
                  id="revenue"
                  name="revenue"
                  value={currentPeriod.revenue}
                  onChange={handleInputChange}
                  placeholder="Enter total revenue"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="cogs" className="block text-sm font-semibold text-[#1A202C] mb-2">
                  Cost of Goods Sold (COGS)
                </label>
                <input
                  type="text"
                  id="cogs"
                  name="cogs"
                  value={currentPeriod.cogs}
                  onChange={handleInputChange}
                  placeholder="Enter COGS"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all"
                />
              </div>

              {/* Facility Costs Breakdown */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-[#1A202C] mb-4">Facility Costs</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="rent" className="block text-sm font-medium text-[#1A202C] mb-2">
                      Rent
                    </label>
                    <input
                      type="text"
                      id="rent"
                      name="rent"
                      value={currentPeriod.rent}
                      onChange={handleInputChange}
                      placeholder="Enter rent cost"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="utilities" className="block text-sm font-medium text-[#1A202C] mb-2">
                      Utilities (Optional)
                    </label>
                    <input
                      type="text"
                      id="utilities"
                      name="utilities"
                      value={currentPeriod.utilities}
                      onChange={handleInputChange}
                      placeholder="Enter utilities cost"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="otherFacilityCosts" className="block text-sm font-medium text-[#1A202C] mb-2">
                      Other Facility Costs (Optional)
                    </label>
                    <input
                      type="text"
                      id="otherFacilityCosts"
                      name="otherFacilityCosts"
                      value={currentPeriod.otherFacilityCosts}
                      onChange={handleInputChange}
                      placeholder="Insurance, maintenance, etc."
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Payroll Breakdown */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-[#1A202C] mb-4">Payroll Information</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="numberOfEmployees" className="block text-sm font-medium text-[#1A202C] mb-2">
                      Number of Employees
                    </label>
                    <input
                      type="text"
                      id="numberOfEmployees"
                      name="numberOfEmployees"
                      value={currentPeriod.numberOfEmployees}
                      onChange={handleInputChange}
                      placeholder="Enter number of employees"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="personalSalary" className="block text-sm font-medium text-[#1A202C] mb-2">
                      Personal/Owner Salary
                    </label>
                    <input
                      type="text"
                      id="personalSalary"
                      name="personalSalary"
                      value={currentPeriod.personalSalary}
                      onChange={handleInputChange}
                      placeholder="Enter personal salary"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="otherPayrollExpenses" className="block text-sm font-medium text-[#1A202C] mb-2">
                      Other Payroll Expenses
                    </label>
                    <input
                      type="text"
                      id="otherPayrollExpenses"
                      name="otherPayrollExpenses"
                      value={currentPeriod.otherPayrollExpenses}
                      onChange={handleInputChange}
                      placeholder="Benefits, taxes, contractor fees"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Taxes */}
              <div>
                <label htmlFor="taxes" className="block text-sm font-semibold text-[#1A202C] mb-2">
                  Taxes
                </label>
                <input
                  type="text"
                  id="taxes"
                  name="taxes"
                  value={currentPeriod.taxes}
                  onChange={handleInputChange}
                  placeholder="Enter tax expenses"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="customExpenses" className="block text-sm font-semibold text-[#1A202C] mb-2">
                  Additional Custom Expenses
                </label>
                <input
                  type="text"
                  id="customExpenses"
                  name="customExpenses"
                  value={currentPeriod.customExpenses}
                  onChange={handleInputChange}
                  placeholder="Enter any additional expenses"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="cashReserves" className="block text-sm font-semibold text-[#1A202C] mb-2">
                  Cash Reserves (Optional)
                </label>
                <input
                  type="text"
                  id="cashReserves"
                  name="cashReserves"
                  value={currentPeriod.cashReserves}
                  onChange={handleInputChange}
                  placeholder="Enter current cash reserves"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Goal Setting */}
          <div className="bg-[#F7FAFC] rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-[#1A202C] mb-6 pb-4 border-b border-gray-200">
              Goal Setting
            </h2>

            <div className="space-y-6">
              <div>
                <label htmlFor="goalType" className="block text-sm font-semibold text-[#1A202C] mb-2">
                  Goal Type
                </label>
                <select
                  id="goalType"
                  value={goalType}
                  onChange={(e) => setGoalType(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all"
                >
                  <option value="">Select a goal type</option>
                  <option value="growth">Growth</option>
                  <option value="profit">Profit Target</option>
                  <option value="employees">Employee Count</option>
                  <option value="renovations">Renovations</option>
                  <option value="marketing">Marketing Project</option>
                </select>
              </div>

              <div>
                <label htmlFor="goalAmount" className="block text-sm font-semibold text-[#1A202C] mb-2">
                  Goal Target Amount
                </label>
                <input
                  type="text"
                  id="goalAmount"
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(e.target.value)}
                  placeholder="Enter target amount"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="goalTimeline" className="block text-sm font-semibold text-[#1A202C] mb-2">
                  Goal Timeline (months)
                </label>
                <input
                  type="text"
                  id="goalTimeline"
                  value={goalTimeline}
                  onChange={(e) => setGoalTimeline(e.target.value)}
                  placeholder="e.g., 6 for 6 months"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all"
                />
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCalculate}
                  className="w-full px-6 py-3 bg-[#2B6CB0] hover:bg-[#2C5282] text-white font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md"
                >
                  Calculate & Analyze
                </button>
              </div>

              <div className="bg-[#F7FAFC] border border-[#9F7AEA] rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#9F7AEA] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-[#1A202C]">
                    Your financial data will be analyzed to provide risk assessment and adjusted budget recommendations based on your goals across all time periods.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}