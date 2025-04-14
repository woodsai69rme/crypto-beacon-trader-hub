
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

export type DashboardTab = 'overview' | 'portfolio' | 'watchlist' | 'trading' | 'analysis' | 'tools';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>(() => {
    // Try to retrieve last active tab from localStorage
    const savedTab = localStorage.getItem("dashboardActiveTab");
    return (savedTab as DashboardTab) || "overview";
  });
  
  const [notificationCount, setNotificationCount] = useState(3);
  const [alertCount, setAlertCount] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  
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
  
  return (
    <div className="container mx-auto px-4 py-6">
      <DashboardHeader 
        notificationCount={notificationCount} 
        alertCount={alertCount}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange}>
        <DashboardTabList activeTab={activeTab} onTabChange={handleTabChange} />
        
        <div className={isLoading ? "animate-pulse" : ""}>
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
        </div>
      </Tabs>
    </div>
  );
};

export default Dashboard;
