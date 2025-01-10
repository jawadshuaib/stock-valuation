import React from 'react';
import { Link } from 'react-router-dom';
import KeyValuationConcepts from './KeyValuationConcepts';

const Home: React.FC = () => {
  return (
    <section>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Stock Valuation Calculator
      </h2>
      <article className="">
        The Intrinsic Value represents what we think the stock is worth today,
        considering all future cash flows brought back to present value. The
        Margin of Safety Price provides a lower target price that includes a
        buffer against potential estimation errors.
      </article>
      <div className="flex justify-center space-x-4">
        <Link
          to="/eps"
          className="inline-block my-4 p-6 font-medium border-2 border-blue-500 text-white bg-blue-500 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Find Intrinsic Value using <span className="underline">EPS</span>
        </Link>
        <Link
          to="/fcf"
          className="inline-block my-4 p-6 font-medium border-2 border-blue-500 text-white bg-blue-500 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Find Intrinsic Value using <span className="underline">FCF</span>
        </Link>
      </div>
      <KeyValuationConcepts />
    </section>
  );
};

export default Home;
