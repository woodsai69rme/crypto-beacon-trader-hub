
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface OnboardingStep {
  title: string;
  description: string;
  component: React.ReactNode;
}

interface InteractiveOnboardingProps {
  onComplete: (preferences: any) => void;
}

const InteractiveOnboarding: React.FC<InteractiveOnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    darkMode: true,
    notificationLevel: "medium",
    defaultCurrency: "USD",
    showTutorials: true,
    autoTrading: false
  });

  const handleUpdatePreference = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const steps: OnboardingStep[] = [
    {
      title: "Welcome to CryptoTrader",
      description: "Let's set up your experience in a few easy steps",
      component: (
        <div className="flex flex-col items-center justify-center py-8">
          <svg
            className="w-24 h-24 mb-4 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <p className="text-center max-w-md">
            We'll help you personalize your trading dashboard and get started with our platform.
          </p>
        </div>
      ),
    },
    {
      title: "Choose Your Theme",
      description: "Select the look and feel of the application",
      component: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6">
          <div
            className={`border rounded-lg p-4 cursor-pointer ${
              !preferences.darkMode ? 'border-primary ring-2 ring-primary' : ''
            }`}
            onClick={() => handleUpdatePreference('darkMode', false)}
          >
            <div className="h-24 bg-white rounded mb-4"></div>
            <p className="font-medium text-center">Light Mode</p>
          </div>
          <div
            className={`border rounded-lg p-4 cursor-pointer ${
              preferences.darkMode ? 'border-primary ring-2 ring-primary' : ''
            }`}
            onClick={() => handleUpdatePreference('darkMode', true)}
          >
            <div className="h-24 bg-gray-900 rounded mb-4"></div>
            <p className="font-medium text-center">Dark Mode</p>
          </div>
        </div>
      ),
    },
    {
      title: "Set Default Currency",
      description: "Choose your preferred currency for trading",
      component: (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-6">
          {['USD', 'EUR', 'GBP', 'AUD'].map((currency) => (
            <Button
              key={currency}
              variant={preferences.defaultCurrency === currency ? 'default' : 'outline'}
              className="h-12"
              onClick={() => handleUpdatePreference('defaultCurrency', currency)}
            >
              {currency}
            </Button>
          ))}
        </div>
      ),
    },
    {
      title: "All Set!",
      description: "You're ready to start trading",
      component: (
        <div className="flex flex-col items-center justify-center py-8">
          <svg
            className="w-16 h-16 text-green-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <p className="text-center max-w-md mb-6">
            Your preferences have been saved. You can always change them later in the settings.
          </p>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(preferences);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{steps[currentStep].title}</CardTitle>
        <CardDescription>{steps[currentStep].description}</CardDescription>
      </CardHeader>
      <CardContent>
        {steps[currentStep].component}
        
        <Progress value={progress} className="mb-6" />
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveOnboarding;
