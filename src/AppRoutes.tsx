import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from './components/homepage/Homepage';
import EPSCalculator from './components/calculators/eps/EPSCalculator';
import FCFCalculator from './components/calculators/fcf/FCFCalculator';
import PrivacyPolicy from './components/privacy-policy/PrivacyPolicy';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/eps" element={<EPSCalculator />} />
      <Route path="/fcf" element={<FCFCalculator />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    </Routes>
  );
};

export default AppRoutes;
