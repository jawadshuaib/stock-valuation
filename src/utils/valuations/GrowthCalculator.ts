/* eslint-disable @typescript-eslint/lines-between-class-members */
import ValuationConfig from './ValuationConfig';

/**
 * Handles growth rate calculations and decay
 */
class GrowthCalculator {
  private initialGrowth: number;
  private terminalGrowth: number;
  private decayFactor: number;
  private growthCategory: string;

  constructor(initialGrowth: number, terminalGrowth: number) {
    this.initialGrowth = initialGrowth;
    this.terminalGrowth = terminalGrowth;
    this.decayFactor = ValuationConfig.calculateDecayFactor(initialGrowth);
    this.growthCategory = ValuationConfig.getGrowthCategory(initialGrowth);
  }

  /**
   * Calculates the growth rate for a given year
   * @param year - The year for which to calculate the growth rate
   * @returns The growth rate as a decimal
   */
  calculateGrowthRate(year: number): number {
    const growthSpread = this.initialGrowth - this.terminalGrowth;
    return (
      this.terminalGrowth + growthSpread * Math.exp(-this.decayFactor * year)
    );
  }

  /**
   * Provides a detailed growth profile
   * @returns An object containing growth-related details
   */
  getGrowthProfile() {
    return {
      initialGrowth: this.initialGrowth,
      terminalGrowth: this.terminalGrowth,
      decayFactor: this.decayFactor,
      category: this.growthCategory,
      yearlyRates: Array.from({ length: 10 }, (_, i) => ({
        year: i + 1,
        growthRate: Number((this.calculateGrowthRate(i) * 100).toFixed(1)),
        decayPercent: Number(
          (
            (1 - this.calculateGrowthRate(i) / this.initialGrowth) *
            100
          ).toFixed(1),
        ),
      })),
    };
  }
}

export default GrowthCalculator;
