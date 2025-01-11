import React from 'react';
import { ProjectionData } from '../types';
import OwnerEarningsYieldCalculator from '../../../utils/valuations/owner-earnings/owner-earnings';

const OwnerEarningsYield: React.FC<{ data: ProjectionData }> = ({ data }) => {
  const ownerEarningsYield = new OwnerEarningsYieldCalculator(data);
  const ownerEarnings = ownerEarningsYield.calculateOwnerEarnings();
  const yieldResult = ownerEarningsYield.calculateYield();

  return (
    <div>
      <h2>Owner Earnings Yield Calculator</h2>
      {ownerEarnings !== null && (
        <div>
          <h3>Owner Earnings: ${ownerEarnings.toFixed(2)}</h3>
        </div>
      )}
      {yieldResult !== null && (
        <div>
          <h3>Owner Earnings Yield: {yieldResult.toFixed(2)}%</h3>
        </div>
      )}
    </div>
  );
};

export default OwnerEarningsYield;
