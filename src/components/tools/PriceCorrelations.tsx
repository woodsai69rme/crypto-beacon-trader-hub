
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const PriceCorrelations: React.FC = () => {
  const [timeframe, setTimeframe] = useState<string>("30d");
  const [baseCoin, setBaseCoin] = useState<string>("BTC");
  
  const correlationData = [
    { coin: "ETH", correlation: 0.85, change: 0.03 },
    { coin: "SOL", correlation: 0.72, change: -0.05 },
    { coin: "ADA", correlation: 0.68, change: 0.02 },
    { coin: "XRP", correlation: 0.62, change: -0.01 },
    { coin: "DOT", correlation: 0.77, change: 0.04 },
    { coin: "AVAX", correlation: 0.81, change: 0.06 },
    { coin: "MATIC", correlation: 0.74, change: 0.01 },
    { coin: "LINK", correlation: 0.67, change: -0.02 },
    { coin: "ATOM", correlation: 0.64, change: 0.03 },
    { coin: "UNI", correlation: 0.59, change: -0.04 },
  ];
  
  // Color function for correlation values
  const getCorrelationColor = (value: number) => {
    if (value >= 0.8) return "text-green-500";
    if (value >= 0.6) return "text-green-400";
    if (value >= 0.4) return "text-yellow-500";
    if (value >= 0.2) return "text-yellow-400";
    if (value >= 0) return "text-gray-400";
    if (value >= -0.2) return "text-gray-400";
    if (value >= -0.4) return "text-orange-400";
    if (value >= -0.6) return "text-orange-500";
    if (value >= -0.8) return "text-red-400";
    return "text-red-500";
  };
  
  return (
    <Card className="border border-border shadow-lg">
      <CardContent className="pt-6 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">Price Correlations</h2>
            <p className="text-sm text-muted-foreground">Analyze asset relationships and diversification</p>
          </div>
          <div className="flex gap-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
                <SelectItem value="365d">1 Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={baseCoin} onValueChange={setBaseCoin}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Base Asset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC">BTC</SelectItem>
                <SelectItem value="ETH">ETH</SelectItem>
                <SelectItem value="SOL">SOL</SelectItem>
                <SelectItem value="ADA">ADA</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search coins..." 
            className="pl-9"
          />
        </div>
        
        <div className="bg-muted/10 rounded-md overflow-hidden">
          <div className="grid grid-cols-12 p-3 bg-muted/20 text-sm font-medium">
            <div className="col-span-4">Asset</div>
            <div className="col-span-4 text-center">Correlation to {baseCoin}</div>
            <div className="col-span-2 text-center">30D Change</div>
            <div className="col-span-2 text-center">Strength</div>
          </div>
          
          <div className="divide-y divide-border/40">
            {correlationData.map((item, index) => (
              <div key={index} className="grid grid-cols-12 p-3 hover:bg-muted/5 transition-colors">
                <div className="col-span-4 flex items-center">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2 text-xs">
                    {item.coin}
                  </div>
                  <div>{item.coin}</div>
                </div>
                <div className="col-span-4 flex justify-center items-center">
                  <div className={`font-medium ${getCorrelationColor(item.correlation)}`}>
                    {item.correlation.toFixed(2)}
                  </div>
                </div>
                <div className="col-span-2 flex justify-center items-center">
                  <div className={`text-sm ${item.change > 0 ? "text-green-500" : "text-red-500"}`}>
                    {item.change > 0 ? "+" : ""}{item.change.toFixed(2)}
                  </div>
                </div>
                <div className="col-span-2 flex justify-center items-center">
                  <div className="w-16 h-2 rounded-full bg-muted/30">
                    <div 
                      className={`h-full rounded-full ${
                        item.correlation >= 0.8 ? "bg-green-500" :
                        item.correlation >= 0.6 ? "bg-green-400" :
                        item.correlation >= 0.4 ? "bg-yellow-500" :
                        "bg-gray-400"
                      }`} 
                      style={{ width: `${Math.abs(item.correlation) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-muted/20 p-3 rounded-lg">
          <div className="text-sm font-medium mb-2">Correlation Legend</div>
          <div className="grid grid-cols-5 gap-2 text-xs">
            <div className="flex flex-col items-center">
              <div className="w-full h-2 bg-green-500 rounded-full mb-1"></div>
              <div>Strong (0.8-1.0)</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-2 bg-green-400 rounded-full mb-1"></div>
              <div>Moderate (0.6-0.8)</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-2 bg-yellow-500 rounded-full mb-1"></div>
              <div>Weak (0.4-0.6)</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-2 bg-gray-400 rounded-full mb-1"></div>
              <div>None (0-0.4)</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-2 bg-red-500 rounded-full mb-1"></div>
              <div>Negative</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceCorrelations;
