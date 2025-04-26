
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
import { Activity, BarChart4 } from "lucide-react";

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
        <CardDescription>Live market data and trading activity</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="market">Market Depth</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
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
          
          <TabsContent value="notifications">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TradeNotifications />
              <div className="flex flex-col gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart4 className="h-5 w-5" />
                      Activity Summary
                    </CardTitle>
                    <CardDescription>Recent trading activity overview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Today's Trades: </span>
                          <span className="font-medium">12</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Volume: </span>
                          <span className="font-medium">$35,480.45</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Recent Activity</div>
                        <div className="space-y-2">
                          <div className="bg-muted/40 p-2 rounded-md text-sm">
                            <div className="flex justify-between">
                              <span>Bitcoin purchase</span>
                              <span className="text-green-600">+0.15 BTC</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Today, 10:45 AM
                            </div>
                          </div>
                          <div className="bg-muted/40 p-2 rounded-md text-sm">
                            <div className="flex justify-between">
                              <span>Ethereum sale</span>
                              <span className="text-red-600">-2.5 ETH</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Yesterday, 2:30 PM
                            </div>
                          </div>
                          <div className="bg-muted/40 p-2 rounded-md text-sm">
                            <div className="flex justify-between">
                              <span>Solana purchase</span>
                              <span className="text-green-600">+10 SOL</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Apr 25, 11:20 AM
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <button className="text-sm text-primary hover:underline">
                          View All Activity
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RealTimeTrading;
