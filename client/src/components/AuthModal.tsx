import React, { useState } from 'react';
import { useAppContext } from "@/contexts/AppContextProvider";

const AuthModal: React.FC = () => {
  const { showAuthModal, setShowAuthModal, oauthError, setOauthError, login } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      setOauthError(false);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'https://smartresume-ai.com/api/v1';
      
      // Отправляем сообщение в background script
      chrome.runtime.sendMessage({ action: 'googleAuth', apiUrl }, async (response) => {
        try {
          if (response.success && response.user) {
            // Преобразуем данные пользователя в формат, ожидаемый контекстом
            const user = {
              id: response.user.id,
              email: response.user.email,
              name: response.user.name,
              plan: response.user.plan || 'free',
              remainingGenerations: response.user.remainingGenerations || 0,
              totalGenerations: response.user.totalGenerations || 3,
              subscriptionStatus: response.user.subscriptionStatus || 'active'
            };

            // Логиним пользователя
            await login(user);
            setShowAuthModal(false);
          } else {
            setOauthError(true);
          }
        } finally {
          setIsLoading(false);
        }
      });
    } catch (error) {
      setOauthError(true);
      setIsLoading(false);
    }
  }

  const handleClose = () => {
    setShowAuthModal(false);
    setOauthError(false);
    setIsLoading(false);
  }

  if (!showAuthModal) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[350px] max-w-full p-3">
        <div className="flex flex-col justify-center mb-4">
          {/* Close button */}
          <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors ml-auto"
          >
            <img
                src="/squared-cross.svg"
                alt="Close"
                className="h-6"
            />
          </button>
          <h3 className="text-2xl text-center px-5 font-semibold text-gray-900">Sign up to save and continue</h3>
        </div>

        <button
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full h-12 flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
            </>
          ) : (
            <>
              <img src="/google.svg" alt="Continue with Google"/>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        {oauthError && (
          <div className="mt-3 text-sm text-red-600 text-center">
            Google sign-in failed. Try again
          </div>
        )}

        <div className="pt-4 pb-8 text-xs text-gray-500 text-center">
          Secure login. We'll never post anything.
        </div>
      </div>
    </div>
  )
}

export default AuthModal
