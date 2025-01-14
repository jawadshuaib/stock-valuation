import React from 'react';

export default function Header() {
  return (
    <header className="mb-4">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Comprehensive Stock Valuation Tool
      </h2>
      <article className="">
        <span className="bg-yellow-200 p-1 rounded ">
          Determine what a stock is worth.
        </span>{' '}
        This tool discounts future cash flows to their present value using both
        Earnings Per Share (EPS) and Free Cash Flow (FCF) to arrive at the
        intrinsic value of a stock.
      </article>
    </header>
  );
}
