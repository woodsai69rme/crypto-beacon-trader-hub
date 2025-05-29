
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import ComprehensiveAiTradingDashboard from "../trading/ComprehensiveAiTradingDashboard";
import EnhancedFakeTrading from "../trading/EnhancedFakeTrading";

const DashboardTrading = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="grid grid-cols-1 gap-6">
      <Tabs defaultValue="ai-dashboard" className="w-full">
        <TabsList className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-3'} mb-6`}>
          <TabsTrigger value="ai-dashboard">AI Trading</TabsTrigger>
          <TabsTrigger value="paper-trading">Paper Trading</TabsTrigger>
          {!isMobile && <TabsTrigger value="automation">Automation</TabsTrigger>}
          {isMobile && <TabsTrigger value="more">More</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="ai-dashboard" className="animate-fade-in">
          <ComprehensiveAiTradingDashboard />
        </TabsContent>
        
        <TabsContent value="paper-trading" className="animate-fade-in">
          <EnhancedFakeTrading />
        </TabsContent>
        
        <TabsContent value="automation" className="animate-fade-in">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">N8N Automation Center</h2>
              <p className="text-muted-foreground mb-4">
                Create powerful automation workflows for your trading strategies
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Trading Signal Distribution</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically send AI-generated signals to Discord, Telegram, and email
                  </p>
                </Card>
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Portfolio Rebalancing</h3>
                  <p className="text-sm text-muted-foreground">
                    Automated portfolio optimization based on AI recommendations
                  </p>
                </Card>
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Risk Monitoring</h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time alerts when portfolio risk exceeds configured thresholds
                  </p>
                </Card>
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Sentiment Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitor social media sentiment and generate trading signals
                  </p>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {isMobile && (
          <TabsContent value="more" className="animate-fade-in">
            <Tabs defaultValue="automation">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="automation">Automation</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="automation">
                <Card>
                  <CardContent className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">N8N Automation Center</h2>
                    <p className="text-muted-foreground">
                      Create powerful automation workflows for your trading strategies
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings">
                <Card>
                  <CardContent className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Platform Settings</h2>
                    <p className="text-muted-foreground">
                      Configure your trading preferences and platform settings
                    </p>
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
