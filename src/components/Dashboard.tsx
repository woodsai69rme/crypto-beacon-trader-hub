
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardTabList from "./dashboard/DashboardTabList";
import DashboardOverview from "./dashboard/DashboardOverview";
import DashboardPortfolio from "./dashboard/DashboardPortfolio";
import DashboardWatchlist from "./dashboard/DashboardWatchlist";
import DashboardTrading from "./dashboard/DashboardTrading";
import DashboardAnalysis from "./dashboard/DashboardAnalysis";
import DashboardTools from "./dashboard/DashboardTools";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

export type DashboardTab = "overview" | "portfolio" | "watchlist" | "trading" | "analysis" | "tools";

interface DashboardProps {
  initialTab?: DashboardTab;
}

const Dashboard = ({ initialTab = "overview" }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      toast({
        title: "Dashboard updated",
        description: "Latest market data has been loaded.",
      });
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value as DashboardTab);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="bg-card shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Crypto Dashboard</CardTitle>
          <CardDescription>
            Your comprehensive crypto trading platform and portfolio manager
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <DashboardTabList activeTab={activeTab} onTabChange={handleTabChange} />
          
          {activeTab === "overview" && <DashboardOverview />}
          {activeTab === "portfolio" && <DashboardPortfolio />}
          {activeTab === "watchlist" && <DashboardWatchlist />}
          {activeTab === "trading" && <DashboardTrading />}
          {activeTab === "analysis" && <DashboardAnalysis />}
          {activeTab === "tools" && <DashboardTools />}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
