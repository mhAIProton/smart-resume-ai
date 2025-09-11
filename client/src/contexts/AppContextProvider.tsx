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
    uploadedFileName?: string; // Для отображения имени файла
}

export interface AppContextType {
    // Auth state
    isAuthenticated: boolean;
    user: User | null;
    oauthError: boolean;
    
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
    showSubscriptionsPopup: boolean;
    showMessagePopup: boolean;
    showLoader: boolean;
    messagePopupData: {
        type: 'message' | 'error';
        title: string;
        subtitle: string;
        buttonText?: string;
    } | null;
    
    // Actions
    setUser: (user: User | null) => void;
    setOauthError: (error: boolean) => void;
    setJobDescription: (jobDescription: JobDescription | null) => void;
    setGenerationType: (type: 'resume' | 'cover-letter' | null) => void;
    setSelectedTone: (tone: 'formal' | 'friendly' | 'bold' | null) => void;
    setResumeData: (data: ResumeData | null) => void;
    setSelectedDesign: (design: 'classic' | 'modern' | 'minimal' | null) => void;
    setLoading: (loading: boolean) => void;
    setShowAuthModal: (show: boolean) => void;
    setShowSubscriptionsPopup: (show: boolean) => void;
    setShowMessagePopup: (show: boolean) => void;
    setShowLoader: (show: boolean) => void;
    setMessagePopupData: (data: {
        type: 'message' | 'error';
        title: string;
        subtitle: string;
        buttonText?: string;
    } | null) => void;
    login: (user: User) => void;
    logout: () => void;
    clearFormData: () => void; // Новая функция для очистки данных форм
}

export const AppContext = createContext<AppContextType>({
    isAuthenticated: false,
    user: null,
    oauthError: false,
    jobDescription: null,
    generationType: null,
    selectedTone: null,
    resumeData: null,
    selectedDesign: null,
    loading: false,
    showAuthModal: false,
    showSubscriptionsPopup: false,
    showMessagePopup: false,
    showLoader: false,
    messagePopupData: null,
    setUser: () => {},
    setOauthError: () => {},
    setJobDescription: () => {},
    setGenerationType: () => {},
    setSelectedTone: () => {},
    setResumeData: () => {},
    setSelectedDesign: () => {},
    setLoading: () => {},
    setShowAuthModal: () => {},
    setShowSubscriptionsPopup: () => {},
    setShowMessagePopup: () => {},
    setShowLoader: () => {},
    setMessagePopupData: () => {},
    login: () => {},
    logout: () => {},
    clearFormData: () => {},
});

