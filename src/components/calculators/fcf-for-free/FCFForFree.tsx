import React, { useContext, useState } from 'react';
import { EMOJIS } from '../../ui/emojis';
import FCFIntrinsicValueCalculator from '../../../utils/valuations/fcf/FCFIntrinsicValueCalculator';
import { Button } from 'flowbite-react';
import NetCurrentAssetsModal from './NetCurrentAssetsModal';
import FCFForFreeCalculator from '../../../utils/valuations/fcf-for-free/fcf-for-free';
import { InvestmentContext } from '../InvestmentContext';
/**
 * FCFForFree Component
 *
 * This component calculates how long it would take for the projected Free Cash Flow (FCF)
 * to equal the Market Cap minus the Net Current Assets (NCAV) of an investment.
 * It essentially calculates the company's ability to generate future cash flow for free.
 *
 * @returns {JSX.Element | null} - The rendered component or null if the premium or cash flows are invalid.
 */
export default function FCFForFree() {
  const data = useContext(InvestmentContext);

  if (!data) return null;

  const prefilledMarketCap =
    data.inputs.sharePrice * (data.inputs.outstandingShares ?? 0);
  const [showModal, setShowModal] = useState(false);
  const [ncav, setNcav] = useState(0);
  const [marketCap, setMarketCap] = useState(prefilledMarketCap);

  const percentageOfMarketCapCoveredByNCAV = (
    (ncav / prefilledMarketCap) *
    100
  ).toFixed(0);

  const calculateFCFForFree = (
    mcap: number,
    currentAssets: number,
    currentLiabilities: number,
  ) => {
    const NCAV = currentAssets - currentLiabilities;
    setMarketCap(mcap);
    setNcav(NCAV);
  };

  const premium = marketCap - ncav;

  const discountRate = parseFloat(data.inputs.discountRate) / 100; // Convert percentage to decimal

  const fcfCalculator = new FCFIntrinsicValueCalculator({
    method: 'fcf',
    sharePrice: data.inputs.sharePrice,
    fcf: data.inputs.initialFCF ? data.inputs.initialFCF : 0,
    growthRate: parseFloat(data.inputs.initialGrowthRate) / 100, // Convert percentage to decimal
    terminalGrowthRate: parseFloat(data.inputs.terminalGrowthRate) / 100, // Convert percentage to decimal
    discountRate: discountRate,
    projectionYears: data.inputs.projectionYears,
    outstandingShares: data.inputs.outstandingShares ?? 0,
  });

  const projections = fcfCalculator.calculateProjections();
  const annualCashFlows = projections.map((projection) => projection.fcf);

  // If there are no annual cash flows, return null
  if (annualCashFlows.length === 0) {
    return null;
  }

  const fcfForFreeCalculator = new FCFForFreeCalculator({
    premium,
    annualCashFlows,
    discountRate,
  });

  const fcfForFreeTime = fcfForFreeCalculator.calculateFCFForFreeTime();

  // Determine the criteria for the FCF for Free time
  const getCriteria = (fcfTime: number) => {
    if (fcfTime < 5) {
      return {
        label: 'Amazing',
        style: 'text-green-600 font-bold',
        emoji: EMOJIS.rocket,
      };
    } else if (fcfTime < 7) {
      return {
        label: 'Great',
        style: 'text-blue-600 font-bold',
        emoji: EMOJIS.star,
      };
    } else if (fcfTime < 10) {
      return {
        label: 'Good',
        style: 'text-yellow-600 font-bold',
        emoji: EMOJIS.smiling,
      };
    } else if (fcfTime < 12) {
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

  const criteria = getCriteria(fcfForFreeTime);

  return (
    <section className="mt-8 p-6 bg-white rounded-lg border border-blue-100 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Free Cash Flows for Free</h2>
      <p className="text-lg mb-4">
        This valuation method measures how quickly the net present value of the
        company&apos;s projected free cash flows can potentially cover the
        difference between its market cap and net current assets. In other
        words, at what point do we get the rest of the business{' '}
        <span className="font-bold">for free</span> as the accumulated assets
        surpass the current market cap.
      </p>
      <Button onClick={() => setShowModal(true)}>
        Enter Current Assets to Calculate
      </Button>
      {ncav > 0 &&
        (fcfForFreeTime !== -1 ? (
          <section className="mt-4">
            <p className="text-lg">
              <span className="font-bold">
                {percentageOfMarketCapCoveredByNCAV}%
              </span>{' '}
              of the share price is covered by the company&apos;s net current
              assets. Higher percentages indicate a larger margin of safety.
            </p>
            <p className="text-lg mt-2">
              The <span className="italic">Free Cash Flow for Free</span> time
              for this investment is{' '}
              <span className={`p-1 rounded bg-yellow-200 font-bold`}>
                {fcfForFreeTime} years
              </span>
              . This is considered{' '}
              <span className={criteria.style}>
                {criteria.label} {criteria.emoji}
              </span>
              .
            </p>
          </section>
        ) : (
          <p className="text-lg text-red-600  mt-2">
            The company is not generating enough free cash flow to cover the
            premium within the time period analyzed.
          </p>
        ))}
      <NetCurrentAssetsModal
        prefilledMarketCap={marketCap}
        show={showModal}
        onClose={() => setShowModal(false)}
        onCalculate={calculateFCFForFree}
      />
    </section>
  );
}
