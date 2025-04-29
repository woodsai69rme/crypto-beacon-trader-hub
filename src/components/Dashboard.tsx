
import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import CollapsibleCard from "./CollapsibleCard";
import DashboardHeader from "./dashboard/DashboardHeader";
import DashboardTabList from "./dashboard/DashboardTabList";
import DashboardOverview from "./dashboard/DashboardOverview";
import DashboardPortfolio from "./dashboard/DashboardPortfolio";
import DashboardWatchlist from "./dashboard/DashboardWatchlist";
import DashboardTrading from "./dashboard/DashboardTrading";
import DashboardAnalysis from "./dashboard/DashboardAnalysis";
import DashboardTools from "./dashboard/DashboardTools";
import DashboardCustomizer from "./DashboardCustomizer";
import CustomizableDashboardLayout from "./dashboard/CustomizableDashboardLayout";
import InteractiveOnboarding from "./onboarding/InteractiveOnboarding";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useTheme } from "@/contexts/ThemeContext";

export type DashboardTab = 'overview' | 'portfolio' | 'watchlist' | 'trading' | 'analysis' | 'tools';

interface DashboardLayoutOptions {
  compactMode: boolean;
  densityLevel: 'comfortable' | 'compact' | 'spacious';
}

const Dashboard = () => {
  const { colorScheme } = useTheme();
  const [activeTab, setActiveTab] = useState<DashboardTab>(() => {
    // Try to retrieve last active tab from localStorage
    const savedTab = localStorage.getItem("dashboardActiveTab");
    return (savedTab as DashboardTab) || "overview";
  });
  
  const [notificationCount, setNotificationCount] = useState(3);
  const [alertCount, setAlertCount] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false); // Set to false by default to skip onboarding
  const [layoutOptions, setLayoutOptions] = useLocalStorage<DashboardLayoutOptions>("dashboard-layout", {
    compactMode: false,
    densityLevel: 'comfortable'
  });
  
  // Save the active tab to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("dashboardActiveTab", activeTab);
  }, [activeTab]);
  
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as DashboardTab);
    
    // Simulate data loading for smoother UX
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, []);
  
  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    
    // Simulate refresh
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Dashboard refreshed",
        description: "Latest data has been loaded",
      });
    }, 1000);
  }, []);
  
  const handleLayoutChange = (newLayout: any) => {
    // In a real app, this would update the dashboard's layout
    toast({
      title: "Layout updated",
      description: "Your dashboard layout preferences have been saved",
    });
  };
  
  const handleOnboardingComplete = (preferences: any) => {
    setShowOnboarding(false);
    console.log("Onboarding preferences:", preferences);
    
    // Apply user preferences to the UI
    if (preferences.darkMode) {
      // Apply dark mode
    }
    
    toast({
      title: "Welcome to TradingApp!",
      description: "Your setup is complete. Explore your personalized dashboard.",
    });
  };
  
  // Apply theme classes based on current color scheme
  const cardClasses = `mb-6 shadow-md border border-border rounded-lg overflow-hidden bg-card ${colorScheme !== 'default' ? `themed-card` : ''}`;
  
  return (
    <div className="mx-auto px-0 py-4 max-w-full">
      {showOnboarding && (
        <InteractiveOnboarding onComplete={handleOnboardingComplete} />
      )}
      
      <DashboardHeader 
        notificationCount={notificationCount} 
        alertCount={alertCount}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />
      
      <CustomizableDashboardLayout onLayoutChange={handleLayoutChange}>
        <div className="flex items-center justify-between mb-6 bg-card rounded-lg p-3 shadow-md border border-border">
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className="w-full">
            <DashboardTabList activeTab={activeTab} onTabChange={handleTabChange} />
          </Tabs>
          <DashboardCustomizer onLayoutChange={handleLayoutChange} className="ml-2" />
        </div>
        
        <div className={`transition-all duration-300 ${isLoading ? "opacity-50" : "opacity-100"}`}>
          <Tabs value={activeTab}>
            <TabsContent value="overview">
              <CollapsibleCard
                title="Overview"
                description="Your trading activity at a glance"
                className={cardClasses}
              >
                <DashboardOverview />
              </CollapsibleCard>
            </TabsContent>
            
            <TabsContent value="portfolio">
              <CollapsibleCard
                title="Portfolio"
                description="View and manage your investments"
                className={cardClasses}
              >
                <DashboardPortfolio />
              </CollapsibleCard>
            </TabsContent>
            
            <TabsContent value="watchlist">
              <CollapsibleCard
                title="Watchlist"
                description="Cryptocurrencies you're monitoring"
                className={cardClasses}
              >
                <DashboardWatchlist />
              </CollapsibleCard>
            </TabsContent>
            
            <TabsContent value="trading">
              <CollapsibleCard
                title="Trading"
                description="Execute trades and view history"
                className={cardClasses}
              >
                <DashboardTrading />
              </CollapsibleCard>
            </TabsContent>
            
            <TabsContent value="analysis">
              <CollapsibleCard
                title="Analysis"
                description="Market analysis and insights"
                className={cardClasses}
              >
                <DashboardAnalysis />
              </CollapsibleCard>
            </TabsContent>
            
            <TabsContent value="tools">
              <CollapsibleCard
                title="Tools"
                description="Trading tools and utilities"
                className={cardClasses}
              >
                <DashboardTools />
              </CollapsibleCard>
            </TabsContent>
          </Tabs>
        </div>
      </CustomizableDashboardLayout>
    </div>
  );
};

export default Dashboard;
