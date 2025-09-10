import React from 'react';
import { useAppContext } from '@/contexts/AppContextProvider';

const Loader: React.FC = () => {
  const { showLoader } = useAppContext();

  if (!showLoader) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        {/* Spinner */}
        <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-50"></div>
        </div>
    </div>
  );
};

export default Loader;
