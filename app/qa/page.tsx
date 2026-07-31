'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getFinancialResults, loadInputData } from '@/lib/storage'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function QAPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [financialData, setFinancialData] = useState<any>(null)
  const [hasData, setHasData] = useState(false)

  useEffect(() => {
    // Load financial data
    const loadFinancialInfo = async () => {
      // Try to get results first
      const results = getFinancialResults()
      if (results && results.detailedInputs) {
        setFinancialData({
          ...results.detailedInputs,
          goal: results.goal,
          periodInfo: results.periodInfo
        })
        setHasData(true)
        
        // Add welcome message
        setMessages([{
          id: '1',
          role: 'assistant',
          content: `Hello! I have access to your financial data for ${results.periodInfo?.periodValue || 'your selected period'}. I can help you with financial analysis, budgeting advice, goal planning, and any other financial questions. What would you like to know?`,
          timestamp: new Date()
        }])
      } else {
        // Try to get input data
        const inputData = loadInputData()
        if (inputData && inputData.periods && inputData.periods.length > 0) {
          const currentPeriod = inputData.periods.find((p: any) => p.id === inputData.currentPeriodId) || inputData.periods[0]
          setFinancialData({
            ...currentPeriod,
            goalType: inputData.goalType,
            goalAmount: inputData.goalAmount,
            goalTimeline: inputData.goalTimeline
          })
          setHasData(true)
          
          setMessages([{
            id: '1',
            role: 'assistant',
            content: `Hello! I have access to your financial data for ${currentPeriod.periodValue}. I can help you with financial analysis, budgeting advice, goal planning, and any other financial questions. What would you like to know?`,
            timestamp: new Date()
          }])
        } else {
          setMessages([{
            id: '1',
            role: 'assistant',
            content: 'Hello! I\'m your financial advisor. To provide personalized advice, please enter your financial data first in the Input section. Once you have data, I can help you with financial analysis, budgeting advice, goal planning, and any other financial questions.',
            timestamp: new Date()
          }])
        }
      }
    }
    
    loadFinancialInfo()
  }, [])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          financialData: financialData
        }),
      })

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'I apologize, but I encountered an error processing your request.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const suggestions = hasData ? [
    "How can I improve my profit margin?",
    "What's my current financial health?",
    "Is my business sustainable with these numbers?",
    "How should I plan for my goal?",
    "What expenses should I reduce?",
    "Am I paying myself enough?"
  ] : [
    "How do I start financial planning?",
    "What metrics should I track?",
    "How do I set realistic business goals?",
    "What are common financial mistakes?",
    "How do I manage cash flow?",
    "When should I consider expanding?"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-10 blur-2xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1A202C] mb-2">Financial Q&A</h1>
          <p className="text-[#718096]">
            {hasData ? 
              "Ask questions about your financial data and get personalized advice" : 
              "Get general financial planning advice"}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Chat Messages */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-[#2B6CB0] to-[#4299E1] text-white'
                      : 'bg-gray-100 text-[#1A202C]'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <p className="text-sm text-gray-600">Thinking...</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestions */}
          {messages.length <= 2 && (
            <div className="px-6 pb-4 border-t border-gray-200">
              <p className="text-xs text-[#718096] mb-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(suggestion)}
                    className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full text-xs text-[#2B6CB0] hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-6 border-t border-gray-200 bg-white/50">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a financial question..."
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent transition-all shadow-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="px-6 py-3 bg-gradient-to-r from-[#2B6CB0] to-[#4299E1] hover:from-[#2C5282] hover:to-[#3182CE] text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>

        {/* Financial Data Summary */}
        {hasData && financialData && (
          <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-[#1A202C] mb-4">Your Financial Data</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-[#718096]">Revenue</p>
                <p className="font-semibold text-[#1A202C]">${financialData.revenue || 'Not set'}</p>
              </div>
              <div>
                <p className="text-[#718096]">COGS</p>
                <p className="font-semibold text-[#1A202C]">${financialData.cogs || 'Not set'}</p>
              </div>
              <div>
                <p className="text-[#718096]">Rent</p>
                <p className="font-semibold text-[#1A202C]">${financialData.rent || 'Not set'}</p>
              </div>
              <div>
                <p className="text-[#718096]">Employees</p>
                <p className="font-semibold text-[#1A202C]">${financialData.numberOfEmployees || 'Not set'}</p>
              </div>
              <div>
                <p className="text-[#718096]">Personal Salary</p>
                <p className="font-semibold text-[1A202C]">${financialData.personalSalary || 'Not set'}</p>
              </div>
              <div>
                <p className="text-[#718096]">Other Payroll</p>
                <p className="font-semibold text-[#1A202C]">${financialData.otherPayrollExpenses || 'Not set'}</p>
              </div>
              <div>
                <p className="text-[#718096]">Taxes</p>
                <p className="font-semibold text-[#1A202C]">${financialData.taxes || 'Not set'}</p>
              </div>
              <div>
                <p className="text-[718096]">Custom Expenses</p>
                <p className="font-semibold text-[1A202C]">${financialData.customExpenses || 'Not set'}</p>
              </div>
            </div>
            {financialData.goalType && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-[#718096]">Goal: {financialData.goalType} - ${financialData.goalAmount || 'Not set'} (${financialData.goalTimeline || 'Not set'} months)</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
