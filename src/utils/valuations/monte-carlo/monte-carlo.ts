/**
 * Monte Carlo Simulation for FCF Intrinsic Value Calculation
 *
 * This class performs a Monte Carlo simulation to estimate the intrinsic value of a stock based on Free Cash Flow (FCF).
 * Monte Carlo simulations involve running a large number of simulations with random inputs to model the uncertainty
 * and variability in the key drivers of the valuation. The results are then analyzed to provide statistical insights
 * such as mean, median, and percentiles.
 *
 * Key Steps:
 * 1. Generate random inputs for growth rate, terminal growth rate, and discount rate based on specified distributions.
 * 2. Validate the generated inputs to ensure they are within acceptable ranges.
 * 3. Run the FCF intrinsic value calculation for each set of random inputs.
 * 4. Collect and analyze the results to provide statistical insights.
 */

import { randomNormal, randomLogNormal } from 'd3-random';
import FCFIntrinsicValueCalculator from '../fcf/FCFIntrinsicValueCalculator';
import { ProjectionData } from '../../../components/calculators/types';
import ValidationError from '../ValidationError';
import ValuationConfig from '../ValuationConfig';

// Define the parameters required for the Monte Carlo simulation
interface MonteCarloParams {
  method: 'fcf' | 'eps';
  sharePrice: number;
  fcf: number;
  growthRate: number;
  terminalGrowthRate: number;
  discountRate: number;
  projectionYears: number;
  marginOfSafety: number;
  outstandingShares: number;
}

class MonteCarloFCFIntrinsicValueCalculator {
  private params: MonteCarloParams;

  private numSimulations: number;

  constructor(params: MonteCarloParams, numSimulations: number = 1000) {
    this.params = params;
    this.numSimulations = numSimulations;
  }

  // Generate random inputs for the simulation
  private generateRandomInputs() {
    // Log-normal distribution for growth rate to account for positive skewness
    const growthRateDist = randomLogNormal(
      Math.log(this.params.growthRate),
      0.2,
    );
    // Normal distribution for terminal growth rate
    const terminalGrowthRateDist = randomNormal(
      this.params.terminalGrowthRate,
      0.01,
    );
    // Normal distribution for discount rate
    const discountRateDist = randomNormal(this.params.discountRate, 0.01);

    // Generate random values
    const growthRate = growthRateDist();
    const terminalGrowthRate = terminalGrowthRateDist();
    const discountRate = discountRateDist();

    // Validate the generated inputs
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
  public runSimulations() {
    const results: ProjectionData[] = [];

    for (let i = 0; i < this.numSimulations; i++) {
      try {
        // Generate random inputs for this simulation
        const randomInputs = this.generateRandomInputs();
        // Create a new FCFIntrinsicValueCalculator with the random inputs
        const calculator = new FCFIntrinsicValueCalculator({
          ...this.params,
          growthRate: randomInputs.growthRate,
          terminalGrowthRate: randomInputs.terminalGrowthRate,
          discountRate: randomInputs.discountRate,
        });

        // Calculate the intrinsic value
        const result = calculator.calculate();
        // Store the result
        results.push(result);
      } catch (error) {
        if (error instanceof ValidationError) {
          // Log validation errors and continue with the next simulation
          console.warn('Validation error in simulation:', error.errors);
          continue;
        } else {
          // Re-throw unexpected errors
          throw error;
        }
      }
    }

    // Analyze the results to provide statistical insights
    return this.analyzeResults(results);
  }

  // Analyze the results of the simulations
  private analyzeResults(results: ProjectionData[]) {
    // Extract intrinsic values from the results
    const intrinsicValues = results.map(
      (result) => result.valuation.intrinsicValue,
    );
    // Calculate the mean intrinsic value
    const mean =
      intrinsicValues.reduce((sum, value) => sum + value, 0) /
      intrinsicValues.length;
    // Sort the intrinsic values to calculate percentiles
    const sortedValues = intrinsicValues.sort((a, b) => a - b);
    // Calculate the median intrinsic value
    const median = sortedValues[Math.floor(sortedValues.length / 2)];
    // Function to calculate a specific percentile
    const percentile = (p: number) =>
      sortedValues[Math.floor((p / 100) * sortedValues.length)];

    // Return the statistical insights
    return {
      mean,
      median,
      percentile10: percentile(10),
      percentile90: percentile(90),
    };
  }
}

export default MonteCarloFCFIntrinsicValueCalculator;
