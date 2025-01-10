import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import EPSCalculator from './components/EPSCalculator'; // Ensure this is the correct path
import FCFCalculator from './components/FCFCalculator';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/eps" element={<EPSCalculator />} />
      <Route path="/fcf" element={<FCFCalculator />} />
    </Routes>
  );
};

export default AppRoutes;
