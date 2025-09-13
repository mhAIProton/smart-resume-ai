import React from 'react';
import {useNavigation} from '@/contexts/NavigationContext';

const BackButton: React.FC = () => {
    const {goBack, canGoBack, currentStep} = useNavigation();

    // Не показывать кнопку Back на главной странице и на странице результата
    if (currentStep === 'main' || currentStep === 'result' || !canGoBack) {
        return null;
    }

    const handleBack = () => {
        goBack();
    };

    return (
        <div className="mx-auto px-3 pb-4">
            <button
                onClick={handleBack}
                className="text-blue-700 hover:underline flex gap-1 items-center"
            >
                <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M0.21967 4.46966C0.0790176 4.61032 0 4.80108 0 4.99999C-4.76835e-07 5.19891 0.0790172 5.38967 0.219669 5.53032L4.21967 9.53033C4.51256 9.82322 4.98744 9.82322 5.28033 9.53033C5.57322 9.23744 5.57322 8.76256 5.28033 8.46967L1.81066 4.99999L5.28033 1.53033C5.57322 1.23744 5.57322 0.762564 5.28033 0.46967C4.98744 0.176777 4.51256 0.176777 4.21967 0.469669L0.21967 4.46966Z"
                        fill="#0026FF"/>
                </svg>
                Back
            </button>
        </div>
    );
};

export default BackButton;
