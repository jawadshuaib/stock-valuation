import { useState } from 'react';
import FinancialInputsForm from './EPSFinancialInputsForm';
import ValuationResults from '../ValuationResults';
import ErrorMessage from '../../ui/ErrorMessage';
import { ProjectionData } from '../types';
import ProjectionChartAndTable from '../ProjectionChartAndTable';
import FinancialRatios from '../financial-ratios/FinancialRatios';
import TimeToOne from '../time-to-one/TimeToOne';

export default function EPSCalculator() {
  const [result, setResult] = useState<ProjectionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const valuateFn = (resultData: ProjectionData | null) => {
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
        Stock Valuation using Discounted Cash Flow based on EPS
      </h2>
      <p className="space-y-2 text-gray-600 mb-6">
        This calculator uses Discounted Cash Flow (DCF) analysis to estimate the
        fair value of a stock. It considers how current earnings might grow over
        time, while accounting for the natural slowdown in growth that most
        companies experience as they mature.
      </p>
      <FinancialInputsForm
        valuateFn={valuateFn}
        valuationErrorFn={valuationErrorFn}
      />
      {result && (
        <>
          <ValuationResults valuation={result.valuation} />
          <FinancialRatios data={result} />
          <ProjectionChartAndTable data={result} />
          <TimeToOne data={result} />
        </>
      )}
      {error && <ErrorMessage message={error} />}
    </section>
  );
}
