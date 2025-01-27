/* eslint-disable @typescript-eslint/lines-between-class-members */
import StockInputValidator from '../StockInputValidator';
import GrowthCalculator from '../GrowthCalculator';
import PresentValueCalculator from '../PresentValueCalculator';
import ValuationConfig from '../ValuationConfig';

/**
 * Parameters required for intrinsic value calculation
 *
 * Financial Context:
 * These parameters are used for Discounted Cash Flow (DCF) analysis to estimate a stock's intrinsic value.
 * - `eps`: Earnings Per Share, the baseline metric for growth and cash flow projections.
 * - `growthRate`: Initial growth rate of the company.
 * - `terminalGrowthRate`: Long-term sustainable growth rate.
 * - `discountRate`: The required rate of return (used for discounting future cash flows).
 * - `projectionYears`: Number of years to project future EPS.
 * - `marginOfSafety`: A buffer to account for uncertainties in assumptions.
 */
interface CalculatorParams {
  method: 'fcf' | 'eps'; // Method used for valuation (EPS or FCF).
  sharePrice: number; // Current share price.
  eps: number;
  growthRate: number;
  terminalGrowthRate: number;
  discountRate: number;
  projectionYears?: number; // Optional, defaults to a preconfigured value.
  marginOfSafety?: number; // Optional, defaults to a preconfigured value.
}

/**
 * Main class for intrinsic value calculation
 *
 * Financial Context:
 * This class implements the Discounted Cash Flow (DCF) method to calculate the intrinsic value of a stock.
 * DCF evaluates the present value of expected future cash flows, adjusting for the time value of money and risk.
 */
class EPSIntrinsicValueCalculator {
  private params: Required<CalculatorParams>; // Ensures all parameters are set with defaults applied.
  private validator: StockInputValidator; // Validates user-provided inputs for consistency and logic.
  private growthCalculator: GrowthCalculator; // Handles EPS growth rate projections.
  private pvCalculator: PresentValueCalculator; // Handles discounting calculations.

  constructor(params: CalculatorParams) {
    // Assigns defaults if optional parameters are not provided.
    this.params = {
      ...params,
      projectionYears:
        params.projectionYears || ValuationConfig.DEFAULTS.PROJECTION_YEARS,
      marginOfSafety:
        params.marginOfSafety || ValuationConfig.DEFAULTS.MARGIN_OF_SAFETY,
    };

    this.validator = new StockInputValidator(this.params); // Validates inputs.
    this.growthCalculator = new GrowthCalculator(
      this.params.growthRate,
      this.params.terminalGrowthRate,
    ); // Prepares growth rate calculations.
    this.pvCalculator = new PresentValueCalculator(this.params.discountRate); // Prepares discounting utility.
  }

  /**
   * Calculates intrinsic value and associated data
   *
   * Financial Context:
   * Combines multiple sub-calculations to estimate the intrinsic value of a stock:
   * - Projects EPS for each year.
   * - Calculates terminal value for steady-state cash flows beyond projection years.
   * - Discounts all cash flows to present value.
   */
  calculate() {
    this.validator.validate(); // Ensures all inputs are valid before proceeding.

    const projections = this.calculateProjections(); // EPS projections for the forecast period.
    const terminalValueAnalysis = this.calculateTerminalValue(projections); // Calculates terminal value.
    const valuation = this.calculateValuation(
      projections,
      terminalValueAnalysis,
    ); // Combines projections and terminal value into an intrinsic value.

    const growthProfile = this.growthCalculator.getGrowthProfile(); // Provides detailed growth analysis.

    return {
      method: this.params.method,
      inputs: this.formatInputs(), // Summarizes user inputs.
      yearByYearProjections: projections, // Detailed EPS and present value projections.
      growthAnalysis: {
        ...this.calculateGrowthAnalysis(projections),
        growthCategory: growthProfile.category,
        decayFactor: growthProfile.decayFactor,
        decayAnalysis: growthProfile.yearlyRates,
      },
      terminalValueAnalysis,
      valuation,
      metadata: {
        calculatedAt: new Date().toISOString(), // Timestamp of the calculation.
      },
    };
  }

