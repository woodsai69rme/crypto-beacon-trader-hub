
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from "./dashboard/DashboardHeader";
import DashboardOverview from "./dashboard/DashboardOverview";
import DashboardPortfolio from "./dashboard/DashboardPortfolio";
import DashboardWatchlist from "./dashboard/DashboardWatchlist";
import DashboardTrading from "./dashboard/DashboardTrading";
import DashboardAnalysis from "./dashboard/DashboardAnalysis";
import DashboardTools from "./dashboard/DashboardTools";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  // Example state for notification badges
  const [notificationCount, setNotificationCount] = useState(3);
  const [alertCount, setAlertCount] = useState(2);
  
  return (
    <div className="container mx-auto px-4 py-6">
      <DashboardHeader 
        notificationCount={notificationCount} 
        alertCount={alertCount}
      />
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <div className="mb-6">
          <TabsList className="bg-crypto-dark-card">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="trading">Trading</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
          </TabsList>
        </div>
        
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
