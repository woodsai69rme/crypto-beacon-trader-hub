
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderBook from './OrderBook';
import FakeTradingForm from './FakeTradingForm';
import TradingChart from './TradingChart';
import { Trade } from '@/types/trading';

const EnhancedFakeTrading: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('standard');
  const [trades, setTrades] = useState<Trade[]>([]);
  
  const handleAddTrade = (trade: Trade) => {
    setTrades(prev => [...prev, trade]);
  };

  return (
    <Card className="w-full glass-card backdrop-blur-lg border-border shadow-lg">
      <CardHeader className="border-b border-border/40">
        <CardTitle className="text-primary text-xl font-semibold">Trading Interface</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <Tabs defaultValue="standard" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6 bg-muted/50">
            <TabsTrigger value="standard" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Standard</TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Advanced</TabsTrigger>
            <TabsTrigger value="analysis" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Analysis</TabsTrigger>
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
                <FakeTradingForm advancedMode={true} onAddTrade={handleAddTrade} />
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
