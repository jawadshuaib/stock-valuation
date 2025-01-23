import React from 'react';
import { Modal } from 'flowbite-react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { useAppSelector } from '../../../store/sliceHooks';

// Register Chart.js components and plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  annotationPlugin,
);

interface MonteCarloDisplayModalProps {
  show: boolean;
  onClose: () => void;
}

function MonteCarloDisplayModal({
  show,
  onClose,
}: MonteCarloDisplayModalProps) {
  const selector = useAppSelector((state) => state.simulation);
  const { simulation } = selector;

  if (!simulation) return null;

  const { median, results } = simulation;

  // Prepare data for histogram
  const intrinsicValues = results.map(
    (result) => result.valuation.intrinsicValue,
  );
  const bins = 20; // Number of bins for the histogram
  const minValue = Math.min(...intrinsicValues);
  const maxValue = Math.max(...intrinsicValues);
  const binWidth = (maxValue - minValue) / bins;
  const histogramData = Array(bins).fill(0);

  intrinsicValues.forEach((value) => {
    const binIndex = Math.floor((value - minValue) / binWidth);
    histogramData[Math.min(binIndex, bins - 1)] += 1;
  });

  const histogramChartData = {
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

  // Chart options with annotation for median
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
    plugins: {
      annotation: {
        annotations: {
          medianLine: {
            type: 'line',
            scaleID: 'x',
            value: median,
            borderColor: 'red',
            borderWidth: 2,
            label: {
              content: 'Median',
              enabled: true,
              position: 'top',
            },
          },
        },
      },
    },
  };

  // Prepare data for line chart
  const lineChartData = {
    labels: results[0].yearByYearProjections.map(
      (projection) => `Year ${projection.year}`,
    ),
    datasets: [
      {
        label: 'Mean',
        data: results.map((result) => result.valuation.intrinsicValue),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: 'Median',
        data: results.map((result) => result.valuation.intrinsicValue),
        borderColor: 'rgba(192, 75, 75, 1)',
        backgroundColor: 'rgba(192, 75, 75, 0.2)',
        fill: true,
      },
      {
        label: '10th Percentile',
        data: results.map((result) => result.valuation.intrinsicValue),
        borderColor: 'rgba(75, 75, 192, 1)',
        backgroundColor: 'rgba(75, 75, 192, 0.2)',
        fill: true,
      },
      {
        label: '90th Percentile',
        data: results.map((result) => result.valuation.intrinsicValue),
        borderColor: 'rgba(75, 192, 75, 1)',
        backgroundColor: 'rgba(75, 192, 75, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div>
      <Modal show={show} onClose={onClose}>
        <Modal.Header>Monte Carlo Simulation</Modal.Header>
        <Modal.Body>
          <p>Monte Carlo simulation results:</p>
          <div className="mt-3">
            <h3 className="text-lg font-semibold">
              Intrinsic Value Distribution
            </h3>
            <Bar data={histogramChartData} options={options} />
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-semibold">Yearly Projections</h3>
            <Line data={lineChartData} options={options} />
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default MonteCarloDisplayModal;
