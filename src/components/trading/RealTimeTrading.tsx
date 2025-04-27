
import React, { useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardContent 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RealTimePrices from "./RealTimePrices";
import OrderBookVisualizer from "./OrderBookVisualizer";
import TradeNotifications from "./TradeNotifications";
import MarketAlerts from "./MarketAlerts";
import RealTimeAlerts from "./RealTimeAlerts";
import RealTimePortfolio from "./RealTimePortfolio";
import RealTimeStrategyPerformance from "./RealTimeStrategyPerformance";
import CorrelationAnalysisToolkit from "./CorrelationAnalysisToolkit";
import PatternRecognition from "./PatternRecognition";
import { Activity, BarChart4, Bell, Wallet, Zap, ArrowUpDown } from "lucide-react";
import { CoinOption } from "@/types/trading";

const RealTimeTrading = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  
  // Sample initial coin data
  const initialCoins: CoinOption[] = [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 61245.32, priceChange: 1200, changePercent: 2.3, marketCap: 1180000000000, volume: 28000000000, image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png", priceAUD: 93654.32 },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 3010.45, priceChange: -120, changePercent: -1.5, marketCap: 360000000000, volume: 15000000000, image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png", priceAUD: 4598.45 },
    { id: "solana", name: "Solana", symbol: "SOL", price: 142.87, priceChange: 8.2, changePercent: 6.1, marketCap: 62000000000, volume: 3800000000, image: "https://assets.coingecko.com/coins/images/4128/large/solana.png", priceAUD: 218.27 },
    { id: "cardano", name: "Cardano", symbol: "ADA", price: 0.45, priceChange: 0.01, changePercent: 2.2, marketCap: 16000000000, volume: 420000000, image: "https://assets.coingecko.com/coins/images/975/large/cardano.png", priceAUD: 0.69 },
    { id: "ripple", name: "XRP", symbol: "XRP", price: 0.57, priceChange: -0.03, changePercent: -4.9, marketCap: 31000000000, volume: 1800000000, image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png", priceAUD: 0.87 },
    { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", price: 0.14, priceChange: 0.006, changePercent: 4.5, marketCap: 19000000000, volume: 980000000, image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png", priceAUD: 0.21 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Real-Time Trading
        </CardTitle>
        <CardDescription>Live market data, portfolio updates, and trading activity</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-7 mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="market">Market Depth</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="strategies">Strategies</TabsTrigger>
            <TabsTrigger value="correlation">Correlation</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RealTimePrices initialCoins={initialCoins} />
              <MarketAlerts />
            </div>
          </TabsContent>
          
          <TabsContent value="market">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <OrderBookVisualizer 
                symbol="BTC/USD" 
                initialPrice={61245.32} 
                depth={15}
              />
              <OrderBookVisualizer 
                symbol="ETH/USD" 
                initialPrice={3010.45} 
                depth={15}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="alerts">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RealTimeAlerts availableCoins={initialCoins} />
              <TradeNotifications />
            </div>
          </TabsContent>
          
          <TabsContent value="portfolio">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RealTimePortfolio />
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Account Activity
                  </CardTitle>
                  <CardDescription>Recent deposits, withdrawals and transfers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-muted/40 p-3 rounded-md border">
                      <div className="flex justify-between">
                        <div className="font-medium">Deposit</div>
                        <div className="text-green-600">+$5,000.00</div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Today, 10:45 AM
                      </div>
                    </div>
                    <div className="bg-muted/40 p-3 rounded-md border">
                      <div className="flex justify-between">
                        <div className="font-medium">Purchase BTC</div>
                        <div className="text-muted-foreground">0.056 BTC</div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Yesterday, 2:30 PM
                      </div>
                    </div>
                    <div className="bg-muted/40 p-3 rounded-md border">
                      <div className="flex justify-between">
                        <div className="font-medium">Transfer to Hardware Wallet</div>
                        <div className="text-amber-600">-0.25 ETH</div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Apr 25, 11:20 AM
                      </div>
                    </div>
                    <div className="bg-muted/40 p-3 rounded-md border">
                      <div className="flex justify-between">
                        <div className="font-medium">Sale SOL</div>
                        <div className="text-muted-foreground">-10 SOL</div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Apr 24, 9:15 AM
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="strategies">
            <RealTimeStrategyPerformance />
          </TabsContent>
          
          <TabsContent value="correlation">
            <CorrelationAnalysisToolkit />
          </TabsContent>
          
          <TabsContent value="patterns">
            <PatternRecognition />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RealTimeTrading;
