import React from 'react';
import { ProjectionData } from '../types';

// Define the props for the InvestmentGrowth component
interface InvestmentGrowthProps {
  data: ProjectionData;
}

// InvestmentGrowth component calculates and displays the growth of an investment over time
export default function InvestmentGrowth({ data }: InvestmentGrowthProps) {
  // Initial investment amount
  const initialInvestment = 10000;
  // Variable to hold the final investment value after projections
  let finalInvestment = initialInvestment;

  // Iterate over each year's projection and calculate the investment growth
  data.yearByYearProjections.forEach((projection) => {
    finalInvestment *= 1 + projection.growthRate / 100;
  });

  // Render the investment growth information
  return (
    <section className="mt-8 p-6 bg-white rounded-lg border border-blue-100 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Investment Growth</h2>
      <p className="text-lg mb-4">
        An initial Investment of ${initialInvestment.toLocaleString()} will have
        grown to{' '}
        <span className="font-bold">
          ${Number(finalInvestment.toFixed(0)).toLocaleString()}
        </span>{' '}
        in {data.inputs.projectionYears} years.
      </p>
    </section>
  );
}
