import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppContextProvider, useAppContext } from './contexts/AppContextProvider';
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
import { useSearchParams } from 'react-router-dom';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Component to handle OAuth error detection
const OAuthErrorHandler: React.FC = () => {
  const { setOauthError, setShowAuthModal } = useAppContext();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'oauth_failed') {
      setOauthError(true);
      setShowAuthModal(true);
      // Clean up the URL by removing the error parameter
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('error');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams, setOauthError, setShowAuthModal]);

  return null;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <div className="chrome-extension">
          <Router>
            <OAuthErrorHandler />
            <div className="min-h-screen bg-gray-50">
              <Header />
              <BackButton />
              <main className="px-3">
                <Routes>
                  <Route path="/" element={<StepMain />} />
                  <Route path="/type" element={<StepType />} />
                  <Route path="/resume" element={<StepResume />} />
                  <Route path="/design" element={<StepDesign />} />
                  <Route path="/tone" element={<StepTone />} />
                  <Route path="/result" element={<StepResult />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                </Routes>
              </main>
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
          </Router>
        </div>
      </AppContextProvider>
    </QueryClientProvider>
  )
}

export default App
