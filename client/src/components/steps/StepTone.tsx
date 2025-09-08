import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAppContext} from '@/contexts/AppContextProvider';

interface ToneOption {
    value: 'formal' | 'friendly' | 'bold';
    title: string;
    description: string;
    example: string;
}

const StepTone: React.FC = () => {
    const navigate = useNavigate();
    const {selectedTone: contextTone, setSelectedTone} = useAppContext();
    const [selectedTone, setSelectedToneLocal] = useState<'formal' | 'friendly' | 'bold' | null>(contextTone);

    const toneOptions: ToneOption[] = [
        {
            value: 'formal',
            title: 'Formal',
            description: 'Professional and respectful',
            example: 'Dear Hiring Manager, I am writing to…'
        },
        {
            value: 'friendly',
            title: 'Friendly',
            description: 'Conversational and natural',
            example: 'Hi team, I\'m excited about to say…'
        },
        {
            value: 'bold',
            title: 'Bold',
            description: 'Confident and direct',
            example: 'Let\'s cut to the chase — I\'m your next hire.'
        }
    ];

    const handleToneChange = (tone: 'formal' | 'friendly' | 'bold') => {
        setSelectedToneLocal(tone);
        setSelectedTone(tone);
    };

    const handleContinue = () => {
        if (selectedTone) {
            navigate('/result');
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Choose tone for your cover letter
            </h2>

            <div className="space-y-3 mb-6">
                {toneOptions.map((option) => (
                    <label
                        key={option.value}
                        className={`flex flex-col p-4 border rounded-lg cursor-pointer transition-colors w-full`}
                    >
                        <input
                            type="radio"
                            name="tone"
                            value={option.value}
                            checked={selectedTone === option.value}
                            onChange={() => handleToneChange(option.value)}
                            className="sr-only"
                        />

                        <div className="flex">
                            <div className="pr-2">
                                {selectedTone === option.value
                                    ? <img src="/mark.svg" alt={option.value}/>
                                    : <img src="/circle.svg" alt={option.value}/>
                                }
                            </div>

                            <div className="w-full">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-medium text-gray-900">{option.title}</h3>
                                    <span className="text-sm text-gray-500">{option.description}</span>
                                </div>

                                <div className="flex gap-2 items-start bg-gray-100 rounded-md p-3 mt-2">
                                    <img src="/megaphone.svg" alt="Example"/>
                                    <p className="text-sm text-gray-900 italic">"{option.example}"</p>
                                </div>
                            </div>
                        </div>
                    </label>
                ))}
            </div>

            <button
                onClick={handleContinue}
                disabled={!selectedTone}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    selectedTone
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
                Continue
            </button>
        </div>
    );
};

export default StepTone;
