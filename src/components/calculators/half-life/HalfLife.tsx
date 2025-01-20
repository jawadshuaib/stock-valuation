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

  // const metric =
  //   data.method === 'eps'
  //     ? 'Price to Earnings Ratio'
  //     : 'Price to Free Cash Flow';
  // const abv = data.method === 'eps' ? 'P/E' : 'P/FCF';

  if (halfLife === -1) return null;

  return (
    <section className="mt-8 p-6 bg-white rounded-lg border border-blue-100 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Half Life</h2>
      <p className="text-lg mb-4">
        A company may be trading at high multiples today, but its growth
        trajectory might justify the valuation. An investor can use time
        arbitrage to their advantage by estimating how quickly this investment
        becomes cheaper.
      </p>
      <p className="text-lg mb-4">
        The Half Life valuation technique estimates the time it will take for
        the investment to become twice as cheap.
      </p>
      <p className="text-lg mb-4">
        Companies with a half life of less than 10 years are considered to have
        high growth potential relative to price. Overtime, we expect the market
        to realize the company&apos;s true worth.{' '}
      </p>
      <p className="bg-yellow-200 p-1 rounded">
        This investment has a half life of{' '}
        <span className="font-bold">{halfLife} years</span>, which is excellent!
        ✅
      </p>
    </section>
  );
}
