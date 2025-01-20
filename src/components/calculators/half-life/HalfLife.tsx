import React from 'react';
import { ProjectionData } from '../types';
import { HalfLifeCalculator } from '../../../utils/valuations/half-life/half-life';

interface HalfLifeProps {
  data: ProjectionData;
}

export default function HalfLife({ data }: HalfLifeProps) {
  const halfLife = HalfLifeCalculator.calculateHalfLife(
    data,
    (projection) => projection[data.method],
  );

  const metric =
    data.method === 'eps'
      ? 'Price to Earnings Ratio'
      : 'Price to Free Cash Flow';
  // const abv = data.method === 'eps' ? 'P/E' : 'P/FCF';

  if (halfLife === -1) return null;

  return (
    <section className="mt-8 p-6 bg-white rounded-lg border border-blue-100 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Half Life</h2>
      <p className="text-lg mb-4">
        The Half Life valuation technique estimates the time it will take for
        the company&apos;s {metric} to reduce to half of its current value. This
        measure helps investors understand the rate at which a company&apos;s
        valuation metrics are improving, providing insight into the
        company&apos;s future performance.
      </p>
      <p className="text-lg">
        Companies with a half life of less than 10 years are considered to have
        a high growth potential relative to price, while those with a half life
        of more than 10 years are considered to be mature companies with stable
        growth. This investment has a half life of {halfLife} years. Which is
        great! ✅
      </p>
    </section>
  );
}
