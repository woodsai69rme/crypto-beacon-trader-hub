
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WoodsAccountManager from '@/components/trading/WoodsAccountManager';
import RealTimeTrading from '@/components/trading/RealTimeTrading';
import WoodsAiTradingSystem from '@/components/trading/WoodsAiTradingSystem';

const TradingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <Tabs defaultValue="accounts" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="accounts">Account Manager</TabsTrigger>
            <TabsTrigger value="trading">Real-Time Trading</TabsTrigger>
            <TabsTrigger value="bots">AI Bots</TabsTrigger>
          </TabsList>
          
          <TabsContent value="accounts">
            <WoodsAccountManager />
          </TabsContent>
          
          <TabsContent value="trading">
            <RealTimeTrading />
          </TabsContent>
          
          <TabsContent value="bots">
            <WoodsAiTradingSystem />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TradingPage;
