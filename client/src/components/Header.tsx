import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from "@/contexts/AppContextProvider"

const Header: React.FC = () => {
  const { isAuthenticated, user, setShowAuthModal, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleAuth = () => {
    if (isAuthenticated) {
      logout();
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 py-2 h-12">
      <div className="flex items-center justify-between px-4">
        {/* Logo */}
        <button 
          onClick={handleLogoClick}
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <img 
            src="/logo.png" 
            alt="SmartResumeAI" 
            className="object-contain"
          />
        </button>

        <div className="flex items-center space-x-2">
          {/* Plan badge */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg px-2 py-1">
            <img 
              src="/plan.svg" 
              alt="Plan" 
              className="w-3 h-3"
            />
            <span className="text-xs font-medium text-gray-700">
              {user?.plan || 'Free'}
            </span>
          </div>

          {/* Generations left badge */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg px-2 py-1">
              <span className="text-xs text-gray-700">
                {user?.remainingGenerations || 0}/3 AI-generations
              </span>
          </div>

          {/* Auth button */}
          <button
            onClick={handleAuth}
            className="flex items-center space-x-1 bg-gray-100 rounded-lg px-2 py-1 hover:bg-gray-200 transition-colors"
          >
            {isAuthenticated ? (
              <>
                <img 
                  src="/logout.svg" 
                  alt="Logout" 
                  className="w-3 h-3"
                />
              </>
            ) : (
              <span className="text-xs font-medium text-gray-700">Sign In</span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
