// components/PaybackTime.tsx

import React from 'react';
import PaybackTimeCalculator from '../../../utils/valuations/payback-time/payback-time';
import { ProjectionData } from '../types';
import { EMOJIS } from '../../ui/emojis';

interface PaybackTimeProps {
  data: ProjectionData;
}

const PaybackTime: React.FC<PaybackTimeProps> = ({ data }) => {
  // Extract the initial investment - which for FCF would require us to multiply with the outstanding shares
  const initialInvestment = data.inputs.outstandingShares
    ? data.inputs.sharePrice * data.inputs.outstandingShares
    : data.inputs.sharePrice;
  // Extract the annual cash flows from the data
  const annualCashFlows = data.yearByYearProjections.map((projection) =>
    data.method === 'fcf' ? projection.fcf || 0 : projection.eps || 0,
  );

  if (initialInvestment === undefined || annualCashFlows.length === 0) {
    return null;
  }

  const calculator = new PaybackTimeCalculator({
    initialInvestment,
    annualCashFlows,
  });

  const paybackTime = calculator.calculatePaybackTime();

  // Determine the criteria for payback time
  const getCriteria = (pbTime: number) => {
    if (pbTime < 4) {
      return {
        label: 'Amazing',
        style: 'text-green-600 font-bold',
        emoji: EMOJIS.rocket,
      };
    } else if (pbTime < 6) {
      return {
        label: 'Great',
        style: 'text-blue-600 font-bold',
        emoji: EMOJIS.star,
      };
    } else if (pbTime < 8) {
      return {
        label: 'Good',
        style: 'text-yellow-600 font-bold',
        emoji: EMOJIS.smiling,
      };
    } else if (pbTime < 9) {
      return {
        label: 'Okay',
        style: 'text-orange-600 font-bold',
        emoji: EMOJIS.unsure,
      };
    } else {
      return {
        label: 'Bad',
        style: 'text-red-600 font-bold',
        emoji: EMOJIS.thumbsdown,
      };
    }
  };

  const criteria = getCriteria(paybackTime);

  return (
    <section className="mt-8 p-6 bg-white rounded-lg border border-blue-100 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Payback Time Calculation</h2>
      <p className="text-lg mb-4">
        Payback time is the period it takes for an investment to generate an
        amount of cash flow sufficient to recover our initial investment.
      </p>
      <p className="text-lg mb-4">
        Publicly traded companies generally trade at much higher multiples than
        private companies. A low payback time is indicative of buying a publicly
        traded company trading as cheaply as a private company.
      </p>
      {paybackTime !== -1 ? (
        <p className="text-lg">
          The payback time for this investment is{' '}
          <span className={`p-1 rounded bg-yellow-200 font-bold`}>
            {paybackTime} years
          </span>
          . This is considered{' '}
          <span className={criteria.style}>
            {criteria.label} {criteria.emoji}
          </span>
          .
        </p>
      ) : (
        <p className="text-lg text-red-600">
          The company is not generating enough cash flow to recover the initial
          investment within the time period analyzed.
        </p>
      )}
    </section>
  );
};

export default PaybackTime;
