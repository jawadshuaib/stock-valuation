/**
 * Configuration constants for stock valuation
 *
 * Financial Context:
 * These constants are based on real-world factors such as:
 * - **Historical Market Returns:** Average returns of stock markets over long periods (e.g., ~7-10% annually).
 * - **Economic Growth Rates:** Long-term GDP growth rates often anchor sustainable growth assumptions.
 * - **Inflation Expectations:** Terminal growth rates generally approximate inflation or slightly exceed it.
 * - **Risk Considerations:** Discount rates and margin of safety account for investment risk and uncertainty.
 * -
 * - **In a standard Discounted Cash Flow (DCF) model, the growth rate of a company’s cash flows is rarely sustainable
 * - **at a high level indefinitely (e.g., 20–30%+). Eventually, competition, market saturation, or macroeconomic
 * - **realities pull growth back closer to GDP or inflation levels (often 2–4%). Hence, applying a declining (decaying)
 * - **growth rate over your projection horizon helps avoid over-optimistic valuations.
 */
class ValuationConfig {
  // Default settings for intrinsic value calculations
  static DEFAULTS = {
    PROJECTION_YEARS: 10, // Default projection horizon for DCF (10 years is standard in most valuations).
    MARGIN_OF_SAFETY: 0.25, // A 25% margin of safety to account for uncertainty in assumptions.
  };

  // Constraints and limits for valuation parameters
  static LIMITS = {
    MAX_TERMINAL_GROWTH: 0.07, // 7% terminal growth cap to reflect realistic long-term economic trends.
    MIN_DISCOUNT_RATE: 0.05, // Minimum 5% discount rate to reflect risk-adjusted required returns.
    MAX_INITIAL_GROWTH: 3, // 300% cap on initial growth rates to prevent over-optimistic scenarios.
  };

  // Thresholds for categorizing growth rates
  static GROWTH_THRESHOLDS = {
    HIGH_GROWTH: 0.2, // Growth rates of 20% or more indicate high-growth companies.
    MODERATE_GROWTH: 0.1, // Growth rates between 10% and 20% are considered moderate.
    LOW_GROWTH: 0.05, // Growth rates between 5% and 10% are low but sustainable.
  };

  // Decay factors define the rate at which growth slows over time
  // If you pick a higher decay factor, the growth rate will rapidly approach the terminal growth.
  // Conversely, a lower decay factor means growth stays elevated for a longer period.
  static DECAY_FACTORS = {
    HIGH_GROWTH: 0.35, // High-growth companies experience faster growth decay.
    MODERATE_GROWTH: 0.25, // Moderate-growth companies decay at a medium rate.
    LOW_GROWTH: 0.15, // Low-growth companies decay more slowly, reflecting stability.
  };

  /**
   * Calculates appropriate decay factor based on initial growth rate
   *
   * Financial Context:
   * - Growth decay models the transition from high growth to sustainable growth.
   * - High-growth companies often experience faster decay due to market saturation, competition, and scalability limits.
   * - Low-growth companies have slower decay, reflecting stable operations.
   *
   * @param initialGrowthRate - The company's initial growth rate (as a decimal, e.g., 0.25 for 25%).
   * @returns The decay factor to be used in growth calculations.
   */
  static calculateDecayFactor(initialGrowthRate: number): number {
    if (initialGrowthRate >= this.GROWTH_THRESHOLDS.HIGH_GROWTH) {
      // Extra decay for very high growth rates to avoid over-optimistic projections
      const extraDecay = Math.min(
        0.1, // Cap the additional decay factor at 0.1
        (initialGrowthRate - this.GROWTH_THRESHOLDS.HIGH_GROWTH) * 0.5,
      );
      return this.DECAY_FACTORS.HIGH_GROWTH + extraDecay;
    } else if (initialGrowthRate >= this.GROWTH_THRESHOLDS.MODERATE_GROWTH) {
      // Interpolate decay between moderate and high growth ranges
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
      // Interpolate decay between low and moderate growth ranges
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
      // For very low growth rates, assign a minimum decay factor to avoid unrealistic projections
      return Math.max(
        0.1, // Minimum decay factor ensures even low-growth companies experience some decay.
        this.DECAY_FACTORS.LOW_GROWTH *
          (initialGrowthRate / this.GROWTH_THRESHOLDS.LOW_GROWTH),
      );
    }
  }

  /**
   * Categorizes growth rate into predefined growth categories
   *
   * Financial Context:
   * Categorizing growth helps provide context about the company's lifecycle stage:
   * - High-growth companies are typically younger, innovative, or disruptive.
   * - Moderate-growth companies are often mature but expanding into new markets.
   * - Low-growth companies are usually stable, established players in saturated markets.
   *
   * @param growthRate - The company's growth rate (as a decimal, e.g., 0.15 for 15%).
   * @returns A string representing the growth category: 'HIGH_GROWTH', 'MODERATE_GROWTH', 'LOW_GROWTH', or 'VERY_LOW_GROWTH'.
   */
  static getGrowthCategory(growthRate: number): string {
    if (growthRate >= this.GROWTH_THRESHOLDS.HIGH_GROWTH) {
      return 'HIGH_GROWTH';
    } else if (growthRate >= this.GROWTH_THRESHOLDS.MODERATE_GROWTH) {
      return 'MODERATE_GROWTH';
    } else if (growthRate >= this.GROWTH_THRESHOLDS.LOW_GROWTH) {
      return 'LOW_GROWTH';
    } else {
      return 'VERY_LOW_GROWTH'; // For companies with minimal or no growth.
    }
  }
}

export default ValuationConfig;
