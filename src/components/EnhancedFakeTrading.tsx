
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CoinOption, Trade } from '@/types/trading';
import FakeTradingForm from './trading/FakeTradingForm';
import { useTradingContext } from '@/contexts/TradingContext';

interface EnhancedFakeTradingProps {
  onTrade?: (trade: Trade) => void;
}

const EnhancedFakeTrading: React.FC<EnhancedFakeTradingProps> = ({ onTrade }) => {
  const { coins, addTrade } = useTradingContext();
  const [activeTab, setActiveTab] = useState<string>('basic');
  
  const handleTrade = (trade: Trade) => {
    addTrade(trade);
    if (onTrade) {
      onTrade(trade);
    }
  };
  
  // Find first coin for price display
  const bitcoinData = coins.find(coin => coin.id === 'bitcoin');
  const currentPrice = bitcoinData?.price || 0;
  // Use changePercent if available or fall back to other price change properties
  const priceChange = bitcoinData?.changePercent || bitcoinData?.priceChange || 0;
  const isPriceUp = priceChange >= 0;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Demo Trading</CardTitle>
            <CardDescription>Practice trading with virtual assets</CardDescription>
          </div>
          {bitcoinData && (
            <div className="text-right">
              <div className="font-medium">${currentPrice.toLocaleString()}</div>
              <Badge variant={isPriceUp ? "success" : "destructive"} className="font-mono">
                {isPriceUp ? '+' : ''}{priceChange.toFixed(2)}%
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <FakeTradingForm 
              onTrade={handleTrade} 
              availableCoins={coins}
              advancedMode={false}
            />
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <FakeTradingForm 
              onTrade={handleTrade} 
              availableCoins={coins}
              advancedMode={true}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedFakeTrading;
