import { randomNormal } from 'd3-random';
import FCFIntrinsicValueCalculator from '../fcf/FCFIntrinsicValueCalculator';
import EPSIntrinsicValueCalculator from '../eps/EPSIntrinsicValueCalculator'; // Assuming you have an EPS calculator
import { ProjectionData } from '../../../components/calculators/types';
import ValidationError from '../ValidationError';
import ValuationConfig from '../ValuationConfig';

export const NUMBER_OF_SIMULATIONS = 2000;

// Define the parameters required for the Monte Carlo simulation
interface MonteCarloParams {
  method: 'fcf' | 'eps';
  sharePrice: number;
  fcf?: number;
  eps?: number;
  growthRate: number; // First-year growth rate is already determined by the user.
  terminalGrowthRate: number;
  discountRate: number;
  projectionYears?: number;
  // marginOfSafety: number;
  outstandingShares?: number;
}

export interface SIMULATION {
  percentile1: number;
  percentile90: number;
  minGrowthRate: number;
  maxGrowthRate: number;
  mean: number;
  median: number;
  results: ProjectionData[];
}

class MonteCarloIntrinsicValueCalculator {
  private params: MonteCarloParams;

  private numSimulations: number;

  constructor(
    params: MonteCarloParams,
    numSimulations = NUMBER_OF_SIMULATIONS,
  ) {
    this.params = params;
    this.numSimulations = numSimulations;
  }

  /**
   * Generate random inputs for the simulation.
   *
   * Note: The first-year growth rate is taken directly from user input (params.growthRate).
   * We do not randomize the first-year growth rate anymore. Random draws are still performed
   * for terminalGrowthRate and discountRate.
   */
  private generateRandomInputs() {
    // Normal distribution for terminal growth rate
    const terminalGrowthRateDist = randomNormal(
      this.params.terminalGrowthRate,
      0.01,
    );
    // Normal distribution for discount rate
    const discountRateDist = randomNormal(this.params.discountRate, 0.01);

    /**
     * First-year growth:
     * We now keep this.params.growthRate for the first year,
     * so we do NOT call 'growthRateDist()' here.
     */
    const growthRate = this.params.growthRate;

    const terminalGrowthRate = terminalGrowthRateDist();
    const discountRate = discountRateDist();

    if (
      growthRate > ValuationConfig.LIMITS.MAX_INITIAL_GROWTH ||
      growthRate < terminalGrowthRate ||
      discountRate < terminalGrowthRate ||
      terminalGrowthRate > ValuationConfig.LIMITS.MAX_TERMINAL_GROWTH ||
      discountRate < ValuationConfig.LIMITS.MIN_DISCOUNT_RATE
    ) {
      throw new ValidationError([
        { code: 'OUT_OF_RANGE', message: 'Generated input is out of range' },
      ]);
    }

    return {
      growthRate,
      terminalGrowthRate,
      discountRate,
    };
  }

