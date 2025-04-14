
import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
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
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  // Example state for notification badges
  const [notificationCount, setNotificationCount] = useState(3);
  const [alertCount, setAlertCount] = useState(2);
  
  return (
    <div className="container mx-auto px-4 py-6">
      <DashboardHeader 
        notificationCount={notificationCount} 
        alertCount={alertCount}
      />
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={(value) => setActiveTab(value as DashboardTab)}>
        <DashboardTabList activeTab={activeTab} />
        
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
  );
};

export default Dashboard;
