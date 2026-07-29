'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { analyzeFinancialImage, FinancialData } from '@/lib/imageAnalyzer'
import IllustratedLoader from '@/components/IllustratedLoader'
import ErrorBanner from '@/components/ErrorBanner'
import { 
  FinancialInputs, 
  GoalInputs, 
  calculateGoalImpact,
  generateStrategicAdvice 
} from '@/lib/financialCalculator'

export default function InputPage() {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    revenue: '',
    cogs: '',
    rentUtilities: '',
    taxesPayroll: '',
    customExpenses: '',
    cashReserves: '',
    goalType: '',
    goalAmount: '',
    goalTimeline: ''
  })

  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<FinancialData | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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
        
        // Auto-fill form with extracted data
        setFormData(prev => ({
          ...prev,
          revenue: result.data?.revenue?.toString() || prev.revenue,
          cogs: result.data?.cogs?.toString() || prev.cogs,
          rentUtilities: result.data?.rent?.toString() || prev.rentUtilities,
          taxesPayroll: result.data?.taxes?.toString() || prev.taxesPayroll,
          customExpenses: result.data?.miscellaneousOverhead?.toString() || prev.customExpenses
        }))
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
    // Validate required fields
    if (!formData.revenue || !formData.cogs || !formData.rentUtilities || 
        !formData.taxesPayroll || !formData.customExpenses) {
      setError('Please fill in all financial information fields')
      return
    }

    if (!formData.goalType || !formData.goalAmount || !formData.goalTimeline) {
      setError('Please fill in all goal information fields')
      return
    }

    try {
      // Parse and validate financial inputs
      const revenue = parseFloat(formData.revenue)
      const cogs = parseFloat(formData.cogs)
      const rentUtilities = parseFloat(formData.rentUtilities)
      const taxesPayroll = parseFloat(formData.taxesPayroll)
      const customExpenses = parseFloat(formData.customExpenses)
      const cashReserves = formData.cashReserves ? parseFloat(formData.cashReserves) : 0
      const goalAmount = parseFloat(formData.goalAmount)
      const goalTimeline = parseFloat(formData.goalTimeline)

      // Check for NaN values
      if (isNaN(revenue) || isNaN(cogs) || isNaN(rentUtilities) || 
          isNaN(taxesPayroll) || isNaN(customExpenses) || isNaN(goalAmount) || isNaN(goalTimeline)) {
        setError('Please enter valid numeric values for all fields')
        return
      }

      // Check for negative values where not appropriate
      if (revenue < 0 || cogs < 0 || rentUtilities < 0 || taxesPayroll < 0 || customExpenses < 0) {
        setError('Financial values cannot be negative')
        return
      }

      if (goalAmount <= 0 || goalTimeline <= 0) {
        setError('Goal amount and timeline must be positive values')
        return
      }

      // Prepare financial inputs
      const financialInputs: FinancialInputs = {
        revenue,
        cogs,
        rentUtilities,
        taxesPayroll,
        customExpenses,
        cashReserves
      }

      // Prepare goal inputs
      const goalInputs: GoalInputs = {
        goalType: formData.goalType as any,
        goalAmount,
        goalTimeline
      }

      // Calculate goal impact
      const results = calculateGoalImpact(financialInputs, goalInputs)
      
      // Generate strategic advice
      const advice = generateStrategicAdvice(
        results.baseline,
        results.adjusted,
        results.risk,
        goalInputs
      )

      // Store results in sessionStorage for the results page
      sessionStorage.setItem('financialResults', JSON.stringify({
        ...results,
        advice,
        inputs: financialInputs,
        goal: goalInputs
      }))

      // Navigate to results page
      router.push('/results')
    } catch (err) {
      setError('An error occurred during calculation. Please check your inputs.')
      console.error(err)
    }
  }

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
          <p className="text-[#718096]">Enter your business financial information and set your goals</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Financial Inputs */}
          <div className="bg-[#F7FAFC] rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-[#1A202C] mb-6 pb-4 border-b border-gray-200">
              Financial Information
            </h2>

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
              <div>
                <label htmlFor="revenue" className="block text-sm font-semibold text-[#1A202C] mb-2">
                  Revenue
                </label>
                <input
                  type="text"
                  id="revenue"
                  name="revenue"
                  value={formData.revenue}
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
                  value={formData.cogs}
                  onChange={handleInputChange}
                  placeholder="Enter COGS"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="rentUtilities" className="block text-sm font-semibold text-[#1A202C] mb-2">
                  Rent & Utilities
                </label>
                <input
                  type="text"
                  id="rentUtilities"
                  name="rentUtilities"
                  value={formData.rentUtilities}
                  onChange={handleInputChange}
                  placeholder="Enter rent and utilities cost"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="taxesPayroll" className="block text-sm font-semibold text-[#1A202C] mb-2">
                  Taxes & Payroll
                </label>
                <input
                  type="text"
                  id="taxesPayroll"
                  name="taxesPayroll"
                  value={formData.taxesPayroll}
                  onChange={handleInputChange}
                  placeholder="Enter taxes and payroll expenses"
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
                  value={formData.customExpenses}
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
                  value={formData.cashReserves}
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
                  name="goalType"
                  value={formData.goalType}
                  onChange={handleInputChange}
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
                  name="goalAmount"
                  value={formData.goalAmount}
                  onChange={handleInputChange}
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
                  name="goalTimeline"
                  value={formData.goalTimeline}
                  onChange={handleInputChange}
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
                    Your financial data will be analyzed to provide risk assessment and adjusted budget recommendations based on your goals.
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