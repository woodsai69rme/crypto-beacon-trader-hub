import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedFakeTrading } from "@/components/trading/EnhancedFakeTrading";
import { Trade } from '@/types/trading';

const Dashboard: React.FC = () => {
  const handleTrade = (trade: Trade) => {
    console.log('Trade executed:', trade);
    // Handle trade logic here if needed
  };

  return (
    <div className="min-h-screen bg-background">
      <Tabs defaultValue="trading" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="trading">Trading</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trading" className="mt-6">
          <EnhancedFakeTrading onTrade={handleTrade} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
