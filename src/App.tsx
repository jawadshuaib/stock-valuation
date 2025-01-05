import { useState } from 'react';
import './App.css';
import FinancialInputsForm from './components/FinancialInputsForm';
import ValuationResults from './components/ValuationResults';
import ErrorMessage from './components/ErrorMessage';

export interface ValuationData {
  intrinsicValue: number;
  marginOfSafetyPrice: number;
}

function App() {
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
    <div className="App mt-6 max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Stock Valuation Calculator
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
      {valuation && <ValuationResults valuation={valuation} />}
      {error && <ErrorMessage message={error} />}
    </div>
  );
}

export default App;
