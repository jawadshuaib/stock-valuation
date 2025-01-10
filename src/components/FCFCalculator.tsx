import { FCFIntrinsicValueCalculator } from '../utils/valuations/fcf';

// Example usage:
const params = {
  fcf: 1000000, // Initial Free Cash Flow in dollars
  growthRate: 0.15, // Initial growth rate (15%)
  terminalGrowthRate: 0.03, // Terminal growth rate (3%)
  discountRate: 0.1, // Discount rate (10%)
  projectionYears: 10, // Projection period (10 years)
  marginOfSafety: 0.2, // Margin of safety (20%)
  outstandingShares: 100000, // Number of shares outstanding
};

// Create an instance of the FCFIntrinsicValueCalculator
const fcfCalculator = new FCFIntrinsicValueCalculator(params);
const fcfValuation = fcfCalculator.calculate();

export default function FCFCalculator() {
  console.log(fcfValuation.valuation.intrinsicSharePrice);
  return <div>* Under construction *</div>;
}
