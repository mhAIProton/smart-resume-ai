import React, { useState, useEffect } from 'react';
import { RefreshCw, Copy, Download, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const Step4: React.FC = () => {
  const { generationRequest, generationResult, setGenerationResult, setLoading, isLoading, decrementGenerations } = {}
  const [content, setContent] = useState('')
  const [design, setDesign] = useState<'classic' | 'modern' | 'minimalist'>('classic')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Simulate API call to generate content
    if (generationRequest && !generationResult) {
      generateContent()
    } else if (generationResult) {
      setContent(generationResult.content)
    }
  }, [generationRequest, generationResult])

  const generateContent = async () => {
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const mockContent = generationRequest?.type === 'cover-letter' 
      ? generateMockCoverLetter()
      : generateMockResume()
    
    const result = {
      id: Date.now().toString(),
      type: generationRequest!.type,
      content: mockContent,
      design: generationRequest!.type === 'resume' ? design : undefined,
      createdAt: new Date().toISOString()
    }
    
    setGenerationResult(result)
    setContent(mockContent)
    setLoading(false)
    decrementGenerations()
  }

  const generateMockCoverLetter = () => {
    return `Dear Hiring Manager,

I am writing to express my strong interest in the Software Engineer position at your company. With my extensive experience in full-stack development and passion for creating innovative solutions, I am confident that I would be a valuable addition to your team.

In my previous role, I have successfully developed and maintained web applications using React, Node.js, and TypeScript. I have experience working with databases including PostgreSQL and MongoDB, and I am familiar with cloud platforms such as AWS and Azure. My strong problem-solving skills and attention to detail have allowed me to deliver high-quality solutions that meet both technical requirements and business objectives.

I am particularly drawn to this opportunity because of your company's commitment to innovation and growth. I am excited about the possibility of contributing to your team's success while continuing to develop my skills in a challenging and dynamic environment.

Thank you for considering my application. I look forward to the opportunity to discuss how my skills and experience can contribute to your team's continued success.

Sincerely,
[Your Name]`
  }

  const generateMockResume = () => {
    return `JOHN DOE
Software Engineer | Full Stack Developer
john.doe@email.com | (555) 123-4567 | linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Experienced Full Stack Developer with 5+ years of expertise in web application development. Proficient in React, Node.js, TypeScript, and modern cloud technologies. Proven track record of delivering scalable solutions and leading development teams.

TECHNICAL SKILLS
• Frontend: React, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS
• Backend: Node.js, Express.js, Python, Django
• Databases: PostgreSQL, MongoDB, Redis
• Cloud: AWS, Azure, Docker, Kubernetes
• Tools: Git, Jenkins, Jira, Figma

PROFESSIONAL EXPERIENCE

Senior Software Engineer | Tech Company Inc. | 2021 - Present
• Led development of 10+ web applications serving 100K+ users
• Mentored team of 3 junior developers and improved code quality by 40%
• Implemented CI/CD pipelines reducing deployment time by 60%
• Collaborated with cross-functional teams to deliver features on time

Software Engineer | StartupXYZ | 2019 - 2021
• Developed responsive web applications using React and Node.js
• Integrated third-party APIs and payment systems
• Optimized database queries improving application performance by 30%
• Participated in agile development processes and code reviews

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2015 - 2019

CERTIFICATIONS
• AWS Certified Developer Associate
• Google Cloud Professional Developer`
  }

  const handleRegenerate = () => {
    setGenerationResult(null)
    generateContent()
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      toast.success('Content copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy content')
    }
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([content], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${generationRequest?.type === 'cover-letter' ? 'cover-letter' : 'resume'}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success('File downloaded successfully!')
  }

  const handleDesignChange = (newDesign: 'classic' | 'modern' | 'minimalist') => {
    setDesign(newDesign)
    // In real app, this would trigger a re-render with new design
  }

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto">
        <div className="card text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Generating your {generationRequest?.type === 'cover-letter' ? 'cover letter' : 'resume'}...</h3>
          <p className="text-sm text-gray-500">This may take a few moments</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Your draft is ready
        </h2>

        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-textarea h-64 resize-none"
            rows={12}
          />
        </div>

        {generationRequest?.type === 'resume' && (
          <div className="mb-4">
            <label className="form-label">Design Style</label>
            <div className="flex space-x-2">
              {[
                { value: 'classic', label: 'Classic' },
                { value: 'modern', label: 'Modern' },
                { value: 'minimalist', label: 'Minimalist' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleDesignChange(option.value as any)}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
                    design === option.value
                      ? 'bg-primary-100 text-primary-700 border border-primary-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <button
            onClick={handleRegenerate}
            className="flex-1 btn-outline flex items-center justify-center space-x-1"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Regenerate</span>
          </button>
          
          <button
            onClick={handleCopy}
            className="flex-1 btn-outline flex items-center justify-center space-x-1"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>
          
          <button
            onClick={handleDownload}
            className="flex-1 btn-outline flex items-center justify-center space-x-1"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Step4
