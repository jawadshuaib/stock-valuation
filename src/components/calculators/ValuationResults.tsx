import React, { useEffect } from 'react';
import { ValuationData } from './types';
import { NUMBER_OF_SIMULATIONS } from '../../utils/valuations/monte-carlo/MonteCarloIntrinsicValueCalculator';
import MonteCarloDisplayModal from './monte-carlo/MonteCarloDisplayModal';
import { useAppSelector } from '../../store/sliceHooks';
import { Tooltip } from 'flowbite-react';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function ValuationResults() {
  const selector = useAppSelector((state) => state.simulation);
  const [openModal, setOpenModal] = React.useState(false);
  const [valuation, setValuation] = React.useState<ValuationData | null>(null);

  useEffect(() => {
    if (selector.simulation) {
      // The 10th percentile can be used as the margin of safety price since
      // it represents a conservative estimate where only 10% of the simulations
      // resulted in an intrinsic value below this amount. This provides a buffer
      // against potential downside risks.
      const { median: intrinsicValue, percentile10: marginOfSafetyPrice } =
        selector.simulation;
      setValuation({
        intrinsicValue,
        marginOfSafetyPrice,
      });
    }
  }, [selector.simulation]);

  const theme = {
    title: 'Valuation Results',
    style: 'from-green-50 to-lime-50 border-green-100',
    description: (
      <>
        Valuation created after{' '}
        <span
          className="underline cursor-pointer hover:no-underline hover:text-blue-600"
          onClick={() => setOpenModal(true)}
        >
          simulating {NUMBER_OF_SIMULATIONS.toLocaleString('en-US')} scenarios
        </span>{' '}
        for the discounted cash flow!
      </>
    ),
  };

  if (!valuation) return null;

  return (
    <section
      className={`${theme.style} mt-8 p-6 bg-gradient-to-br rounded-xl border shadow-sm`}
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {theme.title}
      </h2>
      <div className="space-y-4">
        <div className="p-4 bg-white rounded-lg shadow-sm border border-blue-100">
          <div className="text-sm font-medium text-gray-500 mb-1">
            Intrinsic Value
          </div>
          <div className="text-3xl font-bold text-blue-600">
            ${valuation.intrinsicValue.toFixed(2)}
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-sm border border-blue-100">
          <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
            <span>Margin of Safety Price</span>
            <Tooltip
              content="The margin of safety is determined statistically using the 10th percentile of the Monte Carlo simulations."
              style="light"
            >
              <i className="fas fa-info-circle ml-1 cursor-pointer"></i>
            </Tooltip>
          </div>
          <div className="text-3xl font-bold text-green-600">
            ${valuation.marginOfSafetyPrice.toFixed(2)}
          </div>
        </div>
        <p className="text-sm text-gray-600">{theme.description}</p>
      </div>
      {openModal && (
        <MonteCarloDisplayModal
          show={openModal}
          onClose={() => setOpenModal(false)}
        />
      )}
    </section>
  );
}
