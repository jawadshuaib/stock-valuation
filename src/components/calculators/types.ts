export interface ProjectionData {
  method: 'fcf' | 'eps';
  inputs: {
    sharePrice: number;
    initialFCF?: number;
    initialEPS?: number;
    initialGrowthRate: string;
    terminalGrowthRate: string;
    discountRate: string;
    projectionYears: number;
    outstandingShares?: number;
  };
  yearByYearProjections: {
    year: number;
    fcf?: number;
    eps?: number;
    growthRate: number;
    presentValue: number;
  }[];
  growthAnalysis: {
    startingGrowthRate: string;
    endingGrowthRate: string;
    averageGrowthRate: string;
    growthCategory: string;
    decayFactor: number;
    decayAnalysis: {
      year: number;
      growthRate: number;
      decayPercent: number;
    }[];
  };
  terminalValueAnalysis: {
    finalFCF?: number;
    finalEPS?: number;
    terminalValue: number;
    presentValueOfTerminal: number;
  };
  valuation: {
    presentValueOfCashFlows: number;
    presentValueOfTerminal: number;
    intrinsicValue: number;
    marginOfSafetyPrice: number;
  };
  metadata: {
    calculatedAt: string;
  };
}

export interface ValuationData {
  intrinsicValue: number;
  marginOfSafetyPrice: number;
}

// Define the eps form data structure
export interface EPSFormData {
  sharePrice: number; // Share Price
  eps: number; // Earnings Per Share
  growthRate: number; // Initial growth rate as a percentage
  terminalGrowthRate: number; // Terminal growth rate as a percentage
  discountRate: number; // Discount rate as a percentage
  marginOfSafety: number; // Margin of safety as a percentage
}

// Define the fcf form data structure
export interface FCFFormData {
  sharePrice: number; // Share Price
  fcf: number; // Initial Free Cash Flow in dollars
  growthRate: number; // Initial growth rate as a percentage
  terminalGrowthRate: number; // Terminal growth rate as a percentage
  discountRate: number; // Discount rate as a percentage
  projectionYears: number; // Projection period in years
  marginOfSafety: number; // Margin of safety as a percentage
  outstandingShares: number; // Number of shares outstanding
}
