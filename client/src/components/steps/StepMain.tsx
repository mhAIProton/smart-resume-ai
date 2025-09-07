import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContextProvider';

/**
 * Главный компонент (шаг 1), описание работы
 * @constructor
 */
const StepMain: React.FC = () => {
  const navigate = useNavigate();
  const { setJobDescription, user } = useAppContext();
  const [jobText, setJobText] = useState('');
  const [showExample, setShowExample] = useState(false);

  const exampleJobDescription = `We're looking for a Marketing Specialist to help plan and execute marketing campaigns across social media, email, and ads. You'll work with the content team, update the website, and support events like webinars and trade shows.`;

  const handleContinue = () => {
    if (isValid()) {
      setJobDescription({ text: jobText.trim(), source: 'manual' });
      navigate('/type');
    }
  }

  const isValid = () => {
    return jobText.trim().length >= 10;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Paste job description
      </h2>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Not sure where to find a job description?{' '}
          <button
            onClick={() => setShowExample(!showExample)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {showExample ? 'Close example' : 'See example'}
          </button>
        </p>
      </div>

      {showExample && (
        <div className="mb-4">
          <div className="text-sm text-gray-700">
            {exampleJobDescription}
          </div>
        </div>
      )}

      <div className="mb-4">
        <textarea
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
          placeholder="Paste full job description"
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={8}
        />

        {isValid() && (
          <div className="mt-2 flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-600">Text input detected. Ready to continue</span>
          </div>
        )}
      </div>

      <button
        onClick={handleContinue}
        disabled={!isValid()}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          isValid()
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  );
}

export default StepMain;
