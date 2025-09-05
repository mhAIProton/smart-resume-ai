import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Mail } from 'lucide-react'

const Step2: React.FC = () => {
  const navigate = useNavigate()
  // const { setGenerationRequest, jobDescription } = useAppStore()
  const [selectedType, setSelectedType] = useState<'resume' | 'cover-letter' | null>(null)

  let setGenerationRequest = (props: any) => console.log(props), jobDescription;

  const handleContinue = () => {
    if (selectedType && jobDescription) {
      setGenerationRequest({
        type: selectedType,
        jobDescription: jobDescription
      })
      navigate('/step3')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          What do you want to generate?
        </h2>

        <div className="space-y-3 mb-6">
          <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="type"
              value="resume"
              checked={selectedType === 'resume'}
              onChange={(e) => setSelectedType(e.target.value as 'resume')}
              className="sr-only"
            />
            <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
              selectedType === 'resume' 
                ? 'border-primary-600 bg-primary-600' 
                : 'border-gray-300'
            }`}>
              {selectedType === 'resume' && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </div>
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-gray-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Resume</div>
                <div className="text-sm text-gray-500">Generate or improve your resume</div>
              </div>
            </div>
          </label>

          <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="type"
              value="cover-letter"
              checked={selectedType === 'cover-letter'}
              onChange={(e) => setSelectedType(e.target.value as 'cover-letter')}
              className="sr-only"
            />
            <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
              selectedType === 'cover-letter' 
                ? 'border-primary-600 bg-primary-600' 
                : 'border-gray-300'
            }`}>
              {selectedType === 'cover-letter' && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </div>
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-gray-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Cover Letter</div>
                <div className="text-sm text-gray-500">Generate a personalized cover letter</div>
              </div>
            </div>
          </label>
        </div>

        <button
          onClick={handleContinue}
          disabled={!selectedType}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            selectedType
              ? 'bg-primary-600 hover:bg-primary-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

export default Step2
