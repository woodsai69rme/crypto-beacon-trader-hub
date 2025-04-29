
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Globe } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MarketHours: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("crypto");
  const [selectedTimezone, setSelectedTimezone] = useState<string>("UTC");
  
  const cryptoMarkets = [
    { name: "Global Crypto Market", hours: "24/7", status: "open" },
    { name: "Binance", hours: "24/7", status: "open" },
    { name: "Coinbase", hours: "24/7", status: "open" },
    { name: "Kraken", hours: "24/7", status: "open" },
    { name: "FTX", hours: "24/7", status: "open" },
    { name: "BitMEX", hours: "24/7", status: "open" }
  ];
  
  const stockMarkets = [
    { name: "New York Stock Exchange (NYSE)", hours: "9:30 AM - 4:00 PM EST", status: "closed" },
    { name: "NASDAQ", hours: "9:30 AM - 4:00 PM EST", status: "closed" },
    { name: "Tokyo Stock Exchange", hours: "9:00 AM - 3:00 PM JST", status: "closed" },
    { name: "London Stock Exchange", hours: "8:00 AM - 4:30 PM GMT", status: "closed" },
    { name: "Hong Kong Stock Exchange", hours: "9:30 AM - 4:00 PM HKT", status: "closed" }
  ];
  
  const forexMarkets = [
    { name: "Sydney", hours: "7:00 AM - 4:00 PM AEDT", status: "open" },
    { name: "Tokyo", hours: "9:00 AM - 6:00 PM JST", status: "open" },
    { name: "London", hours: "8:00 AM - 4:00 PM GMT", status: "closed" },
    { name: "New York", hours: "8:00 AM - 5:00 PM EST", status: "closed" }
  ];
  
  const futuresMarkets = [
    { name: "CME Group (Equity)", hours: "6:00 PM - 5:00 PM ET (Sun-Fri)", status: "closed" },
    { name: "CME Group (Currencies)", hours: "6:00 PM - 5:00 PM ET (Sun-Fri)", status: "closed" },
    { name: "CBOT (Grains)", hours: "8:30 AM - 1:20 PM CT", status: "closed" },
    { name: "NYMEX (Energy)", hours: "6:00 PM - 5:00 PM ET (Sun-Fri)", status: "closed" }
  ];
  
  const getMarketData = () => {
    switch (activeTab) {
      case "crypto":
        return cryptoMarkets;
      case "stock":
        return stockMarkets;
      case "forex":
        return forexMarkets;
      case "futures":
        return futuresMarkets;
      default:
        return cryptoMarkets;
    }
  };
  
  return (
    <Card className="border border-border shadow-lg">
      <CardContent className="pt-6 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            <h2 className="text-xl font-bold">Market Hours</h2>
          </div>
          <div className="flex items-center">
            <Globe className="h-4 w-4 mr-1" />
            <select 
              className="bg-muted/20 border border-border/40 rounded-md text-sm px-2 py-1"
              value={selectedTimezone}
              onChange={(e) => setSelectedTimezone(e.target.value)}
            >
              <option value="UTC">UTC</option>
              <option value="EST">EST</option>
              <option value="GMT">GMT</option>
              <option value="JST">JST</option>
              <option value="AEDT">AEDT</option>
            </select>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
            <TabsTrigger value="stock">Stock</TabsTrigger>
            <TabsTrigger value="forex">Forex</TabsTrigger>
            <TabsTrigger value="futures">Futures</TabsTrigger>
          </TabsList>
          
          {["crypto", "stock", "forex", "futures"].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <div className="space-y-1">
                {getMarketData().map((market, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 border border-border/40 rounded-md bg-muted/5 hover:bg-muted/10 transition-colors"
                  >
                    <div>
                      <div className="font-medium">{market.name}</div>
                      <div className="text-xs text-muted-foreground">{market.hours}</div>
                    </div>
                    <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                      market.status === "open" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                    }`}>
                      {market.status === "open" ? "Open" : "Closed"}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="bg-muted/20 p-3 rounded-lg mt-4">
          <div className="flex items-center mb-2">
            <Clock className="h-4 w-4 mr-2" />
            <div className="text-sm font-medium">Current Time ({selectedTimezone})</div>
          </div>
          <div className="text-lg font-bold">{new Date().toLocaleTimeString()}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketHours;
