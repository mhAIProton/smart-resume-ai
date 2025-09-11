import React, { useState, useEffect } from 'react';
import {Copy, Download, RefreshCcw} from 'lucide-react';
import { useAppContext, User } from '@/contexts/AppContextProvider';
import { useGenerateResume, useGenerateCoverLetter } from '@/hooks/useApi';
import toast from 'react-hot-toast';

const StepResult: React.FC = () => {
  const { 
    generationType, 
    isAuthenticated, 
    setShowAuthModal, 
    clearFormData,
    jobDescription,
    selectedTone,
    resumeData,
    selectedDesign,
    user,
    setUser
  } = useAppContext();
  const [copied, setCopied] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  
  const generateResume = useGenerateResume();
  const generateCoverLetter = useGenerateCoverLetter();

  // Проверяем авторизацию при загрузке компонента
  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      generateContent();
    }
  }, [isAuthenticated, setShowAuthModal]);

  // Функция для генерации контента
  const generateContent = async () => {
    if (!isAuthenticated || !jobDescription || !generationType) {
      return;
    }

    try {
      let content;

      if (generationType === 'resume') {
        // Генерируем резюме
        const request = {
          jobDescription: jobDescription.text,
          userExperience: resumeData?.option === 'generate' ? resumeData.generateText : undefined,
          existingResume: resumeData?.option === 'improve' ? resumeData.improveText : undefined,
          design: selectedDesign || 'classic'
        };

        content = await generateResume.execute(request);
      } else {
        // Генерируем сопроводительное письмо
        const request = {
          jobDescription: jobDescription.text,
          tone: selectedTone || 'formal'
        };

        content = await generateCoverLetter.execute(request);
      }

      if (content) {
        setGeneratedContent(content);
        toast.success('Content generated successfully!');
        setUser({
          ...user, 
          remainingGenerations: Math.max(0, Number(user?.remainingGenerations) - 1)
        } as User);
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate content. Please try again.');
    }
  };

  // Получаем сгенерированный контент
  const getGeneratedContent = () => {
    return generatedContent || 'Generating content...';
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

  const handleRegenerate = async () => {
    toast.success('Regenerating content...');
    await generateContent();
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

  if (generateResume.loading || generateCoverLetter.loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[72vh]">
        <img src="/generating.svg" alt="Loading" className='h-10 w-10 animate-spin mb-4' />
        <h2 className='font-medium text-2xl mb-4'>Generating</h2>
        <p className='text-gray-500 text-sm'>{generationType === 'cover-letter' ? 'Cover letter' : 'Resume'}</p>
      </div>
    );
  }

  if (generateResume.error || generateCoverLetter.error) {
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
        <div className="draft-container bg-gray-50 rounded-lg p-4 border border-gray-200 overflow-y-auto">
          <div className="whitespace-pre-line text-sm text-gray-800 font-mono leading-relaxed">
            {getGeneratedContent()}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pb-3">
        {/* Regenerate and Copy buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handleRegenerate}
            className="group flex-1 flex items-center justify-center space-x-2 py-2 px-4 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <RefreshCcw className="w-4 h-4 group-hover:animate-spin" />
            <span className="text-sm font-medium">Regenerate</span>
          </button>
          <button
            onClick={handleCopyText}
            className="group flex-1 flex items-center justify-center space-x-2 py-2 px-4 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Copy className="w-4 h-4 group-hover:animate-bounce" />
            <span className="text-sm font-medium">
              {copied ? 'Copied!' : 'Copy Text'}
            </span>
          </button>
        </div>

        {/* Download PDF button */}
        <button
          onClick={handleDownloadPDF}
          className="group w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Download className="w-4 h-4 group-hover:animate-bounce" />
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
