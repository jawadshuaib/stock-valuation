import { useState } from 'react';
import FCFFinancialInputsForm from './FCFFinancialInputsForm';
import ValuationResults from '../ValuationResults';
import ErrorMessage from '../../ui/ErrorMessage';
import { ProjectionData } from '../types';
import GPT from '../../ui/GPT';
import Investment from '../InvestmentContext';

export default function FCFCalculator() {
  const [result, setResult] = useState<ProjectionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const valuateFn = (resultData: ProjectionData) => {
    setError(null);
    setResult(resultData);
  };

  const valuationErrorFn = (err: string) => {
    if (err) {
      setResult(null);
    }
    setError(err);
  };

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Stock Valuation using Discounted Cash Flow based on FCF
      </h2>
      <p className="space-y-2 text-gray-600 mb-4">
        This calculator uses Discounted Cash Flow (DCF) analysis to estimate the
        fair value of a stock. It considers how current Free Cash Flow (FCF)
        might grow over time, while accounting for the natural slowdown in
        growth that most companies experience as they mature.
      </p>
      <GPT>Not sure how to calculate the free cash flow? Use this GPT.</GPT>
      <FCFFinancialInputsForm
        valuateFn={valuateFn}
        valuationErrorFn={valuationErrorFn}
      />
      {result && <ValuationResults valuation={result.valuation} />}
      {result && (
        <Investment data={result}>
          <Investment.Ratios />
          <Investment.ProjectionChartAndTable />
          <Investment.PaybackTime />
          <Investment.FCFForFree />
          <Investment.HalfLife />
          <Investment.Growth />
          {/* <OwnerEarningsYieldComponent /> */}
        </Investment>
      )}
      {error && <ErrorMessage message={error} />}
    </section>
  );
}
