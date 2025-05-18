
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TradingBotStrategies from "../trading/strategies/TradingBotStrategies";
import SocialTradingHub from "../trading/social/SocialTradingHub";
import RealTimeMarketAnalytics from "../analytics/RealTimeMarketAnalytics";
import RealTimeTrading from "../trading/RealTimeTrading"; 
import { CoinOption } from "@/types/trading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock coin data
const mockCoins: CoinOption[] = [
  { 
    id: 'bitcoin', 
    name: 'Bitcoin', 
    symbol: 'BTC', 
    price: 65432.10,
    priceChange: 2341.50,
    changePercent: 3.7,
    volume: 32456789012,
    marketCap: 1234567890123,
    value: 'bitcoin',
    label: 'Bitcoin (BTC)'
  },
  { 
    id: 'ethereum', 
    name: 'Ethereum', 
    symbol: 'ETH', 
    price: 3421.45,
    priceChange: 145.30,
    changePercent: 4.2,
    volume: 15678901234,
    marketCap: 413456789012,
    value: 'ethereum',
    label: 'Ethereum (ETH)'
  },
];

const DashboardAiTrading = () => {
  const [selectedCoin, setSelectedCoin] = React.useState<CoinOption>(mockCoins[0]);
  
  const handleCoinSelect = (coin: CoinOption) => {
    setSelectedCoin(coin);
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="market">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="market">Market Analytics</TabsTrigger>
          <TabsTrigger value="bots">Trading Bots</TabsTrigger>
          <TabsTrigger value="social">Social Trading</TabsTrigger>
        </TabsList>
        
        <TabsContent value="market" className="space-y-6">
          <RealTimeMarketAnalytics refreshInterval={10000} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RealTimeTrading 
              selectedCoin={selectedCoin} 
              onCoinSelect={handleCoinSelect} 
            />
            <Card>
              <CardHeader>
                <CardTitle>Trading Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Breakout Alert - BTC</h4>
                        <p className="text-sm text-muted-foreground">Strong buying pressure above resistance</p>
                      </div>
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                        Buy Signal
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm"><span className="font-medium">Entry:</span> $65,450</div>
                      <div className="text-sm"><span className="font-medium">Target:</span> $68,300</div>
                      <div className="text-sm"><span className="font-medium">Stop Loss:</span> $63,800</div>
                      <div className="text-sm mt-1"><span className="font-medium">Confidence:</span> 78%</div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Support Zone - ETH</h4>
                        <p className="text-sm text-muted-foreground">Approaching major support level</p>
                      </div>
                      <div className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm font-medium">
                        Watch
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm"><span className="font-medium">Key Level:</span> $3,250</div>
                      <div className="text-sm"><span className="font-medium">Action:</span> Monitor for reversal patterns</div>
                      <div className="text-sm mt-1"><span className="font-medium">Confidence:</span> 65%</div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Overbought - SOL</h4>
                        <p className="text-sm text-muted-foreground">RSI above 75 on 4h timeframe</p>
                      </div>
                      <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                        Sell Signal
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm"><span className="font-medium">Entry:</span> $145.20</div>
                      <div className="text-sm"><span className="font-medium">Target:</span> $132.50</div>
                      <div className="text-sm"><span className="font-medium">Stop Loss:</span> $149.75</div>
                      <div className="text-sm mt-1"><span className="font-medium">Confidence:</span> 72%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="bots" className="space-y-6">
          <TradingBotStrategies />
        </TabsContent>
        
        <TabsContent value="social" className="space-y-6">
          <SocialTradingHub />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardAiTrading;
