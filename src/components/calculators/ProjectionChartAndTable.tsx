import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
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
  BarElement,
  Title,
  Tooltip,
  Legend,
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
  const { yearByYearProjections } = data;
  const label =
    data.method === METHODS.FCF.abv ? METHODS.FCF.label : METHODS.EPS.label;

  // Prepare data for bar chart
  const chartData = {
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
      {
        label: 'Present Value',
        data: yearByYearProjections.map(
          (projection) => projection.presentValue,
        ),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
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
      <h2>Year by Year Projected {label}</h2>
      <Bar data={chartData} options={options} />
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
                      ? projection.fcf.toFixed(2)
                      : 'N/A'
                    : projection.eps
                    ? projection.eps.toFixed(2)
                    : 'N/A'}
                </TableCell>
                <TableCell align="right">{projection.growthRate}</TableCell>
                <TableCell align="right">
                  {projection.presentValue.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ProjectionChartAndTable;
