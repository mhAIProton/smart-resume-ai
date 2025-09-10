import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from "@/contexts/AppContextProvider"

const Header: React.FC = () => {
  const { isAuthenticated, user, setShowAuthModal, setShowSubscriptionsPopup, setShowLoader, logout } = useAppContext();
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

  const handlePlanClick = () => {
    setShowSubscriptionsPopup(true);
  };

  const handleGenerationsClick = () => {
    setShowLoader(true);
    // Auto-hide loader after 3 seconds for demonstration
    setTimeout(() => {
      setShowLoader(false);
    }, 5000);
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
              className={`flex items-center space-x-1 rounded-lg px-2 py-1 transition-colors h-8 ${isAuthenticated ? 'bg-blue-50 hover:bg-blue-100' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            {isAuthenticated ? (
                <>
                  <img
                      src="/logout.svg"
                      alt="Logout"
                      className="h-6"
                  />
                </>
            ) : (
                <span className="text-xs font-medium text-gray-700">Sign In</span>
            )}
          </button>
        </div>

        <div className="flex items-center justify-between gap-1">
          {/* Plan badge */}
          <button
            onClick={handlePlanClick}
            className="w-1/2 flex items-center justify-center space-x-1 bg-gray-100 rounded-md px-2 py-1 h-8 hover:bg-gray-200 transition-colors"
          >
            <img
                src="/plan.svg"
                alt="Plan"
                className="w-4 h-4"
            />
            <span className="text-xs font-medium text-gray-700 capitalize">
                {user?.plan ? `${user?.plan} plan` : 'free plan'}
              </span>
          </button>

          {/* Generations left badge */}
          <button
            onClick={handleGenerationsClick}
            className="w-1/2 flex items-center justify-center space-x-1 bg-gray-100 rounded-lg px-2 py-1 h-8 hover:bg-gray-200 transition-colors"
          >
              <span className="text-xs text-gray-700">
                <b>{user?.remainingGenerations || 0}</b>/<b>3</b> AI-generations
              </span>
          </button>
        </div>
      </header>
  )
}

export default Header
