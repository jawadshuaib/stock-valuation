// components/PaybackTime.tsx

import React from 'react';
import PaybackTimeCalculator from '../../../utils/valuations/payback-time/paybacktime';
import { ProjectionData } from '../types';

interface PaybackTimeProps {
  sharePrice: number;
  data: ProjectionData;
}

const PaybackTime: React.FC<PaybackTimeProps> = ({ data, sharePrice }) => {
  const initialInvestment = sharePrice;
  const annualCashFlows = data.yearByYearProjections.map((projection) =>
    data.method === 'fcf' ? projection.fcf || 0 : projection.eps || 0,
  );

  if (initialInvestment === undefined) {
    return <div>Please provide a valid initial investment.</div>;
  }

  const calculator = new PaybackTimeCalculator({
    initialInvestment,
    annualCashFlows,
  });

  const paybackTime = calculator.calculatePaybackTime();

  return (
    <div>
      <h2>Payback Time Calculation</h2>
      {paybackTime !== -1 ? (
        <p>The payback time is {paybackTime} years.</p>
      ) : (
        <p>The payback time is not achievable with the provided cash flows.</p>
      )}
    </div>
  );
};

export default PaybackTime;
