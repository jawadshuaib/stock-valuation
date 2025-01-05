/* eslint-disable @typescript-eslint/lines-between-class-members */
import StockInputValidator from './StockInputValidator';
import GrowthCalculator from './GrowthCalculator';
import PresentValueCalculator from './PresentValueCalculator';
import ValuationConfig from './ValuationConfig';

/**
 * Parameters required for intrinsic value calculation
 */
interface CalculatorParams {
  eps: number;
  growthRate: number;
  terminalGrowthRate: number;
  discountRate: number;
  projectionYears?: number;
  marginOfSafety?: number;
}

/**
 * Main class for intrinsic value calculation
 */
class IntrinsicValueCalculator {
  private params: Required<CalculatorParams>;
  private validator: StockInputValidator;
  private growthCalculator: GrowthCalculator;
  private pvCalculator: PresentValueCalculator;

  constructor(params: CalculatorParams) {
    this.params = {
      ...params,
      projectionYears:
        params.projectionYears || ValuationConfig.DEFAULTS.PROJECTION_YEARS,
      marginOfSafety:
        params.marginOfSafety || ValuationConfig.DEFAULTS.MARGIN_OF_SAFETY,
    };

    this.validator = new StockInputValidator(this.params);
    this.growthCalculator = new GrowthCalculator(
      this.params.growthRate,
      this.params.terminalGrowthRate,
    );
    this.pvCalculator = new PresentValueCalculator(this.params.discountRate);
  }

  /**
   * Calculates intrinsic value and associated data
   */
  calculate() {
    this.validator.validate();

    const projections = this.calculateProjections();
    const terminalValueAnalysis = this.calculateTerminalValue(projections);
    const valuation = this.calculateValuation(
      projections,
      terminalValueAnalysis,
    );

    const growthProfile = this.growthCalculator.getGrowthProfile();

    return {
      inputs: this.formatInputs(),
      yearByYearProjections: projections,
      growthAnalysis: {
        ...this.calculateGrowthAnalysis(projections),
        growthCategory: growthProfile.category,
        decayFactor: growthProfile.decayFactor,
        decayAnalysis: growthProfile.yearlyRates,
      },
      terminalValueAnalysis,
      valuation,
      metadata: {
        calculatedAt: new Date().toISOString(),
        calculatedBy: 'jawadshuaib', // Replace with dynamic user data if necessary
      },
    };
  }

  calculateProjections() {
    const projections = [];
    let currentEPS = this.params.eps;

    for (let year = 0; year < this.params.projectionYears; year++) {
      const growthRate = this.growthCalculator.calculateGrowthRate(year);
      currentEPS *= 1 + growthRate;

      projections.push({
        year: year + 1,
        eps: Number(currentEPS.toFixed(2)),
        growthRate: Number((growthRate * 100).toFixed(2)),
        presentValue: Number(
          this.pvCalculator
            .calculatePresentValue(currentEPS, year + 1)
            .toFixed(2),
        ),
      });
    }

    return projections;
  }

  calculateTerminalValue(projections: { eps: number }[]) {
    const finalEPS = projections[projections.length - 1].eps;
    const terminalValue = this.pvCalculator.calculateTerminalValue(
      finalEPS,
      this.params.terminalGrowthRate,
    );

    return {
      finalEPS: Number(finalEPS.toFixed(2)),
      terminalValue: Number(terminalValue.toFixed(2)),
      presentValueOfTerminal: Number(
        this.pvCalculator
          .calculatePresentValue(terminalValue, this.params.projectionYears)
          .toFixed(2),
      ),
    };
  }

  calculateValuation(
    projections: { presentValue: number }[],
    terminalValueAnalysis: { presentValueOfTerminal: number },
  ) {
    const presentValueOfCashFlows = projections.reduce(
      (sum, proj) => sum + proj.presentValue,
      0,
    );

    const intrinsicValue =
      presentValueOfCashFlows + terminalValueAnalysis.presentValueOfTerminal;

    return {
      presentValueOfCashFlows: Number(presentValueOfCashFlows.toFixed(2)),
      presentValueOfTerminal: terminalValueAnalysis.presentValueOfTerminal,
      intrinsicValue: Number(intrinsicValue.toFixed(2)),
      marginOfSafetyPrice: Number(
        (intrinsicValue * (1 - this.params.marginOfSafety)).toFixed(2),
      ),
    };
  }

  calculateGrowthAnalysis(projections: { growthRate: number }[]) {
    return {
      startingGrowthRate: `${(this.params.growthRate * 100).toFixed(1)}%`,
      endingGrowthRate: `${projections[projections.length - 1].growthRate}%`,
      averageGrowthRate: `${(
        projections.reduce((sum, p) => sum + p.growthRate, 0) /
        this.params.projectionYears
      ).toFixed(1)}%`,
    };
  }

  formatInputs() {
    return {
      initialEPS: this.params.eps,
      initialGrowthRate: `${(this.params.growthRate * 100).toFixed(1)}%`,
      terminalGrowthRate: `${(this.params.terminalGrowthRate * 100).toFixed(
        1,
      )}%`,
      discountRate: `${(this.params.discountRate * 100).toFixed(1)}%`,
      projectionYears: this.params.projectionYears,
    };
  }
}

export default IntrinsicValueCalculator;
