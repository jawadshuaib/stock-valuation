import React from 'react';
import { ProjectionData } from '../types';
import { HalfLifeCalculator } from '../../../utils/valuations/halflife/halflife';

interface HalfLifeProps {
  data: ProjectionData;
}

export default function HalfLife({ data }: HalfLifeProps) {
  console.log(data);
  const halfLife = HalfLifeCalculator.calculateHalfLife(
    data,
    (projection) => projection[data.method],
  );

  const metric =
    data.method === 'eps'
      ? 'Price to Earnings Ratio'
      : 'Price to Free Cash Flow';
  const abv = data.method === 'eps' ? 'P/E' : 'P/FCF';

  return (
    <section className="mt-8 p-6 bg-white rounded-lg border border-blue-100 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Half Life</h2>
      <p className="text-lg mb-4">
        Another valuation technique is to see how long it would take for the
        company&apos;s {metric} to reach half of the current share price.
      </p>
      <p className="text-lg">
        The {abv} ratio will reach half of the current share price in
        approximately {halfLife} years.
      </p>
    </section>
  );
}
