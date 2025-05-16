
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderBook from './OrderBook';
import FakeTradingForm from './FakeTradingForm';
import TradingChart from './TradingChart';
import { Trade } from '@/types/trading';

const EnhancedFakeTrading: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('standard');

  const handleTrade = (trade: Trade) => {
    console.log("Trade added:", trade);
    // Implementation for adding trade would be here
  };

  const availableCoins = [
    { id: 'BTC', name: 'Bitcoin', symbol: 'BTC', price: 50000, priceChange: 1.2, changePercent: 1.2, value: 'BTC', label: 'Bitcoin (BTC)' },
    { id: 'ETH', name: 'Ethereum', symbol: 'ETH', price: 3000, priceChange: 2.5, changePercent: 2.5, value: 'ETH', label: 'Ethereum (ETH)' },
    { id: 'SOL', name: 'Solana', symbol: 'SOL', price: 100, priceChange: 3.7, changePercent: 3.7, value: 'SOL', label: 'Solana (SOL)' },
    { id: 'ADA', name: 'Cardano', symbol: 'ADA', price: 1.2, priceChange: -0.5, changePercent: -0.5, value: 'ADA', label: 'Cardano (ADA)' }
  ];

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
                <FakeTradingForm 
                  onTrade={handleTrade} 
                  availableCoins={availableCoins}
                />
              </TabsContent>
              
              <TabsContent value="advanced" className="m-0">
                <FakeTradingForm 
                  onTrade={handleTrade} 
                  availableCoins={availableCoins}
                  advancedMode={true}
                />
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
