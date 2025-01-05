/**
 * Calculates present values and handles discounting
 */
class PresentValueCalculator {
  private discountRate: number;

  constructor(discountRate: number) {
    this.discountRate = discountRate;
  }

  /**
   * Calculates the present value of a future cash flow
   * @param futureValue - The value in the future to discount
   * @param year - The year in which the future value is realized
   * @returns The present value
   */
  calculatePresentValue(futureValue: number, year: number): number {
    return futureValue / Math.pow(1 + this.discountRate, year);
  }

  /**
   * Calculates the terminal value using the Gordon growth model
   * @param finalEPS - The final earnings per share at the end of the projection period
   * @param terminalGrowthRate - The perpetual growth rate assumed for the terminal value
   * @returns The terminal value
   */
  calculateTerminalValue(finalEPS: number, terminalGrowthRate: number): number {
    if (this.discountRate <= terminalGrowthRate) {
      throw new Error(
        'Discount rate must be greater than the terminal growth rate to calculate terminal value.',
      );
    }

    return (
      (finalEPS * (1 + terminalGrowthRate)) /
      (this.discountRate - terminalGrowthRate)
    );
  }
}

export default PresentValueCalculator;
