import React from 'react';
import { useAppContext } from "@/contexts/AppContextProvider";
import { useNavigation } from "@/contexts/NavigationContext";
import clsx from 'clsx';

const Header: React.FC = () => {
  const { 
    isAuthenticated, 
    user, 
    setShowAuthModal, 
    setShowSubscriptionsPopup,
    clearFormData,
    logout
  } = useAppContext();
  const {navigate} = useNavigation();

  const handleLogoClick = async () => {
    await clearFormData();
    navigate('main');
  };

  const handleAuth = async () => {
    if (isAuthenticated) {
      await logout();
    } else {
      setShowAuthModal(true);
    }
  };

  const handlePlanClick = () => {
    setShowSubscriptionsPopup(true);
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
                src="/logo.svg"
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
            className={clsx("w-1/2 flex items-center justify-center space-x-1 rounded-md px-2 py-1 h-8 transition-colors", {
              "bg-gray-100 hover:bg-gray-200 text-gray-700": !user?.plan || user?.plan === 'free',
              "bg-blue-200 hover:bg-blue-300 text-blue-700": user?.plan === 'pro',
              "bg-purple-200 hover:bg-purple-300 text-purple-700": user?.plan === 'pro_plus',
            })}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M7.51061 3.6741C7.67872 3.2198 8.32128 3.2198 8.48939 3.6741L8.7221 4.30298C8.77495 4.44581 8.88756 4.55843 9.03039 4.61128L9.65927 4.84399C10.1136 5.01209 10.1136 5.65465 9.65927 5.82276L9.03039 6.05547C8.88756 6.10832 8.77495 6.22094 8.7221 6.36377L8.48939 6.99265C8.32128 7.44695 7.67872 7.44695 7.51061 6.99264L7.27791 6.36377C7.22505 6.22094 7.11244 6.10832 6.96961 6.05547L6.34073 5.82276C5.88642 5.65465 5.88642 5.01209 6.34073 4.84399L6.96961 4.61128C7.11244 4.55843 7.22505 4.44581 7.27791 4.30298L7.51061 3.6741ZM7.70953 5.33337C7.81902 5.25013 7.91675 5.15239 8 5.0429C8.08325 5.15239 8.18098 5.25013 8.29047 5.33337C8.18098 5.41662 8.08325 5.51436 8 5.62385C7.91675 5.51436 7.81902 5.41662 7.70953 5.33337Z" fill="currentColor"/>
              <path d="M4.53639 7.69342C4.67637 7.49576 4.9867 7.57892 5.0091 7.82008L5.04011 8.15392C5.04715 8.22975 5.08696 8.29871 5.14911 8.34272L5.42272 8.53649C5.62037 8.67647 5.53722 8.9868 5.29605 9.0092L4.96221 9.04021C4.88639 9.04725 4.81743 9.08706 4.77342 9.14921L4.57965 9.42282C4.43967 9.62048 4.12933 9.53732 4.10694 9.29615L4.07593 8.96231C4.06889 8.88649 4.02907 8.81753 3.96693 8.77352L3.69332 8.57975C3.49566 8.43977 3.57882 8.12944 3.81998 8.10704L4.15382 8.07603C4.22964 8.06899 4.29861 8.02917 4.34262 7.96703L4.53639 7.69342Z" fill="currentColor"/>
              <path d="M9.0095 9.34573C9.02974 9.02985 9.43202 8.90961 9.62228 9.16258L9.88565 9.51275C9.94546 9.59229 10.037 9.64172 10.1364 9.64808L10.5736 9.67609C10.8895 9.69633 11.0097 10.0986 10.7568 10.2889L10.4066 10.5522C10.3271 10.6121 10.2776 10.7036 10.2713 10.8029L10.2433 11.2402C10.223 11.5561 9.82073 11.6763 9.63047 11.4234L9.36711 11.0732C9.30729 10.9937 9.21571 10.9442 9.1164 10.9379L8.67914 10.9098C8.36326 10.8896 8.24302 10.4873 8.49599 10.2971L8.84616 10.0337C8.92569 9.97388 8.97513 9.88231 8.98149 9.78299L9.0095 9.34573Z" fill="currentColor"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M12.3041 11.5137C13.3537 10.4332 14 8.95876 14 7.33337C14 5.6981 13.3458 4.21562 12.2849 3.13337C11.1959 2.02256 9.67844 1.33337 8 1.33337C4.68629 1.33337 2 4.01967 2 7.33337C2 8.95871 2.64627 10.4331 3.69585 11.5136L3.44213 12.0528C2.86996 13.2687 3.75715 14.6667 5.10099 14.6667H10.8989C12.2428 14.6667 13.13 13.2687 12.5577 12.0527L12.3041 11.5137ZM8 12.3334C10.7614 12.3334 13 10.0948 13 7.33337C13 5.9703 12.4559 4.73632 11.5708 3.83342C10.6621 2.90655 9.39891 2.33337 8 2.33337C5.23858 2.33337 3 4.57195 3 7.33337C3 10.0948 5.23858 12.3334 8 12.3334ZM11.5189 12.1937C10.5303 12.9106 9.31453 13.3334 8 13.3334C6.68542 13.3334 5.46959 12.9106 4.48104 12.1936L4.34696 12.4786C4.08688 13.0313 4.49015 13.6667 5.10099 13.6667H10.8989C11.5098 13.6667 11.913 13.0312 11.6529 12.4785L11.5189 12.1937Z" fill="currentColor"/>
          </svg>
            <span className="text-xs font-medium capitalize">
                {user?.plan === 'pro_plus' ? 'Pro+ Plan' : user?.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
              </span>
          </button>

          {/* Generations left badge */}
          <button
            className="w-1/2 flex items-center justify-center space-x-1 bg-gray-100 rounded-lg px-2 py-1 h-8 hover:bg-gray-200 transition-colors"
          >
              <span className="text-xs text-gray-700">
                <b>{isAuthenticated ? Number(user?.remainingGenerations) : 3}</b>/<b>{isAuthenticated ? Number(user?.totalGenerations) : 3}</b> AI-generations
              </span>
          </button>
        </div>
      </header>
  )
}

export default Header
