import React from 'react';
import { ValuationData } from '../App';
import KeyValuationConcepts from './KeyValuationConcepts';

interface ValuationResultsProps {
  valuation: ValuationData;
}

export default function ValuationResults({ valuation }: ValuationResultsProps) {
  return (
    <section className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Valuation Results
      </h2>

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
      </div>
      <KeyValuationConcepts />
    </section>
  );
}
