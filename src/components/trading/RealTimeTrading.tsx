
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

const RealTimeTrading = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  
  // Sample initial coin data
  const initialCoins = [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 61245.32, priceAUD: 93654.32 },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 3010.45, priceAUD: 4598.45 },
    { id: "solana", name: "Solana", symbol: "SOL", price: 142.87, priceAUD: 218.27 },
    { id: "cardano", name: "Cardano", symbol: "ADA", price: 0.45, priceAUD: 0.69 },
    { id: "ripple", name: "XRP", symbol: "XRP", price: 0.57, priceAUD: 0.87 },
    { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", price: 0.14, priceAUD: 0.21 },
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
              <RealTimeAlerts />
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
