import React, { useState } from 'react';
import { ProjectionData } from '../types';

// Define the props for the InvestmentGrowth component
interface InvestmentGrowthProps {
  data: ProjectionData;
}

// InvestmentGrowth component calculates and displays the growth of an investment over time
export default function InvestmentGrowth({ data }: InvestmentGrowthProps) {
  // State to hold the initial investment amount
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const initialGrowthRate = data.inputs.initialGrowthRate;
  // Variable to hold the final investment value after projections
  let finalInvestment = initialInvestment;

  // Iterate over each year's projection and calculate the investment growth
  data.yearByYearProjections.forEach((projection) => {
    finalInvestment *= 1 + projection.growthRate / 100;
  });

  // Handle input change for the initial investment amount
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInitialInvestment(Number(event.target.value));
  };

  // Render the investment growth information
  return (
    <section className="mt-8 p-6 bg-white rounded-lg border border-blue-100 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Investment Growth</h2>
      <p className="text-lg mb-4">
        An initial Investment of $
        <input
          type="number"
          value={initialInvestment}
          onChange={handleInputChange}
          className="h-8 w-24 rounded border border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700"
        />{' '}
        at a growth rate of {initialGrowthRate} will have compounded to{' '}
        <span className="font-bold">
          ${Number(finalInvestment.toFixed(2)).toLocaleString()}
        </span>{' '}
        in {data.inputs.projectionYears} years.
      </p>
    </section>
  );
}
