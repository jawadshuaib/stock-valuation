import React from 'react';
import { Modal } from 'flowbite-react';
import { useAppSelector } from '../../../store/sliceHooks';
import { NUMBER_OF_SIMULATIONS } from '../../../utils/valuations/monte-carlo/MonteCarloIntrinsicValueCalculator';
import GrowthRateGraph from './GrowthRateGraph';
import IntrinsicValueGraph from './IntrinsicValueGraph';

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

  const {
    median,
    percentile1,
    percentile90,
    minGrowthRate,
    maxGrowthRate,
    results,
  } = simulation;

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
            <IntrinsicValueGraph results={results} />
          </div>
          <div className="mt-6">
            <p className="mb-2">
              The most conservative valuation (1st percentile) is{' '}
              <span className="font-bold">{percentile1.toFixed(2)}</span>,
              meaning only 1% of simulations resulted in an intrinsic value
              below this amount. This pessimistic scenario is used as the margin
              of safety.
            </p>
            <p className="mb-2">
              The vast majority of simulations resulted in an intrinsic value
              below <span className="font-bold">{percentile90.toFixed(2)}</span>
              . This helps to understand the potential upside in the most
              optimistic scenarios.
            </p>
            <GrowthRateGraph results={results} />
            <p>
              Growth rates were sampled from a range of{' '}
              {minGrowthRate.toFixed(2)}% to {maxGrowthRate.toFixed(2)}%. Notice
              the above distribution is clustered towards the lower range of
              growth rates - this is on purpose to simulate conservative
              valuations.
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
