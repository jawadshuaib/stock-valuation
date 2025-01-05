/* eslint-disable @typescript-eslint/lines-between-class-members */
import ValidationError from './ValidationError';
import ValuationConfig from './ValuationConfig';

/**
 * Input parameters for stock valuation
 */
interface ValidationParams {
  eps: number;
  growthRate: number;
  terminalGrowthRate: number;
  discountRate: number;
  [key: string]: unknown; // Allow additional fields if needed
}

/**
 * Represents an individual validation error
 */
interface ValidationErrorDetail {
  code: string;
  message: string;
}

/**
 * Validates input parameters for stock valuation
 */
class StockInputValidator {
  private params: ValidationParams;
  private errors: ValidationErrorDetail[];

  constructor(params: ValidationParams) {
    this.params = params;
    this.errors = [];
  }

  /**
   * Validates all input parameters
   * Throws a ValidationError if any issues are found
   */
  validate(): void {
    this.validateRequiredFields();
    this.validateRates();
    this.validatePositiveValues();

    if (this.errors.length > 0) {
      throw new ValidationError(this.errors);
    }
  }

  /**
   * Validates that all required fields are present
   */
  validateRequiredFields(): void {
    const required = [
      'eps',
      'growthRate',
      'terminalGrowthRate',
      'discountRate',
    ];

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
   */
  validatePositiveValues(): void {
    if (this.params.eps <= 0) {
      this.errors.push({
        code: 'INVALID_EPS',
        message: 'EPS must be positive',
      });
    }
  }
}

export default StockInputValidator;
