/* eslint-disable @typescript-eslint/lines-between-class-members */
import ValuationConfig from './ValuationConfig';

/**
 * Handles growth rate calculations and decay
 *
 * Financial Context:
 * Growth rate decay is a common concept in financial modeling, particularly for valuing companies.
 * High initial growth rates typically cannot be sustained indefinitely due to market saturation,
 * competitive pressures, and other macroeconomic factors. This class calculates how growth rates
 * gradually transition from a high initial rate to a more stable "terminal" rate over time.
 */
class GrowthCalculator {
  private initialGrowth: number; // The starting growth rate (e.g., a high-growth company may have 20-30% initial growth)
  private terminalGrowth: number; // The long-term sustainable growth rate (e.g., GDP growth rate or inflation rate, often ~2-3%)
  private decayFactor: number; // Factor determining the speed at which growth decays over time
  private growthCategory: string; // A label categorizing the growth type (e.g., "High Growth", "Moderate Growth")

  constructor(initialGrowth: number, terminalGrowth: number) {
    this.initialGrowth = initialGrowth;
    this.terminalGrowth = terminalGrowth;
    // Decay factor is computed based on the initial growth rate; higher initial growth may decay faster
    this.decayFactor = ValuationConfig.calculateDecayFactor(initialGrowth);
    // Growth category provides qualitative insight into the company's growth phase
    this.growthCategory = ValuationConfig.getGrowthCategory(initialGrowth);
  }

  /**
   * Calculates the growth rate for a given year
   *
   * Financial Context:
   * The growth rate is assumed to decay exponentially. Exponential decay reflects real-world observations
   * where growth slows down more rapidly in early years and stabilizes over time.
   *
   * Formula:
   * growthRate(year) = terminalGrowth + (initialGrowth - terminalGrowth) * e^(-decayFactor * year)
   *
   * @param year - The year for which to calculate the growth rate
   * @returns The growth rate as a decimal (e.g., 0.15 for 15%)
   */
  calculateGrowthRate(year: number): number {
    const growthSpread = this.initialGrowth - this.terminalGrowth; // Difference between initial and terminal growth
    return (
      this.terminalGrowth + growthSpread * Math.exp(-this.decayFactor * year)
    );
  }

  /**
   * Provides a detailed growth profile
   *
   * Financial Context:
   * A growth profile summarizes the expected trajectory of growth over a defined period (e.g., 10 years).
   * This is useful for investors to understand the projected decline in growth rates and its financial implications.
   *
   * The yearly rates include:
   * - Growth rate: The projected growth rate for the year
   * - Decay percent: The percentage reduction in growth rate relative to the initial growth rate
   *
   * @returns An object containing growth-related details
   */
  getGrowthProfile() {
    return {
      initialGrowth: this.initialGrowth, // Initial growth rate
      terminalGrowth: this.terminalGrowth, // Terminal growth rate
      decayFactor: this.decayFactor, // Decay factor for exponential decline
      category: this.growthCategory, // Growth category descriptor
      yearlyRates: Array.from({ length: 10 }, (_, i) => ({
        year: i + 1, // Year number (e.g., Year 1, Year 2, ...)
        growthRate: Number((this.calculateGrowthRate(i) * 100).toFixed(1)), // Annual growth rate as a percentage
        decayPercent: Number(
          (
            (1 - this.calculateGrowthRate(i) / this.initialGrowth) *
            100
          ).toFixed(1), // Percentage of growth "decayed" compared to initial growth
        ),
      })),
    };
  }
}

export default GrowthCalculator;
