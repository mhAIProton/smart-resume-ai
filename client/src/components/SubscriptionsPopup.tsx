import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContextProvider';
import apiService from '@/services/api';

interface PlanOption {
  value: 'free' | 'pro' | 'pro-plus';
  title: string;
  price: string;
  description: string;
  details: string;
  isCurrent?: boolean;
  priceId?: string;
}

const SubscriptionsPopup: React.FC = () => {
  const { 
    showSubscriptionsPopup, 
    setShowSubscriptionsPopup, 
    setShowMessagePopup,
    setMessagePopupData
  } = useAppContext();
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'pro-plus' | null>(null);

  if (!showSubscriptionsPopup) return null;

  const nextMonth = (): string => {
    const currentDate = new Date();
    const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    
    return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(nextMonthDate);
  };

  const planOptions: PlanOption[] = [
    {
      value: 'free',
      title: 'Free',
      price: '$ 0',
      description: '3 AI-generations',
      details: `Your limit will reset on ${nextMonth()} 1.`,
      isCurrent: true
    },
    {
      value: 'pro',
      title: 'Pro Plan',
      price: '$ 10.90',
      description: '30 AI-generations',
      details: 'Monthly subscription',
      priceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID
    },
    {
      value: 'pro-plus',
      title: 'Pro+ Plan',
      price: '$ 19.90',
      description: '80 AI-generations',
      details: 'Monthly subscription',
      priceId: import.meta.env.VITE_STRIPE_PRO_PLUS_PRICE_ID
    }
  ];

  const handleClose = () => {
    setShowSubscriptionsPopup(false);
    setSelectedPlan(null);
  };

  const handlePlanChange = (plan: 'free' | 'pro' | 'pro-plus') => {
    setSelectedPlan(plan);
  };

  const handleUpgrade = async () => {
    if (!selectedPlan) return;

    // Close subscriptions popup
    setShowSubscriptionsPopup(false);
    
    // Show message popup based on selected plan
    if (selectedPlan === 'free') {
      setMessagePopupData({
        type: 'error',
        title: 'You already have a free plan',
        subtitle: 'Try to purchase a pro plan'
      });
      setShowMessagePopup(true);
      return;
    }

    try {
      // Find the selected plan option
      const selectedPlanOption = planOptions.find(option => option.value === selectedPlan);
      
      if (!selectedPlanOption?.priceId) {
        throw new Error('Price ID not found for selected plan');
      }

      // Create Stripe checkout session
      const { url } = await apiService.createCheckoutSession(selectedPlanOption.priceId);
      
      // Redirect to Stripe checkout
      chrome.tabs.create({ url: url }); // window.location.href = url;
      
    } catch (error) {
      console.error('Error creating checkout session:', error);
      
      setMessagePopupData({
        type: 'error',
        title: 'Payment Error',
        subtitle: 'Failed to create checkout session. Please try again.'
      });
      setShowMessagePopup(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-[350px] max-w-full relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <img
            src="/squared-cross.svg"
            alt="Close"
            className="h-6"
          />
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Warning icon */}
          <div className="flex justify-center mb-2">
            <img
              src="/warning.svg"
              alt="Warning"
              className="h-6"
            />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">
            You've reached your generations limit
          </h2>

          {/* Subtitle */}
          <p className="text-sm text-center mb-4 px-4">
            Upgrade to Pro/Pro+ Plan to continue using SmartResume AI
          </p>

          {/* Plan options */}
          <div className="space-y-3 mb-6">
            {planOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                  option.value === 'free' 
                    ? 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100' 
                    : option.value === 'pro'
                    ? selectedPlan === 'pro' 
                      ? 'bg-blue-100 border-blue-300' 
                      : 'bg-blue-50 border-gray-200 hover:border-blue-300 hover:bg-blue-100'
                    : selectedPlan === 'pro-plus'
                    ? 'bg-purple-100 border-purple-300'
                    : 'bg-purple-50 border-gray-200 hover:border-purple-300 hover:bg-purple-100'
                }`}
              >
                <input
                  type="radio"
                  name="plan"
                  value={option.value}
                  checked={selectedPlan === option.value}
                  onChange={() => handlePlanChange(option.value)}
                  className="sr-only"
                />

                <div className="flex items-center space-x-3">
                  {selectedPlan === option.value
                      ? <svg className={`w-6 h-6 ${option.value === 'pro' ? 'text-blue-500' : option.value === 'pro-plus' ? 'text-purple-500' : 'text-gray-500'}`} width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="11" r="11" fill="currentColor"/>
                        <path d="M10.8955 15.9363C10.5651 15.9363 10.2866 15.797 10.0601 15.5186L7.17847 11.929C7.08879 11.8204 7.02507 11.7166 6.9873 11.6174C6.94954 11.5136 6.93066 11.4074 6.93066 11.2988C6.93066 11.0581 7.0109 10.8599 7.17139 10.7041C7.33187 10.5436 7.53719 10.4634 7.78735 10.4634C8.06584 10.4634 8.29948 10.5837 8.48828 10.8245L10.8672 13.8831L15.4692 6.56226C15.5778 6.40177 15.6887 6.28849 15.802 6.22241C15.9153 6.15161 16.0569 6.11621 16.2268 6.11621C16.4722 6.11621 16.6729 6.19409 16.8286 6.34985C16.9891 6.5009 17.0693 6.69678 17.0693 6.9375C17.0693 7.0319 17.0528 7.12866 17.0198 7.22778C16.9915 7.3269 16.9419 7.43075 16.8711 7.53931L11.731 15.4973C11.5327 15.79 11.2542 15.9363 10.8955 15.9363Z" fill="white"/>
                      </svg>
                      : <img src="/circle.svg" alt="Not selected" className="w-6 h-6"/>
                  }

                  <div className="flex items-center space-x-2">
                    <div>
                      <div className={`font-medium flex gap-1 items-center ${option.value === 'pro' ? 'text-blue-800' : option.value === 'pro-plus' ? 'text-purple-800' : 'text-gray-800'}`}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M7.51061 3.6741C7.67872 3.2198 8.32128 3.2198 8.48939 3.6741L8.7221 4.30298C8.77495 4.44581 8.88756 4.55843 9.03039 4.61128L9.65927 4.84399C10.1136 5.01209 10.1136 5.65465 9.65927 5.82276L9.03039 6.05547C8.88756 6.10832 8.77495 6.22094 8.7221 6.36377L8.48939 6.99265C8.32128 7.44695 7.67872 7.44695 7.51061 6.99264L7.27791 6.36377C7.22505 6.22094 7.11244 6.10832 6.96961 6.05547L6.34073 5.82276C5.88642 5.65465 5.88642 5.01209 6.34073 4.84399L6.96961 4.61128C7.11244 4.55843 7.22505 4.44581 7.27791 4.30298L7.51061 3.6741ZM7.70953 5.33337C7.81902 5.25013 7.91675 5.15239 8 5.0429C8.08325 5.15239 8.18098 5.25013 8.29047 5.33337C8.18098 5.41662 8.08325 5.51436 8 5.62385C7.91675 5.51436 7.81902 5.41662 7.70953 5.33337Z" fill="currentColor"/>
                          <path d="M4.53639 7.69342C4.67637 7.49576 4.9867 7.57892 5.0091 7.82008L5.04011 8.15392C5.04715 8.22975 5.08696 8.29871 5.14911 8.34272L5.42272 8.53649C5.62037 8.67647 5.53722 8.9868 5.29605 9.0092L4.96221 9.04021C4.88639 9.04725 4.81743 9.08706 4.77342 9.14921L4.57965 9.42282C4.43967 9.62048 4.12933 9.53732 4.10694 9.29615L4.07593 8.96231C4.06889 8.88649 4.02907 8.81753 3.96693 8.77352L3.69332 8.57975C3.49566 8.43977 3.57882 8.12944 3.81998 8.10704L4.15382 8.07603C4.22964 8.06899 4.29861 8.02917 4.34262 7.96703L4.53639 7.69342Z" fill="currentColor"/>
                          <path d="M9.0095 9.34573C9.02974 9.02985 9.43202 8.90961 9.62228 9.16258L9.88565 9.51275C9.94546 9.59229 10.037 9.64172 10.1364 9.64808L10.5736 9.67609C10.8895 9.69633 11.0097 10.0986 10.7568 10.2889L10.4066 10.5522C10.3271 10.6121 10.2776 10.7036 10.2713 10.8029L10.2433 11.2402C10.223 11.5561 9.82073 11.6763 9.63047 11.4234L9.36711 11.0732C9.30729 10.9937 9.21571 10.9442 9.1164 10.9379L8.67914 10.9098C8.36326 10.8896 8.24302 10.4873 8.49599 10.2971L8.84616 10.0337C8.92569 9.97388 8.97513 9.88231 8.98149 9.78299L9.0095 9.34573Z" fill="currentColor"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M12.3041 11.5137C13.3537 10.4332 14 8.95876 14 7.33337C14 5.6981 13.3458 4.21562 12.2849 3.13337C11.1959 2.02256 9.67844 1.33337 8 1.33337C4.68629 1.33337 2 4.01967 2 7.33337C2 8.95871 2.64627 10.4331 3.69585 11.5136L3.44213 12.0528C2.86996 13.2687 3.75715 14.6667 5.10099 14.6667H10.8989C12.2428 14.6667 13.13 13.2687 12.5577 12.0527L12.3041 11.5137ZM8 12.3334C10.7614 12.3334 13 10.0948 13 7.33337C13 5.9703 12.4559 4.73632 11.5708 3.83342C10.6621 2.90655 9.39891 2.33337 8 2.33337C5.23858 2.33337 3 4.57195 3 7.33337C3 10.0948 5.23858 12.3334 8 12.3334ZM11.5189 12.1937C10.5303 12.9106 9.31453 13.3334 8 13.3334C6.68542 13.3334 5.46959 12.9106 4.48104 12.1936L4.34696 12.4786C4.08688 13.0313 4.49015 13.6667 5.10099 13.6667H10.8989C11.5098 13.6667 11.913 13.0312 11.6529 12.4785L11.5189 12.1937Z" fill="currentColor"/>
                        </svg>
                        {option.title}
                      </div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                      {option.details && (
                          <div className="text-xs text-gray-500">{option.details}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-lg font-semibold text-gray-900">{option.price}</div>
              </label>
            ))}
          </div>

          {/* Upgrade button */}
            <button
              onClick={handleUpgrade}
              disabled={!selectedPlan}
              className={`w-full flex items-center justify-center space-x-1 font-medium py-3 px-4 rounded-lg transition-colors ${
                  selectedPlan
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-300 text-white cursor-not-allowed'
              }`}
          >
            <img
                src="/lock.svg"
                alt="Lock"
                className="h-6"
            />
            <span>Upgrade</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPopup;
