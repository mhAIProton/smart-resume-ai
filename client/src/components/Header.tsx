import React from 'react'
import { useAppContext} from "@/contexts/AppContextProvider.tsx";

const Header: React.FC = () => {
  const { isAuthenticated, user } = useAppContext();

  const handleAuth = () => {
    if (isAuthenticated) {
      // Logout logic
      // useAppStore().setUser(null)
    } else {
      // setShowAuthModal(true)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SR</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">SmartResumeAI</h1>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Plan:</span>
              <span className="text-xs font-medium text-primary-600 capitalize">
                {user?.plan || 'Free'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {isAuthenticated && (
            <div className="text-right">
              <div className="text-xs text-gray-500">Generations left</div>
              <div className="text-sm font-medium text-gray-900">
                {user?.remainingGenerations || 0}
              </div>
            </div>
          )}
          
          <button
            onClick={handleAuth}
            className="btn-primary text-sm px-3 py-1.5"
          >
            {isAuthenticated ? 'Logout' : 'Sign in'}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
