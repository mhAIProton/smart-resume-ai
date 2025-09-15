import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppContextProvider, useAppContext } from './contexts/AppContextProvider';
import { NavigationProvider, useNavigation, NavigationStep } from './contexts/NavigationContext';
import Header from './components/Header';
import BackButton from './components/BackButton';
import StepMain from './components/steps/StepMain';
import StepType from './components/steps/StepType';
import StepResume from './components/steps/StepResume';
import StepDesign from './components/steps/StepDesign';
import StepTone from './components/steps/StepTone';
import StepResult from './components/steps/StepResult';
import AuthModal from './components/AuthModal';
import AuthCallback from './components/AuthCallback';
import SubscriptionsPopup from './components/SubscriptionsPopup';
import MessagePopup from './components/MessagePopup';
import Loader from './components/Loader';
import { useEffect } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Navigation logic is now in NavigationContext

// Component to handle OAuth error detection
const OAuthErrorHandler: React.FC = () => {
  const { setOauthError, setShowAuthModal } = useAppContext();

  useEffect(() => {
    // Check URL parameters for OAuth errors
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    if (error === 'oauth_failed') {
      setOauthError(true);
      setShowAuthModal(true);
    }
  }, [setOauthError, setShowAuthModal]);

  return null;
};

// Component to render current step
const StepRenderer: React.FC = () => {
  const { currentStep } = useNavigation();

  switch (currentStep) {
    case 'main':
      return <StepMain />;
    case 'type':
      return <StepType />;
    case 'resume':
      return <StepResume />;
    case 'design':
      return <StepDesign />;
    case 'tone':
      return <StepTone />;
    case 'result':
      return <StepResult />;
    case 'auth-callback':
      return <AuthCallback />;
    default:
      return <StepMain />;
  }
};

// Navigation context is now imported from NavigationContext.tsx

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <NavigationProvider>
          <div className="chrome-extension">
            <OAuthErrorHandler />
            <div className="min-h-screen bg-gray-50 relative">
              <Header />
              <BackButton />
              <main className="px-3 pb-20">
                <StepRenderer />
              </main>
              <footer className="absolute bottom-0 left-0 right-0 p-4 text-center">
                <p>Any questions? Please write here!</p>
                <a href="mailto:resumecopilotai@gmail.com" className="text-blue-600 text-base font-semibold hover:text-blue-700 hover:underline transition-colors">resumecopilotai@gmail.com</a>
              </footer>
              <AuthModal />
              <SubscriptionsPopup />
              <MessagePopup />
              <Loader />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />
            </div>
          </div>
        </NavigationProvider>
      </AppContextProvider>
    </QueryClientProvider>
  )
}

export default App
