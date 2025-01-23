import { randomNormal, randomLogNormal } from 'd3-random';
import FCFIntrinsicValueCalculator from '../fcf/FCFIntrinsicValueCalculator';
import EPSIntrinsicValueCalculator from '../eps/EPSIntrinsicValueCalculator'; // Assuming you have an EPS calculator
import { ProjectionData } from '../../../components/calculators/types';
import ValidationError from '../ValidationError';
import ValuationConfig from '../ValuationConfig';

export const NUMBER_OF_SIMULATIONS = 10000;

// Define the parameters required for the Monte Carlo simulation
interface MonteCarloParams {
  method: 'fcf' | 'eps';
  sharePrice: number;
  fcf?: number;
  eps?: number;
  growthRate: number;
  terminalGrowthRate: number;
  discountRate: number;
  projectionYears?: number;
  marginOfSafety: number;
  outstandingShares?: number;
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

  // Generate random inputs for the simulation
  private generateRandomInputs() {
    // Log-normal distribution for growth rate to account for positive skewness
    // The randomLogNormal function generates a growth rate with a mean of
    // Math.log(this.params.growthRate) and a standard deviation of 0.2.
    // This means the generated growth rates will be positively skewed, allowing
    // for higher values while keeping lower values closer to the mean.
    //
    // Here is an image of the log normal distribution:
    // https://www.investopedia.com/thmb/dmWOsjhPLEXqOnOFh7_0v3E4wUs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/dotdash_Final_Log_Normal_Distribution_Nov_2020-01-fa015519559f4b128fef786c51841fb9.jpg
    //
    // When the generated growth rates are positively skewed, it means that most
    // of the growth rates will be clustered around a lower value, but there will
    // be a few instances where the growth rates are significantly higher. This is
    // particularly useful in financial modeling because it reflects the reality
    // that while most companies will have moderate growth rates, a few might
    // experience exceptionally high growth rates.
    const growthRateDist = randomLogNormal(
      Math.log(this.params.growthRate),
      0.2,
    );
    // Normal distribution for terminal growth rate
    // Terminal Growth Rate: The randomNormal function generates a terminal growth
    // rate with a mean of this.params.terminalGrowthRate and a standard deviation
    // of 0.01. This means the generated terminal growth rates will be symmetrically
    // distributed around the mean.
    const terminalGrowthRateDist = randomNormal(
      this.params.terminalGrowthRate,
      0.01,
    );
    // Normal distribution for discount rate
    // The randomNormal function generates a discount rate with a mean of
    // this.params.discountRate and a standard deviation of 0.01. This means the
    // generated discount rates will be symmetrically distributed around the mean.
    const discountRateDist = randomNormal(this.params.discountRate, 0.01);

    const growthRate = growthRateDist();
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

  // Run the Monte Carlo simulations
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
   *    - Generates random inputs for the simulation.
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

    // 10th Percentile (P10):
    // 10% of simulated intrinsic values fall below this value
    // Represents a more conservative/pessimistic valuation scenario

    // 90th Percentile (P90):
    // 90% of simulated values fall below this value
    // Only 10% of values are higher than this
    // Represents a more optimistic valuation scenario
    const percentile = (p: number) =>
      sortedValues[Math.floor((p / 100) * sortedValues.length)];

    return {
      mean,
      median,
      percentile10: percentile(10),
      percentile90: percentile(90),
      results,
    };
  }
}

export default MonteCarloIntrinsicValueCalculator;
