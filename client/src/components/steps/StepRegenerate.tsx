import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContextProvider';
import { useNavigation } from '@/contexts/NavigationContext';
import clsx from 'clsx';

/**
 * Компонент для повторной генерации с дополнительными комментариями
 */
const StepRegenerate: React.FC = () => {
  const { navigate } = useNavigation();
  const { setRegenerateComment, setGeneratedContent } = useAppContext();
  const [comment, setComment] = useState('');

  const handleContinue = async () => {
    if (isCommentValid()) {
      await setRegenerateComment(comment.trim());
      await setGeneratedContent('');
      navigate('result');
    }
  };

  const handleSkip = () => {
    setRegenerateComment('');
    navigate('result');
  };

  const isCommentValid = () => {
    return comment.trim().length >= 5;
  };

  const isCommentTooLarge = () => {
    return comment.length > 1000;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Add feedback for regeneration
      </h2>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Tell us what you'd like to change or improve in the generated content. 
          This feedback will help us create a better version for you.
        </p>
      </div>

      <div className="mb-4">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="e.g., Make it more professional, add more technical skills, focus on leadership experience..."
          className="w-full p-3 border rounded-lg resize-none border-gray-300 bg-gray-200 focus-visible:border-gray-600"
          rows={6}
        />
        {isCommentValid() && (
          <div className="mt-2 flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-600">Feedback provided. Ready to regenerate.</span>
          </div>
        )}
        {isCommentTooLarge() && (
          <div className="mt-2 flex items-center space-x-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-yellow-600">Long feedback detected. Please keep it concise.</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <button
          onClick={handleContinue}
          disabled={!isCommentValid()}
          className={clsx('w-full py-3 px-4 rounded-lg font-medium text-sm transition-colors', {
            'bg-blue-200 text-white cursor-not-allowed': !isCommentValid(),
            'bg-blue-600 hover:bg-blue-700 text-white': isCommentValid(),
          })}
        >
          Regenerate with Feedback
        </button>
        
        <button
          onClick={handleSkip}
          className="w-full py-2 px-4 rounded-lg font-medium text-sm border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Skip and Regenerate
        </button>
      </div>
    </div>
  );
};

export default StepRegenerate;
