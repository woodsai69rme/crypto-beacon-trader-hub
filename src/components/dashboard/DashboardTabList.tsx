
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DashboardTab } from "../Dashboard";

interface DashboardTabListProps {
  activeTab: DashboardTab;
}

const DashboardTabList = ({ activeTab }: DashboardTabListProps) => {
  return (
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
  );
};

export default DashboardTabList;