  /**
   * Calculates yearly EPS projections
   *
   * Financial Context:
   * Projects future EPS based on a decaying growth rate and discounts each year's EPS to present value.
   */
  calculateProjections() {
    const projections = [];
    let currentEPS = this.params.eps; // Start with the current EPS.

    for (let year = 0; year < this.params.projectionYears; year++) {
      const growthRate = this.growthCalculator.calculateGrowthRate(year); // Growth rate for the year.
      currentEPS *= 1 + growthRate; // Apply growth rate to calculate EPS.

      const pv = this.pvCalculator.calculatePresentValue(currentEPS, year + 1); // Discount projected EPS to present value.

      projections.push({
        year: year + 1, // Current year in projection timeline.
        eps: Number(currentEPS ? currentEPS.toFixed(2) : 0), // Projected EPS for the year.
        growthRate: Number(growthRate ? (growthRate * 100).toFixed(2) : 0), // Growth rate as a percentage.
        presentValue: Number(pv ? pv.toFixed(2) : 0), // Discounted present value of EPS.
      });
    }

    return projections;
  }

  /**
   * Calculates terminal value
   *
   * Financial Context:
   * Terminal value represents the value of cash flows beyond the projection period, assuming stable growth.
   * It's a significant portion of the total valuation for long-lived assets like stocks.
   */
  calculateTerminalValue(projections: { eps: number }[]) {
    const finalEPS = projections[projections.length - 1]?.eps ?? 0; // EPS at the end of the projection period.
    const terminalValue = this.pvCalculator.calculateTerminalValue(
      finalEPS,
      this.params.terminalGrowthRate,
    ); // Terminal value calculated using a perpetuity growth model.

    const presentValueOfTerminal = this.pvCalculator.calculatePresentValue(
      terminalValue,
      this.params.projectionYears,
    ); // Discount terminal value to present value.

    return {
      finalEPS: Number(finalEPS ? finalEPS.toFixed(2) : 0),
      terminalValue: Number(terminalValue ? terminalValue.toFixed(2) : 0), // Raw terminal value.
      presentValueOfTerminal: Number(
        presentValueOfTerminal ? presentValueOfTerminal.toFixed(2) : 0,
      ),
    };
  }

  /**
   * Combines present value of projections and terminal value
   */
  calculateValuation(
    projections: { presentValue: number }[],
    terminalValueAnalysis: { presentValueOfTerminal: number },
  ) {
    const presentValueOfCashFlows = projections.reduce(
      (sum, proj) => sum + proj.presentValue,
      0,
    ); // Sum of discounted EPS for the projection period.

    const intrinsicValue =
      presentValueOfCashFlows + terminalValueAnalysis.presentValueOfTerminal; // Total intrinsic value.

    return {
      presentValueOfCashFlows: Number(
        presentValueOfCashFlows ? presentValueOfCashFlows.toFixed(2) : 0,
      ),
      presentValueOfTerminal: terminalValueAnalysis.presentValueOfTerminal,
      intrinsicValue: Number(intrinsicValue ? intrinsicValue.toFixed(2) : 0),
      marginOfSafetyPrice: 0,
      // Number((intrinsicValue * (1 - this.params.marginOfSafety)).toFixed(2)), // Adjusts intrinsic value for margin of safety.
    };
  }

  /**
   * Provides growth rate analysis
   */
  calculateGrowthAnalysis(projections: { growthRate: number }[]) {
    const startingGrowthRate = this.params.growthRate * 100;
    const endingGrowthRate =
      projections[projections.length - 1]?.growthRate ?? 0;
    const averageGrowthRate =
      projections.reduce((sum, p) => sum + p.growthRate, 0) /
      this.params.projectionYears;

    return {
      startingGrowthRate: `${startingGrowthRate.toFixed(1)}%`, // Initial growth rate.
      endingGrowthRate: `${endingGrowthRate.toFixed(1)}%`, // Final growth rate.
      averageGrowthRate: `${averageGrowthRate.toFixed(1)}%`, // Average growth rate over the projection period.
    };
  }

  /**
   * Formats user inputs for display
   */
  formatInputs() {
    return {
      sharePrice: this.params.sharePrice,
      initialEPS: this.params.eps,
      initialGrowthRate: this.params.growthRate * 100,
      terminalGrowthRate: this.params.terminalGrowthRate * 100,
      discountRate: this.params.discountRate * 100,
      projectionYears: this.params.projectionYears,
      marginOfSafety: this.params.marginOfSafety * 100,
    };
  }
}

export default EPSIntrinsicValueCalculator;
