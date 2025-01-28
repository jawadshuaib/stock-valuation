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
    fireEvent.change(screen.getByPlaceholderText(/Price per Share/i), {
      target: { value: '100' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Free Cash Flow/i), {
      target: { value: '50000' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Total Outstanding Shares/i), {
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
    fireEvent.change(screen.getByPlaceholderText(/Required Rate of Return/i), {
      target: { value: '10' },
    });

    // Check for a rendered valuation outcome from ValuationResults
    // The component might take a moment to render results, so consider findByText if necessary
    expect(await screen.findByText(/Valuation Results/i)).toBeInTheDocument();

    expect(screen.getByText(/Margin of Safety Price/i)).toBeInTheDocument();
  });

  // it('shows an error message if invalid inputs are provided', async () => {
  //   render(
  //     <Router>
  //       <ReduxProvider store={store}>
  //         <FCFCalculator />
  //       </ReduxProvider>
  //     </Router>,
  //   );

  //   // Enter some invalid inputs
  //   fireEvent.change(screen.getByPlaceholderText(/Price per share/i), {
  //     target: { value: '0' },
  //   });

  //   // Print the DOM to debug
  //   screen.debug();

  //   // Expect an error or no valuation
  //   // If your component immediately shows an error, look for that text
  //   // Adjust the message check as needed
  //   expect(await screen.findByText(/Calculation error/i)).toBeInTheDocument();
  // });
});
