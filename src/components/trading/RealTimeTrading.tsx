
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Activity } from 'lucide-react';
import FakeTradingForm from './FakeTradingForm';
import { Trade, CoinOption } from '@/types/trading';

const RealTimeTrading: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  
  const selectedCoin: CoinOption = {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    price: 61245.32,
    priceChange: 1200,
    changePercent: 2.3,
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    volume: 28000000000,
    marketCap: 1180000000000,
    value: "BTC",
    label: "Bitcoin (BTC)"
  };

  const handleTrade = (trade: Trade) => {
    setTrades(prev => [trade, ...prev]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-Time Paper Trading
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="trading" className="w-full">
            <TabsList>
              <TabsTrigger value="trading">Trading</TabsTrigger>
              <TabsTrigger value="history">Trade History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trading">
              <FakeTradingForm
                onTrade={handleTrade}
                selectedCoin={selectedCoin}
                onAddTrade={handleTrade}
                advancedMode={true}
              />
            </TabsContent>
            
            <TabsContent value="history">
              <div className="space-y-4">
                {trades.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No trades yet. Start trading to see your history here.
                  </div>
                ) : (
                  trades.map((trade) => (
                    <div key={trade.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            trade.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {trade.type.toUpperCase()}
                          </span>
                          <span className="font-medium">{trade.symbol}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${trade.totalValue.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">
                            {trade.quantity} @ ${trade.price.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {new Date(trade.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeTrading;
