import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, Link, FileText, Sparkles, Edit3 } from 'lucide-react'

const Step3: React.FC = () => {
  const navigate = useNavigate()
  const { generationRequest, setGenerationRequest, user, setShowAuthModal, canGenerate } = {}
  const [tone, setTone] = useState<'formal' | 'friendly' | 'strict' | null>(null)
  const [resumeType, setResumeType] = useState<'generate' | 'improve' | null>(null)
  const [experience, setExperience] = useState('')
  const [existingResumeType, setExistingResumeType] = useState<'pdf' | 'url' | 'text' | null>(null)
  const [existingResumeContent, setExistingResumeContent] = useState('')

  const handleGenerate = () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    if (!canGenerate) {
      // Show limit reached modal
      return
    }

    if (generationRequest?.type === 'cover-letter' && tone) {
      const updatedRequest = {
        ...generationRequest,
        tone
      }
      setGenerationRequest(updatedRequest)
      navigate('/step4')
    } else if (generationRequest?.type === 'resume' && resumeType) {
      const updatedRequest = {
        ...generationRequest,
        resumeType,
        experience: resumeType === 'generate' ? experience : undefined,
        existingResume: resumeType === 'improve' && existingResumeType && existingResumeContent ? {
          type: existingResumeType,
          content: existingResumeContent
        } : undefined
      }
      setGenerationRequest(updatedRequest)
      navigate('/step4')
    }
  }

  const renderCoverLetterOptions = () => (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Choose tone for your cover letter
      </h3>
      <div className="space-y-3 mb-6">
        {[
          { value: 'formal', label: 'Formal', description: 'Professional and traditional' },
          { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
          { value: 'strict', label: 'Strict', description: 'Direct and authoritative' }
        ].map((option) => (
          <label key={option.value} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="tone"
              value={option.value}
              checked={tone === option.value}
              onChange={(e) => setTone(e.target.value as any)}
              className="sr-only"
            />
            <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
              tone === option.value 
                ? 'border-primary-600 bg-primary-600' 
                : 'border-gray-300'
            }`}>
              {tone === option.value && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </div>
            <div>
              <div className="font-medium text-gray-900">{option.label}</div>
              <div className="text-sm text-gray-500">{option.description}</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  )

  const renderResumeOptions = () => (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        How do you want to generate your resume?
      </h3>
      
      <div className="space-y-3 mb-6">
        <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="radio"
            name="resumeType"
            value="generate"
            checked={resumeType === 'generate'}
            onChange={(e) => setResumeType(e.target.value as any)}
            className="sr-only"
          />
          <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
            resumeType === 'generate' 
              ? 'border-primary-600 bg-primary-600' 
              : 'border-gray-300'
          }`}>
            {resumeType === 'generate' && (
              <div className="w-2 h-2 bg-white rounded-full"></div>
            )}
          </div>
          <div className="flex items-center">
            <Sparkles className="w-5 h-5 text-gray-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">Generate from scratch</div>
              <div className="text-sm text-gray-500">Create a new resume based on your experience</div>
            </div>
          </div>
        </label>

        <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="radio"
            name="resumeType"
            value="improve"
            checked={resumeType === 'improve'}
            onChange={(e) => setResumeType(e.target.value as any)}
            className="sr-only"
          />
          <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
            resumeType === 'improve' 
              ? 'border-primary-600 bg-primary-600' 
              : 'border-gray-300'
          }`}>
            {resumeType === 'improve' && (
              <div className="w-2 h-2 bg-white rounded-full"></div>
            )}
          </div>
          <div className="flex items-center">
            <Edit3 className="w-5 h-5 text-gray-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">Improve existing</div>
              <div className="text-sm text-gray-500">Enhance your current resume</div>
            </div>
          </div>
        </label>
      </div>

      {resumeType === 'generate' && (
        <div className="mb-6">
          <label className="form-label">Describe your experience and skills</label>
          <textarea
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="Example: 5 years of experience in web development, proficient in React, Node.js, and TypeScript. Led a team of 3 developers and delivered 10+ successful projects..."
            className="form-textarea h-24"
            rows={4}
          />
        </div>
      )}

      {resumeType === 'improve' && (
        <div className="mb-6">
          <div className="flex space-x-2 mb-3">
            {[
              { value: 'pdf', label: 'Upload PDF', icon: Upload },
              { value: 'url', label: 'Paste URL', icon: Link },
              { value: 'text', label: 'Paste Text', icon: FileText }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setExistingResumeType(option.value as any)}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors flex items-center justify-center space-x-1 ${
                  existingResumeType === option.value
                    ? 'bg-primary-100 text-primary-700 border border-primary-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                <option.icon className="w-4 h-4" />
                <span>{option.label}</span>
              </button>
            ))}
          </div>

          {existingResumeType && (
            <div>
              {existingResumeType === 'text' ? (
                <textarea
                  value={existingResumeContent}
                  onChange={(e) => setExistingResumeContent(e.target.value)}
                  placeholder="Paste your resume text here..."
                  className="form-textarea h-32"
                  rows={6}
                />
              ) : existingResumeType === 'url' ? (
                <input
                  type="url"
                  value={existingResumeContent}
                  onChange={(e) => setExistingResumeContent(e.target.value)}
                  placeholder="https://example.com/resume.pdf"
                  className="form-input"
                />
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload PDF file</p>
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setExistingResumeContent(file.name)
                      }
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )

  const canProceed = () => {
    if (generationRequest?.type === 'cover-letter') {
      return tone !== null
    } else if (generationRequest?.type === 'resume') {
      if (resumeType === 'generate') {
        return experience.trim().length > 0
      } else if (resumeType === 'improve') {
        return existingResumeType && existingResumeContent.trim().length > 0
      }
    }
    return false
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        {generationRequest?.type === 'cover-letter' ? renderCoverLetterOptions() : renderResumeOptions()}

        <button
          onClick={handleGenerate}
          disabled={!canProceed()}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            canProceed()
              ? 'bg-primary-600 hover:bg-primary-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {generationRequest?.type === 'cover-letter' ? 'Generate Cover Letter' : 'Generate Resume'}
        </button>
      </div>
    </div>
  )
}

export default Step3
