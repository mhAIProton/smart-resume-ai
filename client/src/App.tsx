import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppContextProvider } from './contexts/AppContextProvider';
import Header from './components/Header';
import BackButton from './components/BackButton';
import StepMain from './components/steps/StepMain';
import StepType from './components/steps/StepType';
import StepResume from './components/steps/StepResume';
import StepDesign from './components/steps/StepDesign';
import StepTone from './components/steps/StepTone';
import StepResult from './components/steps/StepResult';
import AuthModal from './components/AuthModal';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <div className="chrome-extension">
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Header />
              <main className="p-2">
                <Routes>
                  <Route path="/" element={<StepMain />} />
                  <Route path="/type" element={<StepType />} />
                  <Route path="/resume" element={<StepResume />} />
                  <Route path="/design" element={<StepDesign />} />
                  <Route path="/tone" element={<StepTone />} />
                  <Route path="/result" element={<StepResult />} />
                </Routes>
              </main>
              <BackButton />
              <AuthModal />
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
