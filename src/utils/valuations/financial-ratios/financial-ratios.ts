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

  /**
   * Free Cash Flow Yield = Free Cash Flow per Share / Share Price
   * It is the ratio of the free cash flow per share to the share price.
   * It is a measure of how much free cash flow the company generates per dollar of its stock price.
   * A higher free cash flow yield is generally better.
   * @returns The free cash flow yield or null if the method is not 'fcf'.
   */
  getFCFYield(): number | null {
    if (this.data.method !== 'fcf') return null;
    const fcf = this.data.inputs.initialFCF || 0;
    if (!this.data.inputs.outstandingShares) return null;
    const fcfPerShare = fcf / this.data.inputs.outstandingShares;
    return fcfPerShare / this.data.inputs.sharePrice;
  }

  getPriceToEPSRatio(): number | null {
    if (this.data.method !== 'eps') return null;
    const eps = this.data.inputs.initialEPS || 0;
    return this.data.inputs.sharePrice / eps;
  }

  /**
   * Earnings Yield = EPS / Share Price
   * Earnings Yield is the inverse of the Price to Earnings Ratio.
   * It is the ratio of the earnings per share to the share price.
   * It is a measure of how much the company earns per dollar of its stock price.
   * A higher earnings yield is generally better.
   * @returns The earnings yield or null if the method is not 'eps'.
   */
  getEarningsYield(): number | null {
    if (this.data.method !== 'eps') return null;
    const eps = this.data.inputs.initialEPS || 0;
    if (eps === 0) return null; // Ensure EPS is not zero
    return eps / this.data.inputs.sharePrice; // Calculate earnings yield
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
    return this.data.inputs.sharePrice / this.data.valuation.intrinsicValue;
  }

  getPriceToMarginOfSafetyRatio(): number {
    return (
      this.data.inputs.sharePrice / this.data.valuation.marginOfSafetyPrice
    );
  }
}
