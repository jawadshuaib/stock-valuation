import React from 'react';
import KeyValuationConcepts from './KeyValuationConcepts';
import SavedValuations from './SavedValuations';

const Homepage: React.FC = () => {
  return (
    <section>
      <div className="flex flex-col md:flex-row justify-center md:space-x-2">
        <a
          href="/eps"
          className="flex-1 inline-block my-1 md:my-4 p-4 md:p-6 font-medium border-2 border-green-500 text-white bg-green-500 rounded-lg hover:bg-green-600 hover:text-white hover:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 text-center"
        >
          Find Intrinsic Value using{' '}
          <span className="bg-green-100 p-1 md:p-2 text-black rounded">
            EPS
          </span>
        </a>
        <a
          href="/fcf"
          className="flex-1 inline-block my-1 md:my-4 p-4 md:p-6 font-medium border-2 border-green-500 text-white bg-green-500 rounded-lg hover:bg-green-600 hover:text-white hover:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 text-center"
        >
          Find Intrinsic Value using{' '}
          <span className="bg-green-100 p-1 md:p-2 text-black rounded">
            FCF
          </span>
        </a>
      </div>
      <SavedValuations />
      <KeyValuationConcepts />
    </section>
  );
};

export default Homepage;
