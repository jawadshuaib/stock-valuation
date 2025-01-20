import React from 'react';
import { ProjectionData } from '../types';

// Define the props for the InvestmentGrowth component
interface InvestmentGrowthProps {
  data: ProjectionData;
}

// InvestmentGrowth component calculates and displays the growth of an investment over time
export default function InvestmentGrowth({ data }: InvestmentGrowthProps) {
  // Initial investment amount
  const initialInvestment = 1000;
  // Variable to hold the final investment value after projections
  let finalInvestment = initialInvestment;

  // Iterate over each year's projection and calculate the investment growth
  data.yearByYearProjections.forEach((projection) => {
    finalInvestment *= 1 + projection.growthRate / 100;
  });

  // Render the investment growth information
  return (
    <div>
      <h2>Investment Growth</h2>
      <p>
        An initial Investment of ${initialInvestment.toFixed(2)} in this company
        will have grown to ${finalInvestment.toFixed(2)} in{' '}
        {data.inputs.projectionYears} years.
      </p>
    </div>
  );
}
