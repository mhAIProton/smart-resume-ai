import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface PortProviderProps {
    children: ReactNode;
}

const PortContext = createContext<chrome.runtime.Port | null>(null);

export const PortProvider = ({ children }: PortProviderProps) => {
    const [port, setPort] = useState<chrome.runtime.Port | null>(null);

    useEffect(() => {
        const newPort = chrome.runtime.connect({ name: "smart-resume-ai-port" });
        setPort(newPort);

        return () => {
            newPort.disconnect();
        };
    }, []);

    return (
        <PortContext.Provider value={port}>
            {children}
        </PortContext.Provider>
    );
};

export const usePort = () => {
    return useContext(PortContext);
};
