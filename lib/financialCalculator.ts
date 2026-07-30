/**
 * Financial Calculation Engine
 * Computes baseline financial figures and handles goal impact adjustments
 */

export interface FinancialInputs {
  revenue: number;
  cogs: number;
  rentUtilities: number;
  taxesPayroll: number;
  customExpenses: number;
  cashReserves?: number; // Optional: user's current cash reserves
}

export interface DetailedFinancialInputs {
  revenue: number;
  cogs: number;
  rent: number;
  utilities: number;
  otherFacilityCosts: number;
  numberOfEmployees: number;
  personalSalary: number;
  otherPayrollExpenses: number;
  taxes: number;
  customExpenses: number;
  cashReserves: number;
  timePeriod: 'monthly' | 'quarterly' | 'annually';
}

export interface TimePeriodData {
  id: string;
  periodType: 'month' | 'quarter' | 'year';
  periodValue: string; // e.g., "January 2024", "Q1 2024", "2024"
  financialData: DetailedFinancialInputs;
  goalInputs?: GoalInputs;
}

export interface TimeSeriesFinancialData {
  periods: TimePeriodData[];
  currentPeriodId: string;
}

export interface GoalInputs {
  goalType: 'growth' | 'profit' | 'employees' | 'renovations' | 'marketing' | '';
  goalAmount: number;
  goalTimeline: number; // in months
  ongoingCost?: number; // Monthly ongoing cost for the goal
}

export interface BaselineCalculations {
  grossProfit: number;
  totalOperatingExpenses: number;
  netIncome: number;
  netProfitMargin: number;
  burnRate: number;
  safetyBuffer: number; // in months
}

export interface RiskAssessment {
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  riskScore: number; // 0-100
  factors: {
    profitMargin: number;
    safetyBuffer: number;
    cashFlowHealth: number;
  };
}

export interface AdjustedFinancials {
  baseline: BaselineCalculations;
  adjusted: BaselineCalculations;
  goalImpact: {
    upfrontCost: number;
    monthlyOngoingCost: number;
    totalCostOverTimeline: number;
  };
  risk: RiskAssessment;
}

/**
 * Convert time period to monthly multiplier
 */
export function getTimePeriodMultiplier(timePeriod: 'monthly' | 'quarterly' | 'annually'): number {
  switch (timePeriod) {
    case 'monthly': return 1;
    case 'quarterly': return 1/3;
    case 'annually': return 1/12;
    default: return 1;
  }
}

/**
 * Analyze time-series financial data to identify trends
 */
export function analyzeTimeSeriesTrends(timeSeriesData: TimeSeriesFinancialData) {
  const periods = timeSeriesData.periods.sort((a, b) => {
    // Sort by period (assuming format like "January 2024", "Q1 2024", "2024")
    return a.periodValue.localeCompare(b.periodValue);
  });

  const trends = {
    revenue: [] as number[],
    netIncome: [] as number[],
    profitMargin: [] as number[],
    periods: periods.map(p => p.periodValue)
  };

  periods.forEach(period => {
    const normalized = normalizeToMonthly(period.financialData);
    const baseline = calculateBaseline(normalized);
    
    trends.revenue.push(normalized.revenue);
    trends.netIncome.push(baseline.netIncome);
    trends.profitMargin.push(baseline.netProfitMargin);
  });

  return trends;
}

/**
 * Calculate period-over-period growth rates
 */
