
import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
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

export type DashboardTab = 'overview' | 'portfolio' | 'watchlist' | 'trading' | 'analysis' | 'tools';

interface DashboardLayoutOptions {
  compactMode: boolean;
  densityLevel: 'comfortable' | 'compact' | 'spacious';
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>(() => {
    // Try to retrieve last active tab from localStorage
    const savedTab = localStorage.getItem("dashboardActiveTab");
    return (savedTab as DashboardTab) || "overview";
  });
  
  const [notificationCount, setNotificationCount] = useState(3);
  const [alertCount, setAlertCount] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
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
  
  return (
    <div className="container mx-auto px-4 py-6">
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
        <div className="flex items-center justify-between mb-6">
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className="w-full">
            <DashboardTabList activeTab={activeTab} onTabChange={handleTabChange} />
          </Tabs>
          <DashboardCustomizer onLayoutChange={handleLayoutChange} className="ml-2" />
        </div>
        
        <div className={isLoading ? "animate-pulse" : ""}>
          <Tabs value={activeTab}>
            <TabsContent value="overview">
              <DashboardOverview />
            </TabsContent>
            
            <TabsContent value="portfolio">
              <DashboardPortfolio />
            </TabsContent>
            
            <TabsContent value="watchlist">
              <DashboardWatchlist />
            </TabsContent>
            
            <TabsContent value="trading">
              <DashboardTrading />
            </TabsContent>
            
            <TabsContent value="analysis">
              <DashboardAnalysis />
            </TabsContent>
            
            <TabsContent value="tools">
              <DashboardTools />
            </TabsContent>
          </Tabs>
        </div>
      </CustomizableDashboardLayout>
    </div>
  );
};

export default Dashboard;
