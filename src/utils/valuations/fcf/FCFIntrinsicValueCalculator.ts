import StockInputValidator from '../StockInputValidator';
import GrowthCalculator from '../GrowthCalculator';
import PresentValueCalculator from '../PresentValueCalculator';
import ValuationConfig from '../ValuationConfig';

/**
 * Parameters required for intrinsic value calculation using FCF
 *
 * Financial Context:
 * These parameters are used for Discounted Cash Flow (DCF) analysis to estimate a stock's intrinsic value.
 * - `fcf`: Free Cash Flow, the baseline metric for growth and cash flow projections.
 * - `growthRate`: Initial growth rate of the company.
 * - `terminalGrowthRate`: Long-term sustainable growth rate.
 * - `discountRate`: The required rate of return (used for discounting future cash flows).
 * - `projectionYears`: Number of years to project future FCF.
 * - `marginOfSafety`: A buffer to account for uncertainties in assumptions.
 * - `outstandingShares`: Number of shares outstanding.
 */
interface CalculatorParams {
  method: 'fcf' | 'eps'; // Method used for valuation (EPS or FCF).
  sharePrice: number; // Current share price.
  fcf: number; // Current Free Cash Flow.
  growthRate: number;
  terminalGrowthRate: number;
  discountRate: number;
  projectionYears?: number; // Optional, defaults to a preconfigured value.
  marginOfSafety?: number; // Optional, defaults to a preconfigured value.
  outstandingShares: number; // Number of shares outstanding.
}

/**
 * Main class for intrinsic value calculation using FCF
 *
 * Financial Context:
 * This class implements the Discounted Cash Flow (DCF) method to calculate the intrinsic value of a stock.
 * DCF evaluates the present value of expected future cash flows, adjusting for the time value of money and risk.
 */
class FCFIntrinsicValueCalculator {
  private params: Required<CalculatorParams>; // Ensures all parameters are set with defaults applied.

  private validator: StockInputValidator; // Validates user-provided inputs for consistency and logic.

  private growthCalculator: GrowthCalculator; // Handles FCF growth rate projections.

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
   * - Projects FCF for each year.
   * - Calculates terminal value for steady-state cash flows beyond projection years.
   * - Discounts all cash flows to present value.
   */
  calculate() {
    this.validator.validate(); // Ensures all inputs are valid before proceeding.

    const projections = this.calculateProjections(); // FCF projections for the forecast period.
    const terminalValueAnalysis = this.calculateTerminalValue(projections); // Calculates terminal value.
    const valuation = this.calculateValuation(
      projections,
      terminalValueAnalysis,
    ); // Combines projections and terminal value into an intrinsic value.

    const growthProfile = this.growthCalculator.getGrowthProfile(); // Provides detailed growth analysis.

    return {
      method: this.params.method, // Valuation method used.
      inputs: this.formatInputs(), // Summarizes user inputs.
      yearByYearProjections: projections, // Detailed FCF and present value projections.
      growthAnalysis: {
        ...this.calculateGrowthAnalysis(projections),
        growthCategory: growthProfile.category,
        decayFactor: growthProfile.decayFactor,
        decayAnalysis: growthProfile.yearlyRates,
      },
      terminalValueAnalysis,
      valuation,
      // intrinsicSharePrice: valuation.intrinsicSharePrice, // Intrinsic share price.
      // marginOfSafetySharePrice: valuation.marginOfSafetySharePrice, // Margin of safety share price.
      metadata: {
        calculatedAt: new Date().toISOString(), // Timestamp of the calculation.
      },
    };
  }

  /**
   * Calculates yearly FCF projections
   *
   * Financial Context:
   * Projects future FCF based on a decaying growth rate and discounts each year's FCF to present value.
   */
  calculateProjections() {
    const projections = [];
    let currentFCF = this.params.fcf; // Start with the current FCF.

    for (let year = 0; year < this.params.projectionYears; year++) {
      const growthRate = this.growthCalculator.calculateGrowthRate(year); // Growth rate for the year.
      currentFCF *= 1 + growthRate; // Apply growth rate to calculate FCF.

      projections.push({
        year: year + 1, // Current year in projection timeline.
        fcf: Number(currentFCF.toFixed(2)), // Projected FCF for the year.
        growthRate: Number((growthRate * 100).toFixed(2)), // Growth rate as a percentage.
        presentValue: Number(
          this.pvCalculator
            .calculatePresentValue(currentFCF, year + 1) // Discount projected FCF to present value.
            .toFixed(2),
        ),
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
  calculateTerminalValue(projections: { fcf: number }[]) {
    const finalFCF = projections[projections.length - 1].fcf; // FCF at the end of the projection period.
    const terminalValue = this.pvCalculator.calculateTerminalValue(
      finalFCF,
      this.params.terminalGrowthRate,
    ); // Terminal value calculated using a perpetuity growth model.

    return {
      finalFCF: Number(finalFCF.toFixed(2)),
      terminalValue: Number(terminalValue.toFixed(2)), // Raw terminal value.
      presentValueOfTerminal: Number(
        this.pvCalculator
          .calculatePresentValue(terminalValue, this.params.projectionYears) // Discount terminal value to present value.
          .toFixed(2),
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
    ); // Sum of discounted FCF for the projection period.

    const intrinsicValue =
      presentValueOfCashFlows + terminalValueAnalysis.presentValueOfTerminal; // Total intrinsic value.

    const intrinsicSharePrice = intrinsicValue / this.params.outstandingShares; // Intrinsic share price.
    // const marginOfSafetySharePrice =
    //   intrinsicSharePrice * (1 - this.params.marginOfSafety); // Margin of safety share price.

    return {
      presentValueOfCashFlows: Number(presentValueOfCashFlows.toFixed(2)),
      presentValueOfTerminal: terminalValueAnalysis.presentValueOfTerminal,
      // intrinsicValue: Number(intrinsicValue.toFixed(2)),
      // intrinsicSharePrice: Number(intrinsicSharePrice.toFixed(2)),
      // marginOfSafetySharePrice: Number(marginOfSafetySharePrice.toFixed(2)),
      intrinsicValue: Number(intrinsicSharePrice.toFixed(2)),
      marginOfSafetyPrice: 0, //Number(marginOfSafetySharePrice.toFixed(2)),
    };
  }

  /**
   * Provides growth rate analysis
   */
  calculateGrowthAnalysis(projections: { growthRate: number }[]) {
    return {
      startingGrowthRate: `${(this.params.growthRate * 100).toFixed(1)}%`, // Initial growth rate.
      endingGrowthRate: `${projections[projections.length - 1].growthRate}%`, // Final growth rate.
      averageGrowthRate: `${(
        projections.reduce((sum, p) => sum + p.growthRate, 0) /
        this.params.projectionYears
      ).toFixed(1)}%`, // Average growth rate over the projection period.
    };
  }

  /**
   * Formats user inputs for display
   */
  formatInputs() {
    return {
      sharePrice: this.params.sharePrice,
      initialFCF: this.params.fcf,
      initialGrowthRate: this.params.growthRate * 100,
      terminalGrowthRate: this.params.terminalGrowthRate * 100,
      discountRate: this.params.discountRate * 100,
      projectionYears: this.params.projectionYears,
      outstandingShares: this.params.outstandingShares, // Include outstanding shares in the formatted inputs.
      marginOfSafety: this.params.marginOfSafety * 100,
    };
  }
}

export default FCFIntrinsicValueCalculator;
