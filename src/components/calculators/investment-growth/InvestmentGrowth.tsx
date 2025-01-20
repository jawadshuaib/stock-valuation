import React, { useState } from 'react';
import { ProjectionData } from '../types';

const InvestmentGrowth = ({ data }: { data: ProjectionData }) => {
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const initialGrowthRate =
    Number(data.inputs.initialGrowthRate) > 10
      ? Number(data.inputs.initialGrowthRate)
      : 10;
  const [growthRate, setGrowthRate] = useState(initialGrowthRate);
  let finalInvestment = initialInvestment;

  data.yearByYearProjections.forEach(() => {
    finalInvestment *= 1 + growthRate / 100;
  });

  // Handle input change for the initial investment amount
  const handleInitialInvestmentChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInitialInvestment(Number(event.target.value));
  };

  // Handle input change for the growth rate
  const handleGrowthRateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setGrowthRate(Number(event.target.value));
  };

  // If finalInvestment is not a number or is less than 0, set it to 0
  if (isNaN(finalInvestment) || finalInvestment < 0) {
    finalInvestment = 0;
  }

  // Render the investment growth information
  return (
    <section className="mt-8 p-6 bg-white rounded-lg border border-blue-100 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Investment Growth</h2>
      <p className="text-lg mb-4">
        An initial Investment of $
        <input
          type="number"
          value={initialInvestment}
          onChange={handleInitialInvestmentChange}
          className="h-8 w-24 text-center rounded border border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700"
        />{' '}
        with a growth rate of{' '}
        <input
          type="number"
          value={growthRate}
          onChange={handleGrowthRateChange}
          className="h-8 w-16 text-center rounded border border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700"
        />{' '}
        % will have compounded to{' '}
        <span className="font-bold">
          ${Number(finalInvestment.toFixed(2)).toLocaleString()}
        </span>{' '}
        in {data.inputs.projectionYears} years.
      </p>
    </section>
  );
};

export default InvestmentGrowth;
