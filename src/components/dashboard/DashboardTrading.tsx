
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApiKeyManagement from "../ApiKeyManagement";
import EnhancedFakeTrading from "../trading/EnhancedFakeTrading";
import AiTradingBots from "../trading/AiTradingBots";
import AiTradingDashboard from "../trading/AiTradingDashboard";
import AiTradingMcp from "../trading/AiTradingMcp"; 
import TradingEducation from "../trading/TradingEducation";
import MultiExchangeTrading from "../trading/MultiExchangeTrading";
import AiMarketAnalysis from "../trading/AiMarketAnalysis";
import SocialTradingFeatures from "../trading/SocialTradingFeatures";
import AlertsSystem from "../trading/AlertsSystem";
import ExchangeIntegration from "../trading/ExchangeIntegration";
import MultiTimeframeStrategy from "../trading/MultiTimeframeStrategy";
import AdvancedTrading from "../trading/AdvancedTrading";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

const DashboardTrading = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="grid grid-cols-1 gap-6">
      <Tabs defaultValue="trade" className="w-full">
        <TabsList className={`grid ${isMobile ? 'grid-cols-4' : 'grid-cols-9'} mb-6`}>
          <TabsTrigger value="trade">Trading</TabsTrigger>
          <TabsTrigger value="ai-dashboard">AI Dashboard</TabsTrigger>
          <TabsTrigger value="ai-bots">AI Bots</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="mcp">MCP Trading</TabsTrigger>
          {!isMobile && <TabsTrigger value="multi-exchange">Multi-Exchange</TabsTrigger>}
          {!isMobile && <TabsTrigger value="analysis">Analysis</TabsTrigger>}
          {!isMobile && <TabsTrigger value="social">Social</TabsTrigger>}
          {!isMobile && <TabsTrigger value="api-keys">API Keys</TabsTrigger>}
          {isMobile && <TabsTrigger value="more">More</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="trade" className="animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <EnhancedFakeTrading />
            </div>
            <div className="lg:col-span-1">
              <AlertsSystem />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="ai-dashboard" className="animate-fade-in">
          <AiTradingDashboard />
        </TabsContent>
        
        <TabsContent value="ai-bots" className="animate-fade-in">
          <div className="grid grid-cols-1 gap-6">
            <AiTradingBots />
            <MultiTimeframeStrategy />
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="animate-fade-in">
          <AdvancedTrading />
        </TabsContent>
        
        <TabsContent value="mcp" className="animate-fade-in">
          <AiTradingMcp />
        </TabsContent>
        
        <TabsContent value="multi-exchange" className="animate-fade-in">
          <ExchangeIntegration />
        </TabsContent>
        
        <TabsContent value="analysis" className="animate-fade-in">
          <AiMarketAnalysis />
        </TabsContent>
        
        <TabsContent value="social" className="animate-fade-in">
          <SocialTradingFeatures />
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
            <Tabs defaultValue="multi-exchange">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="multi-exchange">Multi-Exchange</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
                <TabsTrigger value="api-keys">API Keys</TabsTrigger>
              </TabsList>
              
              <TabsContent value="multi-exchange">
                <ExchangeIntegration />
              </TabsContent>
              
              <TabsContent value="analysis">
                <AiMarketAnalysis />
              </TabsContent>
              
              <TabsContent value="social">
                <SocialTradingFeatures />
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
