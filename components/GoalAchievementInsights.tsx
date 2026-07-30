'use client'

interface GoalAchievementInsightsProps {
  goalType: string
  goalAmount: number
  goalTimeline: number
  riskLevel: string
  netProfitMargin: number
  safetyBuffer: number
  detailedInputs?: {
    numberOfEmployees: number
    personalSalary: number
    revenue: number
  }
  customDescription?: string
}

export default function GoalAchievementInsights({
  goalType,
  goalAmount,
  goalTimeline,
  riskLevel,
  netProfitMargin,
  safetyBuffer,
  detailedInputs,
  customDescription
}: GoalAchievementInsightsProps) {
  
  const generateGoalSpecificInsights = () => {
    const insights: string[] = []

    switch (goalType) {
      case 'growth':
        insights.push('Consider reinvesting current profits into growth initiatives rather than taking on debt.')
        insights.push('Focus on customer acquisition strategies with measurable ROI.')
        insights.push('Expand into adjacent markets or product lines to leverage existing customer base.')
        if (netProfitMargin > 15) {
          insights.push('Your healthy profit margin provides room for strategic investments in growth.')
        } else {
          insights.push('Improve operational efficiency before major expansion to ensure sustainable growth.')
        }
        break

      case 'profit':
        insights.push('Review pricing strategy - consider value-based pricing to improve margins.')
        insights.push('Identify and eliminate low-margin products or services.')
        insights.push('Reduce COGS through supplier negotiations or bulk purchasing.')
        insights.push('Implement cost control measures across all departments.')
        if (detailedInputs?.personalSalary && detailedInputs.revenue) {
          const salaryRatio = (detailedInputs.personalSalary / detailedInputs.revenue) * 100
          if (salaryRatio > 20) {
            insights.push('Consider optimizing owner compensation structure to improve overall profitability.')
          }
        }
        break

      case 'employees':
        insights.push('Develop a clear hiring plan with role definitions and performance expectations.')
        insights.push('Consider phased hiring to manage cash flow impact.')
        insights.push('Invest in training and onboarding to ensure new employees become productive quickly.')
        insights.push('Review current team structure to identify roles that can be consolidated or automated.')
        if (safetyBuffer < 6) {
          insights.push('Build cash reserves to cover at least 6 months of payroll before expanding the team.')
        }
        insights.push('Consider contractor or remote arrangements to reduce facility and benefit costs.')
        break

      case 'renovations':
        insights.push('Obtain multiple quotes from contractors to ensure competitive pricing.')
        insights.push('Phase renovations to minimize business disruption and spread costs.')
        insights.push('Consider renovations that will directly impact revenue generation (e.g., customer-facing areas).')
        insights.push('Set aside 20-30% contingency funds for unexpected costs.')
        if (riskLevel === 'High' || riskLevel === 'Critical') {
          insights.push('Delay renovations until financial position improves to avoid jeopardizing business stability.')
        }
        break

      case 'marketing':
        insights.push('Start with A/B testing on small campaigns before scaling up spend.')
        insights.push('Focus on marketing channels with proven ROI for your industry.')
        insights.push('Set clear, measurable KPIs for all marketing initiatives.')
        insights.push('Consider content marketing and organic growth strategies to reduce paid ad dependency.')
        insights.push('Build email marketing capabilities for cost-effective customer retention.')
        break

      case 'continuity':
        insights.push('Focus on building robust emergency reserves - aim for 6-12 months of operating expenses.')
        insights.push('Diversify revenue streams to reduce dependency on single sources.')
        insights.push('Develop contingency plans for key business risks (supply chain, key personnel, market changes).')
        insights.push('Maintain strong relationships with multiple suppliers to reduce dependency risks.')
        insights.push('Regularly review insurance coverage to ensure adequate protection.')
        if (safetyBuffer < 6) {
          insights.push('Priority: Build cash reserves to at least 6 months of operating expenses for business resilience.')
        }
        break

      case 'custom':
        insights.push('Break down your custom goal into smaller, manageable milestones.')
        insights.push('Establish clear metrics to measure progress toward your specific objective.')
        insights.push('Regularly assess whether your current activities align with your custom goal.')
        insights.push('Be prepared to pivot your approach based on results and changing circumstances.')
        insights.push('Document lessons learned to inform future custom initiatives.')
        if (customDescription) {
          insights.push(`Your custom goal: "${customDescription}" - Keep this specific objective in mind throughout implementation.`)
        }
        break

      default:
        insights.push('Set clear, measurable milestones for tracking progress toward your goal.')
        insights.push('Regularly review and adjust your strategy based on performance data.')
    }

    // Add financial health based insights
    if (riskLevel === 'Critical') {
      insights.push('URGENT: Focus on stabilizing cash flow before pursuing major goals.')
      insights.push('Consider temporary expense reduction to build financial buffer.')
    } else if (riskLevel === 'High') {
      insights.push('Proceed cautiously with your goal. Consider a phased approach.')
      insights.push('Monitor cash flow weekly during goal implementation.')
    } else if (riskLevel === 'Low') {
      insights.push('Your strong financial position provides flexibility in pursuing this goal.')
      insights.push('Consider accelerating timeline or expanding scope if opportunities arise.')
    }

    return insights
  }

  const generateActionableSteps = () => {
    const steps: string[] = []

    // Common first steps
    steps.push('Create a detailed project plan with timeline and financial breakdown.')
    steps.push('Set up tracking systems to monitor goal progress and financial impact.')

    switch (goalType) {
      case 'growth':
        steps.push('Identify top 3 growth opportunities with highest potential ROI.')
        steps.push('Develop marketing campaigns for each opportunity.')
        steps.push('Set up customer feedback loops to validate growth strategies.')
        break

      case 'profit':
        steps.push('Conduct comprehensive expense audit.')
        steps.push('Review all supplier contracts for negotiation opportunities.')
        steps.push('Analyze product/service profitability by category.')
        break

      case 'employees':
        steps.push('Draft detailed job descriptions for new positions.')
        steps.push('Develop interview and onboarding processes.')
        steps.push('Calculate total cost per hire including benefits and training.')
        break

      case 'renovations':
        steps.push('Get professional assessments and multiple contractor quotes.')
        steps.push('Secure necessary permits and approvals.')
        steps.push('Plan for temporary business operations during renovation.')
        break

      case 'marketing':
        steps.push('Define target audience and key messaging.')
        steps.push('Set up analytics and tracking for all marketing channels.')
        steps.push('Create content calendar and campaign schedule.')
        break

      case 'continuity':
        steps.push('Conduct comprehensive risk assessment of current operations.')
        steps.push('Review and strengthen insurance coverage.')
        steps.push('Identify and diversify key supplier relationships.')
        steps.push('Build emergency reserve fund with target amount.')
        steps.push('Document business continuity and disaster recovery procedures.')
        break

      case 'custom':
        steps.push('Clearly define success metrics for your custom goal.')
        steps.push('Break down goal into specific, actionable milestones.')
        steps.push('Identify resources and funding required for each phase.')
        steps.push('Set up regular review cycles to assess progress.')
        steps.push('Create contingency plans for potential obstacles.')
        break
    }

    steps.push('Review progress monthly and adjust strategy as needed.')
    steps.push('Celebrate milestones to maintain team motivation.')

    return steps
  }

  const insights = generateGoalSpecificInsights()
  const actionableSteps = generateActionableSteps()

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-[#1A202C] mb-4">Goal Achievement Insights</h3>
      
      {/* Risk Assessment Banner */}
      <div className={`mb-6 p-4 rounded-lg border-2 ${
        riskLevel === 'Critical' ? 'bg-red-50 border-red-500' :
        riskLevel === 'High' ? 'bg-orange-50 border-orange-500' :
        riskLevel === 'Moderate' ? 'bg-yellow-50 border-yellow-500' :
        'bg-green-50 border-green-500'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            riskLevel === 'Critical' ? 'bg-red-500' :
            riskLevel === 'High' ? 'bg-orange-500' :
            riskLevel === 'Moderate' ? 'bg-yellow-500' :
            'bg-green-500'
          }`}>
            <span className="text-white font-bold text-sm">
              {riskLevel === 'Critical' ? '!' : 
               riskLevel === 'High' ? '!' :
               riskLevel === 'Moderate' ? 'i' : '✓'}
            </span>
          </div>
          <div>
            <p className="font-semibold text-[#1A202C]">Current Risk Level: {riskLevel}</p>
            <p className="text-sm text-[#718096]">
              {riskLevel === 'Critical' ? 'Immediate attention required. Focus on financial stabilization.' :
               riskLevel === 'High' ? 'Proceed with caution. Consider phased implementation.' :
               riskLevel === 'Moderate' ? 'Monitor closely. Ensure adequate buffers.' :
               'Good position to pursue goal. Maintain current practices.'}
            </p>
          </div>
        </div>
      </div>

      {/* Strategic Insights */}
      <div className="mb-6 bg-[#F7FAFC] rounded-lg p-5 border border-gray-200">
        <h4 className="font-semibold text-[#1A202C] mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#9F7AEA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Strategic Insights
        </h4>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                index % 2 === 0 ? 'bg-[#2B6CB0]' : 'bg-[#9F7AEA]'
              }`}></div>
              <p className="text-sm text-[#1A202C]">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable Steps */}
      <div className="bg-[#F7FAFC] rounded-lg p-5 border border-gray-200">
        <h4 className="font-semibold text-[#1A202C] mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#2B6CB0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Actionable Steps
        </h4>
        <div className="space-y-2">
          {actionableSteps.map((step, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#2B6CB0] text-white text-xs flex items-center justify-center flex-shrink-0">
                {index + 1}
              </div>
              <p className="text-sm text-[#1A202C]">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
