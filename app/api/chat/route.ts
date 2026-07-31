import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, financialData } = await request.json()
    
    // Create context with financial data if available
    let context = ""
    if (financialData) {
      context = `
You are a financial advisor for business owners. Here is the user's financial data:
- Revenue: ${financialData.revenue || 'Not provided'}
- COGS: ${financialData.cogs || 'Not provided'}
- Rent: ${financialData.rent || 'Not provided'}
- Utilities: ${financialData.utilities || 'Not provided'}
- Other Facility Costs: ${financialData.otherFacilityCosts || 'Not provided'}
- Number of Employees: ${financialData.numberOfEmployees || 'Not provided'}
- Personal Salary: ${financialData.personalSalary || 'Not provided'}
- Other Payroll Expenses: ${financialData.otherPayrollExpenses || 'Not provided'}
- Taxes: ${financialData.taxes || 'Not provided'}
- Custom Expenses: ${financialData.customExpenses || 'Not provided'}
- Cash Reserves: ${financialData.cashReserves || 'Not provided'}
- Time Period: ${financialData.timePeriod || 'Not provided'}
- Period Value: ${financialData.periodValue || 'Not provided'}
- Goal Type: ${financialData.goalType || 'Not provided'}
- Goal Amount: ${financialData.goalAmount || 'Not provided'}
- Goal Timeline: ${financialData.goalTimeline || 'Not provided'} months

Provide helpful, practical financial advice based on this data. Be specific and actionable.
`
    } else {
      context = "You are a financial advisor for business owners. Provide helpful, practical financial advice. Be specific and actionable."
    }
    
    // For now, we'll use a simple response since we don't have AI integration
    // In production, this would call an AI service like OpenAI, Anthropic, etc.
    let response = ""
    
    if (financialData) {
      response = `Based on your financial data for ${financialData.periodValue || 'the selected period'}, I can help you with analysis and advice. Your revenue is ${financialData.revenue || 'not provided'} with expenses including ${financialData.cogs || 'COGS'}, ${financialData.rent || 'rent'}, and payroll costs. Your goal is ${financialData.goalType || 'not specified'} with a timeline of ${financialData.goalTimeline || 'not specified'} months. What specific financial questions do you have?`
    } else {
      response = "I'm here to help with your financial planning questions. Please enter your financial data first so I can provide personalized advice."
    }
    
    return NextResponse.json({ response })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}