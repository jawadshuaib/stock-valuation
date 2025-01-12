import { ProjectionData } from '../../../components/calculators/types';

export class FinancialRatiosCalculator {
  private data: ProjectionData;

  constructor(data: ProjectionData) {
    this.data = data;
  }

  getPriceToFCFRatio(): number | null {
    if (this.data.method !== 'fcf') return null;
    const fcf = this.data.inputs.initialFCF || 0;
    return this.data.inputs.sharePrice / fcf;
  }

  getPriceToEPSRatio(): number | null {
    if (this.data.method !== 'eps') return null;
    const eps = this.data.inputs.initialEPS || 0;
    return this.data.inputs.sharePrice / eps;
  }

  getPriceToIntrinsicValueRatio(): number {
    return this.data.inputs.sharePrice / this.data.valuation.intrinsicValue;
  }

  getPriceToMarginOfSafetyRatio(): number {
    return (
      this.data.inputs.sharePrice / this.data.valuation.marginOfSafetyPrice
    );
  }
}
