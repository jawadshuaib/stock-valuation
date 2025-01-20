import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { ProjectionData } from './types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export const METHODS = {
  EPS: {
    abv: 'eps',
    label: 'Earnings per Share',
  },
  FCF: {
    abv: 'fcf',
    label: 'Free Cash Flow',
  },
};

interface ProjectionChartAndTableProps {
  data: ProjectionData;
}

const ProjectionChartAndTable = ({ data }: ProjectionChartAndTableProps) => {
  const { yearByYearProjections, terminalValueAnalysis, valuation } = data;
  const label =
    data.method === METHODS.FCF.abv ? METHODS.FCF.label : METHODS.EPS.label;

  // Prepare data for bar chart
  const barChartData = {
    labels: yearByYearProjections.map(
      (projection) => `Year ${projection.year}`,
    ),
    datasets: [
      {
        label,
        data: yearByYearProjections.map((projection) =>
          data.method === METHODS.FCF.abv ? projection.fcf : projection.eps,
        ),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  // Prepare data for line chart
  const lineChartData = {
    labels: yearByYearProjections.map(
      (projection) => `Year ${projection.year}`,
    ),
    datasets: [
      {
        label: 'Growth Rate (%)',
        data: yearByYearProjections.map((projection) => projection.growthRate),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <p className="mt-3">
        The following illustrates the projected {label} over a period of{' '}
        {yearByYearProjections.length} years. We discount the projected and
        terminal value for each year back to the present and arrive at the
        intrinsic value.
      </p>
      <Bar data={barChartData} options={options} />
      <p className="mt-3">
        The following chart shows the decay in the projected growth rate over
        the same period.
      </p>
      <Line data={lineChartData} options={options} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Year</TableCell>
              <TableCell align="right">{label}</TableCell>
              <TableCell align="right">Growth Rate (%)</TableCell>
              <TableCell align="right">Present Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {yearByYearProjections.map((projection) => (
              <TableRow key={projection.year}>
                <TableCell component="th" scope="row">
                  {projection.year}
                </TableCell>
                <TableCell align="right">
                  {data.method === METHODS.FCF.abv
                    ? projection.fcf
                      ? projection.fcf.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })
                      : 'N/A'
                    : projection.eps
                    ? projection.eps.toFixed(2)
                    : 'N/A'}
                </TableCell>
                <TableCell align="right">{projection.growthRate}</TableCell>
                <TableCell align="right">
                  {projection.presentValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell component="th" scope="row" colSpan={3}>
                Total Present Value
              </TableCell>
              <TableCell align="right">
                {valuation.presentValueOfCashFlows.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row" colSpan={3}>
                Present Value of Terminal Value
              </TableCell>
              <TableCell align="right">
                {terminalValueAnalysis.presentValueOfTerminal.toLocaleString(
                  undefined,
                  { minimumFractionDigits: 2 },
                )}
              </TableCell>
            </TableRow>
            {data.method === METHODS.FCF.abv && (
              <TableRow>
                <TableCell component="th" scope="row" colSpan={3}>
                  Total Intrinsic Value (Present + Terminal Value)
                </TableCell>
                <TableCell align="right">
                  {(
                    valuation.presentValueOfCashFlows +
                    terminalValueAnalysis.presentValueOfTerminal
                  ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell component="th" scope="row" colSpan={3}>
                Intrinsic Value per Share
              </TableCell>
              <TableCell align="right">
                {valuation.intrinsicValue.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ProjectionChartAndTable;
