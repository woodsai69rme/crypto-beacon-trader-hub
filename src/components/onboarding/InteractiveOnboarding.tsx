
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface OnboardingStep {
  title: string;
  description: string;
  content: React.ReactNode;
}

interface OnboardingPreferences {
  name: string;
  experienceLevel: string;
  tradingFrequency: string;
  riskTolerance: string;
  interestedFeatures: string[];
  darkMode: boolean;
  receiveNotifications: boolean;
  enableRealTimeData: boolean;
  baseCurrency: string;
}

interface InteractiveOnboardingProps {
  onComplete: (preferences: OnboardingPreferences) => void;
}

const InteractiveOnboarding: React.FC<InteractiveOnboardingProps> = ({ onComplete }) => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage("onboarding-completed", false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const [preferences, setPreferences] = useState<OnboardingPreferences>({
    name: "",
    experienceLevel: "intermediate",
    tradingFrequency: "weekly",
    riskTolerance: "moderate",
    interestedFeatures: ["ai-trading", "real-time-data"],
    darkMode: true,
    receiveNotifications: true,
    enableRealTimeData: true,
    baseCurrency: "USD"
  });
  
  // If onboarding has been completed, return null
  if (hasCompletedOnboarding) {
    return null;
  }
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setProgress(((currentStep + 1) / steps.length) * 100);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setProgress(((currentStep - 1) / steps.length) * 100);
    }
  };
  
  const handleComplete = () => {
    setHasCompletedOnboarding(true);
    onComplete(preferences);
  };
  
  const handlePreferenceChange = (key: keyof OnboardingPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleFeatureToggle = (feature: string) => {
    setPreferences(prev => {
      const currentFeatures = [...prev.interestedFeatures];
      if (currentFeatures.includes(feature)) {
        return {
          ...prev,
          interestedFeatures: currentFeatures.filter(f => f !== feature)
        };
      } else {
        return {
          ...prev,
          interestedFeatures: [...currentFeatures, feature]
        };
      }
    });
  };
  
  // Define the onboarding steps
  const steps: OnboardingStep[] = [
    {
      title: "Welcome to TradingApp",
      description: "Let's get you set up in just a few steps.",
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">What should we call you?</Label>
            <Input
              id="name"
              placeholder="Your name"
              value={preferences.name}
              onChange={(e) => handlePreferenceChange("name", e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="darkMode">Theme Preference</Label>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm">Dark Mode</span>
              <Switch
                id="darkMode"
                checked={preferences.darkMode}
                onCheckedChange={(checked) => handlePreferenceChange("darkMode", checked)}
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Trading Experience",
      description: "Help us tailor the experience to your level.",
      content: (
        <div className="space-y-4">
          <div>
            <Label>Your trading experience</Label>
            <RadioGroup
              value={preferences.experienceLevel}
              onValueChange={(value) => handlePreferenceChange("experienceLevel", value)}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="beginner" id="beginner" />
                <Label htmlFor="beginner">Beginner</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="intermediate" id="intermediate" />
                <Label htmlFor="intermediate">Intermediate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="advanced" id="advanced" />
                <Label htmlFor="advanced">Advanced</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="professional" id="professional" />
                <Label htmlFor="professional">Professional</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="mt-4">
            <Label>How often do you trade?</Label>
            <Select
              value={preferences.tradingFrequency}
              onValueChange={(value) => handlePreferenceChange("tradingFrequency", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="rarely">Rarely</SelectItem>
                <SelectItem value="never">Never (Just starting)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    },
    {
      title: "Risk Profile",
      description: "Understanding your risk tolerance helps us recommend appropriate strategies.",
      content: (
        <div className="space-y-4">
          <div>
            <Label>Risk Tolerance</Label>
            <RadioGroup
              value={preferences.riskTolerance}
              onValueChange={(value) => handlePreferenceChange("riskTolerance", value)}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="conservative" id="conservative" />
                <Label htmlFor="conservative">Conservative</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderate" id="moderate" />
                <Label htmlFor="moderate">Moderate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="aggressive" id="aggressive" />
                <Label htmlFor="aggressive">Aggressive</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very-aggressive" id="very-aggressive" />
                <Label htmlFor="very-aggressive">Very Aggressive</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="mt-4">
            <Label>Base Currency</Label>
            <Select
              value={preferences.baseCurrency}
              onValueChange={(value) => handlePreferenceChange("baseCurrency", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">US Dollar (USD)</SelectItem>
                <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                <SelectItem value="EUR">Euro (EUR)</SelectItem>
                <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                <SelectItem value="JPY">Japanese Yen (JPY)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    },
    {
      title: "Features and Preferences",
      description: "Select the features you're most interested in.",
      content: (
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Features of Interest</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="ai-trading" 
                  checked={preferences.interestedFeatures.includes("ai-trading")}
                  onCheckedChange={(checked) => handleFeatureToggle("ai-trading")}
                />
                <Label htmlFor="ai-trading">AI Trading Bots</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="real-time-data" 
                  checked={preferences.interestedFeatures.includes("real-time-data")}
                  onCheckedChange={(checked) => handleFeatureToggle("real-time-data")}
                />
                <Label htmlFor="real-time-data">Real-time Data</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="portfolio-tracking" 
                  checked={preferences.interestedFeatures.includes("portfolio-tracking")}
                  onCheckedChange={(checked) => handleFeatureToggle("portfolio-tracking")}
                />
                <Label htmlFor="portfolio-tracking">Portfolio Tracking</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="technical-analysis" 
                  checked={preferences.interestedFeatures.includes("technical-analysis")}
                  onCheckedChange={(checked) => handleFeatureToggle("technical-analysis")}
                />
                <Label htmlFor="technical-analysis">Technical Analysis</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="alerts" 
                  checked={preferences.interestedFeatures.includes("alerts")}
                  onCheckedChange={(checked) => handleFeatureToggle("alerts")}
                />
                <Label htmlFor="alerts">Price Alerts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="exchange-integration" 
                  checked={preferences.interestedFeatures.includes("exchange-integration")}
                  onCheckedChange={(checked) => handleFeatureToggle("exchange-integration")}
                />
                <Label htmlFor="exchange-integration">Exchange Integration</Label>
              </div>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Receive Notifications</Label>
              <Switch
                id="notifications"
                checked={preferences.receiveNotifications}
                onCheckedChange={(checked) => handlePreferenceChange("receiveNotifications", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="realTimeData">Enable Real-Time Data</Label>
              <Switch
                id="realTimeData"
                checked={preferences.enableRealTimeData}
                onCheckedChange={(checked) => handlePreferenceChange("enableRealTimeData", checked)}
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "You're All Set!",
      description: "Your personalized trading experience awaits.",
      content: (
        <div className="space-y-4 text-center">
          <div className="py-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium">Ready to Trade</h3>
            <p className="text-muted-foreground mt-2">
              Your preferences have been saved. Let's start trading!
            </p>
          </div>
          
          <div className="bg-muted/40 p-4 rounded-md border text-left">
            <h4 className="font-medium mb-2">Your Selected Preferences</h4>
            <ul className="text-sm space-y-1">
              <li><span className="font-medium">Experience Level:</span> {preferences.experienceLevel.charAt(0).toUpperCase() + preferences.experienceLevel.slice(1)}</li>
              <li><span className="font-medium">Trading Frequency:</span> {preferences.tradingFrequency.charAt(0).toUpperCase() + preferences.tradingFrequency.slice(1)}</li>
              <li><span className="font-medium">Risk Tolerance:</span> {preferences.riskTolerance.charAt(0).toUpperCase() + preferences.riskTolerance.slice(1)}</li>
              <li><span className="font-medium">Base Currency:</span> {preferences.baseCurrency}</li>
              <li><span className="font-medium">Featured Enabled:</span> {preferences.interestedFeatures.length} features</li>
            </ul>
          </div>
        </div>
      )
    }
  ];
  
  const currentStepData = steps[currentStep];
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{currentStepData.title}</CardTitle>
          <CardDescription>{currentStepData.description}</CardDescription>
        </CardHeader>
        
        <CardContent>
          {currentStepData.content}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          <Progress value={progress} className="w-full h-2" />
          
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button onClick={handleComplete}>
                Complete Setup
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InteractiveOnboarding;
