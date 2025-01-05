/**
 * Configuration constants for stock valuation
 *
 * These limits are based on:
 * - Historical market returns
 * - Economic growth rates
 * - Inflation expectations
 * - Risk considerations
 */

class ValuationConfig {
  static DEFAULTS = {
    PROJECTION_YEARS: 10,
    MARGIN_OF_SAFETY: 0.25,
  };

  static LIMITS = {
    MAX_TERMINAL_GROWTH: 0.04, // 4%
    MIN_DISCOUNT_RATE: 0.08, // 8%
    MAX_INITIAL_GROWTH: 1, // 100%
  };

  static GROWTH_THRESHOLDS = {
    HIGH_GROWTH: 0.2, // 20%+ is considered high growth
    MODERATE_GROWTH: 0.1, // 10-20% is moderate growth
    LOW_GROWTH: 0.05, // Below 5% is low growth
  };

  static DECAY_FACTORS = {
    HIGH_GROWTH: 0.35, // Faster decay for high growth
    MODERATE_GROWTH: 0.25, // Moderate decay for normal growth
    LOW_GROWTH: 0.15, // Slower decay for stable companies
  };

  /**
   * Calculates appropriate decay factor based on initial growth rate
   * @param initialGrowthRate - The company's initial growth rate
   * @returns The calculated decay factor
   */
  static calculateDecayFactor(initialGrowthRate: number): number {
    if (initialGrowthRate >= this.GROWTH_THRESHOLDS.HIGH_GROWTH) {
      // For very high growth rates, increase decay factor even more
      const extraDecay = Math.min(
        0.1, // Cap the extra decay
        (initialGrowthRate - this.GROWTH_THRESHOLDS.HIGH_GROWTH) * 0.5,
      );
      return this.DECAY_FACTORS.HIGH_GROWTH + extraDecay;
    } else if (initialGrowthRate >= this.GROWTH_THRESHOLDS.MODERATE_GROWTH) {
      // Linear interpolation between moderate and high decay factors
      const growthRange =
        this.GROWTH_THRESHOLDS.HIGH_GROWTH -
        this.GROWTH_THRESHOLDS.MODERATE_GROWTH;
      const decayRange =
        this.DECAY_FACTORS.HIGH_GROWTH - this.DECAY_FACTORS.MODERATE_GROWTH;
      const growthAboveModerate =
        initialGrowthRate - this.GROWTH_THRESHOLDS.MODERATE_GROWTH;
      return (
        this.DECAY_FACTORS.MODERATE_GROWTH +
        (growthAboveModerate / growthRange) * decayRange
      );
    } else if (initialGrowthRate >= this.GROWTH_THRESHOLDS.LOW_GROWTH) {
      // Linear interpolation between low and moderate decay factors
      const growthRange =
        this.GROWTH_THRESHOLDS.MODERATE_GROWTH -
        this.GROWTH_THRESHOLDS.LOW_GROWTH;
      const decayRange =
        this.DECAY_FACTORS.MODERATE_GROWTH - this.DECAY_FACTORS.LOW_GROWTH;
      const growthAboveLow =
        initialGrowthRate - this.GROWTH_THRESHOLDS.LOW_GROWTH;
      return (
        this.DECAY_FACTORS.LOW_GROWTH +
        (growthAboveLow / growthRange) * decayRange
      );
    } else {
      // For very low growth rates, reduce decay factor
      return Math.max(
        0.1, // Minimum decay factor
        this.DECAY_FACTORS.LOW_GROWTH *
          (initialGrowthRate / this.GROWTH_THRESHOLDS.LOW_GROWTH),
      );
    }
  }

  /**
   * Categorizes growth rate into predefined growth categories
   * @param growthRate - The company's growth rate
   * @returns A string representing the growth category
   */
  static getGrowthCategory(growthRate: number): string {
    if (growthRate >= this.GROWTH_THRESHOLDS.HIGH_GROWTH) {
      return 'HIGH_GROWTH';
    } else if (growthRate >= this.GROWTH_THRESHOLDS.MODERATE_GROWTH) {
      return 'MODERATE_GROWTH';
    } else if (growthRate >= this.GROWTH_THRESHOLDS.LOW_GROWTH) {
      return 'LOW_GROWTH';
    } else {
      return 'VERY_LOW_GROWTH';
    }
  }
}

export default ValuationConfig;
