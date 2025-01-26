import React from 'react';
import { Bar } from 'react-chartjs-2';
import { ProjectionData } from '../types'; // Adjust the import path if needed

// Define the props for our IntrinsicValueGraph component.
// This component will receive and display the distribution of intrinsic values
// based on an array of ProjectionData.
interface IntrinsicValueGraphProps {
  results: ProjectionData[];
}

const IntrinsicValueGraph: React.FC<IntrinsicValueGraphProps> = ({
  results,
}) => {
  // 1) Extract intrinsic values from each result.
  // These values will be used to form our histogram.
  const intrinsicValues = results.map((r) => r.valuation.intrinsicValue);

  // 2) Determine how many bins to show in the histogram. Limit to 20.
  // If there are fewer than 20 intrinsic values, use that number of bins.
  const bins = intrinsicValues.length > 20 ? 20 : intrinsicValues.length;

  // 3) Find the minimum and maximum intrinsic value to establish range.
  const minValue = Math.min(...intrinsicValues);
  const maxValue = Math.max(...intrinsicValues);

  // 4) Calculate the width of each bin based on our range and bin count.
  const binWidth = (maxValue - minValue) / bins;

  // 5) Create an array to store frequency counts for each bin.
  const histogramData = Array(bins).fill(0);

  // 6) Iterate over each intrinsic value and increment the appropriate bin's frequency.
  intrinsicValues.forEach((value) => {
    // Identify the bin index for this value.
    const binIndex = Math.floor((value - minValue) / binWidth);
    // Use Math.min(...) to avoid an out-of-bounds index for the last bin.
    histogramData[Math.min(binIndex, bins - 1)] += 1;
  });

  // 7) Prepare Chart.js data:
  // Use bin labels, and the frequency counts for each bin as the dataset.
  const data = {
    labels: histogramData.map((_, index) =>
      (minValue + index * binWidth).toFixed(2),
    ),
    datasets: [
      {
        label: 'Intrinsic Value Distribution',
        data: histogramData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  // 8) Chart options that control responsiveness, axis titles, etc.
  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Intrinsic Value',
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

  // 9) Render the bar chart along with a heading describing the data.
  return (
    <>
      <h3 className="text-lg font-semibold mb-4">
        Intrinsic Value Distribution
      </h3>
      <Bar data={data} options={options} />
    </>
  );
};

export default IntrinsicValueGraph;
