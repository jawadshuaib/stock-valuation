import React, { useContext } from 'react';
import ReverseDCFCalculator from '../../../utils/valuations/reverse-dcf/ReverseDCFCalculator';
import { InvestmentContext } from '../InvestmentContext';

export default function ReverseDCF() {
  const data = useContext(InvestmentContext);

  if (!data) return null;

  let impliedGrowthRate = 0;

  const calculateReverseDCF = () => {
    const params = {
      method: data.method, // "fcf" or "eps"
      sharePrice: data.inputs.sharePrice,
      initialFCF: data.inputs.initialFCF || 0,
      initialEPS: data.inputs.initialEPS || 0,
      initialGrowthRate: data.inputs.initialGrowthRate,
      terminalGrowthRate: data.inputs.terminalGrowthRate,
      discountRate: data.inputs.discountRate,
      projectionYears: data.inputs.projectionYears,
      outstandingShares: data.inputs.outstandingShares || 0,
      marginOfSafety: data.inputs.marginOfSafety,
      decayFactor: data.growthAnalysis?.decayFactor || 0,
    };

    const calculator = new ReverseDCFCalculator(params);
    impliedGrowthRate = calculator.calculateImpliedGrowthRate();
  };

  calculateReverseDCF();

  if (impliedGrowthRate === 0) {
    return (
      <div>At this price, the market is not expecting the company to grow.</div>
    );
  }

  let interpretation: React.ReactNode;
  if (impliedGrowthRate > data.inputs.initialGrowthRate) {
    interpretation = (
      <>
        The market is more optimistic than you are.{' '}
        <span className="bg-red-500 text-white rounded px-1">This is bad</span>.
        If the company fails to achieve the {impliedGrowthRate.toFixed(2)}%
        growth rate, the stock price may decline as the market adjusts to lower
        expectations. If your estimate is more accurate, the stock is likely
        overpriced based on your valuation model.
      </>
    );
  } else if (impliedGrowthRate === data.inputs.initialGrowthRate) {
    interpretation = (
      <>
        The market is pricing the stock as if it will grow at{' '}
        {impliedGrowthRate.toFixed(2)}% per year, which is the same as your
        estimate.
      </>
    );
  } else {
    interpretation = (
      <>
        The market is more pessimistic than you are.{' '}
        <span className="bg-green-500 text-white rounded px-1">
          This is good
        </span>
        . If the company achieves the growth rate you expect, the stock price
        may rise as the market adjusts to higher expectations. If your estimate
        is more accurate, the stock is likely underpriced based on your
        valuation model.
      </>
    );
  }

  return (
    <section className="mt-8 p-6 bg-white rounded-lg border border-blue-100 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">
        Reverse Discounted Cash Flow Analysis
      </h2>
      <p className="text-lg mb-4">
        The market is pricing the stock as if it will grow at{' '}
        <span className="font-bold text-green-600">
          {impliedGrowthRate.toFixed(2)}%
        </span>{' '}
        per year.
      </p>
      <p className="text-lg mb-4">{interpretation}</p>
    </section>
  );
}
