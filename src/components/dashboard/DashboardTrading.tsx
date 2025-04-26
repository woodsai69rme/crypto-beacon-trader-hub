
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApiKeyManagement from "../ApiKeyManagement";
import FakeTrading from "../FakeTrading";
import AiTradingBots from "../trading/AiTradingBots";
import AiTradingMcp from "../trading/AiTradingMcp"; 
import TradingEducation from "../trading/TradingEducation";
import MultiExchangeTrading from "../trading/MultiExchangeTrading";
import AiMarketAnalysis from "../trading/AiMarketAnalysis";
import SocialTradingFeatures from "../trading/SocialTradingFeatures";
import AlertsSystem from "../trading/AlertsSystem";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

const DashboardTrading = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="grid grid-cols-1 gap-6">
      <Tabs defaultValue="trade" className="w-full">
        <TabsList className={`grid ${isMobile ? 'grid-cols-4' : 'grid-cols-8'} mb-6`}>
          <TabsTrigger value="trade">Basic Trading</TabsTrigger>
          <TabsTrigger value="ai-bots">AI Bots</TabsTrigger>
          <TabsTrigger value="mcp">MCP Trading</TabsTrigger>
          <TabsTrigger value="multi-exchange">Multi-Exchange</TabsTrigger>
          {!isMobile && <TabsTrigger value="analysis">Analysis</TabsTrigger>}
          {!isMobile && <TabsTrigger value="social">Social</TabsTrigger>}
          {!isMobile && <TabsTrigger value="education">Education</TabsTrigger>}
          {!isMobile && <TabsTrigger value="api-keys">API Keys</TabsTrigger>}
          {isMobile && <TabsTrigger value="more">More</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="trade" className="animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <FakeTrading />
            </div>
            <div className="lg:col-span-1">
              <AlertsSystem />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="ai-bots" className="animate-fade-in">
          <AiTradingBots />
        </TabsContent>
        
        <TabsContent value="mcp" className="animate-fade-in">
          <AiTradingMcp />
        </TabsContent>
        
        <TabsContent value="multi-exchange" className="animate-fade-in">
          <MultiExchangeTrading />
        </TabsContent>
        
        <TabsContent value="analysis" className="animate-fade-in">
          <AiMarketAnalysis />
        </TabsContent>
        
        <TabsContent value="social" className="animate-fade-in">
          <SocialTradingFeatures />
        </TabsContent>
        
        <TabsContent value="education" className="animate-fade-in">
          <TradingEducation />
        </TabsContent>
        
        <TabsContent value="api-keys" className="animate-fade-in">
          <Card>
            <CardContent className="pt-6">
              <ApiKeyManagement />
            </CardContent>
          </Card>
        </TabsContent>
        
        {isMobile && (
          <TabsContent value="more" className="animate-fade-in">
            <Tabs defaultValue="analysis">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="api-keys">API Keys</TabsTrigger>
              </TabsList>
              
              <TabsContent value="analysis">
                <AiMarketAnalysis />
              </TabsContent>
              
              <TabsContent value="social">
                <SocialTradingFeatures />
              </TabsContent>
              
              <TabsContent value="education">
                <TradingEducation />
              </TabsContent>
              
              <TabsContent value="api-keys">
                <Card>
                  <CardContent className="pt-6">
                    <ApiKeyManagement />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default DashboardTrading;
