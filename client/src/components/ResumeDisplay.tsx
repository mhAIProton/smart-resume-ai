import React from 'react';
import { ResumeData, DesignType } from '@/services/pdf/pdfService';

interface ResumeDisplayProps {
  resumeData: ResumeData;
  design: DesignType;
}

const ResumeDisplay: React.FC<ResumeDisplayProps> = ({ resumeData, design }) => {
  const renderClassicDesign = () => (
    <div className="resume-classic bg-white p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">{resumeData.full_name}</h1>
        <h2 className="text-lg text-gray-700">{resumeData.profession}</h2>
      </div>

      {/* Contacts */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <img src="/icons/pdf-mail.png" alt="Email" className="w-4 h-4 mr-2" />
          <span className="text-sm text-gray-600">{resumeData.contacts?.email}</span>
        </div>
        <div className="flex items-center mb-2">
          <img src="/icons/pdf-phone.png" alt="Phone" className="w-4 h-4 mr-2" />
          <span className="text-sm text-gray-600">{resumeData.contacts?.phone}</span>
        </div>
        <div className="flex items-center mb-2">
          <img src="/icons/pdf-link.png" alt="Portfolio" className="w-4 h-4 mr-2" />
          <span className="text-sm text-gray-600">{resumeData.contacts?.portfolio}</span>
        </div>
      </div>

      {/* Profile */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Profile</h3>
        <p className="text-sm text-gray-700 leading-relaxed">{resumeData.summary}</p>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {resumeData.skills?.map((skill, index) => (
            <span
              key={index}
              className="inline-block px-3 py-1 bg-gray-100 border border-gray-300 rounded-full text-xs text-gray-700"
            >
              {skill}
            </span>
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
  );

  const renderModernDesign = () => (
    <div className="resume-modern max-w-6xl mx-auto">
      <div className="grid grid-cols-12 min-h-screen">
        {/* Left Column - Main Content (65%) */}
        <div className="col-span-8 bg-gray-100 p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-xl font-normal text-gray-900 mb-2">{resumeData.full_name}</h1>
            <h2 className="text-2xl text-gray-700">{resumeData.profession}</h2>
          </div>

          {/* Profile */}
          <div className="mb-6">
            <h3 className="text-lg font-normal text-green-600 mb-2">Profile</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{resumeData.summary}</p>
          </div>

          {/* Experience */}
          <div className="mb-6">
            <h3 className="text-lg font-normal text-green-600 mb-2">Experience</h3>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900">{exp.job_title}</h4>
                <p className="text-sm text-gray-600">{exp.company}</p>
                <p className="text-sm text-gray-500">{exp.dates}</p>
                <p className="text-sm text-gray-700 mt-1 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Additional Info (35%) */}
        <div className="col-span-4 bg-white p-6">
          {/* Contacts */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <img src="/icons/pdf-mail.png" alt="Email" className="w-4 h-4 mr-2" />
              <span className="text-xs text-gray-600">{resumeData.contacts?.email}</span>
            </div>
            <div className="flex items-center mb-2">
              <img src="/icons/pdf-phone.png" alt="Phone" className="w-4 h-4 mr-2" />
              <span className="text-xs text-gray-600">{resumeData.contacts?.phone}</span>
            </div>
            <div className="flex items-center mb-2">
              <img src="/icons/pdf-link.png" alt="Portfolio" className="w-4 h-4 mr-2" />
              <span className="text-xs text-gray-600">{resumeData.contacts?.portfolio}</span>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-6">
            <h3 className="text-lg font-normal text-green-600 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-1">
              {resumeData.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 bg-gray-100 border border-gray-300 rounded-full text-xs text-gray-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="mb-6">
            <h3 className="text-lg font-normal text-green-600 mb-2">Education</h3>
            {resumeData.education?.map((edu, index) => (
              <div key={index} className="mb-3">
                <h4 className="text-sm font-semibold text-gray-900">{edu.degree}</h4>
                <p className="text-xs text-gray-600">{edu.institution}</p>
                <p className="text-xs text-gray-500">{edu.dates}</p>
                {index < resumeData.education.length - 1 && (
                  <hr className="border-gray-200 my-2" />
                )}
              </div>
            ))}
          </div>

          {/* Additional */}
          {resumeData.additional?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-normal text-green-600 mb-2">Additional</h3>
              {resumeData.additional?.map((add, index) => (
                <div key={index}>
                  {add.languages && (
                    <div className="mb-2">
                      <span className="font-semibold text-xs text-gray-900">Languages: </span>
                      <p className="text-xs text-gray-700 mt-1">{add.languages}</p>
                    </div>
                  )}
                  {add.tools && (
                    <div className="mb-2">
                      <span className="font-semibold text-xs text-gray-900">Tools: </span>
                      <p className="text-xs text-gray-700 mt-1">{add.tools}</p>
                    </div>
                  )}
                  {add.certificates && (
                    <div className="mb-2">
                      <span className="font-semibold text-xs text-gray-900">Certificates: </span>
                      <p className="text-xs text-gray-700 mt-1">{add.certificates}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderMinimalDesign = () => (
    <div className="resume-minimal bg-white p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">{resumeData.full_name}</h1>
        <h2 className="text-lg text-gray-700">{resumeData.profession}</h2>
      </div>

      {/* Divider */}
      <hr className="border-gray-300 mb-6" />

      {/* Contacts */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          {resumeData.contacts?.email}  |  {resumeData.contacts?.phone}  |  {resumeData.contacts?.portfolio}
        </p>
      </div>

      {/* Profile */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile</h3>
        <p className="text-sm text-gray-700 leading-relaxed">{resumeData.summary}</p>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Skills</h3>
        <p className="text-sm text-gray-700">
          {resumeData.skills.join('  |  ')}
        </p>
      </div>

      {/* Experience */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Experience</h3>
        {resumeData.experience.map((exp, index) => (
          <div key={index} className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900">{exp.job_title}</h4>
            <p className="text-sm text-gray-600">{exp.company}</p>
            <p className="text-sm text-gray-500">{exp.dates}</p>
            <p className="text-sm text-gray-700 mt-1 leading-relaxed">{exp.description}</p>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Education</h3>
        {resumeData.education?.map((edu, index) => (
          <div key={index} className="mb-3">
            <h4 className="text-sm font-semibold text-gray-900">{edu.degree}</h4>
            <p className="text-sm text-gray-600">{edu.institution}</p>
            <p className="text-sm text-gray-500">{edu.dates}</p>
          </div>
        ))}
      </div>

      {/* Additional */}
      {resumeData.additional?.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional</h3>
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
  );

  const renderDesign = () => {
    if (Object.keys(resumeData).length === 0) return null;

    switch (design) {
      case 'classic':
        return renderClassicDesign();
      case 'modern':
        return renderModernDesign();
      case 'minimal':
        return renderMinimalDesign();
      default:
        return renderClassicDesign();
    }
  };

  return (
    <div className="resume-display">
      {renderDesign()}
    </div>
  );
};

export default ResumeDisplay;
