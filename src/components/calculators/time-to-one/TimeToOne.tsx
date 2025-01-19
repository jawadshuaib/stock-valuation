import React from 'react';
import { ProjectionData } from '../types';
import { TimeToOneCalculator } from '../../../utils/valuations/time-to-one/time-to-one';

interface TimesToOneProps {
  data: ProjectionData;
}

export default function TimeToOne({ data }: TimesToOneProps) {
  console.log(data);
  const timeToOne = TimeToOneCalculator.calculateTimeToPEOne(data);

  const metric =
    data.method === 'eps'
      ? 'Price to Earnings Ratio'
      : 'Price to Free Cash Flow';
  const abv = data.method === 'eps' ? 'P/E' : 'P/FCF';

  return (
    <section className="mt-8 p-6 bg-white rounded-lg border border-blue-100 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Time to One</h2>
      <p className="text-lg mb-4">
        Another valuation technique is to see how long it would take for the
        company&apos;s {data.method} to reach the current share price.
      </p>
      <p className="text-lg mb-4">
        It is estimated that it will take{' '}
        <span className="font-bold">
          {timeToOne} year{timeToOne > 1 ? 's' : ''}
        </span>{' '}
        for the {abv} to reach one - afterwhich the company&apos;s {data.method}{' '}
        will equal its current share price.
      </p>
      <p className="text-lg mb-4">
        Note it is not the goal of our investment to reach {metric} of 1 but
        rather to view this ratio objectively once growth has been taken into
        account. An investor can decide whether the expected{' '}
        <span className="italic">Time to One</span> is justified
      </p>
    </section>
  );
}
