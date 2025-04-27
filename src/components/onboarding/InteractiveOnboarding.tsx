import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { ChevronRight, ChevronLeft, Check, X, AlertCircle, LucideIcon, BarChart3, Wallet, ArrowLeftRight, Settings2 } from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
}

interface OnboardingPreference {
  tradingExperience: string;
  interestedFeatures: string[];
  defaultCurrency: string;
  enableRealTimeUpdates: boolean;
  darkMode: boolean;
  newsletterSignup: boolean;
  completed: boolean;
}

type OnboardingTooltipPosition = "top" | "right" | "bottom" | "left";

interface OnboardingTooltip {
  id: string;
  selector: string;
  content: string;
  position: OnboardingTooltipPosition;
  icon?: LucideIcon;
}

interface InteractiveOnboardingProps {
  onComplete?: (preferences: OnboardingPreference) => void;
}

const InteractiveOnboarding: React.FC<InteractiveOnboardingProps> = ({
  onComplete
}) => {
  const [preferences, setPreferences] = useLocalStorage<OnboardingPreference>("onboarding-preferences", {
    tradingExperience: "beginner",
    interestedFeatures: ["portfolio", "trading"],
    defaultCurrency: "USD",
    enableRealTimeUpdates: true,
    darkMode: false,
    newsletterSignup: true,
    completed: false
  });

  const [isOpen, setIsOpen] = useState(!preferences.completed);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [tooltipOpen, setTooltipOpen] = useState<OnboardingTooltip | null>(null);

  const steps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome to TradingApp",
      description: "Let's personalize your experience in a few quick steps",
      content: (
        <div className="flex flex-col items-center text-center py-6">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <BarChart3 className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Welcome to TradingApp</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            This guided setup will help personalize your experience and show you around the platform.
            You can always change these settings later.
          </p>
          <Button 
            size="lg"
            onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
          >
            Let's Get Started
          </Button>
        </div>
      )
    },
    {
      id: "experience",
      title: "Your Trading Experience",
      description: "Help us tailor the platform to your expertise level",
      content: (
        <div className="py-4">
          <p className="mb-6 text-muted-foreground">
            What's your level of experience with cryptocurrency trading?
          </p>
          <RadioGroup
            value={preferences.tradingExperience}
            onValueChange={(value) => setPreferences({...preferences, tradingExperience: value})}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="beginner" id="beginner" />
              <Label htmlFor="beginner" className="cursor-pointer">
                <span className="font-medium">Beginner</span>
                <p className="text-sm text-muted-foreground">
                  New to trading, still learning the basics
                </p>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="intermediate" id="intermediate" />
              <Label htmlFor="intermediate" className="cursor-pointer">
                <span className="font-medium">Intermediate</span>
                <p className="text-sm text-muted-foreground">
                  Some experience trading, familiar with key concepts
                </p>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="advanced" id="advanced" />
              <Label htmlFor="advanced" className="cursor-pointer">
                <span className="font-medium">Advanced</span>
                <p className="text-sm text-muted-foreground">
                  Experienced trader with sophisticated strategies
                </p>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="professional" id="professional" />
              <Label htmlFor="professional" className="cursor-pointer">
                <span className="font-medium">Professional</span>
                <p className="text-sm text-muted-foreground">
                  Professional trader or institutional user
                </p>
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      id: "features",
      title: "Features You're Interested In",
      description: "We'll customize your dashboard with these in mind",
      content: (
        <div className="py-4">
          <p className="mb-6 text-muted-foreground">
            Which features are you most interested in using? (Select all that apply)
          </p>
          <div className="space-y-4">
            {[
              {id: "portfolio", label: "Portfolio Tracking", description: "Track your crypto holdings across exchanges"},
              {id: "trading", label: "Trading", description: "Execute trades directly from the platform"},
              {id: "ai-bots", label: "AI Trading Bots", description: "Automated trading with AI strategies"},
              {id: "analytics", label: "Advanced Analytics", description: "In-depth market and portfolio analysis"},
              {id: "news", label: "News & Insights", description: "Stay updated with crypto market news"},
              {id: "tax", label: "Tax Reporting", description: "Tools for tax compliance and reporting"}
            ].map((feature) => (
              <div key={feature.id} className="flex items-start space-x-2">
                <Checkbox 
                  id={feature.id} 
                  checked={preferences.interestedFeatures.includes(feature.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setPreferences({
                        ...preferences, 
                        interestedFeatures: [...preferences.interestedFeatures, feature.id]
                      });
                    } else {
                      setPreferences({
                        ...preferences,
                        interestedFeatures: preferences.interestedFeatures.filter(f => f !== feature.id)
                      });
                    }
                  }}
                />
                <div className="grid gap-1.5">
                  <Label htmlFor={feature.id} className="cursor-pointer font-medium">
                    {feature.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "preferences",
      title: "General Preferences",
      description: "Set your default settings",
      content: (
        <div className="py-4 space-y-6">
          <div className="space-y-3">
            <Label>Default Currency</Label>
            <RadioGroup
              value={preferences.defaultCurrency}
              onValueChange={(value) => setPreferences({...preferences, defaultCurrency: value})}
              className="flex flex-wrap gap-4"
            >
              {["USD", "EUR", "GBP", "AUD", "JPY", "CAD", "BTC", "ETH"].map((currency) => (
                <div key={currency} className="flex items-center space-x-2">
                  <RadioGroupItem value={currency} id={`currency-${currency}`} />
                  <Label htmlFor={`currency-${currency}`}>{currency}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Real-Time Price Updates</Label>
              <p className="text-sm text-muted-foreground">
                Receive live price updates for your portfolio
              </p>
            </div>
            <Switch
              checked={preferences.enableRealTimeUpdates}
              onCheckedChange={(checked) => setPreferences({...preferences, enableRealTimeUpdates: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Use dark theme for the interface
              </p>
            </div>
            <Switch
              checked={preferences.darkMode}
              onCheckedChange={(checked) => setPreferences({...preferences, darkMode: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Newsletter Signup</Label>
              <p className="text-sm text-muted-foreground">
                Receive market insights & platform updates
              </p>
            </div>
            <Switch
              checked={preferences.newsletterSignup}
              onCheckedChange={(checked) => setPreferences({...preferences, newsletterSignup: checked})}
            />
          </div>
        </div>
      )
    },
    {
      id: "complete",
      title: "Setup Complete!",
      description: "You're all set to start trading",
      content: (
        <div className="flex flex-col items-center text-center py-6">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
            <Check className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">Setup Complete!</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Your preferences have been saved. Let's explore your personalized dashboard.
          </p>
          <div className="space-y-4">
            <div className="border rounded-md p-3 text-left">
              <h4 className="font-medium">Personalized For You</h4>
              <p className="text-sm text-muted-foreground">
                We've configured your experience based on your {preferences.tradingExperience} experience level.
              </p>
            </div>
            <div className="border rounded-md p-3 text-left">
              <h4 className="font-medium">Focus Areas</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {preferences.interestedFeatures.map(feature => (
                  <Badge key={feature} className="bg-primary/10 text-primary border-none">
                    {feature.charAt(0).toUpperCase() + feature.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="border rounded-md p-3 text-left">
              <h4 className="font-medium">Next Steps</h4>
              <p className="text-sm text-muted-foreground">
                Follow our guided tour to learn about key features.
              </p>
            </div>
          </div>
          <Button 
            size="lg"
            className="mt-6"
            onClick={handleComplete}
          >
            Start Using TradingApp
          </Button>
        </div>
      )
    }
  ];

  const tooltips: OnboardingTooltip[] = [
    {
      id: "dashboard-tooltip",
      selector: "#dashboard-tab",
      content: "Your personalized overview of market data and portfolio",
      position: "bottom",
      icon: BarChart3
    },
    {
      id: "portfolio-tooltip",
      selector: "#portfolio-tab",
      content: "Track your crypto holdings across exchanges",
      position: "bottom",
      icon: Wallet
    },
    {
      id: "trading-tooltip",
      selector: "#trading-tab",
      content: "Execute trades and manage your orders",
      position: "bottom",
      icon: ArrowLeftRight
    },
    {
      id: "settings-tooltip",
      selector: "#settings-button",
      content: "Configure your account and application preferences",
      position: "left",
      icon: Settings2
    }
  ];

  useEffect(() => {
    if (preferences.completed && !isOpen) {
      const showTooltipsSequentially = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        for (const tooltip of tooltips) {
          const element = document.querySelector(tooltip.selector);
          if (!element) continue;
          
          setTooltipOpen(tooltip);
          
          await new Promise(resolve => setTimeout(resolve, 5000));
          
          setTooltipOpen(null);
          
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      };
      
      showTooltipsSequentially();
    }
  }, [preferences.completed, isOpen]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleComplete = () => {
    setPreferences({
      ...preferences,
      completed: true
    });
    
    setIsOpen(false);
    
    if (onComplete) {
      onComplete(preferences);
    }
    
    toast({
      title: "Welcome to TradingApp!",
      description: "Your personalized setup is complete.",
    });
  };

  const handleDismissTooltip = () => {
    setTooltipOpen(null);
  };

  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const Tooltip: React.FC<{ tooltip: OnboardingTooltip }> = ({ tooltip }) => {
    const element = document.querySelector(tooltip.selector);
    if (!element) return null;
    
    const rect = element.getBoundingClientRect();
    const Icon = tooltip.icon;
    
    let style: React.CSSProperties = {
      position: 'fixed',
      zIndex: 9999,
    };
    
    const tooltipWidth = 320;
    const tooltipHeight = 100;
    const spacing = 10;
    
    switch (tooltip.position) {
      case 'top':
        style = {
          ...style,
          bottom: window.innerHeight - rect.top + spacing,
          left: rect.left + (rect.width / 2) - (tooltipWidth / 2),
          width: tooltipWidth,
        };
        break;
      case 'right':
        style = {
          ...style,
          left: rect.right + spacing,
          top: rect.top + (rect.height / 2) - (tooltipHeight / 2),
          width: tooltipWidth,
        };
        break;
      case 'bottom':
        style = {
          ...style,
          top: rect.bottom + spacing,
          left: rect.left + (rect.width / 2) - (tooltipWidth / 2),
          width: tooltipWidth,
        };
        break;
      case 'left':
        style = {
          ...style,
          right: window.innerWidth - rect.left + spacing,
          top: rect.top + (rect.height / 2) - (tooltipHeight / 2),
          width: tooltipWidth,
        };
        break;
    }
    
    return (
      <div 
        style={style}
        className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-lg border animate-fade-in"
      >
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="bg-primary/10 p-2 rounded-full">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
          <div className="flex-1">
            <p className="font-medium mb-1">Feature Tip</p>
            <p className="text-sm text-muted-foreground">{tooltip.content}</p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 rounded-full"
            onClick={handleDismissTooltip}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (preferences.completed) {
          setIsOpen(open);
        }
      }}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          <div className="px-6 pt-6">
            <DialogHeader>
              <DialogTitle>{currentStep.title}</DialogTitle>
              <DialogDescription>{currentStep.description}</DialogDescription>
            </DialogHeader>
            
            <Progress value={progress} className="mt-4" />
          </div>
          
          <div className="p-6">
            {currentStep.content}
          </div>
          
          <DialogFooter className="px-6 pb-6 flex gap-2">
            {!isFirstStep && (
              <Button variant="outline" onClick={handlePrevious}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            
            <div className="flex-1"></div>
            
            {isLastStep ? (
              <Button onClick={handleComplete}>
                <Check className="h-4 w-4 mr-2" />
                Complete Setup
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Continue
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {tooltipOpen && <Tooltip tooltip={tooltipOpen} />}
      
      {preferences.completed && !isOpen && (
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-8 right-8"
          onClick={() => setIsOpen(true)}
        >
          <AlertCircle className="h-4 w-4 mr-2" />
          Restart Guided Tour
        </Button>
      )}
    </>
  );
};

const Badge = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
};

export default InteractiveOnboarding;
