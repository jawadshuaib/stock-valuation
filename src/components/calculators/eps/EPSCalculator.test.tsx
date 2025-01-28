/**
 * @file EPSCalculator.test.tsx
 * @description This file contains unit tests for the EPSCalculator component using React Testing Library and Jest.
 * The tests ensure that the EPSCalculator component behaves correctly when valid and invalid inputs are provided.
 */

/**
 * Test suite for the EPSCalculator component.
 * @module EPSCalculatorTests
 */

/**
 * Test case to verify that the EPSCalculator component displays valuation results after valid inputs are entered.
 * @function
 * @name displaysValuationResultsAfterValidInputs
 * @async
 * @returns {Promise<void>}
 */

/**
 * Test case to verify that the EPSCalculator component shows an error message if invalid inputs are provided.
 * @function
 * @name showsErrorMessageIfInvalidInputs
 * @async
 * @returns {Promise<void>}
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import EPSCalculator from './EPSCalculator';
import store from '../../../store/store';

describe('EPSCalculator component', () => {
  it('displays valuation results after valid inputs are entered', async () => {
    render(
      <Router>
        <ReduxProvider store={store}>
          <EPSCalculator />
        </ReduxProvider>
      </Router>,
    );

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText(/Price per share/i), {
      target: { value: '100' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Earnings per share/i), {
      target: { value: '5' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Expected growth rate/i), {
      target: { value: '5' },
    });
    fireEvent.change(
      screen.getByPlaceholderText(/Growth rate after projection period/i),
      {
        target: { value: '2' },
      },
    );
    fireEvent.change(screen.getByPlaceholderText(/Required rate of return/i), {
      target: { value: '10' },
    });

    // Check for a rendered valuation outcome from ValuationResults
    // The component might take a moment to render results, so consider findByText if necessary
    expect(await screen.findByText(/Valuation Results/i)).toBeInTheDocument();
    expect(screen.getByText(/Margin of Safety Price/i)).toBeInTheDocument();
  });

  it('shows an error message if invalid inputs are provided', async () => {
    render(
      <Router>
        <ReduxProvider store={store}>
          <EPSCalculator />
        </ReduxProvider>
      </Router>,
    );

    // Enter some invalid inputs
    fireEvent.change(screen.getByPlaceholderText(/Price per share/i), {
      target: { value: '10' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Earnings per Share/i), {
      target: { value: '10' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Expected growth rate/i), {
      target: { value: '3' },
    });
    fireEvent.change(
      screen.getByPlaceholderText(/Growth rate after projection period/i),
      {
        target: { value: '2' },
      },
    );
    fireEvent.change(screen.getByPlaceholderText(/Required Rate of Return/i), {
      target: { value: '1' },
    });

    // Print the DOM to debug
    // screen.debug();

    // Expect an error or no valuation results
    expect(await screen.findByText(/Calculation error/i)).toBeInTheDocument();
  });
});
