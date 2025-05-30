
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Bot, Activity, BarChart3 } from "lucide-react";
import EnhancedFakeTrading from './trading/EnhancedFakeTrading';
import AiTradingDashboard from './trading/AiTradingDashboard';
import LiveAnalyticsDashboard from './analytics/LiveAnalyticsDashboard';
import ComprehensiveTradingDashboard from './trading/ComprehensiveTradingDashboard';

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Crypto Trading Platform</h1>
          <p className="text-muted-foreground">
            AI-powered trading with real-time data in AUD
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Live Data Connected</span>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="trading" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Paper Trading
          </TabsTrigger>
          <TabsTrigger value="ai-bots" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            AI Bots
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <ComprehensiveTradingDashboard />
        </TabsContent>

        <TabsContent value="trading" className="space-y-6">
          <EnhancedFakeTrading />
        </TabsContent>

        <TabsContent value="ai-bots" className="space-y-6">
          <AiTradingDashboard />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <LiveAnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