// Ключи для localStorage
const STORAGE_KEYS = {
    JOB_DESCRIPTION: 'smart_resume_job_description',
    GENERATION_TYPE: 'smart_resume_generation_type',
    SELECTED_TONE: 'smart_resume_selected_tone',
    RESUME_DATA: 'smart_resume_resume_data',
    SELECTED_DESIGN: 'smart_resume_selected_design',
};

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUserState] = useState<User | null>(null);
    const [oauthError, setOauthError] = useState(false);
    const [jobDescription, setJobDescriptionState] = useState<JobDescription | null>(null);
    const [generationType, setGenerationTypeState] = useState<'resume' | 'cover-letter' | null>(null);
    const [selectedTone, setSelectedToneState] = useState<'formal' | 'friendly' | 'bold' | null>(null);
    const [resumeData, setResumeDataState] = useState<ResumeData | null>(null);
    const [selectedDesign, setSelectedDesignState] = useState<'classic' | 'modern' | 'minimal' | null>(null);
    const [loading, setLoading] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showSubscriptionsPopup, setShowSubscriptionsPopup] = useState(false);
    const [showMessagePopup, setShowMessagePopup] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [messagePopupData, setMessagePopupData] = useState<{
        type: 'message' | 'error';
        title: string;
        subtitle: string;
        buttonText?: string;
    } | null>(null);

    // Функции для работы с localStorage
    const saveToStorage = (key: string, data: any) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    };

    const loadFromStorage = (key: string) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    };

    const setUser = (user: User | null) => {
        setUserState(user);
        setIsAuthenticated(!!user);
    };

    const setJobDescription = (jobDescription: JobDescription | null) => {
        setJobDescriptionState(jobDescription);
        if (jobDescription) {
            saveToStorage(STORAGE_KEYS.JOB_DESCRIPTION, jobDescription);
        } else {
            localStorage.removeItem(STORAGE_KEYS.JOB_DESCRIPTION);
        }
    };

    const setGenerationType = (type: 'resume' | 'cover-letter' | null) => {
        setGenerationTypeState(type);
        if (type) {
            saveToStorage(STORAGE_KEYS.GENERATION_TYPE, type);
        } else {
            localStorage.removeItem(STORAGE_KEYS.GENERATION_TYPE);
        }
    };

    const setSelectedTone = (tone: 'formal' | 'friendly' | 'bold' | null) => {
        setSelectedToneState(tone);
        if (tone) {
            saveToStorage(STORAGE_KEYS.SELECTED_TONE, tone);
        } else {
            localStorage.removeItem(STORAGE_KEYS.SELECTED_TONE);
        }
    };

    const setResumeData = (data: ResumeData | null) => {
        setResumeDataState(data);
        if (data) {
            // Сохраняем данные без File объекта (он не сериализуется)
            const dataToSave = {
                ...data,
                uploadedFile: undefined, // Убираем File объект
            };
            saveToStorage(STORAGE_KEYS.RESUME_DATA, dataToSave);
        } else {
            localStorage.removeItem(STORAGE_KEYS.RESUME_DATA);
        }
    };

    const setSelectedDesign = (design: 'classic' | 'modern' | 'minimal' | null) => {
        setSelectedDesignState(design);
        if (design) {
            saveToStorage(STORAGE_KEYS.SELECTED_DESIGN, design);
        } else {
            localStorage.removeItem(STORAGE_KEYS.SELECTED_DESIGN);
        }
    };

    const clearFormData = () => {
        setJobDescription(null);
        setGenerationType(null);
        setSelectedTone(null);
        setResumeData(null);
        setSelectedDesign(null);
        
        // Очищаем localStorage
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    };

    const login = (user: User) => {
        setUser(user);
        setShowAuthModal(false);
        setOauthError(false);
    };

    const logout = () => {
        setUser(null);
        clearFormData();
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

    // Загружаем сохраненные данные форм при инициализации
    const loadFormData = () => {
        const savedJobDescription = loadFromStorage(STORAGE_KEYS.JOB_DESCRIPTION);
        const savedGenerationType = loadFromStorage(STORAGE_KEYS.GENERATION_TYPE);
        const savedSelectedTone = loadFromStorage(STORAGE_KEYS.SELECTED_TONE);
        const savedResumeData = loadFromStorage(STORAGE_KEYS.RESUME_DATA);
        const savedSelectedDesign = loadFromStorage(STORAGE_KEYS.SELECTED_DESIGN);

        if (savedJobDescription) setJobDescriptionState(savedJobDescription);
        if (savedGenerationType) setGenerationTypeState(savedGenerationType);
        if (savedSelectedTone) setSelectedToneState(savedSelectedTone);
        if (savedResumeData) setResumeDataState(savedResumeData);
        if (savedSelectedDesign) setSelectedDesignState(savedSelectedDesign);
    };

    // Проверяем авторизацию и загружаем данные форм при загрузке приложения
    useEffect(() => {
        checkAuth();
        loadFormData();
    }, []);

    return (
        <AppContext.Provider
            value={{
                isAuthenticated,
                user,
                oauthError,
                jobDescription,
                generationType,
                selectedTone,
                resumeData,
                selectedDesign,
                loading,
                showAuthModal,
                showSubscriptionsPopup,
                showMessagePopup,
                showLoader,
                messagePopupData,
                setUser,
                setOauthError,
                setJobDescription,
                setGenerationType,
                setSelectedTone,
                setResumeData,
                setSelectedDesign,
                setLoading,
                setShowAuthModal,
                setShowSubscriptionsPopup,
                setShowMessagePopup,
                setShowLoader,
                setMessagePopupData,
                login,
                logout,
                clearFormData,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);