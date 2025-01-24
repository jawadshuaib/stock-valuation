import { ValidationError } from '../src/utils/valuations';
import { FCFIntrinsicValueCalculator } from '../src/utils/valuations/fcf';
import { Handler } from '@netlify/functions';
import { ProjectionData } from '../src/components/calculators/types';

interface QueryParams {
  sharePrice: string;
  fcf: string;
  growthRate: string;
  terminalGrowthRate?: string;
  discountRate?: string;
  marginOfSafety?: string;
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

    const {
      sharePrice,
      fcf,
      growthRate,
      terminalGrowthRate = '3',
      discountRate = '10',
      marginOfSafety = '50',
      outstandingShares,
    } = params;

    const missingParams = [];
    if (!sharePrice) missingParams.push('sharePrice');
    if (!fcf) missingParams.push('fcf');
    if (!growthRate) missingParams.push('growthRate');
    if (!outstandingShares) missingParams.push('outstandingShares');

    if (missingParams.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: `Missing query parameters: ${missingParams.join(', ')}`,
        }),
      };
    }

    if (
      isNaN(Number(sharePrice)) ||
      isNaN(Number(fcf)) ||
      isNaN(Number(growthRate)) ||
      isNaN(Number(terminalGrowthRate)) ||
      isNaN(Number(discountRate)) ||
      isNaN(Number(marginOfSafety)) ||
      isNaN(Number(outstandingShares))
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid query parameters' }),
      };
    }

    const calculator = new FCFIntrinsicValueCalculator({
      method: 'fcf',
      sharePrice: Number(sharePrice),
      fcf: Number(fcf),
      growthRate: Number(growthRate),
      terminalGrowthRate: Number(terminalGrowthRate),
      discountRate: Number(discountRate),
      marginOfSafety: Number(marginOfSafety),
      outstandingShares: Number(outstandingShares),
    });

    const result: ProjectionData = calculator.calculate();

    return {
      statusCode: 200,
      body: JSON.stringify(result),
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
