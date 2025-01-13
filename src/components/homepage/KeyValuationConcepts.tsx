import React from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

const Chicklet = function ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-100">
      <h4 className="font-medium text-slate-600 mb-2">{title}</h4>
      <p className="text-gray-600">{children}</p>
    </div>
  );
};

export default function KeyValuationConcepts() {
  return (
    <section>
      <article className="mt-2 p-8 bg-gray-50 rounded-xl border border-gray-200">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Key Valuation Concepts
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Chicklet title="Present Value">
                Future cash flows discounted to today&apos;s value
              </Chicklet>
              <Chicklet title="Growth Decay">
                Recognition that{' '}
                <a
                  href="https://github.com/jawadshuaib/stock-valuation/blob/main/documentation/GrowthRateDecayExplanation.md"
                  className="hover:text-blue-500 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  high growth rates naturally decline
                </a>{' '}
                over time
              </Chicklet>
              <Chicklet title="Terminal Value">
                Company&apos;s value beyond the projection period
              </Chicklet>
              <Chicklet title="Margin of Safety">
                Buffer against estimation errors
              </Chicklet>
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
                  <BlockMath math="Present Value = \dfrac{FV}{(1 + r)^n}" />
                  <BlockMath math="Growth\ Decay = g_T + (g_0 - g_T) \cdot e^{-kt}" />
                  <BlockMath math="Terminal Value = Future Value \cdot \dfrac{1 + g}{r - g}" />
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
