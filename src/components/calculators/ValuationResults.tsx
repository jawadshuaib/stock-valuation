import React from 'react';
import { ValuationData } from './types';
import { NUMBER_OF_SIMULATIONS } from '../../utils/valuations/monte-carlo/MonteCarloFCFIntrinsicValueCalculator';

interface ValuationResultsProps {
  selection: 'deterministic' | 'montecarlo';
  valuation: ValuationData;
}

export default function ValuationResults({
  selection,
  valuation,
}: ValuationResultsProps) {
  const theme = {
    deterministic: {
      title: 'Valuation Results',
      style: 'from-blue-50 to-indigo-50 border-blue-100',
      description: '',
    },
    montecarlo: {
      title: 'Valuation Results',
      style: 'from-green-50 to-lime-50 border-green-100',
      description: `Valuation created using ${NUMBER_OF_SIMULATIONS.toLocaleString(
        'en-US',
      )} Monte Carlo simulations adjusted for growth, terminal and discount rate.`,
    },
  };

  const title = theme[selection].title;
  const style = theme[selection].style;
  const description = theme[selection].description;

  return (
    <section
      className={`${style} mt-8 p-6 bg-gradient-to-br rounded-xl border shadow-sm`}
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">{title}</h2>

      <div className="space-y-4">
        <div className="p-4 bg-white rounded-lg shadow-sm border border-blue-100">
          <div className="text-sm font-medium text-gray-500 mb-1">
            Intrinsic Value
          </div>
          <div className="text-3xl font-bold text-blue-600">
            ${valuation.intrinsicValue.toFixed(2)}
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-sm border border-blue-100">
          <div className="text-sm font-medium text-gray-500 mb-1">
            Margin of Safety Price
          </div>
          <div className="text-3xl font-bold text-green-600">
            ${valuation.marginOfSafetyPrice.toFixed(2)}
          </div>
        </div>
        {description !== '' && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </div>
    </section>
  );
}
