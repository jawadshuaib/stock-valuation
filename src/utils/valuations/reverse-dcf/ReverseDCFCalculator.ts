/**
 * Parameters required for the reverse DCF calculation
 */
interface ReverseDCFParams {
  sharePrice: number; // Current share price
  initialFCF: number; // Initial free cash flow (FCF)
  initialGrowthRate: number; // Expected starting growth rate (%)
  terminalGrowthRate: number; // Terminal growth rate (%)
  discountRate: number; // Discount rate (%)
  projectionYears: number; // Number of projection years
  outstandingShares: number; // Total shares outstanding
  // marginOfSafety: number; // Margin of safety (%), if you wish to adjust the intrinsic value
  decayFactor: number; // Decay factor for exponential decline in growth rate
}

/**
 * ReverseDCFCalculator class uses an exponential decay model for the growth rate.
 * It finds the implied initial growth rate such that the DCF value equals the market’s intrinsic value.
 *
 * The dynamic growth rate for year n is calculated as:
 *
 *   dynamicGrowthRate(n) = terminalGrowthRate + (initialGrowthRate - terminalGrowthRate) * exp(-decayFactor * (n - 1))
 *
 * All percentage inputs (growth rate, discount rate, terminal rate) are divided by 100 for calculations.
 */
class ReverseDCFCalculator {
  private params: ReverseDCFParams;

  constructor(params: ReverseDCFParams) {
    this.params = params;
  }

  /**
   * Calculates the implied initial growth rate (%)
   * that makes the present value of the cash flows equal to the market value.
   */
  calculateImpliedGrowthRate(): number {
    const {
      sharePrice,
      initialFCF,
      terminalGrowthRate,
      discountRate,
      projectionYears,
      outstandingShares,
      // marginOfSafety,
      decayFactor,
    } = this.params;

    // Determine the market's total intrinsic value.
    // Optionally, you might adjust for margin of safety; for now, we use the raw market value.
    const intrinsicValue = sharePrice * outstandingShares;

    /**
     * Calculates the DCF value given an initial growth rate.
     * The cash flows grow each year at a rate that decays exponentially toward the terminal rate.
     */
    const calculateDCF = (growthRate: number): number => {
      let totalValue = 0;
      let currentFCF = initialFCF;

      for (let year = 1; year <= projectionYears; year++) {
        // Exponential decay model for the growth rate:
        const dynamicGrowthRate =
          terminalGrowthRate +
          (growthRate - terminalGrowthRate) *
            Math.exp(-decayFactor * (year - 1));
        // Convert percentage to decimal:
        const dynamicGrowthRateDec = dynamicGrowthRate / 100;

        currentFCF *= 1 + dynamicGrowthRateDec;
        totalValue += currentFCF / Math.pow(1 + discountRate / 100, year);
      }

      // Terminal value using the terminal growth rate (converted to decimal):
      const terminalValue =
        (currentFCF * (1 + terminalGrowthRate / 100)) /
        (discountRate / 100 - terminalGrowthRate / 100);
      totalValue +=
        terminalValue / Math.pow(1 + discountRate / 100, projectionYears);

      return totalValue;
    };

    /**
     * Uses binary search to solve for the implied initial growth rate that makes
     * the calculated DCF value match the market's intrinsic value.
     */
    const findGrowthRate = (): number => {
      let low = 0;
      let high = 50; // Reasonable search range in percentage points
      let mid = 0;
      const tolerance = 0.0001;

      while (high - low > tolerance) {
        mid = (low + high) / 2;
        const dcfValue = calculateDCF(mid);

        if (dcfValue > intrinsicValue) {
          // The model produces a higher value than the market implies,
          // so the initial growth rate is too high.
          high = mid;
        } else {
          low = mid;
        }
      }
      return mid;
    };

    return findGrowthRate();
  }
}

export default ReverseDCFCalculator;
