import React from 'react';
import { Link } from 'react-router-dom';
import KeyValuationConcepts from './KeyValuationConcepts';
import SavedValuations from './SavedValuations';

const Homepage: React.FC = () => {
  return (
    <section>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Comprehensive Stock Valuation Tool
      </h2>
      {/* <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Analyze and Calculate Intrinsic Value using DCF Methodology
      </h3> */}
      <article className="">
        <span className="bg-yellow-200 p-1 rounded ">
          Determine what a stock is worth.
        </span>{' '}
        This tool discounts future cash flows to their present value using both
        Earnings Per Share (EPS) and Free Cash Flow (FCF) to arrive at the
        intrinsic value of a stock.
      </article>
      <div className="flex justify-center space-x-4">
        <Link
          to="/eps"
          className="inline-block my-4 p-6 font-medium border-2 border-green-500 text-white bg-green-500 rounded-lg hover:bg-green-600 hover:text-white hover:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
        >
          Find Intrinsic Value using{' '}
          <span className="bg-green-100 p-2 text-black rounded">EPS</span>
        </Link>
        <Link
          to="/fcf"
          className="inline-block my-4 p-6 font-medium border-2 border-green-500 text-white bg-green-500 rounded-lg hover:bg-green-600 hover:text-white hover:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
        >
          Find Intrinsic Value using{' '}
          <span className="bg-green-100 p-2 text-black rounded">FCF</span>
        </Link>
      </div>
      <SavedValuations />
      <KeyValuationConcepts />
    </section>
  );
};

export default Homepage;
