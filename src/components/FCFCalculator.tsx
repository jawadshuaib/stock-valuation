import { useState } from 'react';
import FCFFinancialInputsForm from './FCFFinancialInputsForm';
import ValuationResults from './ValuationResults';
import ErrorMessage from './ErrorMessage';

export interface ValuationData {
  intrinsicValue: number;
  marginOfSafetyPrice: number;
}

export default function FCFCalculator() {
  const [valuation, setValuation] = useState<ValuationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const valuateFn = (valuationData: ValuationData | null) => {
    setError(null);
    setValuation(valuationData);
  };

  const valuationErrorFn = (err: string) => {
    if (err) {
      setValuation(null);
    }
    setError(err);
  };

  return (
    <section>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Stock Valuation using Discounted Cash Flow based on FCF
      </h2>
      <p className="space-y-2 text-gray-600 mb-6">
        This calculator uses Discounted Cash Flow (DCF) analysis to estimate the
        fair value of a stock. It considers how current Free Cash Flow (FCF)
        might grow over time, while accounting for the natural slowdown in
        growth that most companies experience as they mature.
      </p>
      <FCFFinancialInputsForm
        valuateFn={valuateFn}
        valuationErrorFn={valuationErrorFn}
      />
      {valuation && <ValuationResults valuation={valuation} />}
      {error && <ErrorMessage message={error} />}
    </section>
  );
}
// import { FCFIntrinsicValueCalculator } from '../utils/valuations/fcf';

// // Example usage:
// const params = {
//   fcf: 1000000, // Initial Free Cash Flow in dollars
//   growthRate: 0.15, // Initial growth rate (15%)
//   terminalGrowthRate: 0.03, // Terminal growth rate (3%)
//   discountRate: 0.1, // Discount rate (10%)
//   projectionYears: 10, // Projection period (10 years)
//   marginOfSafety: 0.2, // Margin of safety (20%)
//   outstandingShares: 100000, // Number of shares outstanding
// };

// // Create an instance of the FCFIntrinsicValueCalculator
// const fcfCalculator = new FCFIntrinsicValueCalculator(params);
// const fcfValuation = fcfCalculator.calculate();

// export default function FCFCalculator() {
//   console.log(fcfValuation.valuation.intrinsicSharePrice);
//   return <div>* Under construction *</div>;
// }
