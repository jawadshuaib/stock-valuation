/**
 * Parameters required for the reverse DCF calculation.
 * Depending on the chosen method ("fcf" or "eps"), the appropriate initial value should be provided.
 */
interface ReverseDCFParams {
  method: 'fcf' | 'eps'; // Method of valuation: FCF or EPS
  sharePrice: number; // Current share price
  initialFCF?: number; // Initial free cash flow (for FCF method)
  initialEPS?: number; // Initial earnings per share (for EPS method)
  initialGrowthRate: number; // Expected starting growth rate (%)
  terminalGrowthRate: number; // Terminal growth rate (%)
  discountRate: number; // Discount rate (%)
  projectionYears: number; // Number of projection years
  outstandingShares?: number; // Total shares outstanding (only used for FCF)
  marginOfSafety: number; // Margin of safety (%)
  decayFactor: number; // Decay factor for exponential decline in growth rate
}

/**
 * ReverseDCFCalculator uses an exponential decay model for the growth rate.
 * It finds the implied initial growth rate such that the present value of the cash flows (or EPS) equals the market’s intrinsic value.
 *
 * The dynamic growth rate for year n is calculated as:
 *   dynamicGrowthRate(n) = terminalGrowthRate + (initialGrowthRate - terminalGrowthRate) * exp(-decayFactor * (n - 1))
 *
 * For the FCF method, the intrinsic value is calculated as: sharePrice * outstandingShares.
 * For the EPS method, it is simply the sharePrice (per-share valuation).
 * All percentage‐inputs are expressed in percent and converted to decimals when used.
 */
class ReverseDCFCalculator {
  private params: ReverseDCFParams;

  constructor(params: ReverseDCFParams) {
    this.params = params;
  }

  /**
   * Calculates the implied initial growth rate (%) that makes the present value of the projected values equal
   * to the market’s intrinsic value.
   */
  calculateImpliedGrowthRate(): number {
    const {
      method,
      sharePrice,
      // initialGrowthRate,
      terminalGrowthRate,
      discountRate,
      projectionYears,
      outstandingShares,
      // marginOfSafety,
      decayFactor,
    } = this.params;

    // Determine the base value (FCF or EPS) based on the chosen method.
    let initialValue: number;
    if (method === 'fcf') {
      if (this.params.initialFCF === undefined) {
        throw new Error('initialFCF must be provided for method "fcf".');
      }
      initialValue = this.params.initialFCF;
    } else if (method === 'eps') {
      if (this.params.initialEPS === undefined) {
        throw new Error('initialEPS must be provided for method "eps".');
      }
      initialValue = this.params.initialEPS;
    } else {
      throw new Error('Invalid method. Choose "fcf" or "eps".');
    }

    // Calculate the market's intrinsic value.
    // For FCF, intrinsic value = sharePrice * outstandingShares;
    // for EPS, intrinsic value = sharePrice (per share).
    const intrinsicValue =
      method === 'fcf' ? sharePrice * (outstandingShares || 0) : sharePrice;

    /**
     * Calculates the DCF value given an initial growth rate.
     * Uses an exponential decay model for the growth rate over the projection period.
     */
    const calculateDCF = (growthRate: number): number => {
      let totalValue = 0;
      let currentValue = initialValue;

      for (let year = 1; year <= projectionYears; year++) {
        // Calculate the dynamic growth rate for this year.
        const dynamicGrowthRate =
          terminalGrowthRate +
          (growthRate - terminalGrowthRate) *
            Math.exp(-decayFactor * (year - 1));
        const dynamicGrowthRateDec = dynamicGrowthRate / 100;

        // Update the value for this year.
        currentValue *= 1 + dynamicGrowthRateDec;
        totalValue += currentValue / Math.pow(1 + discountRate / 100, year);
      }

      // Calculate terminal value using the terminal growth rate.
      const terminalValue =
        (currentValue * (1 + terminalGrowthRate / 100)) /
        (discountRate / 100 - terminalGrowthRate / 100);
      totalValue +=
        terminalValue / Math.pow(1 + discountRate / 100, projectionYears);

      return totalValue;
    };

    /**
     * Uses a binary search to solve for the implied initial growth rate that brings
     * the calculated DCF value into line with the market's intrinsic value.
     */
    const findGrowthRate = (): number => {
      let low = 0;
      let high = 50; // Reasonable search range in percentage points.
      let mid = 0;
      const tolerance = 0.0001;

      while (high - low > tolerance) {
        mid = (low + high) / 2;
        const dcfValue = calculateDCF(mid);

        if (dcfValue > intrinsicValue) {
          // The calculated DCF value is too high, so lower the growth rate.
          high = mid;
        } else {
          // The calculated DCF value is too low, so raise the growth rate.
          low = mid;
        }
      }
      return mid;
    };

    return findGrowthRate();
  }
}

export default ReverseDCFCalculator;
