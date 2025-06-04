// import React, { useContext, useState, useEffect } from 'react';
// import { InvestmentContext } from '../InvestmentContext';

// const InvestmentGrowth = () => {
//   const data = useContext(InvestmentContext);
//   if (!data) return null;

//   const [initialInvestment, setInitialInvestment] = useState(10000);

//   // Current share price and outstanding shares
//   const sharePrice = data.inputs.sharePrice;
//   const outstandingShares = data.inputs.outstandingShares || 1;

//   // Adjust initial investment if share price is more than the investment amount
//   useEffect(() => {
//     if (sharePrice > initialInvestment) {
//       setInitialInvestment(100000);
//     }
//   }, [sharePrice, initialInvestment]);

//   // Terminal value is the estimated value of the entire company in year 10
//   const terminalValue = data.terminalValueAnalysis?.terminalValue || 0;

//   /**
//    * Calculate the share price in year 10 by dividing the terminal value
//    * by the total number of outstanding shares.
//    */
//   const projectedSharePriceIn10Years =
//     outstandingShares > 0 ? terminalValue / outstandingShares : 0;

//   /**
//    * Calculate how many shares the user can buy with the current initial investment
//    * and then estimate the future investment value if the stock price reaches
//    * the projected share price in year 10.
//    */
//   const sharesOwned =
//     sharePrice > 0 ? Math.floor(initialInvestment / sharePrice) : 0;
//   const futureInvestmentValue = sharesOwned * projectedSharePriceIn10Years;

//   const handleInitialInvestmentChange = (
//     event: React.ChangeEvent<HTMLInputElement>,
//   ) => {
//     setInitialInvestment(Number(event.target.value));
//   };

//   return (
//     <section className="mt-8 p-6 bg-white rounded-lg border border-blue-100 shadow-sm">
//       <h2 className="text-2xl font-semibold mb-4">Investment Growth</h2>
//       <p className="text-lg mb-4">
//         With an initial investment of $
//         <input
//           type="number"
//           value={initialInvestment}
//           onChange={handleInitialInvestmentChange}
//           className="h-8 w-24 text-center rounded border border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700"
//         />{' '}
//         at the current share price of ${sharePrice.toFixed(2)}, you can buy{' '}
//         <strong>{sharesOwned.toLocaleString()}</strong> shares. If this stock
//         reaches the company’s projected value in 10 years, the share price would
//         be about
//         <strong> ${projectedSharePriceIn10Years.toFixed(2)}</strong>. Your
//         investment could then be worth{' '}
//         <strong className="bg-green-200 p-1 rounded">
//           ${futureInvestmentValue.toLocaleString()}
//         </strong>
//         .
//       </p>
//     </section>
//   );
// };

// export default InvestmentGrowth;

import React, { useContext, useState } from 'react';
import { ProjectionData } from '../types'; // Import MethodEnum
// import { InvestmentContext } from '../contexts/InvestmentContext';
// import { FinancialRatiosCalculator } from '../services/FinancialRatiosCalculator';
import { InvestmentContext } from '../InvestmentContext';
import { FinancialRatiosCalculator } from '../../../utils/valuations/financial-ratios/financial-ratios';
import { BlockMath } from 'react-katex';

enum MethodEnum {
  FCF = 'fcf',
  EPS = 'eps',
}

interface ReturnComponents {
  period: number; // in years
  annualizedYield: number | null;
  annualizedGrowth: number | null;
  totalAnnualizedReturn: number | null;
  totalCompoundedReturn: number | null;
  projectedInvestmentValue: number | null;
}

const formatPercentage = (
  value: number | null,
  defaultText: string = 'N/A',
): string => {
  if (value === null || isNaN(value) || !isFinite(value)) return defaultText;
  return `${(value * 100).toFixed(2)}%`;
};

