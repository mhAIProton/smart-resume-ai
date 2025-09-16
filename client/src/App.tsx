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
// import { pdfService } from './services/pdf/pdfService';

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

// const resumeData = {
//   "full_name": "Alexandra Ivanova",
//   "profession": "Product / UI/UX Designer",
//   "summary": "Product designer with 4+ years of experience building digital products from discovery to delivery. Specialized in mobile and web interfaces with a strong focus on user needs and business goals. Experienced in startups, marketplaces, and e-commerce. Proficient in Figma, UX research, and MVP-first approach.",
//   "contacts": {
//     "email": "alexa.ivanova@gmail.com",
//     "phone": "+7 707 123 45 67",
//     "portfolio": "linkedin.com/in/alex-ivanova"
//   },
//   "skills": ["Figma", "UX Research", "Design Systems", "Prototyping", "User Flows / CJM", "Web / Mobile Design", "Wireframing", "User Interviews", "Notion", "FigJam"],
//   "experience": [
//     {
//       "job_title": "Product Designer",
//       "company": "Wildberries Tech",
//       "dates": "2022–2024",
//       "description": "Designed seller dashboard (increased conversion by 12%)\nConducted 10+ user interviews for storefront redesign\nContributed to internal design system for B2B tools\nWorked closely with PMs and frontend/backend teams"
//     },
//     {
//       "job_title": "Middle+ Product Designer",
//       "company": "Yandex.Market",
//       "dates": "2021–2022",
//       "description": "Participated in redesign of product catalog and search filters\nWorked on mobile-first improvements for checkout flow\nCollaborated with analysts to improve user funnel\nTook part in weekly design critiques and sprints"
//     },
//     {
//       "job_title": "Freelance",
//       "company": "Jamb App",
//       "dates": "2020–2021",
//       "description": "Created mobile interface for Canadian home repair service\nDesigned order flow, filters, product cards, and questionnaires\nApplied atomic design principles for scalable UI\nDelivered a clickable prototype for investor pitch"
//     }
//   ],
//   "education": [
//     {
//       "degree": "UX/UI Design",
//       "institution": "British Higher School of Art and Design",
//       "dates": "2020–2021"
//     },
//     {
//       "degree": "Bachelor’s Degree | Economics",
//       "institution": "Lomonosov Moscow State University",
//       "dates": "2015–2019"
//     }
//   ],
//   "additional": [
//     {
//       "languages": "Russian (native), English (B2)",
//       "tools": "Figma, FigJam, Notion, Miro, Trello, Slack",
//       "certificates": "Google UX Design (Coursera, 2023)"
//     }
//   ]
// };

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

              {/* <div>
                <button onClick={() => {
                  pdfService.generatePDF(resumeData, 'classic');
                }}>
                  Download PDF
                </button>
              </div> */}


              
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
