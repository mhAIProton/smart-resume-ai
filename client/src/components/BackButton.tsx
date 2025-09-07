import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Не показывать кнопку Back на главной странице и на странице результата
  if (location.pathname === '/' || location.pathname === '/result') {
    return null;
  }

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-md mx-auto px-2 pb-4">
      <button
        onClick={handleBack}
        className="w-full py-2 px-4 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors"
      >
        Back
      </button>
    </div>
  );
};

export default BackButton;
