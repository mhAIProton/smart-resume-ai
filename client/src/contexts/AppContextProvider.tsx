import React, { useState, ReactNode, createContext, useContext, useEffect } from 'react';

export interface User {
    id?: string;
    email?: string;
    name?: string;
    plan: 'Free' | 'Pro' | 'Premium';
    remainingGenerations: number;
}

export interface JobDescription {
    text: string;
    url?: string;
    source: 'manual' | 'url';
}

export interface ResumeData {
    option: 'generate' | 'improve';
    generateText?: string;
    improveText?: string;
    uploadedFile?: File;
}

export interface AppContextType {
    // Auth state
    isAuthenticated: boolean;
    user: User | null;
    
    // Job description state
    jobDescription: JobDescription | null;
    
    // Generation type state
    generationType: 'resume' | 'cover-letter' | null;
    
    // Tone state
    selectedTone: 'formal' | 'friendly' | 'bold' | null;
    
    // Resume data state
    resumeData: ResumeData | null;
    
    // Design state
    selectedDesign: 'classic' | 'modern' | 'minimal' | null;
    
    // UI state
    loading: boolean;
    showAuthModal: boolean;
    
    // Actions
    setUser: (user: User | null) => void;
    setJobDescription: (jobDescription: JobDescription | null) => void;
    setGenerationType: (type: 'resume' | 'cover-letter' | null) => void;
    setSelectedTone: (tone: 'formal' | 'friendly' | 'bold' | null) => void;
    setResumeData: (data: ResumeData | null) => void;
    setSelectedDesign: (design: 'classic' | 'modern' | 'minimal' | null) => void;
    setLoading: (loading: boolean) => void;
    setShowAuthModal: (show: boolean) => void;
    login: (user: User) => void;
    logout: () => void;
}

export const AppContext = createContext<AppContextType>({
    isAuthenticated: false,
    user: null,
    jobDescription: null,
    generationType: null,
    selectedTone: null,
    resumeData: null,
    selectedDesign: null,
    loading: false,
    showAuthModal: false,
    setUser: () => {},
    setJobDescription: () => {},
    setGenerationType: () => {},
    setSelectedTone: () => {},
    setResumeData: () => {},
    setSelectedDesign: () => {},
    setLoading: () => {},
    setShowAuthModal: () => {},
    login: () => {},
    logout: () => {},
});

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUserState] = useState<User | null>(null);
    const [jobDescription, setJobDescriptionState] = useState<JobDescription | null>(null);
    const [generationType, setGenerationTypeState] = useState<'resume' | 'cover-letter' | null>(null);
    const [selectedTone, setSelectedToneState] = useState<'formal' | 'friendly' | 'bold' | null>(null);
    const [resumeData, setResumeDataState] = useState<ResumeData | null>(null);
    const [selectedDesign, setSelectedDesignState] = useState<'classic' | 'modern' | 'minimal' | null>(null);
    const [loading, setLoading] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    const setUser = (user: User | null) => {
        setUserState(user);
        setIsAuthenticated(!!user);
    };

    const setJobDescription = (jobDescription: JobDescription | null) => {
        setJobDescriptionState(jobDescription);
    };

    const setGenerationType = (type: 'resume' | 'cover-letter' | null) => {
        setGenerationTypeState(type);
    };

    const setSelectedTone = (tone: 'formal' | 'friendly' | 'bold' | null) => {
        setSelectedToneState(tone);
    };

    const setResumeData = (data: ResumeData | null) => {
        setResumeDataState(data);
    };

    const setSelectedDesign = (design: 'classic' | 'modern' | 'minimal' | null) => {
        setSelectedDesignState(design);
    };

    const login = (user: User) => {
        setUser(user);
        setShowAuthModal(false);
    };

    const logout = () => {
        setUser(null);
        setJobDescription(null);
        setGenerationType(null);
        setSelectedTone(null);
        setResumeData(null);
        setSelectedDesign(null);
        localStorage.removeItem('auth_token');
    };

    // Функция для проверки авторизации при загрузке приложения
    const checkAuth = async () => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser({
                        id: userData.id,
                        email: userData.email,
                        name: userData.name,
                        plan: userData.plan,
                        remainingGenerations: userData.remainingGenerations,
                    });
                } else {
                    // Токен недействителен, удаляем его
                    localStorage.removeItem('auth_token');
                }
            } catch (error) {
                console.error('Error checking auth:', error);
                localStorage.removeItem('auth_token');
            }
        }
    };

    // Проверяем авторизацию при загрузке приложения
    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AppContext.Provider
            value={{
                isAuthenticated,
                user,
                jobDescription,
                generationType,
                selectedTone,
                resumeData,
                selectedDesign,
                loading,
                showAuthModal,
                setUser,
                setJobDescription,
                setGenerationType,
                setSelectedTone,
                setResumeData,
                setSelectedDesign,
                setLoading,
                setShowAuthModal,
                login,
                logout,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);