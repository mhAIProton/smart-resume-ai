import React, { useState, ReactNode, createContext, useContext, useEffect } from 'react';
import { STORAGE_KEYS, saveToStorage, loadFromStorage, removeFromStorage } from '../utils/chromeStorage';

export interface User {
    id?: string;
    email?: string;
    name?: string;
    plan: 'free' | 'pro' | 'pro_plus';
    remainingGenerations: number;
    totalGenerations: number;
    subscriptionStatus: 'active' | 'canceling' | 'canceled';
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
    
    // Regenerate comment state
    regenerateComment: string | null;
    
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
    setUser: (user: User | null) => Promise<void>;
    setOauthError: (error: boolean) => void;
    setJobDescription: (jobDescription: JobDescription | null) => Promise<void>;
    setGenerationType: (type: 'resume' | 'cover-letter' | null) => Promise<void>;
    setSelectedTone: (tone: 'formal' | 'friendly' | 'bold' | null) => Promise<void>;
    setResumeData: (data: ResumeData | null) => Promise<void>;
    setSelectedDesign: (design: 'classic' | 'modern' | 'minimal' | null) => Promise<void>;
    setRegenerateComment: (comment: string | null) => Promise<void>;
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
    login: (user: User) => Promise<void>;
    logout: () => Promise<void>;
    clearFormData: () => Promise<void>; // Новая функция для очистки данных форм
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
    regenerateComment: null,
    loading: false,
    showAuthModal: false,
    showSubscriptionsPopup: false,
    showMessagePopup: false,
    showLoader: false,
    messagePopupData: null,
    setUser: async () => {},
    setOauthError: () => {},
    setJobDescription: async () => {},
    setGenerationType: async () => {},
    setSelectedTone: async () => {},
    setResumeData: async () => {},
    setSelectedDesign: async () => {},
    setRegenerateComment: async () => {},
    setLoading: () => {},
    setShowAuthModal: () => {},
    setShowSubscriptionsPopup: () => {},
    setShowMessagePopup: () => {},
    setShowLoader: () => {},
    setMessagePopupData: () => {},
    login: async () => {},
    logout: async () => {},
    clearFormData: async () => {},
});

