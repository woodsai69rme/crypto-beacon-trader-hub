
import React, { useState, useEffect } from "react";
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
import { cn } from "@/lib/utils";
import { useUI } from "@/contexts/UIContext";

export type DashboardTab = "overview" | "portfolio" | "watchlist" | "trading" | "analysis" | "tools";

interface DashboardProps {
  initialTab?: DashboardTab;
}

const Dashboard = ({ initialTab = "overview" }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);
  const { tickerSettings, sidebarSettings } = useUI();
  
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
  
  // Calculate padding based on sidebar settings
  const getPadding = () => {
    const hasSidebar = sidebarSettings?.enabled;
    return hasSidebar ? "px-0 md:px-4" : "px-4";
  };
  
  return (
    <div className={cn("container mx-auto py-8", getPadding())}>
      <Card className="bg-card shadow-lg relative overflow-hidden">
        {/* Futuristic accent border for the card */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/40 via-primary/80 to-primary/40"></div>
        
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Crypto Dashboard</CardTitle>
          <CardDescription>
            Your comprehensive crypto trading platform and portfolio manager
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <DashboardTabList activeTab={activeTab} onTabChange={handleTabChange} />
          
          <div className="relative">
            {/* Add futuristic background patterns */}
            <div className="absolute inset-0 pointer-events-none opacity-5">
              <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl"></div>
              <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-primary/5 blur-3xl"></div>
            </div>
            
            {activeTab === "overview" && <DashboardOverview />}
            {activeTab === "portfolio" && <DashboardPortfolio />}
            {activeTab === "watchlist" && <DashboardWatchlist />}
            {activeTab === "trading" && <DashboardTrading />}
            {activeTab === "analysis" && <DashboardAnalysis />}
            {activeTab === "tools" && <DashboardTools />}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
