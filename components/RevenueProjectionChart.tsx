'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface RevenueProjectionChartProps {
  currentRevenue: number
  timeline: number
  profitMargin: number
}

export default function RevenueProjectionChart({ currentRevenue, timeline, profitMargin }: RevenueProjectionChartProps) {
  // Calculate profitability threshold (revenue needed to maintain current profit margin)
  const totalExpenses = currentRevenue * (1 - Math.abs(profitMargin) / 100)
  const profitabilityThreshold = totalExpenses / (1 - 0.05) // Assuming 5% minimum profit margin

  // Generate projection data
  const data = []
  const growthRates = {
    slow: 0.02, // 2% monthly growth
    standard: 0.05, // 5% monthly growth
    high: 0.10 // 10% monthly growth
  }

  for (let month = 0; month <= timeline; month++) {
    const monthData: any = {
      month: `Month ${month}`,
      threshold: profitabilityThreshold
    }

    // Calculate projections based on different growth rates
    monthData.slowGrowth = currentRevenue * Math.pow(1 + growthRates.slow, month)
    monthData.standardGrowth = currentRevenue * Math.pow(1 + growthRates.standard, month)
    monthData.highGrowth = currentRevenue * Math.pow(1 + growthRates.high, month)

    data.push(monthData)
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-[#1A202C] mb-4">Revenue Projection Over Time</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis 
            dataKey="month" 
            stroke="#718096"
            tick={{ fill: '#718096', fontSize: 12 }}
          />
          <YAxis 
            stroke="#718096"
            tick={{ fill: '#718096', fontSize: 12 }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#F7FAFC', 
              border: '1px solid #E2E8F0',
              borderRadius: '8px'
            }}
            formatter={(value: any) => `$${typeof value === 'number' ? value.toFixed(2) : '0.00'}`}
          />
          <Legend />
          
          {/* Profitability Threshold */}
          <Line 
            type="monotone" 
            dataKey="threshold" 
            stroke="#E53E3E" 
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Profitability Threshold"
          />
          
          {/* Slow Growth */}
          <Line 
            type="monotone" 
            dataKey="slowGrowth" 
            stroke="#718096" 
            strokeWidth={2}
            name="Slow Growth (2%)"
          />
          
          {/* Standard Growth */}
          <Line 
            type="monotone" 
            dataKey="standardGrowth" 
            stroke="#2B6CB0" 
            strokeWidth={3}
            name="Standard Growth (5%)"
          />
          
          {/* High Growth */}
          <Line 
            type="monotone" 
            dataKey="highGrowth" 
            stroke="#48BB78" 
            strokeWidth={2}
            name="High Growth (10%)"
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 p-4 bg-[#F7FAFC] rounded-lg border border-gray-200">
        <p className="text-sm text-[#718096]">
          <span className="font-semibold text-[#1A202C]">Key:</span> The red dashed line shows the minimum revenue needed to maintain profitability. 
          Your business should aim to stay above this line. Different growth scenarios show potential revenue paths based on varying growth rates.
        </p>
      </div>
    </div>
  )
}
