
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApiKeyManagement from "../ApiKeyManagement";
import FakeTrading from "../FakeTrading";
import AiTradingBots from "../trading/AiTradingBots";
import TradingEducation from "../trading/TradingEducation";
import MultiExchangeTrading from "../trading/MultiExchangeTrading";
import AiMarketAnalysis from "../trading/AiMarketAnalysis";
import CommunityHub from "../community/CommunityHub";

const DashboardTrading = () => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <Tabs defaultValue="trade" className="w-full">
        <TabsList className="grid grid-cols-6 mb-6">
          <TabsTrigger value="trade">Basic Trading</TabsTrigger>
          <TabsTrigger value="ai-bots">AI Trading Bots</TabsTrigger>
          <TabsTrigger value="multi-exchange">Multi-Exchange</TabsTrigger>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trade">
          <FakeTrading />
          <div className="mt-6">
            <ApiKeyManagement />
          </div>
        </TabsContent>
        
        <TabsContent value="ai-bots">
          <AiTradingBots />
        </TabsContent>
        
        <TabsContent value="multi-exchange">
          <MultiExchangeTrading />
        </TabsContent>
        
        <TabsContent value="analysis">
          <AiMarketAnalysis />
        </TabsContent>
        
        <TabsContent value="education">
          <TradingEducation />
        </TabsContent>
        
        <TabsContent value="community">
          <CommunityHub />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardTrading;
