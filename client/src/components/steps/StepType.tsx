import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContextProvider';
import { useNavigation } from '@/contexts/NavigationContext';

/**
 * Выбор типа генерации (шаг 2), резюме или сопроводительное письмо
 * @constructor
 */
const StepType: React.FC = () => {
  const {navigate} = useNavigation();
  const {jobDescription, generationType, setGenerationType} = useAppContext();
  const [selectedType, setSelectedType] = useState<'resume' | 'cover-letter' | null>(generationType);

  const handleTypeChange = async (type: 'resume' | 'cover-letter') => {
    setSelectedType(type);
    await setGenerationType(type);
  }

  const handleContinue = () => {
    if (jobDescription) {
      navigate(selectedType === 'resume' ? 'resume' : 'tone');
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-5">
        What do you want to generate?
      </h2>

      <div className="space-y-3 mb-6">
        {/* Resume Option */}
        <label
          className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors w-full ${
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
            <span className="font-medium text-gray-900 text-sm">Resume</span>
          </div>
          {selectedType === 'resume' && (
            <svg className="text-purple-600" width="11" height="8" viewBox="0 0 11 8" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.7584 1.46323C11.0805 1.1285 11.0805 0.585786 10.7584 0.251051C10.4362 -0.0836837 9.91382 -0.0836837 9.59164 0.251051L4.125 5.93067L1.40836 3.10819C1.08618 2.77346 0.563819 2.77346 0.241637 3.10819C-0.0805456 3.44293 -0.0805456 3.98564 0.241637 4.32038L3.54164 7.74895C3.86382 8.08368 4.38618 8.08368 4.70836 7.74895L10.7584 1.46323Z"
                fill="currentColor"/>
            </svg>
          )}
        </label>

        {/* Cover Letter Option */}
        <label
          className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors w-full ${
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
            <span className="font-medium text-gray-900 text-sm">Cover Letter</span>
          </div>
          {selectedType === 'cover-letter' && (
            <svg className="text-orange-600" width="11" height="8" viewBox="0 0 11 8" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.7584 1.46323C11.0805 1.1285 11.0805 0.585786 10.7584 0.251051C10.4362 -0.0836837 9.91382 -0.0836837 9.59164 0.251051L4.125 5.93067L1.40836 3.10819C1.08618 2.77346 0.563819 2.77346 0.241637 3.10819C-0.0805456 3.44293 -0.0805456 3.98564 0.241637 4.32038L3.54164 7.74895C3.86382 8.08368 4.38618 8.08368 4.70836 7.74895L10.7584 1.46323Z"
                fill="currentColor"/>
            </svg>
          )}
        </label>
      </div>

      <button
        onClick={handleContinue}
        disabled={!selectedType}
        className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-colors ${
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
