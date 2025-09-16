import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContextProvider';
import { useNavigation } from '@/contexts/NavigationContext';
import clsx from 'clsx';

/**
 * Главный компонент (шаг 1), описание работы
 * @constructor
 */
const StepMain: React.FC = () => {
  const {navigate} = useNavigation();
  const {jobDescription, setJobDescription} = useAppContext();
  const [jobText, setJobText] = useState('');
  const [showExample, setShowExample] = useState(false);

  const exampleJobDescription = `We're looking for a Marketing Specialist to help plan and execute marketing campaigns across social media, email, and ads. You'll work with the content team, update the website, and support events like webinars and trade shows.`;

  // Восстанавливаем текст из контекста при загрузке компонента
  useEffect(() => {
    if (jobDescription?.text) {
      setJobText(jobDescription.text);
    }
  }, [jobDescription]);

  const handleContinue = async () => {
    if (isTextExist()) {
      await setJobDescription({text: jobText.trim(), source: 'manual'});
      navigate('type');
    }
  }

  const isTextExist = () => {
    return jobText.replace(/\d/g, '').trim().length >= 10;
  }

  const isTextTooLarge = () => {
    return jobText.length > 2000;
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
        <div className="mb-6">
          <div className="text-sm text-gray-400">
            {exampleJobDescription}
          </div>
        </div>
      )}

      <div className="mb-4">
        <textarea
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
          placeholder="Paste full job description"
          className="w-full p-3 border rounded-lg resize-none border-gray-300 bg-gray-200 focus-visible:border-gray-600"
          rows={8}
        />
        {isTextExist() && (
          <div className="mt-2 flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-600">Text input detected. Ready to continue.</span>
          </div>
        )}
        {isTextTooLarge() && (
          <div className="mt-2 flex items-center space-x-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-yellow-600">Large input detected. Please confirm it's the full job description.</span>
          </div>
        )}
      </div>

      <button
        onClick={handleContinue}
        disabled={!isTextExist()}
        className={clsx('w-full py-3 px-4 rounded-lg font-medium text-sm transition-colors', {
          'bg-blue-200 text-white cursor-not-allowed': !isTextExist(),
          'bg-blue-600 hover:bg-blue-700 text-white': isTextExist(),
        })}
      >
        Continue
      </button>
    </div>
  );
}

export default StepMain;
