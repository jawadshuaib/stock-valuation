/* eslint-disable @typescript-eslint/lines-between-class-members */
import ValidationError from './ValidationError';
import ValuationConfig from './ValuationConfig';

/**
 * Input parameters for stock valuation
 *
 * Financial Context:
 * These parameters are the foundation of stock valuation models such as Discounted Cash Flow (DCF).
 * - `eps`: Earnings Per Share, the key measure of profitability per share.
 * - `growthRate`: Initial growth rate for the company's earnings.
 * - `terminalGrowthRate`: Sustainable long-term growth rate.
 * - `discountRate`: Rate used to discount future cash flows to present value.
 */
interface ValidationParams {
  method: 'eps' | 'fcf'; // Method used for valuation (EPS or FCF).
  eps?: number;
  fcf?: number;
  growthRate: number;
  terminalGrowthRate: number;
  discountRate: number;
  [key: string]: unknown; // Allows flexibility for additional parameters.
}

/**
 * Represents an individual validation error
 *
 * Financial Context:
 * Validation errors capture issues that could lead to unrealistic or invalid financial projections.
 * Examples include missing fields, excessive growth rates, or negative EPS values.
 */
interface ValidationErrorDetail {
  code: string; // Unique code identifying the type of validation error.
  message: string; // Descriptive message explaining the error.
}

/**
 * Validates input parameters for stock valuation
 *
 * Financial Context:
 * Validation ensures input parameters are realistic and consistent with financial modeling principles:
 * - Growth rates should reflect realistic market conditions.
 * - Terminal growth rates must align with long-term economic indicators (e.g., GDP or inflation).
 * - Discount rates should exceed growth rates to reflect the time value of money and risk.
 */
class StockInputValidator {
  private params: ValidationParams; // Input parameters to validate.
  private errors: ValidationErrorDetail[]; // Accumulates validation errors.

  constructor(params: ValidationParams) {
    this.params = params;
    this.errors = [];
  }

  /**
   * Validates all input parameters
   *
   * Financial Context:
   * Comprehensive validation prevents flawed assumptions that can distort valuation results.
   * Throws a `ValidationError` if any issues are detected, ensuring the user corrects them before proceeding.
   */
  validate(): void {
    this.requireEPSOrFCF(); // Ensures either EPS or FCF is provided.
    this.validateRequiredFields(); // Ensures all mandatory fields are present.
    this.validateRates(); // Checks the relationships and constraints of rates.
    this.validatePositiveValues(); // Ensures EPS and other values are positive.

    if (this.errors.length > 0) {
      throw new ValidationError(this.errors); // Throws error if any validation fails.
    }
  }

  /**
   * Validates that either EPS or FCF is provided
   *
   * Financial Context:
   * EPS and FCF are fundamental metrics for stock valuation models.
   * A missing EPS or FCF value would render the valuation model invalid.
   */
  requireEPSOrFCF(): void {
    if (this.params.eps === undefined && this.params.fcf === undefined) {
      this.errors.push({
        code: 'MISSING_FIELD',
        message: 'Either EPS or FCF must be provided',
      });
    }
  }

  /**
   * Validates that all required fields are present
   *
   * Financial Context:
   * Missing critical fields such as `eps` or `discountRate` undermines the integrity of the valuation model.
   */
  validateRequiredFields(): void {
    const required = ['growthRate', 'terminalGrowthRate', 'discountRate'];

    required.forEach((field) => {
      if (this.params[field] === undefined) {
        this.errors.push({
          code: 'MISSING_FIELD',
          message: `Missing required field: ${field}`,
        });
      }
    });
  }

  /**
   * Validates that growth and discount rates meet constraints
   *
   * Financial Context:
   * - Terminal growth rates should always be less than initial growth rates to reflect slowing growth over time.
   * - Terminal growth rates must be lower than discount rates to ensure convergence in valuation models.
   * - Initial growth rates must not exceed a predefined maximum to prevent over-optimistic scenarios.
   */
  validateRates(): void {
    const { terminalGrowthRate, growthRate, discountRate } = this.params;

    if (terminalGrowthRate >= growthRate) {
      this.errors.push({
        code: 'INVALID_TERMINAL_GROWTH',
        message: `Terminal growth rate (${(terminalGrowthRate * 100).toFixed(
          1,
        )}%) must be lower than growth rate (${(growthRate * 100).toFixed(
          1,
        )}%)`,
      });
    }

    if (terminalGrowthRate >= discountRate) {
      this.errors.push({
        code: 'INVALID_DISCOUNT_RATE',
        message: `Terminal growth rate (${(terminalGrowthRate * 100).toFixed(
          1,
        )}%) must be lower than discount rate (${(discountRate * 100).toFixed(
          1,
        )}%)`,
      });
    }

    if (growthRate > ValuationConfig.LIMITS.MAX_INITIAL_GROWTH) {
      this.errors.push({
        code: 'HIGH_GROWTH_RATE',
        message: `Initial growth rate (${(growthRate * 100).toFixed(
          1,
        )}%) exceeds maximum allowed (${(
          ValuationConfig.LIMITS.MAX_INITIAL_GROWTH * 100
        ).toFixed(1)}%)`,
      });
    }
  }

  /**
   * Validates that EPS values are positive
   *
   * Financial Context:
   * A company's EPS must be positive for valuation purposes, as negative EPS indicates a loss.
   * Negative or zero EPS renders valuation models invalid or meaningless.
   */
  validatePositiveValues(): void {
    if (this.params.eps && this.params.eps <= 0) {
      this.errors.push({
        code: 'INVALID_EPS',
        message: 'EPS must be positive',
      });
    }

    if (this.params.fcf && this.params.fcf <= 0) {
      this.errors.push({
        code: 'INVALID_FCF',
        message: 'FCF must be positive',
      });
    }
  }
}

export default StockInputValidator;
