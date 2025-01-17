import { ValidationError } from '../src/utils/valuations';
import { FCFIntrinsicValueCalculator } from '../src/utils/valuations/fcf';
import { Handler } from '@netlify/functions';

interface QueryParams {
  sharePrice: string;
  fcf: string;
  growthRate: string;
  terminalGrowthRate: string;
  discountRate: string;
  marginOfSafety: string;
  outstandingShares: string;
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
    const fcf = parseFloat(params.fcf);
    const growthRate = parseFloat(params.growthRate) / 100;
    const terminalGrowthRate = parseFloat(params.terminalGrowthRate) / 100;
    const discountRate = parseFloat(params.discountRate) / 100;
    const marginOfSafety = parseFloat(params.marginOfSafety) / 100;
    const outstandingShares = parseFloat(params.outstandingShares);

    // Validate required parameters
    if (
      isNaN(sharePrice) ||
      isNaN(fcf) ||
      isNaN(growthRate) ||
      isNaN(terminalGrowthRate) ||
      isNaN(discountRate) ||
      isNaN(marginOfSafety) ||
      isNaN(outstandingShares)
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid query parameters' }),
      };
    }

    // Perform FCF calculation
    const calculator = new FCFIntrinsicValueCalculator({
      method: 'fcf',
      sharePrice,
      fcf,
      growthRate,
      terminalGrowthRate,
      discountRate,
      marginOfSafety,
      outstandingShares,
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
