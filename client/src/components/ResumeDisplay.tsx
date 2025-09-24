import React from 'react';
import { ResumeData as PDFResumeData } from '@/services/pdf/pdfService';
import EditableContent from './EditableContent';
import { useAppContext } from '@/contexts/AppContextProvider';

interface ResumeDisplayProps {
  resumeData: PDFResumeData | string;
}

const ResumeDisplay: React.FC<ResumeDisplayProps> = ({ resumeData }) => {
  // В случае если ResumeData - текст, засовываем его в простой шаблон
  if (typeof resumeData === 'string') {
    return (
      <div id="resume-content" className="resume-classic bg-white p-6 max-w-4xl mx-auto">
        {resumeData}
      </div>
    );
  }

  const { updateGeneratedContent } = useAppContext();

  const handleResumeDataChange = (property: string, value: string) => {
    updateGeneratedContent({ [property]: value } as Partial<PDFResumeData>);
  };

  const handleContactsDataChange = (property: string, value: string) => {
    updateGeneratedContent({ contacts: { ...resumeData.contacts, [property]: value } } as Partial<PDFResumeData>);
  };

  const handleSkillsDataChange = (index: number, value: string) => {
    if (value.trim() === '') {
      updateGeneratedContent({ skills: resumeData.skills.filter((_, i) => i !== index) } as Partial<PDFResumeData>);
    } else {
      updateGeneratedContent({ skills: [...resumeData.skills.slice(0, index), value, ...resumeData.skills.slice(index + 1)] } as Partial<PDFResumeData>);
    }
  };

  return (
    <div id="resume-content">
      <div className="resume-classic bg-white p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="rd-full-name mb-2">
            <EditableContent
              value={resumeData.full_name}
              onChange={(value) => handleResumeDataChange('full_name', value)}
              className="text-2xl font-semibold text-gray-900"
              placeholder="Enter your name"
            />
          </div>
          <div className="rd-profession">
            <EditableContent
              value={resumeData.profession}
              onChange={(value) => handleResumeDataChange('profession', value)}
              className="text-lg text-gray-700"
              placeholder="Enter your profession"
            />
          </div>
        </div>

        {/* Contacts */}
        <div className="mb-6">
          {resumeData.contacts?.email && (
            <div className="flex items-center mb-2">
              <img src="/icons/pdf-mail.png" alt="Email" className="w-4 h-4 mr-2" />
              <EditableContent
                value={resumeData.contacts.email}
                onChange={(value) => handleContactsDataChange('email', value)}
                className="text-sm text-gray-600"
                placeholder="Enter your email"
              />
            </div>
          )}
          {resumeData.contacts?.phone && (
            <div className="flex items-center mb-2">
              <img src="/icons/pdf-phone.png" alt="Phone" className="w-4 h-4 mr-2" />
              <EditableContent
                value={resumeData.contacts.phone}
                onChange={(value) => handleContactsDataChange('phone', value)}
                className="text-sm text-gray-600"
                placeholder="Enter your phone"
              />
            </div>
          )}
          {resumeData.contacts?.portfolio && (
            <div className="flex items-center mb-2">
              <img src="/icons/pdf-link.png" alt="Portfolio" className="w-4 h-4 mr-2" />
              <EditableContent
                value={resumeData.contacts.portfolio}
                onChange={(value) => handleContactsDataChange('portfolio', value)}
                className="text-sm text-gray-600"
                placeholder="Enter your portfolio"
              />
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Profile</h3>
          <EditableContent
            value={resumeData.summary}
            onChange={(value) => handleResumeDataChange('summary', value)}
            multiline={true}
            className="text-sm text-gray-700 leading-relaxed w-full"
            placeholder="Enter your profile"
          />
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills?.map((skill, index) => (
              <EditableContent
                value={skill}
                onChange={(value) => handleSkillsDataChange(index, value)}
                className="inline-block px-3 py-1 bg-gray-100 border border-gray-300 rounded-full text-xs text-gray-700 hover:translate-y-[-2px] hover:shadow-md transition-transform duration-200"
                placeholder="Enter skill"
              />
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Experience</h3>
          {resumeData.experience?.map((exp, index) => (
            <div key={index} className="mb-4">
              <h4 className="text-base font-semibold text-gray-900">{exp.job_title}</h4>
              <p className="text-sm text-gray-600">{exp.company}</p>
              <p className="text-sm text-gray-500">{exp.dates}</p>
              <p className="text-sm text-gray-700 mt-2 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Education</h3>
          {resumeData.education.map((edu, index) => (
            <div key={index} className="mb-3">
              <h4 className="text-base font-semibold text-gray-900">{edu.degree}</h4>
              <p className="text-sm text-gray-600">{edu.institution}</p>
              <p className="text-sm text-gray-500">{edu.dates}</p>
            </div>
          ))}
        </div>

        {/* Additional */}
        {resumeData.additional?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional</h3>
            {resumeData.additional?.map((add, index) => (
              <div key={index}>
                {add.languages && (
                  <div className="mb-2">
                    <span className="font-semibold text-sm text-gray-900">Languages: </span>
                    <span className="text-sm text-gray-700">{add.languages}</span>
                  </div>
                )}
                {add.tools && (
                  <div className="mb-2">
                    <span className="font-semibold text-sm text-gray-900">Tools: </span>
                    <span className="text-sm text-gray-700">{add.tools}</span>
                  </div>
                )}
                {add.certificates && (
                  <div className="mb-2">
                    <span className="font-semibold text-sm text-gray-900">Certificates: </span>
                    <span className="text-sm text-gray-700">{add.certificates}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeDisplay;
