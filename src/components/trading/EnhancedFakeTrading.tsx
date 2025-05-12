
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderBook from './OrderBook';
import FakeTradingForm from './FakeTradingForm';
import TradingChart from './TradingChart';
import { Trade } from '@/types/trading';

const EnhancedFakeTrading: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('standard');

  const handleAddTrade = (trade: Trade) => {
    console.log("Trade added:", trade);
    // Implementation for adding trade would be here
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Trading Interface</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="standard" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="standard">Standard</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>
          
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TradingChart 
                coinId="bitcoin" 
                showVolume={activeTab === 'advanced' || activeTab === 'analysis'}
                showControls={activeTab === 'advanced' || activeTab === 'analysis'}
              />
            </div>
            
            <div className="space-y-6">
              <TabsContent value="standard" className="m-0">
                <FakeTradingForm onAddTrade={handleAddTrade} />
              </TabsContent>
              
              <TabsContent value="advanced" className="m-0">
                <FakeTradingForm onAddTrade={handleAddTrade} advancedMode={true} />
              </TabsContent>
              
              <TabsContent value="analysis" className="m-0">
                <OrderBook />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedFakeTrading;