// Storage keys are now imported from chromeStorage utility

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUserState] = useState<User | null>(null);
    const [oauthError, setOauthError] = useState(false);
    const [jobDescription, setJobDescriptionState] = useState<JobDescription | null>(null);
    const [generationType, setGenerationTypeState] = useState<'resume' | 'cover-letter' | null>(null);
    const [selectedTone, setSelectedToneState] = useState<'formal' | 'friendly' | 'bold' | null>(null);
    const [resumeData, setResumeDataState] = useState<ResumeData | null>(null);
    const [selectedDesign, setSelectedDesignState] = useState<'classic' | 'modern' | 'minimal' | null>(null);
    const [regenerateComment, setRegenerateCommentState] = useState<string | null>(null);
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

    // Storage functions are now imported from chromeStorage utility

    const setUser = async (user: User | null) => {
        setUserState(user);
        setIsAuthenticated(!!user);
        
        if (user) {
            await saveToStorage(STORAGE_KEYS.USER_DATA, user);
        } else {
            await removeFromStorage(STORAGE_KEYS.USER_DATA);
        }
    };

    const setJobDescription = async (jobDescription: JobDescription | null) => {
        setJobDescriptionState(jobDescription);
        if (jobDescription) {
            await saveToStorage(STORAGE_KEYS.JOB_DESCRIPTION, jobDescription);
        } else {
            await removeFromStorage(STORAGE_KEYS.JOB_DESCRIPTION);
        }
    };

    const setGenerationType = async (type: 'resume' | 'cover-letter' | null) => {
        setGenerationTypeState(type);
        if (type) {
            await saveToStorage(STORAGE_KEYS.GENERATION_TYPE, type);
        } else {
            await removeFromStorage(STORAGE_KEYS.GENERATION_TYPE);
        }
    };

    const setSelectedTone = async (tone: 'formal' | 'friendly' | 'bold' | null) => {
        setSelectedToneState(tone);
        if (tone) {
            await saveToStorage(STORAGE_KEYS.SELECTED_TONE, tone);
        } else {
            await removeFromStorage(STORAGE_KEYS.SELECTED_TONE);
        }
    };

    const setResumeData = async (data: ResumeData | null) => {
        setResumeDataState(data);
        if (data) {
            // Сохраняем данные без File объекта (он не сериализуется)
            const dataToSave = {
                ...data,
                uploadedFile: undefined, // Убираем File объект
            };
            await saveToStorage(STORAGE_KEYS.RESUME_DATA, dataToSave);
        } else {
            await removeFromStorage(STORAGE_KEYS.RESUME_DATA);
        }
    };

    const setSelectedDesign = async (design: 'classic' | 'modern' | 'minimal' | null) => {
        setSelectedDesignState(design);
        if (design) {
            await saveToStorage(STORAGE_KEYS.SELECTED_DESIGN, design);
        } else {
            await removeFromStorage(STORAGE_KEYS.SELECTED_DESIGN);
        }
    };

    const setRegenerateComment = async (comment: string | null) => {
        setRegenerateCommentState(comment);
        if (comment) {
            await saveToStorage(STORAGE_KEYS.REGENERATE_COMMENT, comment);
        } else {
            await removeFromStorage(STORAGE_KEYS.REGENERATE_COMMENT);
        }
    };

    const clearFormData = async () => {
        setJobDescription(null);
        setGenerationType(null);
        setSelectedTone(null);
        setResumeData(null);
        setSelectedDesign(null);
        setRegenerateComment(null);
        
        // Очищаем storage
        const keysToRemove = [
            STORAGE_KEYS.JOB_DESCRIPTION,
            STORAGE_KEYS.GENERATION_TYPE,
            STORAGE_KEYS.SELECTED_TONE,
            STORAGE_KEYS.RESUME_DATA,
            STORAGE_KEYS.SELECTED_DESIGN,
            STORAGE_KEYS.REGENERATE_COMMENT
        ];
        await removeFromStorage(keysToRemove);
    };

    const login = async (user: User) => {
        await setUser(user);
        setShowAuthModal(false);
        setOauthError(false);
    };

    const logout = async () => {
        await setUser(null);
        await clearFormData();
        await removeFromStorage(STORAGE_KEYS.AUTH_TOKEN);
    };

    // Функция для проверки авторизации при загрузке приложения
    const checkAuth = async () => {
        try {
            // Сначала проверяем, есть ли сохраненные данные пользователя
            // const savedUserData = await loadFromStorage(STORAGE_KEYS.USER_DATA);
            // if (savedUserData) {
            //     await setUser(savedUserData);
            //     return;
            // }

            // Если нет сохраненных данных, проверяем токен
            const token = await loadFromStorage(STORAGE_KEYS.AUTH_TOKEN);
            if (token) {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        const user = {
                            id: userData.id,
                            email: userData.email,
                            name: userData.name,
                            plan: userData.plan,
                            remainingGenerations: userData.remainingGenerations,
                            totalGenerations: userData.totalGenerations,
                            subscriptionStatus: userData.subscriptionStatus,
                        };
                        await setUser(user);
                    } else {
                        // Токен недействителен, удаляем его
                        await removeFromStorage(STORAGE_KEYS.AUTH_TOKEN);
                    }
                } catch (error) {
                    console.error('Error checking auth:', error);
                    await removeFromStorage(STORAGE_KEYS.AUTH_TOKEN);
                }
            }
        } catch (error) {
            console.error('Error loading user data from storage:', error);
        }
    };

    // Загружаем сохраненные данные форм при инициализации
    const loadFormData = async () => {
        try {
            const savedJobDescription = await loadFromStorage(STORAGE_KEYS.JOB_DESCRIPTION);
            const savedGenerationType = await loadFromStorage(STORAGE_KEYS.GENERATION_TYPE);
            const savedSelectedTone = await loadFromStorage(STORAGE_KEYS.SELECTED_TONE);
            const savedResumeData = await loadFromStorage(STORAGE_KEYS.RESUME_DATA);
            const savedSelectedDesign = await loadFromStorage(STORAGE_KEYS.SELECTED_DESIGN);
            const savedRegenerateComment = await loadFromStorage(STORAGE_KEYS.REGENERATE_COMMENT);

            if (savedJobDescription) setJobDescriptionState(savedJobDescription);
            if (savedGenerationType) setGenerationTypeState(savedGenerationType);
            if (savedSelectedTone) setSelectedToneState(savedSelectedTone);
            if (savedResumeData) setResumeDataState(savedResumeData);
            if (savedSelectedDesign) setSelectedDesignState(savedSelectedDesign);
            if (savedRegenerateComment) setRegenerateCommentState(savedRegenerateComment);
        } catch (error) {
            console.error('Error loading form data from storage:', error);
        }
    };

    // Проверяем авторизацию и загружаем данные форм при загрузке приложения
    useEffect(() => {
        const initializeApp = async () => {
            await checkAuth();
            await loadFormData();
        };
        
        initializeApp();
    }, []);

    // Listen for messages from background script
    useEffect(() => {
        const handleMessage = (message: any, _sender: any, _sendResponse: any) => {
            if (message.action === 'refreshUserData') {
                checkAuth();
            }
        };

        // Add message listener
        if (chrome?.runtime?.onMessage) {
            chrome.runtime.onMessage.addListener(handleMessage);
        }

        // Cleanup
        return () => {
            if (chrome?.runtime?.onMessage) {
                chrome.runtime.onMessage.removeListener(handleMessage);
            }
        };
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
                regenerateComment,
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
                setRegenerateComment,
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