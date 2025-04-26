
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApiKeyManagement from "../ApiKeyManagement";
import FakeTrading from "../FakeTrading";
import AiTradingBots from "../trading/AiTradingBots";
import TradingEducation from "../trading/TradingEducation";
import MultiExchangeTrading from "../trading/MultiExchangeTrading";
import AiMarketAnalysis from "../trading/AiMarketAnalysis";
import CommunityHub from "../community/CommunityHub";
import { Card, CardContent } from "@/components/ui/card";

const DashboardTrading = () => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <Tabs defaultValue="trade" className="w-full">
        <TabsList className="grid grid-cols-7 mb-6">
          <TabsTrigger value="trade">Basic Trading</TabsTrigger>
          <TabsTrigger value="ai-bots">AI Trading Bots</TabsTrigger>
          <TabsTrigger value="multi-exchange">Multi-Exchange</TabsTrigger>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trade">
          <FakeTrading />
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
        
        <TabsContent value="api-keys">
          <Card>
            <CardContent className="pt-6">
              <ApiKeyManagement />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardTrading;
