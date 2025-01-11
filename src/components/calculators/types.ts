export interface ProjectionData {
  method: 'fcf' | 'eps';
  inputs: {
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
