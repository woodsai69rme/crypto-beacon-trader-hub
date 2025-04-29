
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowDownUp, TrendingDown, TrendingUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const PriceCorrelations: React.FC = () => {
  const [timeframe, setTimeframe] = useState("30d");
  const [baseCoin, setBaseCoin] = useState("BTC");
  
  // Mock correlation data
  const correlationData = {
    "BTC": [
      { symbol: "ETH", correlation: 0.87, change: 0.02 },
      { symbol: "SOL", correlation: 0.76, change: -0.05 },
      { symbol: "ADA", correlation: 0.72, change: 0.04 },
      { symbol: "XRP", correlation: 0.61, change: -0.01 },
      { symbol: "DOT", correlation: 0.82, change: 0.03 },
      { symbol: "MATIC", correlation: 0.75, change: 0.01 },
      { symbol: "AVAX", correlation: 0.79, change: -0.02 },
      { symbol: "LINK", correlation: 0.73, change: 0.00 }
    ],
    "ETH": [
      { symbol: "BTC", correlation: 0.87, change: 0.02 },
      { symbol: "SOL", correlation: 0.81, change: 0.03 },
      { symbol: "ADA", correlation: 0.65, change: -0.02 },
      { symbol: "XRP", correlation: 0.58, change: 0.01 },
      { symbol: "DOT", correlation: 0.75, change: -0.04 },
      { symbol: "MATIC", correlation: 0.84, change: 0.05 },
      { symbol: "AVAX", correlation: 0.82, change: 0.02 },
      { symbol: "LINK", correlation: 0.80, change: 0.03 }
    ],
    "SOL": [
      { symbol: "BTC", correlation: 0.76, change: -0.05 },
      { symbol: "ETH", correlation: 0.81, change: 0.03 },
      { symbol: "ADA", correlation: 0.70, change: 0.01 },
      { symbol: "XRP", correlation: 0.54, change: -0.03 },
      { symbol: "DOT", correlation: 0.71, change: 0.00 },
      { symbol: "MATIC", correlation: 0.73, change: 0.02 },
      { symbol: "AVAX", correlation: 0.80, change: 0.04 },
      { symbol: "LINK", correlation: 0.72, change: -0.01 }
    ]
  };
  
  const getCorrelationColor = (correlation: number) => {
    if (correlation > 0.8) return "text-green-500";
    if (correlation > 0.6) return "text-blue-500";
    if (correlation > 0.4) return "text-yellow-500";
    if (correlation > 0.2) return "text-orange-500";
    return "text-red-500";
  };
  
  const getCorrelationStrength = (correlation: number) => {
    const absCorrelation = Math.abs(correlation);
    if (absCorrelation > 0.8) return "Very Strong";
    if (absCorrelation > 0.6) return "Strong";
    if (absCorrelation > 0.4) return "Moderate";
    if (absCorrelation > 0.2) return "Weak";
    return "Very Weak";
  };
  
  const getCorrelationBar = (correlation: number) => {
    const width = Math.abs(correlation) * 100;
    const color = correlation > 0 ? "bg-green-500" : "bg-red-500";
    return (
      <div className="w-full bg-secondary h-2 rounded-full">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${width}%` }}></div>
      </div>
    );
  };
  
  return (
    <Card className="shadow-lg border border-border">
      <CardHeader className="bg-card text-card-foreground">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <ArrowDownUp className="h-5 w-5" />
          Price Correlations
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Analyze how cryptocurrency prices move in relation to each other
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Base Asset</label>
            <Select value={baseCoin} onValueChange={setBaseCoin}>
              <SelectTrigger>
                <SelectValue placeholder="Select base asset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                <SelectItem value="SOL">Solana (SOL)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Timeframe</label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger>
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Correlations with {baseCoin}</h3>
            <Button variant="outline" size="sm">Export Data</Button>
          </div>
          
          <div className="space-y-4">
            {correlationData[baseCoin as keyof typeof correlationData].map((item, idx) => (
              <div key={idx} className="p-3 bg-secondary/10 rounded-md border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                      {item.symbol}
                    </div>
                    <span className="font-medium">{item.symbol}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${getCorrelationColor(item.correlation)}`}>
                      {item.correlation.toFixed(2)}
                    </span>
                    <span className={`text-xs flex items-center ${item.change > 0 ? 'text-green-500' : item.change < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                      {item.change > 0 ? <TrendingUp className="h-3.5 w-3.5 mr-1" /> : item.change < 0 ? <TrendingDown className="h-3.5 w-3.5 mr-1" /> : null}
                      {item.change > 0 ? '+' : ''}{item.change.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  {getCorrelationBar(item.correlation)}
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{getCorrelationStrength(item.correlation)} Correlation</span>
                    <span>Over {timeframe} period</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t border-border pt-4">
          <h4 className="font-medium mb-3">Correlation Heat Map</h4>
          <div className="p-4 bg-secondary/10 rounded-md border border-border/50">
            <div className="flex justify-center items-center h-32 text-muted-foreground">
              <p>Heat map visualization (Premium Feature)</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border pt-4">
          <h4 className="font-medium mb-1">Understanding Correlation Coefficients</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><span className="font-medium">+1.0:</span> Perfect positive correlation</p>
            <p><span className="font-medium">+0.7 to +0.9:</span> Strong positive correlation</p>
            <p><span className="font-medium">+0.4 to +0.6:</span> Moderate positive correlation</p>
            <p><span className="font-medium">-0.4 to +0.4:</span> Weak or no correlation</p>
            <p><span className="font-medium">-0.7 to -0.9:</span> Strong negative correlation</p>
            <p><span className="font-medium">-1.0:</span> Perfect negative correlation</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceCorrelations;
