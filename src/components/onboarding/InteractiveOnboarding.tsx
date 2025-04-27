import React, { useState, useEffect } from 'react';

const InteractiveOnboarding = () => {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const steps = [
    {
      title: 'Welcome to Crypto Dashboard!',
      content: 'Let\'s set up your account and explore the key features.',
      target: '#dashboard-title',
    },
    {
      title: 'Connect to an Exchange',
      content: 'Link your exchange account to start trading.',
      target: '#exchange-integration',
    },
    {
      title: 'Explore AI Trading Bots',
      content: 'Discover automated trading strategies powered by AI.',
      target: '#ai-trading-bots',
    },
    {
      title: 'Customize Your Dashboard',
      content: 'Add and arrange widgets to suit your needs.',
      target: '#customizable-dashboard',
    },
  ];

  useEffect(() => {
    if (step === steps.length) {
      setCompleted(true);
    }
  }, [step, steps.length]);

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleComplete = () => {
    setCompleted(true);
    alert('Onboarding completed! Enjoy using Crypto Dashboard.');
  };
  
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">{steps[step].title}</h2>
        <p className="mb-6">{steps[step].content}</p>
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Back
          </button>
          {step === steps.length - 1 ? (
            <button
              onClick={handleComplete}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Complete
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveOnboarding;
