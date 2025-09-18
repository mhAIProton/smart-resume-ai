import React, { useState, useEffect } from 'react';
import {Copy, Download, RefreshCcw} from 'lucide-react';
import { useAppContext, User } from '@/contexts/AppContextProvider';
import { useNavigation } from '@/contexts/NavigationContext';
import { useGenerateResume, useGenerateCoverLetter } from '@/hooks/useApi';
import toast from 'react-hot-toast';
import { pdfService, ResumeData, DesignType } from '@/services/pdf/pdfService';
import ResumeDisplay from '@/components/ResumeDisplay';

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
    setUser,
    setShowSubscriptionsPopup
  } = useAppContext();
  const {navigate} = useNavigation();
  const [copied, setCopied] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [content, setContent] = useState<ResumeData>({} as ResumeData);
  
  const generateResume = useGenerateResume();
  const generateCoverLetter = useGenerateCoverLetter();

  const json = {
    "full_name": "Alexandra Ivanova",
    "profession": "Product / UI/UX Designer",
    "summary": "Product designer with 4+ years of experience building digital products from discovery to delivery. Specialized in mobile and web interfaces with a strong focus on user needs and business goals. Experienced in startups, marketplaces, and e-commerce. Proficient in Figma, UX research, and MVP-first approach.",
    "contacts": {
      "email": "alexa.ivanova@gmail.com",
      "phone": "+7 707 123 45 67",
      "portfolio": "linkedin.com/in/alex-ivanova"
    },
    "skills": ["Figma", "UX Research", "Design Systems", "Prototyping", "User Flows / CJM", "Web / Mobile Design", "Wireframing", "User Interviews", "Notion", "FigJam"],
    "experience": [
      {
        "job_title": "Product Designer",
        "company": "Wildberries Tech",
        "dates": "2022–2024",
        "description": "Designed seller dashboard (increased conversion by 12%)\nConducted 10+ user interviews for storefront redesign\nContributed to internal design system for B2B tools\nWorked closely with PMs and frontend/backend teams"
      },
      {
        "job_title": "Middle+ Product Designer",
        "company": "Yandex.Market",
        "dates": "2021–2022",
        "description": "Participated in redesign of product catalog and search filters\nWorked on mobile-first improvements for checkout flow\nCollaborated with analysts to improve user funnel\nTook part in weekly design critiques and sprints"
      },
      {
        "job_title": "Freelance",
        "company": "Jamb App",
        "dates": "2020–2021",
        "description": "Created mobile interface for Canadian home repair service\nDesigned order flow, filters, product cards, and questionnaires\nApplied atomic design principles for scalable UI\nDelivered a clickable prototype for investor pitch"
      }
    ],
    "education": [
      {
        "degree": "UX/UI Design",
        "institution": "British Higher School of Art and Design",
        "dates": "2020–2021"
      },
      {
        "degree": "Bachelor’s Degree | Economics",
        "institution": "Lomonosov Moscow State University",
        "dates": "2015–2019"
      }
    ],
    "additional": [
      {
        "languages": "Russian (native), English (B2)",
        "tools": "Figma, FigJam, Notion, Miro, Trello, Slack",
        "certificates": "Google UX Design (Coursera, 2023)"
      }
    ]
  };

  // Проверяем авторизацию при загрузке компонента
  useEffect(() => {
    setShowAuthModal(!isAuthenticated);
    generateContent();
  }, [isAuthenticated, setShowAuthModal]);

  // Функция для генерации контента
  const generateContent = async () => {
    if (!isAuthenticated || Number(user?.remainingGenerations) < 1) {
      return;
    }

    try {
      let content;

      if (generationType === 'resume') {
        // Генерируем резюме
        const request = {
          jobDescription: jobDescription?.text,
          userExperience: resumeData?.option === 'generate' ? resumeData.generateText : undefined,
          existingResume: resumeData?.option === 'improve' ? resumeData.improveText : undefined,
          design: selectedDesign || 'classic'
        };

        content = await generateResume.execute(request);
        if (content) {
          const parsedContent = JSON.parse(content) as ResumeData;
          setContent(parsedContent);
        }
      } else {
        // Генерируем сопроводительное письмо
        const request = {
          jobDescription: jobDescription?.text,
          tone: selectedTone || 'formal'
        };

        content = await generateCoverLetter.execute(request);
      }

      if (content) {
        setGeneratedContent(content);
        setIsGenerated(true);
        setUser({ ...user, remainingGenerations: Math.max(0, Number(user?.remainingGenerations) - 1)} as User);
        toast.success('Content generated successfully!');
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate content. Please try again.');
    }
  };

  // Получаем сгенерированный контент
  const getGeneratedContent = () => {
    return generatedContent || 'Your draft will appear here...';
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
    await generateContent();
  };

  const handleDownloadPDF = () => {
    try {
      const content = getGeneratedContent();
      
      if (!content || content === 'Your draft will appear here...') {
        toast.error('No content to download');
        return;
      }

      if (generationType === 'resume') {
        // Парсим JSON данные для резюме
        let resumeData: ResumeData;
        try {
          resumeData = JSON.parse(content);
        } catch (parseError) {
          console.error('Failed to parse resume JSON:', parseError);
          toast.error('Invalid resume data format');
          return;
        }

        // Генерируем PDF используя pdfService
        const design = (selectedDesign || 'classic') as DesignType;
        pdfService.generatePDF(resumeData, design);
        
        // Генерируем имя файла
        const timestamp = new Date().toISOString().split('T')[0];
        const fileName = `resume_${timestamp}.pdf`;
        
        // Скачиваем PDF
        pdfService.downloadPDF(fileName);
      } else {
        // Для cover letter используем pdfService
        pdfService.generateCoverLetterPDF(content);
        
        // Генерируем имя файла
        const timestamp = new Date().toISOString().split('T')[0];
        const fileName = `cover-letter_${timestamp}.pdf`;
        
        // Скачиваем PDF
        pdfService.downloadPDF(fileName);
      }
      
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  const handleStartNew = () => {
    // Очищаем все данные форм
    clearFormData();
    navigate('main');
  };

  if (!isGenerated && Number(user?.remainingGenerations) < 1) {
    return (
      <div className="flex flex-col items-center justify-center h-[72vh]">
        <h3 className='font-medium mb-4 text-red-500 px-8 text-center'>You have no generations remaining.<br/> Please upgrade your plan to generate more content.</h3>
        <button
          onClick={() => setShowSubscriptionsPopup(true)}
          className="group h-11 w-1/2 flex items-center justify-center space-x-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <img
            src="/lock.svg"
            alt="Lock"
            className="h-6"
          />
          <span className="font-medium">Upgrade Plan</span>
        </button>
      </div>
    );
  }

  if (generateResume.loading || generateCoverLetter.loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[72vh]">
        <img src="/generating.svg" alt="Loading" className='h-10 w-10 mb-4' />
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
            <ResumeDisplay resumeData={content} design={selectedDesign || 'classic'} />
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
            <Copy className="w-4 h-4 group-hover:animate-pulse" />
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
          <Download className="w-4 h-4 group-hover:animate-pulse" />
          <span className="text-sm font-medium">Download PDF</span>
        </button>

        {/* Start New button */}
        <button
          onClick={handleStartNew}
          className="w-full flex items-center justify-center space-x-2 py-2 px-4 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="text-sm font-medium">Start New Generation</span>
        </button>
      </div>
    </div>
  );
};

export default StepResult;
