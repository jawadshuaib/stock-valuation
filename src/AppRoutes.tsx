import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from './components/homepage/Homepage';
import EPSCalculator from './components/calculators/eps/EPSCalculator'; // Ensure this is the correct path
import FCFCalculator from './components/calculators/fcf/FCFCalculator';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/eps" element={<EPSCalculator />} />
      <Route path="/fcf" element={<FCFCalculator />} />
    </Routes>
  );
};

export default AppRoutes;
