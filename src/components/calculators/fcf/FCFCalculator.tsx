import React, { useState } from 'react';
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
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Stock Valuation using Free Cash Flow
      </h2>
      <p className="space-y-2 text-gray-600 mb-4">
        This calculator uses Discounted Cash Flow (DCF) analysis to estimate the
        fair value of a stock. It considers how current Free Cash Flow (FCF)
        might grow over time, while accounting for the natural slowdown in
        growth that most companies experience as they mature. Monte Carlo
        simulations are used to iterate over thousands of possible scenarios to
        arrive at the most statistically sound valuation.
      </p>
      <GPT>Not sure how to calculate the free cash flow? Use this GPT.</GPT>
      <FCFFinancialInputsForm
        valuateFn={valuateFn}
        valuationErrorFn={valuationErrorFn}
      />

      {/* Intrinsic Value and Margin of Safety Price  */}
      <ValuationResults />

      {result && (
        <>
          <Investment data={result}>
            <Investment.Ratios />
            <Investment.ProjectionChartAndTable />
            <Investment.PaybackTime />
            <Investment.FCFForFree />
            <Investment.HalfLife />
            <Investment.Growth />
            {/* <OwnerEarningsYieldComponent /> */}
          </Investment>
        </>
      )}
      {error && <ErrorMessage message={error} />}
    </section>
  );
}
