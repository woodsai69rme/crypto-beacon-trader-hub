
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from "@/hooks/use-media-query";
import { DashboardTab } from "../Dashboard";

interface DashboardTabListProps {
  activeTab: DashboardTab;
  onTabChange?: (value: string) => void;
}

const DashboardTabList = ({ activeTab, onTabChange }: DashboardTabListProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <div className="mb-6 overflow-x-auto">
      <Tabs value={activeTab} onValueChange={(value) => onTabChange && onTabChange(value)}>
        <TabsList className={`bg-crypto-dark-card ${isMobile ? "w-max" : ""}`}>
          <TabsTrigger 
            value="overview"
            data-state={activeTab === "overview" ? "active" : "inactive"}
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="portfolio"
            data-state={activeTab === "portfolio" ? "active" : "inactive"}
          >
            Portfolio
          </TabsTrigger>
          <TabsTrigger 
            value="watchlist"
            data-state={activeTab === "watchlist" ? "active" : "inactive"}
          >
            Watchlist
          </TabsTrigger>
          <TabsTrigger 
            value="trading"
            data-state={activeTab === "trading" ? "active" : "inactive"}
          >
            Trading
          </TabsTrigger>
          <TabsTrigger 
            value="analysis"
            data-state={activeTab === "analysis" ? "active" : "inactive"}
          >
            Analysis
          </TabsTrigger>
          <TabsTrigger 
            value="tools"
            data-state={activeTab === "tools" ? "active" : "inactive"}
          >
            Tools
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default DashboardTabList;