  /**
   * Runs a series of Monte Carlo simulations to calculate intrinsic values based on the specified method (FCF or EPS).
   *
   * @returns {ProjectionData[]} An array of projection data results from the simulations.
   *
   * @throws {ValidationError} If required parameters for the selected method are missing.
   *
   * The function performs the following steps:
   * 1. Initializes an empty array to store the results of each simulation.
   * 2. Iterates for the number of simulations specified by `this.numSimulations`.
   * 3. For each iteration:
   *    - Generates random inputs for the simulation, except for the first-year growth rate, which remains user-defined.
   *    - Depending on the method specified in `this.params.method`, it uses either the `FCFIntrinsicValueCalculator` or `EPSIntrinsicValueCalculator` to calculate the intrinsic value.
   *    - If the required parameters for the selected method are missing, a `ValidationError` is thrown.
   *    - If a result is successfully calculated, it is added to the results array.
   * 4. If a `ValidationError` occurs during a simulation, it logs a warning and continues with the next simulation.
   * 5. After all simulations are complete, it analyzes the results and returns them.
   */
  public runSimulations() {
    const results: ProjectionData[] = [];

    // Run the specified number of simulations
    for (let i = 0; i < this.numSimulations; i++) {
      try {
        const randomInputs = this.generateRandomInputs();
        let result: ProjectionData | undefined;

        // Check the method and use the appropriate calculator
        if (this.params.method === 'fcf') {
          // Ensure FCF parameter is provided for FCF method
          if (this.params.fcf === undefined) {
            throw new ValidationError([
              {
                code: 'MISSING_PARAM',
                message: 'FCF is required for FCF method',
              },
            ]);
          }
          // Create an instance of FCFIntrinsicValueCalculator with the generated inputs
          const calculator = new FCFIntrinsicValueCalculator({
            ...this.params,
            fcf: this.params.fcf,
            growthRate: randomInputs.growthRate,
            terminalGrowthRate: randomInputs.terminalGrowthRate,
            discountRate: randomInputs.discountRate,
            outstandingShares: this.params.outstandingShares ?? 0,
          });
          result = calculator.calculate();
        } else if (this.params.method === 'eps') {
          // Ensure EPS parameter is provided for EPS method
          if (this.params.eps === undefined) {
            throw new ValidationError([
              {
                code: 'MISSING_PARAM',
                message: 'EPS is required for EPS method',
              },
            ]);
          }
          // Create an instance of EPSIntrinsicValueCalculator with the generated inputs
          const calculator = new EPSIntrinsicValueCalculator({
            ...this.params,
            eps: this.params.eps!,
            growthRate: randomInputs.growthRate,
            terminalGrowthRate: randomInputs.terminalGrowthRate,
            discountRate: randomInputs.discountRate,
          });
          result = calculator.calculate();
        }

        // If a result is successfully calculated, add it to the results array
        if (result) {
          results.push(result);
        }
      } catch (error) {
        // Handle validation errors by logging a warning and continuing with the next simulation
        if (error instanceof ValidationError) {
          // console.warn('Validation error in simulation:', error.errors);
          continue;
        } else {
          throw error;
        }
      }
    }

    // Analyze and return the results of the simulations
    return this.analyzeResults(results);
  }

  // Analyze the results of the simulations
  private analyzeResults(results: ProjectionData[]) {
    const intrinsicValues = results.map(
      (result) => result.valuation.intrinsicValue,
    );
    const mean =
      intrinsicValues.reduce((sum, value) => sum + value, 0) /
      intrinsicValues.length;
    const sortedValues = intrinsicValues.sort((a, b) => a - b);
    const median = sortedValues[Math.floor(sortedValues.length / 2)];
    // Percentiles divide the data into 100 equal parts after sorting
    const percentile = (p: number) =>
      sortedValues[Math.floor((p / 100) * sortedValues.length)];
    // 1st Percentile (P1):
    // 1% of simulated intrinsic values fall below this value
    // Represents a more conservative/pessimistic valuation scenario
    const percentile1 = percentile(1);
    // 90th Percentile (P90):
    // 90% of simulated values fall below this value
    // Only 10% of values are higher than this
    // Represents a more optimistic valuation scenario

    // Calculate the range of growth rates
    const growthRates = results.map(
      (result) => result.inputs.initialGrowthRate,
    );
    const minGrowthRate = Math.min(...growthRates);
    const maxGrowthRate = Math.max(...growthRates);

    // Update results to include margin of safety
    const updatedResults = results.map((result) => ({
      ...result,
      valuation: {
        ...result.valuation,
        marginOfSafetyPrice: percentile1,
      },
    }));

    return {
      mean,
      median,
      percentile1: percentile(1),
      percentile90: percentile(90),
      minGrowthRate,
      maxGrowthRate,
      results: updatedResults,
    };
  }
}

export default MonteCarloIntrinsicValueCalculator;
