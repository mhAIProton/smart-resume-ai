import React, { useState, ReactNode, createContext, useContext } from 'react';

export interface AppContextType {
    attemptsLeft: number;
    loading: boolean;
    isAuthenticated: boolean;
    user: Object,
}

export const AppContext = createContext<AppContextType>({
    attemptsLeft: 3,
    loading: false,
    isAuthenticated: false,
    user: {},
});

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [attemptsLeft, setAttemptsLeft] = useState(3);
    const [loading, setLoading] = useState(false);

    return (
        <AppContext.Provider
            value={{
                attemptsLeft,
                loading,
                isAuthenticated,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);