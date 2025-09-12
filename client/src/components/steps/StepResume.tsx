import React, {useState, useEffect} from 'react'
import {useAppContext} from '@/contexts/AppContextProvider'
import {useNavigation} from '@/contexts/NavigationContext'
import { useUploadFile } from '@/hooks/useApi'
import toast from 'react-hot-toast'

const StepResume: React.FC = () => {
    const {navigate} = useNavigation()
    const {resumeData, setResumeData} = useAppContext()
    const [selectedOption, setSelectedOption] = useState<'generate' | 'improve' | null>(null)
    const [generateText, setGenerateText] = useState('')
    const [improveText, setImproveText] = useState('')
    const [improveTab, setImproveTab] = useState<'paste' | 'upload'>('paste')
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [showExample, setShowExample] = useState(false)
    
    const uploadFile = useUploadFile()

    const exampleText = '5+ years in product design, skilled in Figma, UX writing, accessibility, looking for a role in health tech'

    // Восстанавливаем данные из контекста при загрузке компонента
    useEffect(() => {
        if (resumeData) {
            setSelectedOption(resumeData.option)
            if (resumeData.generateText) {
                setGenerateText(resumeData.generateText)
            }
            if (resumeData.improveText) {
                setImproveText(resumeData.improveText)
                setImproveTab('paste')
            }
            if (resumeData.uploadedFile) {
                setUploadedFile(resumeData.uploadedFile)
                setImproveTab('upload')
            }
        }
    }, [resumeData])

    const handleGenerateContinue = async () => {
        if (selectedOption === 'generate' && generateText.trim()) {
            await setResumeData({
                option: 'generate',
                generateText: generateText.trim()
            });
            navigate('design');
        }
    }

    const handleImproveContinue = async () => {
        if (selectedOption === 'improve' && (improveText.trim() || uploadedFile)) {
            await setResumeData({
                option: 'improve',
                improveText: improveText.trim(),
                uploadedFile: uploadedFile || undefined,
                uploadedFileName: uploadedFile?.name
            });
            navigate('design');
        }
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file && file.type === 'application/pdf') {
            setUploadedFile(file)
            
            try {
                // Загружаем файл на сервер и извлекаем текст
                const content = await uploadFile.execute(file)
                if (content) {
                    setImproveText(content)
                    toast.success('File uploaded and text extracted successfully!')
                }
            } catch (error) {
                console.error('File upload error:', error)
                setUploadedFile(null)
            }
        } else {
            toast.error('Please select a valid PDF file')
        }
    }

    const handleRemoveFile = () => {
        setUploadedFile(null)
        // Очищаем input
        const fileInput = document.getElementById('pdf-upload') as HTMLInputElement
        if (fileInput) {
            fileInput.value = ''
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
                <div className={`border rounded-lg p-2 cursor-pointer transition-colors border-gray-300 hover:border-gray-400`}>
                    <div
                        onClick={() => setSelectedOption('generate')}
                        className="flex items-start"
                    >
                        <input
                            type="radio"
                            name="resume-option"
                            value="generate"
                            checked={selectedOption === 'generate'}
                            onChange={() => setSelectedOption('generate')}
                            className="sr-only"
                        />
                        <div className="min-w-[32px] pr-2">
                            {selectedOption === 'generate'
                                ? <img src="/mark.svg" alt="Generate from scratch"/>
                                : <img src="/circle.svg" alt="Generate from scratch"/>
                            }
                        </div>
                        <div className="w-full flex flex-col">
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-900 mb-1">Generate from scratch</h3>
                                <p className="text-sm text-gray-500">Create a resume using your background and
                                    skills</p>
                            </div>
                            {selectedOption === 'generate' && (
                                <div className="max-w-full mt-2">
                                    <textarea
                                        value={generateText}
                                        onChange={(e) => setGenerateText(e.target.value)}
                                        placeholder="Tell us about your experience, skills, tools, or goals"
                                        className="w-full p-2 border rounded-lg resize-none border-gray-300 bg-gray-200 focus-visible:border-gray-600"
                                        rows={4}
                                    />

                                    {generateText.trim() && (
                                        <div className="flex items-center space-x-1 py-1">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span className="text-sm text-green-600">Text input detected. Ready to continue</span>
                                        </div>
                                    )}

                                    <div className="flex items-center space-x-1">
                                        <span className="text-sm text-gray-600">Not sure what to write?</span>
                                        <button
                                            onClick={() => setShowExample(!showExample)}
                                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            {showExample ? 'Close example' : 'See example'}
                                        </button>
                                    </div>

                                    {showExample && (
                                        <div className="bg-gray-50 text-sm text-gray-400 py-2">
                                            {exampleText}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Improve my resume option */}
                <div className={`border rounded-lg p-2 cursor-pointer transition-colors border-gray-300 hover:border-gray-400`}>
                    <div
                        onClick={() => setSelectedOption('improve')}
                        className="flex items-start"
                    >
                        <input
                            type="radio"
                            name="resume-option"
                            value="improve"
                            checked={selectedOption === 'improve'}
                            onChange={() => setSelectedOption('improve')}
                            className="sr-only"
                        />
                        <div className="min-w-[32px] pr-2">
                            {selectedOption === 'improve'
                                ? <img src="/mark.svg" alt="Generate from scratch"/>
                                : <img src="/circle.svg" alt="Generate from scratch"/>
                            }
                        </div>
                        <div className="w-full flex flex-col">
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-900 mb-1">Improve my resume</h3>
                                <p className="text-sm text-gray-500">Paste, upload or link to your current resume</p>
                            </div>

                            {selectedOption === 'improve' && (
                                <div className="mt-4 space-y-3">
                                    {/* Tabs */}
                                    <div className="flex bg-gray-200 p-1.5 rounded-s-md">
                                        <button
                                            onClick={() => setImproveTab('paste')}
                                            className={`flex-1 py-2 px-3 text-sm rounded-s-md transition-colors ${
                                                improveTab === 'paste'
                                                    ? 'bg-white text-gray-900'
                                                    : 'bg-gray-200 text-gray-500 border border-gray-200'
                                            }`}
                                        >
                                            Paste Text
                                        </button>
                                        <button
                                            onClick={() => setImproveTab('upload')}
                                            className={`flex-1 py-2 px-3 text-sm rounded-lg transition-colors ${
                                                improveTab === 'upload'
                                                    ? 'bg-white text-gray-900'
                                                    : 'bg-gray-200 text-gray-500 border border-gray-200'
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
                                            className="w-full p-3 border rounded-lg resize-none border-gray-300 bg-gray-200 focus-visible:border-gray-600"
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
                                            
                                            {uploadFile.loading ? (
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-center space-x-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                        <img src="/generating.svg" alt="Uploading" className="w-5 h-5 animate-spin text-blue-600"/>
                                                        <span className="text-sm text-blue-700 font-medium">Uploading and extracting text...</span>
                                                    </div>
                                                </div>
                                            ) : uploadedFile ? (
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-center space-x-2 bg-green-50 border border-green-200 rounded-lg p-3">
                                                        <img src="/upload.svg" alt="File uploaded" className="w-5 h-5 text-green-600"/>
                                                        <span className="text-sm text-green-700 font-medium">{uploadedFile.name}</span>
                                                        <button
                                                            onClick={handleRemoveFile}
                                                            className="ml-2 text-red-600 hover:text-red-700"
                                                            title="Remove file"
                                                        >
                                                            <img src="/squared-cross.svg" alt="Remove" className="w-4 h-4"/>
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => document.getElementById('pdf-upload')?.click()}
                                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                                    >
                                                        Upload different file
                                                    </button>
                                                </div>
                                            ) : (
                                                <label
                                                    htmlFor="pdf-upload"
                                                    className="w-full justify-center cursor-pointer inline-flex items-center space-x-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors"
                                                >
                                                    <img src="/upload.svg" alt="Upload File"/>
                                                    <span>Upload File</span>
                                                </label>
                                            )}
                                        </div>
                                    )}

                                    {hasInput() && (
                                        <div className="flex items-center space-x-1">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span
                                                className="text-sm text-green-600">User input detected. Ready to continue</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
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
