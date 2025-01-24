import React, { useContext } from 'react';
import { FinancialRatiosCalculator } from '../../../utils/valuations/financial-ratios/financial-ratios';
import { InvestmentContext } from '../InvestmentContext';
// import { useAppSelector } from '../../../store/sliceHooks';

interface FinancialRatiosProps {
  // data: ProjectionData;
}

const Emoji: React.FC<{ value: number }> = ({ value }) => {
  if (value < 1) {
    return <span className="pl-2">✅</span>;
  }

  return <span className="pl-2">🟡</span>;
};

const FinancialRatios: React.FC<FinancialRatiosProps> = () => {
  // const selector = useAppSelector((state) => state.simulation);
  const data = useContext(InvestmentContext);

  // const [mos, setMos] = useState<number | null>(null);
  if (!data) return null;

  const ratios = new FinancialRatiosCalculator(data);

  const priceToFCF = ratios.getPriceToFCFRatio();
  const priceToEPS = ratios.getPriceToEPSRatio();
  const priceToEarningsGrowth = ratios.getPriceToEarningsGrowth();
  const priceToIntrinsicValue = ratios.getPriceToIntrinsicValueRatio();
  const priceToMarginOfSafety = ratios.getPriceToMarginOfSafetyRatio();

  // useEffect(() => {
  //   if (selector.simulation) {
  //     // The 10th percentile can be used as the margin of safety price since
  //     // it represents a conservative estimate where only 10% of the simulations
  //     // resulted in an intrinsic value below this amount. This provides a buffer
  //     // against potential downside risks.
  //     const { median: intrinsicValue, percentile10: marginOfSafetyPrice } =
  //       selector.simulation;
  //     setValuation({
  //       intrinsicValue,
  //       marginOfSafetyPrice,
  //     });
  //   }
  // }, [selector.simulation]);

  return (
    <section className="mt-8 p-6 bg-white rounded-lg border border-blue-100 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Financial Ratios</h2>
      <p className="text-lg mb-4">
        Below are the financial ratios calculated based on the provided data.
      </p>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="text-left py-2 px-4 border-b">Ratio</th>
            <th className="text-left py-2 px-4 border-b">Value</th>
          </tr>
        </thead>
        <tbody>
          {priceToFCF !== null && (
            <tr>
              <td className="py-2 px-4 border-b">
                Price to Free Cash Flow (P/FCF)
              </td>
              <td className="py-2 px-4 border-b">{priceToFCF.toFixed(2)}</td>
            </tr>
          )}
          {priceToEPS !== null && (
            <tr>
              <td className="py-2 px-4 border-b">
                Price to Earnings per Share (P/E)
              </td>
              <td className="py-2 px-4 border-b">{priceToEPS.toFixed(2)}</td>
            </tr>
          )}
          {priceToEarningsGrowth !== null && (
            <tr>
              <td className="py-2 px-4 border-b">
                Price to Earnings Growth (PEG)
              </td>
              <td className="py-2 px-4 border-b">
                {priceToEarningsGrowth.toFixed(2)}
                {Emoji({ value: priceToEarningsGrowth })}
              </td>
            </tr>
          )}
          <tr>
            <td className="py-2 px-4 border-b">Price to Intrinsic Value</td>
            <td className="py-2 px-4 border-b">
              {priceToIntrinsicValue.toFixed(2)}
              {Emoji({ value: priceToIntrinsicValue })}
            </td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b">Price to Margin of Safety</td>
            <td className="py-2 px-4 border-b">
              {priceToMarginOfSafety.toFixed(2)}
              {Emoji({ value: priceToMarginOfSafety })}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};

export default FinancialRatios;
