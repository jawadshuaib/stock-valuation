/**
 * Parameters required for reverse DCF calculation
 */
interface ReverseDCFParams {
  fcf: number; // Free Cash Flow
  discountRate: number; // Discount rate for DCF
  terminalGrowthRate: number; // Terminal growth rate after projection years
  projectionYears: number; // Number of years to project future FCF
  marketPrice: number; // Current market price of the stock
  outstandingShares: number; // Number of shares outstanding
}

/**
 * Main class for reverse DCF calculation
 *
 * Financial Context:
 * This class calculates the implied growth rate of a stock given its FCF, discount rate, terminal growth rate, and current market price.
 * The reverse DCF calculation involves solving for the growth rate that equates the present value of projected cash flows to the current market price.
 */
class ReverseDCFCalculator {
  private params: ReverseDCFParams;

  constructor(params: ReverseDCFParams) {
    this.params = params;
  }

  /**
   * Calculates the implied growth rate
   *
   * Financial Context:
   * Uses a binary search method to find the growth rate that matches the intrinsic value to the current market price.
   */
  calculateImpliedGrowthRate(): number {
    const {
      fcf,
      discountRate,
      terminalGrowthRate,
      projectionYears,
      marketPrice,
      outstandingShares,
    } = this.params;
    const intrinsicValue = marketPrice * outstandingShares;

    /**
     * Calculates the DCF value for a given growth rate
     */
    const calculateDCF = (growthRate: number): number => {
      let totalValue = 0;
      let currentFCF = fcf;

      for (let year = 1; year <= projectionYears; year++) {
        currentFCF *= 1 + growthRate;
        totalValue += currentFCF / Math.pow(1 + discountRate, year);
      }

      const terminalValue =
        (currentFCF * (1 + terminalGrowthRate)) /
        (discountRate - terminalGrowthRate);
      totalValue += terminalValue / Math.pow(1 + discountRate, projectionYears);

      return totalValue;
    };

    /**
     * Finds the growth rate using binary search
     */
    const findGrowthRate = (): number => {
      let low = 0;
      let high = 1;
      let mid;

      while (high - low > 0.0001) {
        mid = (low + high) / 2;
        const dcfValue = calculateDCF(mid);

        if (dcfValue > intrinsicValue) {
          high = mid;
        } else {
          low = mid;
        }
      }

      return mid!;
    };

    return findGrowthRate();
  }
}

export default ReverseDCFCalculator;
