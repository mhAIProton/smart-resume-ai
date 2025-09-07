import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContextProvider';

/**
 * Выбор типа генерации (шаг 2), резюме или сопроводительное письмо
 * @constructor
 */
const StepType: React.FC = () => {
  const navigate = useNavigate();
  const { jobDescription, generationType, setGenerationType } = useAppContext();
  const [selectedType, setSelectedType] = useState<'resume' | 'cover-letter' | null>(generationType);

  const handleTypeChange = (type: 'resume' | 'cover-letter') => {
    setSelectedType(type);
    setGenerationType(type);
  }

  const handleContinue = () => {
    if (jobDescription) {
      navigate(selectedType === 'resume' ? '/resume' : '/tone');
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        What do you want to generate?
      </h2>

      <div className="space-y-3 mb-6">
        {/* Resume Option */}
        <label className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors w-full ${
          selectedType === 'resume' 
            ? 'bg-purple-100 border-2 border-purple-200' 
            : 'bg-gray-50 border-2 border-gray-200 hover:bg-purple-50'
        }`}>
          <input
            type="radio"
            name="type"
            value="resume"
            checked={selectedType === 'resume'}
            onChange={() => handleTypeChange('resume')}
            className="sr-only"
          />
          <div className="flex items-center">
            <img
              src="/resume.svg"
              alt="Resume"
              className="w-6 h-6 mr-3"
            />
            <span className="font-medium text-gray-900">Resume</span>
          </div>
          {selectedType === 'resume' && (
            <img
              src="/mark.svg"
              alt="Selected"
              className="w-5 h-5"
            />
          )}
        </label>

        {/* Cover Letter Option */}
        <label className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors w-full ${
          selectedType === 'cover-letter' 
            ? 'bg-orange-100 border-2 border-orange-200' 
            : 'bg-gray-50 border-2 border-gray-200 hover:bg-orange-50'
        }`}>
          <input
            type="radio"
            name="type"
            value="cover-letter"
            checked={selectedType === 'cover-letter'}
            onChange={() => handleTypeChange('cover-letter')}
            className="sr-only"
          />
          <div className="flex items-center">
            <img
              src="/cover-letter.svg"
              alt="Cover Letter"
              className="w-6 h-6 mr-3"
            />
            <span className="font-medium text-gray-900">Cover Letter</span>
          </div>
          {selectedType === 'cover-letter' && (
            <img
              src="/mark.svg"
              alt="Selected"
              className="w-5 h-5"
            />
          )}
        </label>
      </div>

      <button
        onClick={handleContinue}
        disabled={!selectedType}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          selectedType
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  );
}

export default StepType;
