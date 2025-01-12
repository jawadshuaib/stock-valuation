import React from 'react';
import { ProjectionData } from '../types';
import { FinancialRatiosCalculator } from '../../../utils/valuations/financial-ratios/financial-ratios';

interface FinancialRatiosProps {
  data: ProjectionData;
}

const FinancialRatios: React.FC<FinancialRatiosProps> = ({ data }) => {
  const ratios = new FinancialRatiosCalculator(data);

  const priceToFCF = ratios.getPriceToFCFRatio();
  const priceToEPS = ratios.getPriceToEPSRatio();
  const priceToIntrinsicValue = ratios.getPriceToIntrinsicValueRatio();
  const priceToMarginOfSafety = ratios.getPriceToMarginOfSafetyRatio();

  return (
    <section className="mt-8 p-6 bg-white rounded-lg border border-blue-100 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Financial Ratios</h2>
      <p className="text-lg mb-4">
        Below are the financial ratios calculated based on the provided data.
      </p>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Ratio</th>
            <th className="py-2 px-4 border-b">Value</th>
          </tr>
        </thead>
        <tbody>
          {priceToFCF !== null && (
            <tr>
              <td className="py-2 px-4 border-b">
                Price to Free Cash Flow (P/FCF)
              </td>
              <td className="py-2 px-4 border-b">{priceToFCF.toFixed(2)}</td>
            </tr>
          )}
          {priceToEPS !== null && (
            <tr>
              <td className="py-2 px-4 border-b">
                Price to Earnings per Share (P/E)
              </td>
              <td className="py-2 px-4 border-b">{priceToEPS.toFixed(2)}</td>
            </tr>
          )}
          <tr>
            <td className="py-2 px-4 border-b">Price to Intrinsic Value</td>
            <td className="py-2 px-4 border-b">
              {priceToIntrinsicValue.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b">Price to Margin of Safety</td>
            <td className="py-2 px-4 border-b">
              {priceToMarginOfSafety.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};

export default FinancialRatios;
