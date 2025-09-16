import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContextProvider';
import { useNavigation } from '@/contexts/NavigationContext';
import clsx from 'clsx';

interface DesignOption {
  value: 'classic' | 'modern' | 'minimal';
  title: string;
  description: string;
  example: string;
}

const StepDesign: React.FC = () => {
  const {navigate} = useNavigation();
  const {selectedDesign: contextDesign, setSelectedDesign} = useAppContext();
  const [selectedDesign, setSelectedDesignLocal] = useState<'classic' | 'modern' | 'minimal' | null>(null);

  const designOptions: DesignOption[] = [
    {
      value: 'classic',
      title: 'Classic',
      description: 'Clean and traditional',
      example: '/img/design-classic.png'
    },
    {
      value: 'modern',
      title: 'Modern',
      description: 'Stylish and elegant',
      example: '/img/design-modern.png'
    },
    {
      value: 'minimal',
      title: 'Minimal',
      description: 'Simple and clean',
      example: '/img/design-minimal.png'
    }
  ];

  // Восстанавливаем выбранный дизайн из контекста при загрузке компонента
  useEffect(() => {
    if (contextDesign) {
      setSelectedDesignLocal(contextDesign);
    }
  }, [contextDesign]);

  const handleDesignChange = async (design: 'classic' | 'modern' | 'minimal') => {
    setSelectedDesignLocal(design);
    await setSelectedDesign(design);
  };

  const handleContinue = () => {
    if (selectedDesign) {
      navigate('result');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Choose your resume design
      </h2>

      <div className="space-y-3 mb-6">
        {designOptions.map((option) => (
          <label
            key={option.value}
            className={clsx(
              'flex flex-col p-2 border rounded-lg cursor-pointer transition-colors w-full border-gray-300 hover:border-gray-400',
              selectedDesign === option.value && 'bg-gray-100'
            )}
          >
            <input
              type="radio"
              name="design"
              value={option.value}
              checked={selectedDesign === option.value}
              onChange={() => handleDesignChange(option.value)}
              className="sr-only"
            />

            <div className="flex">
              <div className="min-w-[32px] pr-2">
                {selectedDesign === option.value
                  ? <img src="/mark.svg" alt={option.value}/>
                  : <img src="/circle.svg" alt={option.value}/>
                }
              </div>

              <div className="w-full flex flex-col">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900 text-sm">{option.title}</h3>
                  <span className="text-sm text-gray-500">{option.description}</span>
                </div>

                <div
                  className={`bg-white rounded-md overflow-hidden transition-all duration-300 ${selectedDesign === option.value ? 'mt-2 p-3 border border-gray-200 max-h-60' : 'max-h-0'}`}>
                  <img src={option.example} alt={option.value} className="max-h-56 mx-auto"/>
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>

      <button
        onClick={handleContinue}
        disabled={!selectedDesign}
        className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-colors ${
          selectedDesign
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  );
};

export default StepDesign;
