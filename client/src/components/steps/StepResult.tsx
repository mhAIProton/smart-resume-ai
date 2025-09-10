import React, { useState, useEffect } from 'react';
import {Copy, Download, RefreshCcw} from 'lucide-react';
import { useAppContext } from '@/contexts/AppContextProvider';
import toast from 'react-hot-toast';

const StepResult: React.FC = () => {
  const { generationType, isAuthenticated, setShowAuthModal, clearFormData } = useAppContext();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isGeneratedError, setIsGeneratedError] = useState(false);

  // Проверяем авторизацию при загрузке компонента
  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      setLoading(true)
    }
  }, [isAuthenticated, setShowAuthModal]);

  // Примеры контента на основе выбранного типа
  const getGeneratedContent = () => {
    if (generationType === 'cover-letter') {
      return `Cover Letter

      Hello,

      I'm excited to apply for the [Job Title] position at [Company Name]. Though I am at the beginning of my career, I bring a strong willingness to learn, a proactive mindset, and a passion for [industry or field, e.g., digital product development].

      I'm confident that my foundational skills and enthusiasm for growth make me a good fit for your team. I would love the opportunity to contribute and gain experience in a dynamic environment like yours.

      Thank you for considering my application. I look forward to the opportunity to speak with you.

      Best regards, [Full Name]`;
          } else {
            return `Resume: Junior Project Manager

      First Last Name
      📍 City, Country | 📞 +7 XXX XXX-XX-XX | ✉️ email@oo.com

      Key Skills:
      - Project Management (Agile, Scrum)
      - Project Planning and Timeline Management
      - Risk Management
      - Stakeholder Communication
      - Tools: Jira, Trello, MS Project, Confluence
      - Reporting and Documentation

      Experience:
      [Work Experience Section]

      Education:
      [Education Section]

      Projects:
      [Projects Section]`;
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(getGeneratedContent());
      setCopied(true);
      toast.success('Text copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy text');
    }
  };

  const handleRegenerate = () => {
    toast.success('Regenerating content...');
    // Здесь будет логика регенерации контента
  };

  const handleDownloadPDF = () => {
    toast.success('Downloading PDF...');
    // Здесь будет логика скачивания PDF
  };

  const handleStartNew = () => {
    // Очищаем все данные форм
    clearFormData();
    // toast.success('Starting new generation...');
    // Перенаправляем на первый шаг
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[72vh]">
        <img src="/generating.svg" alt="Loading" className='h-10 w-10 animate-spin mb-4' />
        <h2 className='font-medium text-2xl mb-4'>Generating</h2>
        <p className='text-gray-500 text-sm'>{generationType === 'cover-letter' ? 'Cover letter' : 'Resume'}</p>
      </div>
    );
  }

  if (isGeneratedError) {
    return (
      <div className="flex flex-col items-center justify-center h-[72vh]">
        <h3 className='font-medium mb-4 text-red-500 px-8 text-center'>We couldn't generate your draft.<br/> Please try again.</h3>
        <div className='w-full px-8'>
          <button
            onClick={handleRegenerate}
            className="group flex-1 w-full text-white h-11 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg bg-blue-700 hover:bg-blue-800 transition-colors"
          >
            <RefreshCcw className="w-4 h-4 group-hover:animate-spin" />
            <span className="text-sm font-medium">Retry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-end mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mr-2">
          Your draft is ready
        </h2>
        <img
            src="/circle-daw.svg"
            alt="Ready"
            className="w-6 h-6"
        />
      </div>

      {/* Content */}
      <div className="mb-6">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="whitespace-pre-line text-sm text-gray-800 font-mono leading-relaxed">
            {getGeneratedContent()}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Regenerate and Copy buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handleRegenerate}
            className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            <span className="text-sm font-medium">Regenerate</span>
          </button>
          <button
            onClick={handleCopyText}
            className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Copy className="w-4 h-4" />
            <span className="text-sm font-medium">
              {copied ? 'Copied!' : 'Copy Text'}
            </span>
          </button>
        </div>

        {/* Download PDF button */}
        <button
          onClick={handleDownloadPDF}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          <span className="font-medium">Download PDF</span>
        </button>

        {/* Start New button */}
        <button
          onClick={handleStartNew}
          className="w-full flex items-center justify-center space-x-2 py-2 px-4 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium">Start New Generation</span>
        </button>
      </div>
    </div>
  );
};

export default StepResult;
