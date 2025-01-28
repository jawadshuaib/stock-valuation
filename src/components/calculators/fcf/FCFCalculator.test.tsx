/**
 * @file FCFCalculator.test.tsx
 * @description This file contains test cases for the FCFCalculator component using React Testing Library and Jest.
 * It tests the component's behavior when valid and invalid inputs are provided.
 *
 * @module FCFCalculatorTest
 */

/**
 * @test FCFCalculator component
 * @description Test suite for the FCFCalculator component.
 */

/**
 * @test
 * @name displays valuation results after valid inputs are entered
 * @description This test case verifies that the FCFCalculator component displays valuation results when valid inputs are entered.
 * It fills out the form with valid data and checks for the presence of valuation results and margin of safety price.
 */

/**
 * @test
 * @name shows an error message if invalid inputs are provided
 * @description This test case verifies that the FCFCalculator component shows an error message when invalid inputs are provided.
 * It fills out the form with invalid data and checks for the presence of a calculation error message.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import FCFCalculator from './FCFCalculator';
import store from '../../../store/store';

describe('FCFCalculator component', () => {
  it('displays valuation results after valid inputs are entered', async () => {
    render(
      <Router>
        <ReduxProvider store={store}>
          <FCFCalculator />
        </ReduxProvider>
      </Router>,
    );

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText(/Price per share/i), {
      target: { value: '100' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Free cash flow/i), {
      target: { value: '50000' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Total outstanding shares/i), {
      target: { value: '1000' },
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
    expect(await screen.findByText(/valuation results/i)).toBeInTheDocument();

    expect(screen.getByText(/margin of safety price/i)).toBeInTheDocument();
  });

  it('shows an error message if invalid inputs are provided', async () => {
    render(
      <Router>
        <ReduxProvider store={store}>
          <FCFCalculator />
        </ReduxProvider>
      </Router>,
    );

    // Invalid input for terminal rate
    fireEvent.change(screen.getByPlaceholderText(/Price per share/i), {
      target: { value: '10' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Free cash flow/i), {
      target: { value: '2' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Total outstanding shares/i), {
      target: { value: '1' },
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
    fireEvent.change(screen.getByPlaceholderText(/Required rate of return/i), {
      target: { value: '1' },
    });

    // Print the DOM to debug
    // screen.debug();

    // Expect an error or no valuation
    expect(await screen.findByText(/Calculation error/i)).toBeInTheDocument();
  });
});