export function calculateGrowthRates(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Get progress towards goal across time periods
 */
export function calculateGoalProgress(timeSeriesData: TimeSeriesFinancialData, goal: GoalInputs) {
  const periods = timeSeriesData.periods.sort((a, b) => 
    a.periodValue.localeCompare(b.periodValue)
  );

  const progress = periods.map((period, index) => {
    const normalized = normalizeToMonthly(period.financialData);
    const baseline = calculateBaseline(normalized);
    
    // Calculate cumulative progress if we have goal inputs
    let goalProgress = 0;
    if (period.goalInputs) {
      const result = calculateGoalImpact(normalized, period.goalInputs);
      // Simple progress metric: how close are we to the goal timeline?
      goalProgress = (index + 1) / goal.goalTimeline * 100;
    }

    return {
      period: period.periodValue,
      revenue: normalized.revenue,
      netIncome: baseline.netIncome,
      profitMargin: baseline.netProfitMargin,
      goalProgress: Math.min(goalProgress, 100)
    };
  });

  return progress;
}

/**
 * Normalize detailed inputs to monthly values
 */
export function normalizeToMonthly(detailedInputs: DetailedFinancialInputs): FinancialInputs {
  const multiplier = getTimePeriodMultiplier(detailedInputs.timePeriod);
  
  return {
    revenue: detailedInputs.revenue * multiplier,
    cogs: detailedInputs.cogs * multiplier,
    rentUtilities: (detailedInputs.rent + detailedInputs.utilities + detailedInputs.otherFacilityCosts) * multiplier,
    taxesPayroll: (detailedInputs.taxes + detailedInputs.personalSalary + detailedInputs.otherPayrollExpenses) * multiplier,
    customExpenses: detailedInputs.customExpenses * multiplier,
    cashReserves: detailedInputs.cashReserves // Cash reserves are absolute, not time-dependent
  };
}

/**
 * Calculate baseline financial figures
 */
export function calculateBaseline(inputs: FinancialInputs): BaselineCalculations {
  const { revenue, cogs, rentUtilities, taxesPayroll, customExpenses, cashReserves = 0 } = inputs;

  // Gross Profit = Revenue - COGS
  const grossProfit = revenue - cogs;

  // Total Operating Expenses = Rent + Taxes/Payroll + Other Overhead
  const totalOperatingExpenses = rentUtilities + taxesPayroll + customExpenses;

  // Net Income = Gross Profit - OpEx
  const netIncome = grossProfit - totalOperatingExpenses;

  // Net Profit Margin = Net Income / Revenue (as percentage)
  const netProfitMargin = revenue > 0 ? (netIncome / revenue) * 100 : 0;

  // Burn Rate = Monthly OpEx (assuming all inputs are monthly)
  const burnRate = totalOperatingExpenses;

  // Safety Buffer = Cash Reserves / Monthly OpEx (in months)
  const safetyBuffer = burnRate > 0 ? cashReserves / burnRate : 0;

  return {
    grossProfit,
    totalOperatingExpenses,
    netIncome,
    netProfitMargin,
    burnRate,
    safetyBuffer
  };
}

/**
 * Assess risk level based on financial metrics
 */
export function assessRisk(baseline: BaselineCalculations): RiskAssessment {
  const { netProfitMargin, safetyBuffer, netIncome } = baseline;

  let riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  let riskScore = 0;

  // Check for critical risk first (negative cash flow)
  if (netIncome < 0) {
    riskLevel = 'Critical';
    riskScore = 90 + Math.min(10, Math.abs(netIncome) / 1000); // 90-100 based on severity
  } 
  // High Risk: Net profit margin < 5% or safety buffer < 3 months
  else if (netProfitMargin < 5 || safetyBuffer < 3) {
    riskLevel = 'High';
    riskScore = 60 + Math.min(20, (5 - netProfitMargin) * 2); // 60-80
  } 
  // Moderate Risk: Net profit margin between 5% and 20%; safety buffer 3-6 months
  else if (netProfitMargin < 20 || safetyBuffer < 6) {
    riskLevel = 'Moderate';
    riskScore = 30 + Math.min(20, (20 - netProfitMargin)); // 30-50
  } 
  // Low Risk: Net profit margin > 20% after applying goal expenses; safety buffer > 6 months
  else {
    riskLevel = 'Low';
    riskScore = Math.max(0, 20 - (netProfitMargin - 20) / 2); // 0-20
  }

  // Calculate individual factor scores
  const profitMarginScore = Math.max(0, Math.min(100, (netProfitMargin / 25) * 100));
  const safetyBufferScore = Math.max(0, Math.min(100, (safetyBuffer / 12) * 100));
  const cashFlowHealthScore = netIncome > 0 ? Math.min(100, (netIncome / 10000) * 100) : 0;

  return {
    riskLevel,
    riskScore: Math.round(riskScore),
    factors: {
      profitMargin: Math.round(profitMarginScore),
      safetyBuffer: Math.round(safetyBufferScore),
      cashFlowHealth: Math.round(cashFlowHealthScore)
    }
  };
}

/**
 * Calculate goal impact and adjusted financials
 */
export function calculateGoalImpact(
  inputs: FinancialInputs,
  goal: GoalInputs
): AdjustedFinancials {
  const baseline = calculateBaseline(inputs);
  
  // Calculate goal impact based on goal type
  let upfrontCost = 0;
  let monthlyOngoingCost = 0;

  switch (goal.goalType) {
    case 'growth':
      // Growth: Target amount is upfront investment, assume 20% as ongoing monthly cost
      upfrontCost = goal.goalAmount;
      monthlyOngoingCost = goal.goalAmount * 0.2 / goal.goalTimeline;
      break;
    
    case 'profit':
      // Profit Target: No upfront cost, but may require operational changes
      upfrontCost = 0;
      monthlyOngoingCost = goal.goalAmount * 0.1 / goal.goalTimeline; // 10% investment
      break;
    
    case 'employees':
      // Employee Count: Assume $50,000 per employee upfront (hiring costs), ongoing salary
      const annualSalaryPerEmployee = 50000;
      const hiringCostPerEmployee = 5000;
      const employeeCount = goal.goalAmount;
      upfrontCost = employeeCount * hiringCostPerEmployee;
      monthlyOngoingCost = (employeeCount * annualSalaryPerEmployee) / 12;
      break;
    
    case 'renovations':
      // Renovations: Full amount upfront, minimal ongoing
      upfrontCost = goal.goalAmount;
      monthlyOngoingCost = goal.goalAmount * 0.02 / goal.goalTimeline; // 2% maintenance
      break;
    
    case 'marketing':
      // Marketing: 50% upfront, 50% spread over timeline
      upfrontCost = goal.goalAmount * 0.5;
      monthlyOngoingCost = (goal.goalAmount * 0.5) / goal.goalTimeline;
      break;
    
    default:
      upfrontCost = 0;
      monthlyOngoingCost = 0;
  }

  // Use provided ongoing cost if available
  if (goal.ongoingCost !== undefined) {
    monthlyOngoingCost = goal.ongoingCost;
  }

  const totalCostOverTimeline = upfrontCost + (monthlyOngoingCost * goal.goalTimeline);

  // Calculate adjusted financials
  const adjustedCashReserves = (inputs.cashReserves || 0) - upfrontCost;
  const adjustedOperatingExpenses = baseline.totalOperatingExpenses + monthlyOngoingCost;
  const adjustedNetIncome = baseline.grossProfit - adjustedOperatingExpenses;
  const adjustedProfitMargin = inputs.revenue > 0 ? (adjustedNetIncome / inputs.revenue) * 100 : 0;
  const adjustedSafetyBuffer = adjustedOperatingExpenses > 0 ? adjustedCashReserves / adjustedOperatingExpenses : 0;

  const adjusted: BaselineCalculations = {
    grossProfit: baseline.grossProfit, // Gross profit doesn't change with goal expenses
    totalOperatingExpenses: adjustedOperatingExpenses,
    netIncome: adjustedNetIncome,
    netProfitMargin: adjustedProfitMargin,
    burnRate: adjustedOperatingExpenses,
    safetyBuffer: adjustedSafetyBuffer
  };

  // Assess risk with adjusted financials
  const risk = assessRisk(adjusted);

  return {
    baseline,
    adjusted,
    goalImpact: {
      upfrontCost,
      monthlyOngoingCost,
      totalCostOverTimeline
    },
    risk
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Generate strategic advice based on risk assessment
 */
export function generateStrategicAdvice(
  baseline: BaselineCalculations,
  adjusted: BaselineCalculations,
  risk: RiskAssessment,
  goal: GoalInputs
): string[] {
  const advice: string[] = [];

  // Safety buffer advice
  if (baseline.safetyBuffer < 3) {
    advice.push('Critical: Build emergency reserves. Aim for 3-6 months of operating expenses to protect against unexpected costs or revenue dips.');
  } else if (baseline.safetyBuffer < 6) {
    advice.push('Consider maintaining 3-6 months of operating expenses as emergency reserves to improve financial stability.');
  }

  // Profit margin advice
  if (baseline.netProfitMargin < 5) {
    advice.push('Warning: Profit margins are very thin. Review COGS and operating expenses to identify cost-saving opportunities.');
  } else if (baseline.netProfitMargin < 15) {
    advice.push('Review COGS regularly to identify cost-saving opportunities without compromising product quality.');
  }

  // Goal-specific advice
  if (goal.goalType === 'employees') {
    advice.push('Before hiring, ensure you have sufficient cash flow to cover at least 6 months of salaries for new positions.');
  } else if (goal.goalType === 'renovations') {
    advice.push('Renovation projects often run 20-30% over budget. Build in contingency funds and consider phased implementation.');
  } else if (goal.goalType === 'marketing') {
    advice.push('Track marketing ROI carefully. Start with smaller campaigns to test effectiveness before scaling up.');
  }

  // Revenue diversification advice
  if (baseline.grossProfit / (baseline.grossProfit + baseline.totalOperatingExpenses) < 0.3) {
    advice.push('Diversify revenue streams to reduce dependency on single sources and improve growth potential.');
  }

  // Cash flow monitoring advice
  advice.push('Monitor cash flow trends weekly to identify potential shortfalls before they become critical.');

  // Risk-specific advice
  if (risk.riskLevel === 'Critical') {
    advice.push('URGENT: Current plan creates negative cash flow. Reduce goal scope, delay implementation, or secure additional funding before proceeding.');
  } else if (risk.riskLevel === 'High') {
    advice.push('High risk: Consider a phased approach to your goal. Implement in stages to assess impact before full commitment.');
  }

  return advice;
}