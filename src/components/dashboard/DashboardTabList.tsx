
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { DashboardTab } from "../Dashboard";

interface DashboardTabListProps {
  activeTab: DashboardTab;
  onTabChange?: (value: string) => void;
}

const DashboardTabList = ({ activeTab, onTabChange }: DashboardTabListProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <div className="mb-6 overflow-x-auto">
      <TabsList className={`bg-crypto-dark-card ${isMobile ? "w-max" : ""}`}>
        <TabsTrigger 
          value="overview" 
          onClick={() => onTabChange && onTabChange("overview")}
          data-state={activeTab === "overview" ? "active" : "inactive"}
        >
          Overview
        </TabsTrigger>
        <TabsTrigger 
          value="portfolio" 
          onClick={() => onTabChange && onTabChange("portfolio")}
          data-state={activeTab === "portfolio" ? "active" : "inactive"}
        >
          Portfolio
        </TabsTrigger>
        <TabsTrigger 
          value="watchlist" 
          onClick={() => onTabChange && onTabChange("watchlist")}
          data-state={activeTab === "watchlist" ? "active" : "inactive"}
        >
          Watchlist
        </TabsTrigger>
        <TabsTrigger 
          value="trading" 
          onClick={() => onTabChange && onTabChange("trading")}
          data-state={activeTab === "trading" ? "active" : "inactive"}
        >
          Trading
        </TabsTrigger>
        <TabsTrigger 
          value="analysis" 
          onClick={() => onTabChange && onTabChange("analysis")}
          data-state={activeTab === "analysis" ? "active" : "inactive"}
        >
          Analysis
        </TabsTrigger>
        <TabsTrigger 
          value="tools" 
          onClick={() => onTabChange && onTabChange("tools")}
          data-state={activeTab === "tools" ? "active" : "inactive"}
        >
          Tools
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default DashboardTabList;
