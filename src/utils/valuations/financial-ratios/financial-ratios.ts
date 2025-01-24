import { ProjectionData } from '../../../components/calculators/types';

export class FinancialRatiosCalculator {
  private data: ProjectionData;

  constructor(data: ProjectionData) {
    this.data = data;
  }

  getPriceToFCFRatio(): number | null {
    if (this.data.method !== 'fcf') return null;
    const fcf = this.data.inputs.initialFCF || 0;
    if (!this.data.inputs.outstandingShares) return null;
    const fcfPerShare = fcf / this.data.inputs.outstandingShares;
    return this.data.inputs.sharePrice / fcfPerShare;
  }

  getPriceToEPSRatio(): number | null {
    if (this.data.method !== 'eps') return null;
    const eps = this.data.inputs.initialEPS || 0;
    return this.data.inputs.sharePrice / eps;
  }

  getPriceToEarningsGrowth(): number | null {
    if (this.data.method !== 'eps') return null; // Ensure the method is 'eps'
    const eps = this.data.inputs.initialEPS || 0;
    if (eps === 0) return null; // Ensure EPS is not zero
    const peRatio = this.data.inputs.sharePrice / eps; // Calculate PE ratio
    const growth =
      parseFloat(this.data.inputs.initialGrowthRate.toString()) || 0;
    if (growth === 0) return null; // Ensure Growth rate is not zero
    return peRatio / growth; // Calculate PEG ratio
  }

  getPriceToIntrinsicValueRatio(): number {
    console.log('financial-ratios', this.data.valuation.intrinsicValue);
    return this.data.inputs.sharePrice / this.data.valuation.intrinsicValue;
  }

  getPriceToMarginOfSafetyRatio(): number {
    return (
      this.data.inputs.sharePrice / this.data.valuation.marginOfSafetyPrice
    );
  }
}
