
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MarketOverview from './MarketOverview';
import PortfolioDashboard from './PortfolioDashboard';
import TradingDashboard from './TradingDashboard';
import AnalysisDashboard from './AnalysisDashboard';
import UtilityDashboard from './UtilityDashboard';
import LiveAnalyticsDashboard from './analytics/LiveAnalyticsDashboard';
import RealTrading from './trading/RealTrading';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="market" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="market">Market</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="realtrading">Real Trading</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="analytics">Live Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="market" className="p-0 border-none">
          <MarketOverview />
        </TabsContent>
        
        <TabsContent value="portfolio" className="p-0 border-none">
          <PortfolioDashboard />
        </TabsContent>
        
        <TabsContent value="trading" className="p-0 border-none">
          <TradingDashboard />
        </TabsContent>
        
        <TabsContent value="realtrading" className="p-0 border-none">
          <RealTrading />
        </TabsContent>
        
        <TabsContent value="analysis" className="p-0 border-none">
          <AnalysisDashboard />
        </TabsContent>
        
        <TabsContent value="tools" className="p-0 border-none">
          <UtilityDashboard />
        </TabsContent>
        
        <TabsContent value="analytics" className="p-0 border-none">
          <div className="grid grid-cols-1 gap-6">
            <LiveAnalyticsDashboard showDetailedView={true} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
