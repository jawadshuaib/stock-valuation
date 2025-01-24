import { ValidationError } from '../src/utils/valuations';
import { EPSIntrinsicValueCalculator } from '../src/utils/valuations/eps';
import { Handler } from '@netlify/functions';
import { ProjectionData } from '../src/components/calculators/types';

interface QueryParams {
  sharePrice: string;
  eps: string;
  growthRate: string;
  terminalGrowthRate?: string;
  discountRate?: string;
  marginOfSafety?: string;
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
      eps,
      growthRate,
      terminalGrowthRate = '3',
      discountRate = '10',
      marginOfSafety = '50',
    } = params;

    const missingParams = [];
    if (!sharePrice) missingParams.push('sharePrice');
    if (!eps) missingParams.push('eps');
    if (!growthRate) missingParams.push('growthRate');

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
      isNaN(Number(eps)) ||
      isNaN(Number(growthRate)) ||
      isNaN(Number(terminalGrowthRate)) ||
      isNaN(Number(discountRate)) ||
      isNaN(Number(marginOfSafety))
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid query parameters' }),
      };
    }

    const calculator = new EPSIntrinsicValueCalculator({
      method: 'eps',
      sharePrice: Number(sharePrice),
      eps: Number(eps),
      growthRate: Number(growthRate),
      terminalGrowthRate: Number(terminalGrowthRate),
      discountRate: Number(discountRate),
      marginOfSafety: Number(marginOfSafety),
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
