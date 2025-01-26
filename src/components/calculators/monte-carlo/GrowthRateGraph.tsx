import React from 'react';
import { Bar } from 'react-chartjs-2';
import { ProjectionData } from '../types'; // Adjust the import path accordingly

// Define the props for our component, which only needs the simulation results
interface GrowthRateGraphProps {
  results: ProjectionData[];
}

const GrowthRateGraph: React.FC<GrowthRateGraphProps> = ({ results }) => {
  // Extract the initial growth rates from each result
  const growthRates = results.map((r) => r.inputs.initialGrowthRate);

  // Define the number of bins for our histogram
  const bins = growthRates.length > 200 ? 200 : growthRates.length;

  // Calculate the minimum and maximum growth rates
  const minGrowthRate = Math.min(...growthRates);
  const maxGrowthRate = Math.max(...growthRates);

  // Determine bin width for the histogram
  const binWidth = (maxGrowthRate - minGrowthRate) / bins;

  // Create an array to store frequency counts for each bin
  const histogramData = Array(bins).fill(0);

  // Distribute each growth rate into the appropriate bin
  growthRates.forEach((value) => {
    const binIndex = Math.floor((value - minGrowthRate) / binWidth);
    histogramData[Math.min(binIndex, bins - 1)] += 1;
  });

  // Prepare the data object for Chart.js
  const data = {
    labels: histogramData.map((_, index) =>
      (minGrowthRate + index * binWidth).toFixed(2),
    ),
    datasets: [
      {
        label: 'Growth Rate Distribution',
        data: histogramData,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  // Configure chart options, including axes labels
  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Growth Rate',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Frequency',
        },
      },
    },
  };

  // Render the component, including a heading and the Bar chart
  return (
    <>
      <h3 className="text-lg font-semibold mb-4">Growth Rate Distribution</h3>
      <Bar data={data} options={options} />
    </>
  );
};

export default GrowthRateGraph;
