import React, { useContext } from 'react';
import OwnerEarningsYieldCalculator from '../../../utils/valuations/owner-earnings/owner-earnings';
import { InvestmentContext } from '../InvestmentContext';

const OwnerEarningsYield: React.FC = () => {
  const data = useContext(InvestmentContext);

  if (!data) return null;

  const ownerEarningsYield = new OwnerEarningsYieldCalculator(data);
  const yieldResult = ownerEarningsYield.calculateYield();
  const discountRate = parseFloat(data.inputs.discountRate.toString());

  if (!yieldResult) {
    return null;
  }

  const isGoodYield = yieldResult > discountRate;
  const messageClass = isGoodYield ? '' : '';
  const messageText = isGoodYield
    ? 'which is great since it is higher than the discount rate.'
    : 'which is below the discount rate so not ideal.';

  return (
    <section className="mt-4 p-6 bg-white rounded-lg border border-blue-100 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">
        Estimated Owner Earnings Yield
      </h2>
      <p className="text-lg mb-4">
        Owner Earnings represent the cash flow a business generates after
        accounting for all necessary expenses and reinvestments required to
        maintain its operations and ensure sustainable growth. In essence, they
        are the true free cash flows available to the business owners or
        shareholders.
      </p>
      <p className="text-lg mb-4">
        To make this clearer, consider the example of a landlord: The Owner
        Earnings Yield could be thought of as the percentage of the total value
        of the property that the landlord receives as net rental income after
        deducting maintenance costs, taxes, and other expenses. It’s the
        landlord’s true take-home income from the property, relative to its
        value.
      </p>
      <p className="text-lg mb-4">
        For a company, Owner Earnings belong to the shareholders. When these
        earnings are retained, they increase shareholder equity, enhancing the
        value of their ownership in the business.
      </p>
      <p className="text-lg mb-4">
        The owner earnings yield for this business is{' '}
        <span className="font-bold p-1 rounded bg-yellow-200">
          {yieldResult.toFixed(2)}%
        </span>{' '}
        <span className={`${messageClass}`}>{messageText}</span>
      </p>
      <p className="text-lg">
        Note that the yield calculated here uses Free Cash Flow (FCF) as a proxy
        for the actual Owner Earnings. This approach provides an estimate since
        it does not capture all non-cash expenses and working capital
        adjustments that Owner Earnings would typically include.
      </p>
    </section>
  );
};

export default OwnerEarningsYield;
