import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContextProvider';
import clsx from 'clsx';
import toast from "react-hot-toast";
import { DesignType, pdfService } from "@/services/pdf/pdfService.ts";
import { Download } from "lucide-react";

interface DesignOption {
  value: 'classic' | 'modern' | 'minimal';
  title: string;
  description: string;
  example: string;
}

const StepDesign: React.FC = () => {
  const {selectedDesign: contextDesign, setSelectedDesign, generatedContent} = useAppContext();
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

  const handleDownloadPDF = () => {
    try {
      if (!generatedContent) {
        toast.error('No content to download');
        return;
      }

      // Генерируем PDF используя pdfService
      const design = (selectedDesign || 'classic') as DesignType;
      pdfService.generatePDF(generatedContent, design);

      // Генерируем имя файла
      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `resume_${timestamp}.pdf`;

      // Скачиваем PDF
      pdfService.downloadPDF(fileName);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try again.');
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

      {/* Download PDF button */}
      <button
        onClick={handleDownloadPDF}
        disabled={!selectedDesign}
        className="group w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        <Download className="w-4 h-4 group-hover:animate-pulse" />
        <span className="text-sm font-medium">Download PDF</span>
      </button>
    </div>
  );
};

export default StepDesign;
