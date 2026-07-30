'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface ExpenseBreakdownChartProps {
  detailedInputs?: {
    rent: number
    utilities: number
    otherFacilityCosts: number
    personalSalary: number
    otherPayrollExpenses: number
    taxes: number
    customExpenses: number
  }
  rentUtilities?: number
  taxesPayroll?: number
  customExpenses?: number
}

const COLORS = {
  rent: '#2B6CB0',
  utilities: '#4299E1',
  otherFacility: '#90CDF4',
  personalSalary: '#9F7AEA',
  otherPayroll: '#B794F4',
  taxes: '#ED8936',
  custom: '#48BB78'
}

export default function ExpenseBreakdownChart({ 
  detailedInputs, 
  rentUtilities, 
  taxesPayroll, 
  customExpenses 
}: ExpenseBreakdownChartProps) {
  let data = []

  if (detailedInputs) {
    data = [
      { name: 'Rent', value: detailedInputs.rent || 0, color: COLORS.rent },
      { name: 'Utilities', value: detailedInputs.utilities || 0, color: COLORS.utilities },
      ...(detailedInputs.otherFacilityCosts > 0 ? [{ name: 'Other Facility', value: detailedInputs.otherFacilityCosts, color: COLORS.otherFacility }] : []),
      { name: 'Personal Salary', value: detailedInputs.personalSalary || 0, color: COLORS.personalSalary },
      { name: 'Other Payroll', value: detailedInputs.otherPayrollExpenses || 0, color: COLORS.otherPayroll },
      { name: 'Taxes', value: detailedInputs.taxes || 0, color: COLORS.taxes },
      { name: 'Custom Expenses', value: detailedInputs.customExpenses || 0, color: COLORS.custom }
    ]
  } else {
    // Fallback for old data structure
    data = [
      { name: 'Rent & Utilities', value: rentUtilities || 0, color: COLORS.rent },
      { name: 'Taxes & Payroll', value: taxesPayroll || 0, color: COLORS.personalSalary },
      { name: 'Custom Expenses', value: customExpenses || 0, color: COLORS.custom }
    ]
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const total = data.payload.payload.total
      const percentage = ((data.value / total) * 100).toFixed(1)
      
      return (
        <div className="bg-[#F7FAFC] p-3 rounded-lg border border-gray-200 shadow-lg">
          <p className="font-semibold text-[#1A202C]">{data.name}</p>
          <p className="text-sm text-[#718096]">
            ${data.value.toFixed(2)} ({percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  // Calculate total for percentage calculations
  const total = data.reduce((sum, item) => sum + item.value, 0)
  data.forEach(item => (item as any).total = total)

  // Filter out zero values for cleaner display
  const filteredData = data.filter(item => item.value > 0)

  if (filteredData.length === 0) {
    return (
      <div className="w-full">
        <h3 className="text-lg font-semibold text-[#1A202C] mb-4">Expense Breakdown</h3>
        <div className="flex items-center justify-center h-[350px] text-[#718096]">
          <p>No expense data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-[#1A202C] mb-4">Expense Breakdown</h3>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {filteredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry: any) => (
              <span style={{ color: entry.color, fontSize: '12px' }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="mt-4 grid grid-cols-2 gap-2">
        {filteredData.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[#718096]">{item.name}</span>
            <span className="font-medium text-[#1A202C] ml-auto">
              {((item.value / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
