// src/components/BackButton.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className="mb-5">
      <button
        onClick={handleBackClick}
        className="bg-slate-100 hover:bg-slate-500 hover:text-white text-slate-500 font-bold py-2 px-4 rounded"
      >
        Go Back to Homepage
      </button>
    </div>
  );
};

export default BackButton;
