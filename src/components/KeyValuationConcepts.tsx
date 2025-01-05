import React from 'react';

export default function KeyValuationConcepts() {
  return (
    <section>
      <article className="mt-4 text-xs text-gray-500">
        The Intrinsic Value represents what we think the stock is worth today,
        considering all future cash flows brought back to present value. The
        Margin of Safety Price provides a lower target price that includes a
        buffer against potential estimation errors.
      </article>

      <article className="mt-2 p-8 bg-gray-50 rounded-xl border border-gray-200">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Key Valuation Concepts
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-white rounded-lg border border-gray-100">
                <h4 className="font-medium text-blue-600 mb-2">
                  Present Value
                </h4>
                <p className="text-gray-600">
                  Future cash flows discounted to today&apos;s value
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-100">
                <h4 className="font-medium text-blue-600 mb-2">Growth Decay</h4>
                <p className="text-gray-600">
                  Recognition that high growth rates naturally decline over time
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-100">
                <h4 className="font-medium text-blue-600 mb-2">
                  Terminal Value
                </h4>
                <p className="text-gray-600">
                  Company&apos;s value beyond the projection period
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-100">
                <h4 className="font-medium text-blue-600 mb-2">
                  Margin of Safety
                </h4>
                <p className="text-gray-600">
                  Buffer against estimation errors
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Mathematical Foundation
            </h3>
            <div className="space-y-4 bg-white p-6 rounded-lg border border-gray-100">
              <div className="space-y-2">
                <div className="font-medium text-gray-700">Core Formulas:</div>
                <div className="pl-4 space-y-2 font-mono text-sm">
                  <p>Present Value = FutureValue / (1 + r)^n</p>
                  <p>
                    Growth Decay = TerminalGrowth + (InitialGrowth -
                    TerminalGrowth) * e^(-kt)
                  </p>
                  <p>Terminal Value = FinalEPS * (1 + g) / (r - g)</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="font-medium text-gray-700 mb-2">Where:</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
                  <div>r = discount rate</div>
                  <div>n = number of years</div>
                  <div>g = growth rate</div>
                  <div>k = decay factor</div>
                  <div>t = time in years</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
