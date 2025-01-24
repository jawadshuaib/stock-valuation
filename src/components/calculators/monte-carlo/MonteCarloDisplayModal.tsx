import React from 'react';
import { Modal } from 'flowbite-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { useAppSelector } from '../../../store/sliceHooks';
import { NUMBER_OF_SIMULATIONS } from '../../../utils/valuations/monte-carlo/MonteCarloIntrinsicValueCalculator';

// Register Chart.js components and plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
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

  const { median, percentile10, percentile90, results } = simulation;

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
            type: 'line' as const,
            scaleID: 'x',
            value: median,
            borderColor: 'red',
            borderWidth: 2,
            label: {
              content: 'Median',
              enabled: true,
              position: 'end' as const,
            },
          },
        },
      },
    },
  };

  return (
    <div>
      <Modal show={show} onClose={onClose} dismissible>
        <Modal.Header>Monte Carlo Simulation</Modal.Header>
        <Modal.Body>
          <p className="mb-4">
            This discounted cash flow was simulated a total of{' '}
            {NUMBER_OF_SIMULATIONS.toLocaleString('en-US')} times with varying
            values for growth, terminal, and discount rates to arrive at the
            most reasonable valuation.
          </p>
          <p className="mb-4">
            From the resultant distribution, we picked the median intrinsic
            value of{' '}
            <span className="p-1 bg-yellow-200 font-bold rounded-md">
              {median.toFixed(2)}
            </span>{' '}
            as the best representative of the dataset.
          </p>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">
              Intrinsic Value Distribution
            </h3>
            <Bar data={histogramChartData} options={options} />
          </div>
          <div className="mt-6">
            <p className="mb-2">
              The most conservative valuation (1st percentile) is{' '}
              <span className="font-bold">{percentile10.toFixed(2)}</span>,
              meaning only 1% of simulations resulted in an intrinsic value
              below this amount. This pessimistic scenario is used as the margin
              of safety.
            </p>
            <p>
              The vast majority of simulations resulted in an intrinsic value
              below <span className="font-bold">{percentile90.toFixed(2)}</span>
              . This helps to understand the potential upside in the most
              optimistic scenarios.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <p>
            Link to the{' '}
            <a
              href="https://github.com/jawadshuaib/stock-valuation/blob/main/documentation/MonteCarloExplanation.md"
              className="underline hover:no-underline hover:text-blue-600"
              target="_blank"
              rel="noreferrer"
            >
              mathematical explanation
            </a>{' '}
            for the Monte Carlo simulation above.
          </p>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MonteCarloDisplayModal;
