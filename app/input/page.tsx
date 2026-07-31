'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { analyzeFinancialImage, FinancialData } from '@/lib/imageAnalyzer'
import IllustratedLoader from '@/components/IllustratedLoader'
import ErrorBanner from '@/components/ErrorBanner'
import { setFinancialResults } from '@/lib/storage'
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
  const [customGoal, setCustomGoal] = useState('')
  const [isAnalyzingGoal, setIsAnalyzingGoal] = useState(false)

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

  const handleAnalyzeCustomGoal = async () => {
    if (!customGoal.trim()) {
      setError('Please enter a custom goal description')
      return
    }

    setIsAnalyzingGoal(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Analyze this business goal and extract structured information. Respond with JSON only, no markdown. Goal: "${customGoal}"
          
          Extract:
          - goalType: categorize as "growth", "profit", "employees", "renovations", "marketing", "continuity", or "other"
          - goalAmount: estimated cost in numbers (extract numbers from description)
          - goalTimeline: estimated timeline in months (extract numbers or infer from context)
          - description: brief summary of the goal
          
          If any information is unclear or not provided, use reasonable estimates based on typical business scenarios.`
        }),
      })

      const data = await response.json()
      
      if (data.response) {
        try {
          // Try to parse JSON from the response
          const jsonMatch = data.response.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const parsedGoal = JSON.parse(jsonMatch[0])
            
            // Auto-fill the form with extracted data
            setGoalType(parsedGoal.goalType || 'other')
            setGoalAmount(parsedGoal.goalAmount?.toString() || '')
            setGoalTimeline(parsedGoal.goalTimeline?.toString() || '')
            
            // Show success message
            setError(null)
          } else {
            // If no JSON found, try to extract information from text
            setError('Could not parse goal details. Please enter manually.')
          }
        } catch (parseError) {
          setError('Could not parse goal details. Please enter manually.')
        }
      } else {
        setError('Failed to analyze custom goal')
      }
    } catch (err) {
      setError('An error occurred during goal analysis')
      console.error(err)
    } finally {
      setIsAnalyzingGoal(false)
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

    // Handle custom goal type
    const finalGoalType = goalType === 'other' && customGoal ? 'custom' : goalType

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
        goalType: finalGoalType as any,
        goalAmount: goalAmountNum,
        goalTimeline: goalTimelineNum,
        customDescription: goalType === 'other' && customGoal ? customGoal : undefined
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

      // Store results in localStorage for the results page
      setFinancialResults({
        ...results,
        advice,
        inputs: normalizedInputs,
        goal: goalInputs,
        detailedInputs: currentPeriod.financialData,
        timeSeriesData,
        trends,
        progress,
        periodInfo: {
          id: currentPeriod.id,
          periodType: currentPeriod.periodType,
          periodValue: currentPeriod.periodValue
        }
      })

      // Navigate to results page
      router.push('/results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during calculation. Please check your inputs.')
      console.error(err)
    }
  }

  const currentPeriod = periods.find(p => p.id === currentPeriodId) || periods[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-10 blur-2xl"></div>
      </div>

      {isAnalyzing && (
        <IllustratedLoader message="Analyzing financial document..." />
      )}
      
      {error && (
        <ErrorBanner 
          message={error} 
          onDismiss={() => setError(null)} 
        />
      )}
      
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1A202C] mb-2">Input Financial Data</h1>
          <p className="text-[#718096]">Enter your business financial information across multiple time periods and set your goals</p>
        </div>

        {/* Period Selector */}
        <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="text-sm font-semibold text-[#1A202C]">Time Period:</label>
              <div className="flex gap-2">
                {periods.map((period) => (
                  <button
                    key={period.id}
                    onClick={() => handlePeriodChange(period.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      currentPeriodId === period.id
                        ? 'bg-gradient-to-r from-[#2B6CB0] to-[#4299E1] text-white shadow-md'
                        : 'bg-white text-[#1A202C] border border-gray-300 hover:bg-gray-50 hover:border-blue-300'
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
                className="px-4 py-2 bg-gradient-to-r from-[#48BB78] to-[#38A169] hover:from-[#38A169] hover:to-[#2F855A] text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg text-sm transform hover:scale-105"
              >
                + Add Period
              </button>
              {periods.length > 1 && (
                <button
                  onClick={() => removePeriod(currentPeriodId)}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg text-sm transform hover:scale-105"
                >
                  Remove Period
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Financial Inputs */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-[#1A202C]">
                Financial Information - {currentPeriod.periodValue}
              </h2>
              <div className="flex items-center gap-2">
                <select
                  name="periodType"
                  value={currentPeriod.periodType}
                  onChange={handleInputChange}
                  className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all text-sm shadow-sm"
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
                  className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all text-sm w-40 shadow-sm"
                />
              </div>
            </div>

            {/* File Upload Section */}
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <label className="block text-sm font-semibold text-[#1A202C] mb-2">
                Upload Financial Document (PDF, Image)
              </label>
              <div className="flex gap-3">
                <input
                  type="file"
                  id="financialDocument"
                  accept=".pdf,.jpg,.jpeg,.png,.tiff"
                  onChange={handleFileChange}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all text-sm shadow-sm"
                />
                <button
                  type="button"
                  onClick={handleAnalyzeImage}
                  disabled={!file || isAnalyzing}
                  className="px-4 py-2 bg-gradient-to-r from-[#9F7AEA] to-[#B794F4] hover:from-[#805AD5] hover:to-[#9F7AEA] text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Analyze
                </button>
              </div>
              {analysisResult && (
                <div className="mt-2 text-xs text-[#718096] flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Document analyzed successfully. Data has been auto-filled below.
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all shadow-sm"
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all shadow-sm"
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all shadow-sm"
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
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all shadow-sm"
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
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all shadow-sm"
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
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all shadow-sm"
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
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all shadow-sm"
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
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all shadow-sm"
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
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all shadow-sm"
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all shadow-sm"
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all shadow-sm"
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Goal Setting */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all shadow-sm"
                >
                  <option value="">Select a goal type</option>
                  <option value="growth">Growth</option>
                  <option value="profit">Profit Target</option>
                  <option value="employees">Employee Count</option>
                  <option value="renovations">Renovations</option>
                  <option value="marketing">Marketing Project</option>
                  <option value="continuity">Business Continuity</option>
                  <option value="other">Custom Goal</option>
                </select>
              </div>

              {/* Custom Goal Input Section */}
              {goalType === 'other' && (
                <div className="pt-4 border-t border-gray-200">
                  <label htmlFor="customGoal" className="block text-sm font-semibold text-[#1A202C] mb-2">
                    Describe Your Custom Goal
                  </label>
                  <textarea
                    id="customGoal"
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    placeholder="Describe your business goal in detail (e.g., 'I want to expand to a second location in 18 months with an estimated cost of $150,000')"
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all shadow-sm resize-none"
                  />
                  <button
                    type="button"
                    onClick={handleAnalyzeCustomGoal}
                    disabled={!customGoal.trim() || isAnalyzingGoal}
                    className="mt-3 px-4 py-2 bg-gradient-to-r from-[#9F7AEA] to-[#B794F4] hover:from-[#805AD5] hover:to-[#9F7AEA] text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
                  >
                    {isAnalyzingGoal ? (
                      <>
                        <svg className="h-4 w-4 text-white" style={{ animation: 'spin 1s linear infinite' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing Goal...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Auto-Fill with AI
                      </>
                    )}
                  </button>
                  <p className="mt-2 text-xs text-[#718096]">
                    AI will analyze your description and automatically fill in the goal amount and timeline.
                  </p>
                </div>
              )}

              {/* Business Continuity Specific Info */}
              {goalType === 'continuity' && (
                <div className="pt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-semibold text-[#1A202C] mb-1">Business Continuity Goal</h4>
                      <p className="text-xs text-[#718096]">
                        This goal focuses on maintaining operational stability and financial reserves to keep your business running through challenging periods. The analysis will prioritize safety buffers and cash flow sustainability.
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all shadow-sm"
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all shadow-sm"
                />
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCalculate}
                  className="w-full px-6 py-3 bg-gradient-to-r from-[#2B6CB0] to-[#4299E1] hover:from-[#2C5282] hover:to-[#3182CE] text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-105"
                >
                  Calculate & Analyze
                </button>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-[#9F7AEA] rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#9F7AEA] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-[#1A202C]">
                    Your financial data will be analyzed to provide risk assessment and adjusted financial recommendations based on your goals across all time periods.
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