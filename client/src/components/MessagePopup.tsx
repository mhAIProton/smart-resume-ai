import React from 'react';
import { useAppContext } from '@/contexts/AppContextProvider';

const MessagePopup: React.FC = () => {
  const { showMessagePopup, setShowMessagePopup, messagePopupData } = useAppContext();

  if (!showMessagePopup || !messagePopupData) return null;

  const { type, title, subtitle, buttonText = 'Ok' } = messagePopupData;

  const handleClose = () => {
    setShowMessagePopup(false);
  };

  const handleButtonClick = () => {
    setShowMessagePopup(false);
  };

  const iconSrc = type === 'error' ? '/warning.svg' : '/circle-daw.svg';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-[350px] max-w-full relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <img
            src="/squared-cross.svg"
            alt="Close"
            className="h-6"
          />
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-2">
            <img
              src={iconSrc}
              alt={type === 'error' ? 'Warning' : 'Success'}
              className="h-8"
            />
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
            {title}
          </h2>

          {/* Subtitle */}
          <p className="text-sm text-gray-600 text-center mb-6">
            {subtitle}
          </p>

          {/* Button */}
          <button
            onClick={handleButtonClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagePopup;
