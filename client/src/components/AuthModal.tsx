import React from 'react';
import { useAppContext } from "@/contexts/AppContextProvider";
import { X, Mail } from 'lucide-react';

const AuthModal: React.FC = () => {
  const { showAuthModal, setShowAuthModal } = useAppContext();

  const handleGoogleAuth = () => {
    // Перенаправляем на Google OAuth
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    window.location.href = `${apiUrl}/auth/google`;
  }

  const handleClose = () => {
    setShowAuthModal(false);
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
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <img src="/google.svg" alt="Continue with Google"/>
          <span>Continue with Google</span>
        </button>

        <div className="pt-4 pb-8 text-xs text-gray-500 text-center">
          Secure login. We’ll never post anything.
        </div>
      </div>
    </div>
  )
}

export default AuthModal
