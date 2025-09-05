import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Link, Eye, EyeOff } from 'lucide-react'

const Step1: React.FC = () => {
  const navigate = useNavigate()
  // const { setJobDescription } = {}
  const [jobText, setJobText] = useState('')
  const [jobUrl, setJobUrl] = useState('')
  const [inputType, setInputType] = useState<'text' | 'url'>('text')
  const [showExample, setShowExample] = useState(false)

  let setJobDescription = () => {}

  const exampleJobDescription = `Software Engineer - Full Stack Developer

We are looking for a talented Full Stack Developer to join our growing team. You will be responsible for developing and maintaining web applications using modern technologies.

Requirements:
- 3+ years of experience in web development
- Proficiency in React, Node.js, and TypeScript
- Experience with databases (PostgreSQL, MongoDB)
- Knowledge of cloud platforms (AWS, Azure)
- Strong problem-solving skills
- Bachelor's degree in Computer Science or related field

Responsibilities:
- Develop and maintain web applications
- Collaborate with cross-functional teams
- Write clean, maintainable code
- Participate in code reviews
- Stay up-to-date with industry trends

Benefits:
- Competitive salary
- Health insurance
- Remote work options
- Professional development opportunities`

  const handleContinue = () => {
    if (inputType === 'text' && jobText.trim()) {
      setJobDescription({
        text: jobText.trim(),
        source: 'manual'
      })
      navigate('/step2')
    } else if (inputType === 'url' && jobUrl.trim()) {
      setJobDescription({
        text: '',
        url: jobUrl.trim(),
        source: 'url'
      })
      navigate('/step2')
    }
  }

  const isValid = () => {
    if (inputType === 'text') {
      return jobText.trim().length > 0
    } else {
      return jobUrl.trim().length > 0
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Paste job description or job link
        </h2>
        
        <div className="mb-4">
          <button
            onClick={() => setShowExample(!showExample)}
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
          >
            {showExample ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>
              {showExample ? 'Close example' : 'See example'}
            </span>
          </button>
        </div>

        {showExample && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Example job description:</h4>
            <div className="text-xs text-gray-600 whitespace-pre-line max-h-32 overflow-y-auto">
              {exampleJobDescription}
            </div>
          </div>
        )}

        <div className="mb-4">
          <div className="flex space-x-1 mb-3">
            <button
              onClick={() => setInputType('text')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
                inputType === 'text'
                  ? 'bg-primary-100 text-primary-700 border border-primary-200'
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-1" />
              Job Description
            </button>
            <button
              onClick={() => setInputType('url')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
                inputType === 'url'
                  ? 'bg-primary-100 text-primary-700 border border-primary-200'
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}
            >
              <Link className="w-4 h-4 inline mr-1" />
              Job Link
            </button>
          </div>

          {inputType === 'text' ? (
            <textarea
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              placeholder="Paste the job description here..."
              className="form-textarea h-32"
              rows={6}
            />
          ) : (
            <input
              type="url"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://example.com/job-posting"
              className="form-input"
            />
          )}
        </div>

        <button
          onClick={handleContinue}
          disabled={!isValid()}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            isValid()
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

export default Step1
