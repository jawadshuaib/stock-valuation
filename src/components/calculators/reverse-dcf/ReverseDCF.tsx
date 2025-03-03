import React, { useContext } from 'react';
import ReverseDCFCalculator from '../../../utils/valuations/reverse-dcf/ReverseDCFCalculator';
import { InvestmentContext } from '../InvestmentContext';

export default function ReverseDCF() {
  const data = useContext(InvestmentContext);

  if (!data) return null;
  let impliedGrowthRate = 0;
  const calculateReverseDCF = () => {
    const params = {
      fcf: data.inputs.initialFCF ? data.inputs.initialFCF : 0, // Free Cash Flow
      discountRate: data.inputs.discountRate / 100,
      terminalGrowthRate: data.inputs.terminalGrowthRate / 100,
      projectionYears: data.inputs.projectionYears, // 10 years projection
      marketPrice: data.inputs.sharePrice, // Current market price of the stock
      outstandingShares: data.inputs.outstandingShares
        ? data.inputs.outstandingShares
        : 0, // Number of shares outstanding
    };

    const calculator = new ReverseDCFCalculator(params);
    impliedGrowthRate = calculator.calculateImpliedGrowthRate() * 100;
  };

  calculateReverseDCF();

  if (impliedGrowthRate === 0) {
    return (
      <div>At this price, the market is not expecting the company to grow.</div>
    );
  }

  let interpretation = '';
  if (impliedGrowthRate > data.inputs.initialGrowthRate) {
    interpretation = `The market is more optimistic than you are. This is bad. If the company fails to achieve the ${impliedGrowthRate.toFixed(
      2,
    )}% growth rate, the stock price may decline as the market adjusts to lower expectations. If your estimate is more accurate, the stock is likely overpriced based on your valuation model.`;
  } else if (impliedGrowthRate === data.inputs.initialGrowthRate) {
    interpretation = `The market is pricing the stock as if it will grow at ${impliedGrowthRate.toFixed(
      2,
    )}% per year, which is the same as your estimate.`;
  } else {
    interpretation = `The market is more pessimistic than you are. This is good. If the company achieves the growth rate you expect, the stock price may rise as the market adjusts to higher expectations. If your estimate is more accurate, the stock is likely underpriced based on your valuation model.`;
  }

  return (
    <section className="mt-8 p-6 bg-white rounded-lg border border-blue-100 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Reverse DCF Analysis</h2>
      <p className="text-lg mb-4">
        The market is pricing the stock as if it will grow at{' '}
        <span className="font-bold text-green-600">
          {impliedGrowthRate.toFixed(2)}%
        </span>{' '}
        per year, while you expect it to grow at{' '}
        <span className="font-bold text-blue-600">
          {data.inputs.initialGrowthRate.toFixed(2)}%
        </span>
        .
      </p>
      <p className="text-lg mb-4">{interpretation}</p>
    </section>
  );
}
