import { useState } from 'react';
import FinancialInputsForm from './EPSFinancialInputsForm';
import ValuationResults from '../ValuationResults';
import ErrorMessage from '../../ui/ErrorMessage';
import { ProjectionData } from '../types';
import ProjectionChartAndTable from '../ProjectionChartAndTable';
import BackButton from '../../ui/BackButton';

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
      <BackButton />
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
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
      {result?.valuation && <ValuationResults valuation={result.valuation} />}
      {result && <ProjectionChartAndTable data={result} />}
      {error && <ErrorMessage message={error} />}
    </section>
  );
}
