import React, { createContext, useContext, useState, ReactNode } from 'react';

export type NavigationStep = 'main' | 'type' | 'resume' | 'design' | 'tone' | 'result' | 'auth-callback';

interface NavigationContextType {
  currentStep: NavigationStep;
  navigate: (step: NavigationStep) => void;
  goBack: () => void;
  canGoBack: boolean;
}

const NavigationContext = createContext<NavigationContextType>({
  currentStep: 'main',
  navigate: () => {},
  goBack: () => {},
  canGoBack: false,
});

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<NavigationStep>('main');
  const [history, setHistory] = useState<NavigationStep[]>(['main']);

  const navigate = (step: NavigationStep) => {
    setCurrentStep(step);
    setHistory(prev => [...prev, step]);
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // Remove current step
      const previousStep = newHistory[newHistory.length - 1];
      setCurrentStep(previousStep);
      setHistory(newHistory);
    }
  };

  const canGoBack = history.length > 1;

  return (
    <NavigationContext.Provider value={{
      currentStep,
      navigate,
      goBack,
      canGoBack,
    }}>
      {children}
    </NavigationContext.Provider>
  );
};
