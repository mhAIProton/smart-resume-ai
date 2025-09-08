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
      <header className="bg-white border-b border-gray-200 py-2 px-3 mb-6">
        <div className="flex items-center justify-between mb-2">
          {/* Logo */}
          <button
              onClick={handleLogoClick}
              className="flex items-center hover:opacity-80 transition-opacity"
          >
            <img
                src="/logo.png"
                alt="SmartResumeAI"
                className="object-contain h-8"
            />
          </button>

          {/* Auth button */}
          <button
              onClick={handleAuth}
              className="flex items-center space-x-1 bg-gray-100 rounded-lg px-2 py-1 hover:bg-gray-200 transition-colors h-8"
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

        <div className="flex items-center justify-between gap-1">
          {/* Plan badge */}
          <div className="w-1/2 flex items-center justify-center space-x-1 bg-gray-100 rounded-md px-2 py-1 h-8">
            <img
                src="/plan.svg"
                alt="Plan"
                className="w-4 h-4"
            />
            <span className="text-xs font-medium text-gray-700">
                {user?.plan || 'Free Plan'}
              </span>
          </div>

          {/* Generations left badge */}
          <div className="w-1/2 flex items-center justify-center space-x-1 bg-gray-100 rounded-lg px-2 py-1 h-8">
              <span className="text-xs text-gray-700">
                <b>{user?.remainingGenerations || 0}</b>/<b>3</b> AI-generations
              </span>
          </div>
        </div>
      </header>
  )
}

export default Header
