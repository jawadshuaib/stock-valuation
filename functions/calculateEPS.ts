import { ValidationError } from '../src/utils/valuations';
import { EPSIntrinsicValueCalculator } from '../src/utils/valuations/eps';
import { Handler } from '@netlify/functions';

interface QueryParams {
  sharePrice: string;
  eps: string;
  growthRate: string;
  terminalGrowthRate: string;
  discountRate: string;
  marginOfSafety: string;
}

export const handler: Handler = async (event) => {
  try {
    const params = event.queryStringParameters as unknown as QueryParams;
    if (!params) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing query parameters' }),
      };
    }

    // Parse query parameters
    const sharePrice = parseFloat(params.sharePrice);
    const eps = parseFloat(params.eps);
    const growthRate = parseFloat(params.growthRate) / 100;
    const terminalGrowthRate = parseFloat(params.terminalGrowthRate) / 100;
    const discountRate = parseFloat(params.discountRate) / 100;
    const marginOfSafety = parseFloat(params.marginOfSafety) / 100;

    // Validate required parameters
    if (
      isNaN(sharePrice) ||
      isNaN(eps) ||
      isNaN(growthRate) ||
      isNaN(terminalGrowthRate) ||
      isNaN(discountRate) ||
      isNaN(marginOfSafety)
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid query parameters' }),
      };
    }

    // Perform EPS calculation
    const calculator = new EPSIntrinsicValueCalculator({
      method: 'eps',
      sharePrice,
      eps,
      growthRate,
      terminalGrowthRate,
      discountRate,
      marginOfSafety,
    });

    const result = calculator.calculate();

    // Return the result as JSON
    return {
      statusCode: 200,
      body: JSON.stringify({
        intrinsic_value: result.valuation.intrinsicValue,
        margin_of_safety_price: result.valuation.marginOfSafetyPrice,
      }),
    };
  } catch (error) {
    let errorMessage = 'Calculation error';
    if (error instanceof ValidationError) {
      errorMessage = `Validation failed: ${error.errors
        .map((e) => e.message)
        .join(', ')}`;
    } else if (error instanceof Error) {
      errorMessage = `Calculation error: ${error.message}`;
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};
