import React, { useContext, useState } from 'react';
import { InvestmentContext } from '../InvestmentContext';

const InvestmentGrowth = () => {
  const data = useContext(InvestmentContext);
  if (!data) return null;

  const [initialInvestment, setInitialInvestment] = useState(10000);

  // Current share price and outstanding shares
  const sharePrice = data.inputs.sharePrice;
  const outstandingShares = data.inputs.outstandingShares || 1;

  // Terminal value is the estimated value of the entire company in year 10
  const terminalValue = data.terminalValueAnalysis?.terminalValue || 0;

  /**
   * Calculate the share price in year 10 by dividing the terminal value
   * by the total number of outstanding shares.
   */
  const projectedSharePriceIn10Years =
    outstandingShares > 0 ? terminalValue / outstandingShares : 0;

  /**
   * Calculate how many shares the user can buy with the current initial investment
   * and then estimate the future investment value if the stock price reaches
   * the projected share price in year 10.
   */
  const sharesOwned =
    sharePrice > 0 ? Math.floor(initialInvestment / sharePrice) : 0;
  const futureInvestmentValue = sharesOwned * projectedSharePriceIn10Years;

  const handleInitialInvestmentChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInitialInvestment(Number(event.target.value));
  };

  return (
    <section className="mt-8 p-6 bg-white rounded-lg border border-blue-100 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Investment Growth</h2>
      <p className="text-lg mb-4">
        With an initial investment of $
        <input
          type="number"
          value={initialInvestment}
          onChange={handleInitialInvestmentChange}
          className="h-8 w-24 text-center rounded border border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700"
        />{' '}
        at the current share price of ${sharePrice.toFixed(2)}, you can buy{' '}
        <strong>{sharesOwned.toLocaleString()}</strong> shares. If this stock
        reaches the company’s projected value in 10 years, the share price would
        be about
        <strong> ${projectedSharePriceIn10Years.toFixed(2)}</strong>. Your
        investment could then be worth{' '}
        <strong className="bg-green-200 p-1 rounded">
          ${futureInvestmentValue.toLocaleString()}
        </strong>
        .
      </p>
    </section>
  );
};

export default InvestmentGrowth;
