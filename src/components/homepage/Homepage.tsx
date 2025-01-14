import React from 'react';
import KeyValuationConcepts from './KeyValuationConcepts';
import SavedValuations from './SavedValuations';

const Homepage: React.FC = () => {
  return (
    <section>
      <div className="flex justify-center space-x-4">
        <a
          href="/eps"
          className="inline-block my-4 p-6 font-medium border-2 border-green-500 text-white bg-green-500 rounded-lg hover:bg-green-600 hover:text-white hover:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
        >
          Find Intrinsic Value using{' '}
          <span className="bg-green-100 p-2 text-black rounded">EPS</span>
        </a>
        <a
          href="/fcf"
          className="inline-block my-4 p-6 font-medium border-2 border-green-500 text-white bg-green-500 rounded-lg hover:bg-green-600 hover:text-white hover:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
        >
          Find Intrinsic Value using{' '}
          <span className="bg-green-100 p-2 text-black rounded">FCF</span>
        </a>
      </div>
      <SavedValuations />
      <KeyValuationConcepts />
    </section>
  );
};

export default Homepage;
