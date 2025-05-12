
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MarketOverview from './MarketOverview';
import PortfolioDashboard from './PortfolioDashboard';
import TradingDashboard from './TradingDashboard';
import AnalysisDashboard from './AnalysisDashboard';
import UtilityDashboard from './UtilityDashboard';
import LiveAnalyticsDashboard from './analytics/LiveAnalyticsDashboard';
import RealTrading from './trading/RealTrading';
import CustomizableDashboard from './dashboard/CustomizableDashboard';
import { Bot, Book, Code, Layout, LineChart, BarChart4, Table2, Gauge, Wallet, Globe } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="market" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10">
          <TabsTrigger value="market" className="flex items-center gap-1">
            <Globe className="h-4 w-4" />
            <span className="hidden md:inline">Market</span>
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="flex items-center gap-1">
            <Wallet className="h-4 w-4" />
            <span className="hidden md:inline">Portfolio</span>
          </TabsTrigger>
          <TabsTrigger value="trading" className="flex items-center gap-1">
            <Table2 className="h-4 w-4" />
            <span className="hidden md:inline">Trading</span>
          </TabsTrigger>
          <TabsTrigger value="realtrading" className="flex items-center gap-1">
            <LineChart className="h-4 w-4" />
            <span className="hidden md:inline">Real Trading</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-1">
            <BarChart4 className="h-4 w-4" />
            <span className="hidden md:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex items-center gap-1">
            <Gauge className="h-4 w-4" />
            <span className="hidden md:inline">Tools</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1">
            <LineChart className="h-4 w-4" />
            <span className="hidden md:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="customize" className="flex items-center gap-1">
            <Layout className="h-4 w-4" />
            <span className="hidden md:inline">Customize</span>
          </TabsTrigger>
          <TabsTrigger value="docs" className="flex items-center gap-1">
            <Book className="h-4 w-4" />
            <span className="hidden md:inline">Docs</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-1">
            <Bot className="h-4 w-4" />
            <span className="hidden md:inline">AI</span>
          </TabsTrigger>
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
        
        <TabsContent value="customize" className="p-0 border-none">
          <CustomizableDashboard />
        </TabsContent>
        
        <TabsContent value="docs" className="p-0 border-none">
          <div className="p-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Documentation</h2>
            <p className="text-muted-foreground">
              Documentation section is currently under construction. Check back soon for detailed guides and API references.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="ai" className="p-0 border-none">
          <div className="p-4 text-center">
            <h2 className="text-2xl font-bold mb-4">AI Trading Features</h2>
            <p className="text-muted-foreground">
              AI trading features including strategy building, backtesting, and optimization are coming soon.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
