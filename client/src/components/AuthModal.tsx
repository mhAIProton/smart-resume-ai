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
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Sign in to continue</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Sign in to generate your resume and access all features.
        </p>

        <button
          onClick={handleGoogleAuth}
          className="w-full flex items-center justify-center space-x-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Mail className="w-5 h-5" />
          <span>Continue with Google</span>
        </button>

        <div className="mt-4 text-xs text-gray-500 text-center">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  )
}

export default AuthModal
