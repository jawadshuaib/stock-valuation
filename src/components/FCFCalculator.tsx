import { FCFIntrinsicValueCalculator } from '../utils/valuations/fcf';

// Example usage:
const fcfParams = {
  fcf: 5000000,
  growthRate: 0.15,
  terminalGrowthRate: 0.03,
  discountRate: 0.1,
  projectionYears: 10,
  marginOfSafety: 0.2,
};

const fcfCalculator = new FCFIntrinsicValueCalculator(fcfParams);
const fcfValuation = fcfCalculator.calculate();

export default function FCFCalculator() {
  console.log(fcfValuation.valuation.intrinsicValue);
  return <div>* Under construction *</div>;
}
