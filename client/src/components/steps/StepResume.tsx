import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '@/contexts/AppContextProvider'

const StepResume: React.FC = () => {
  const navigate = useNavigate()
  const { resumeData, setResumeData } = useAppContext()
  const [selectedOption, setSelectedOption] = useState<'generate' | 'improve' | null>(resumeData?.option || null)
  const [generateText, setGenerateText] = useState('')
  const [improveText, setImproveText] = useState('')
  const [improveTab, setImproveTab] = useState<'paste' | 'upload'>('paste')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [showExample, setShowExample] = useState(false)

  const exampleText = '5+ years in product design, skilled in Figma, UX writing, accessibility, looking for a role in health tech'

  const handleGenerateContinue = () => {
    if (selectedOption === 'generate' && generateText.trim()) {
      setResumeData({
        option: 'generate',
        generateText: generateText.trim()
      });
      navigate('/design');
    }
  }

  const handleImproveContinue = () => {
    if (selectedOption === 'improve' && (improveText.trim() || uploadedFile)) {
      setResumeData({
        option: 'improve',
        improveText: improveText.trim(),
        uploadedFile: uploadedFile || undefined
      });
      navigate('/design');
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file)
    }
  }

  const isValid = () => {
    if (selectedOption === 'generate') {
      return generateText.trim().length > 0
    } else if (selectedOption === 'improve') {
      return improveText.trim().length > 0 || uploadedFile !== null
    }
    return false
  }

  const hasInput = () => {
    if (selectedOption === 'generate') {
      return generateText.trim().length > 0
    } else if (selectedOption === 'improve') {
      return improveText.trim().length > 0 || uploadedFile !== null
    }
    return false
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        How do you want to generate your resume?
      </h2>

      <div className="space-y-4 mb-6">
        {/* Generate from scratch option */}
        <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${
          selectedOption === 'generate' 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}>
          <div
            onClick={() => setSelectedOption('generate')}
            className="flex items-start space-x-3"
          >
            <input
              type="radio"
              name="resume-option"
              value="generate"
              checked={selectedOption === 'generate'}
              onChange={() => setSelectedOption('generate')}
              className="mt-1"
            />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">Generate from scratch</h3>
              <p className="text-sm text-gray-500">Create a resume using your background and skills</p>
            </div>
          </div>

          {selectedOption === 'generate' && (
            <div className="mt-4 space-y-3">
              <textarea
                value={generateText}
                onChange={(e) => setGenerateText(e.target.value)}
                placeholder="Tell us about your experience, skills, tools, or goals"
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />

              {generateText.trim() && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Text input detected. Ready to continue</span>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Not sure what to write?</span>
                <button
                  onClick={() => setShowExample(!showExample)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {showExample ? 'Close example' : 'See example'}
                </button>
              </div>

              {showExample && (
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <div className="text-sm text-gray-700">
                    {exampleText}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Improve my resume option */}
        <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${
          selectedOption === 'improve' 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}>
          <div
            onClick={() => setSelectedOption('improve')}
            className="flex items-start space-x-3"
          >
            <input
              type="radio"
              name="resume-option"
              value="improve"
              checked={selectedOption === 'improve'}
              onChange={() => setSelectedOption('improve')}
              className="mt-1"
            />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">Improve my resume</h3>
              <p className="text-sm text-gray-500">Paste, upload or link to your current resume</p>
            </div>
          </div>

          {selectedOption === 'improve' && (
            <div className="mt-4 space-y-3">
              {/* Tabs */}
              <div className="flex space-x-1">
                <button
                  onClick={() => setImproveTab('paste')}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
                    improveTab === 'paste'
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  Paste Text
                </button>
                <button
                  onClick={() => setImproveTab('upload')}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
                    improveTab === 'upload'
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  Upload PDF
                </button>
              </div>

              {/* Tab content */}
              {improveTab === 'paste' ? (
                <textarea
                  value={improveText}
                  onChange={(e) => setImproveText(e.target.value)}
                  placeholder="Paste your resume text here..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={6}
                />
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label
                    htmlFor="pdf-upload"
                    className="cursor-pointer inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <span>Upload File</span>
                  </label>
                  {uploadedFile && (
                    <p className="mt-2 text-sm text-gray-600">{uploadedFile.name}</p>
                  )}
                </div>
              )}

              {hasInput() && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">User input detected. Ready to continue</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={selectedOption === 'generate' ? handleGenerateContinue : handleImproveContinue}
        disabled={!isValid()}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          isValid()
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  )
}

export default StepResume