const formatCurrency = (
  value: number | null,
  defaultText: string = 'N/A',
): string => {
  if (value === null || isNaN(value) || !isFinite(value)) return defaultText;
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const InvestmentReturnSensitivityAnalysis: React.FC = () => {
  const data = useContext(InvestmentContext);
  const [initialInvestment, setInitialInvestment] = useState<number>(10000);

  if (!data) {
    return (
      <section
        aria-labelledby="loading-title"
        className="mt-8 p-6 bg-white rounded-lg border border-blue-100 shadow-sm"
      >
        <h2
          id="loading-title"
          className="text-2xl font-semibold mb-4 text-gray-900"
        >
          Expected Total Return Analysis
        </h2>
        <p className="text-gray-700">Loading data or data not available...</p>
      </section>
    );
  }

  const ratios = new FinancialRatiosCalculator(data);
  const periods = [3, 5, 10]; // Years

  const handleInitialInvestmentChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    setInitialInvestment(value === '' ? 0 : Number(value));
  };

  const calculateReturnComponents = (
    periodInYears: number,
    projectionData: ProjectionData,
    currentInvestment: number,
  ): ReturnComponents => {
    const { method, yearByYearProjections } = projectionData;

    const annualizedYield =
      method === MethodEnum.FCF
        ? ratios.getFCFYield()
        : ratios.getEarningsYield();

    let annualizedGrowth: number | null = null;
    if (
      yearByYearProjections &&
      yearByYearProjections.length > 0 &&
      periodInYears > 0
    ) {
      const projectionsForPeriod = yearByYearProjections.slice(
        0,
        periodInYears,
      );
      if (
        projectionsForPeriod.length >= periodInYears &&
        projectionsForPeriod.length > 0
      ) {
        // Ensure enough data
        const sumOfGrowthRates = projectionsForPeriod.reduce(
          (sum, p) => sum + p.growthRate / 100, // Convert percentage to decimal
          0,
        );
        annualizedGrowth = sumOfGrowthRates / projectionsForPeriod.length;
      } else {
        annualizedGrowth =
          (parseFloat(projectionData.inputs.initialGrowthRate.toString()) ||
            0) / 100;
      }
    } else {
      annualizedGrowth =
        (parseFloat(projectionData.inputs.initialGrowthRate.toString()) || 0) /
        100;
    }

    let totalAnnualizedReturn: number | null = null;
    if (annualizedYield !== null && annualizedGrowth !== null) {
      totalAnnualizedReturn = annualizedYield + annualizedGrowth;
    }

    let totalCompoundedReturn: number | null = null;
    let projectedInvestmentValue: number | null = null;

    if (totalAnnualizedReturn !== null && periodInYears > 0) {
      totalCompoundedReturn =
        Math.pow(1 + totalAnnualizedReturn, periodInYears) - 1;
      projectedInvestmentValue =
        currentInvestment * (1 + totalCompoundedReturn);
    } else if (
      totalAnnualizedReturn === 0 &&
      annualizedYield === 0 &&
      annualizedGrowth === 0
    ) {
      // Handle 0 return case
      totalCompoundedReturn = 0;
      projectedInvestmentValue = currentInvestment;
    }

    return {
      period: periodInYears,
      annualizedYield,
      annualizedGrowth,
      totalAnnualizedReturn,
      totalCompoundedReturn,
      projectedInvestmentValue,
    };
  };

  const results: ReturnComponents[] = periods.map((p) =>
    calculateReturnComponents(p, data, initialInvestment),
  );

  return (
    <section
      aria-labelledby="return-analysis-title"
      className="mt-8 p-6 bg-white rounded-lg border border-blue-100 shadow-sm"
    >
      <h2
        id="return-analysis-title"
        className="text-2xl font-semibold mb-4 text-gray-900"
      >
        Expected Total Returns
      </h2>
      <p className="text-lg mb-4">
        For an initial investment of $
        <input
          type="number"
          value={initialInvestment}
          onChange={handleInitialInvestmentChange}
          className="h-8 w-28 mx-1 text-center rounded border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Initial investment amount"
        />
        you can expect the following return on your investment.
      </p>
      <p className="text-gray-600 text-lg mb-4">
        <BlockMath math="Expected\  Return = Yield + Average\ Growth" />
      </p>
      <div className="overflow-x-auto">
        <table
          className="min-w-full bg-white border border-gray-200"
          aria-label="Investment Return Sensitivity Analysis Table"
        >
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
              >
                Investment Horizon
              </th>
              <th
                scope="col"
                className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
              >
                Yield
              </th>
              <th
                scope="col"
                className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
              >
                Avg. Growth
              </th>
              <th
                scope="col"
                className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
              >
                Total Return
              </th>
              <th
                scope="col"
                className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
              >
                Total Compounded Return (Period)
              </th>
              <th
                scope="col"
                className="py-3 px-4 text-left  font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
              >
                Projected Investment Value ($)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {results.map((res, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">
                  {res.period} Years
                </td>
                <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">
                  {formatPercentage(res.annualizedYield)}
                </td>
                <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">
                  {formatPercentage(res.annualizedGrowth)}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 font-semibold whitespace-nowrap">
                  {formatPercentage(res.totalAnnualizedReturn)}
                </td>
                <td className="py-3 px-4 text-sm text-green-600 font-bold whitespace-nowrap">
                  {formatPercentage(res.totalCompoundedReturn)}
                </td>
                <td className="py-3 px-4 text-sm text-blue-600 font-bold whitespace-nowrap">
                  {formatCurrency(res.projectedInvestmentValue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 text-xs text-gray-500 space-y-1">
        <p>
          * Yield is based on{' '}
          {data.method === MethodEnum.EPS
            ? 'Earnings Yield (EPS/Price)'
            : 'FCF Yield (FCF/Share/Price)'}
          .
        </p>
        <p>
          * Avg. Annual FCF/EPS Growth is the average of projected annual growth
          rates over the investment horizon. If detailed projections covering
          the full period are unavailable, it defaults to the Initial Growth
          Rate.
        </p>
        <p>
          * It is assumed that the P/E or P/FCF multiple of the investment
          remains static. Changes in this multiple will affect the total return.
        </p>
        <p>
          * N/A indicates that a value could not be calculated due to missing
          inputs, zero denominators, or other mathematical constraints.
        </p>
      </div>
    </section>
  );
};

export default InvestmentReturnSensitivityAnalysis;
