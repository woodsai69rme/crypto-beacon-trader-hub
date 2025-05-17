
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LineChart, TrendingDown, TrendingUp, AlertCircle, Download } from "lucide-react";
import { FibonacciAnalysisProps } from "./types";

interface FibLevels {
  level0: number;
  level236: number;
  level382: number;
  level500: number;
  level618: number;
  level786: number;
  level1000: number;
}

const FibonacciAnalysis: React.FC<FibonacciAnalysisProps> = ({ 
  coinId = "bitcoin",
  timeRange = "1D",
  symbol = "BTC/USD",
  timeframe = "1D"
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState(symbol);
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  const [trend, setTrend] = useState<'up' | 'down'>('up');
  
  const fibLevels: FibLevels = {
    level0: 67890.00,
    level236: 65230.45,
    level382: 63450.67,
    level500: 61800.54,
    level618: 60150.20,
    level786: 58430.89,
    level1000: 56230.78
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="h-5 w-5" />
          Fibonacci Analysis
        </CardTitle>
        <CardDescription>
          Identify potential support and resistance levels using Fibonacci retracements
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="text-sm font-medium mb-2">Symbol</div>
            <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC/USD">BTC/USD</SelectItem>
                <SelectItem value="ETH/USD">ETH/USD</SelectItem>
                <SelectItem value="SOL/USD">SOL/USD</SelectItem>
                <SelectItem value="ADA/USD">ADA/USD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <div className="text-sm font-medium mb-2">Timeframe</div>
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1H">1 Hour</SelectItem>
                <SelectItem value="4H">4 Hours</SelectItem>
                <SelectItem value="1D">1 Day</SelectItem>
                <SelectItem value="1W">1 Week</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <div className="text-sm font-medium mb-2">Trend Direction</div>
            <div className="flex gap-2">
              <Button 
                variant={trend === 'up' ? "default" : "outline"} 
                className="flex-1"
                onClick={() => setTrend('up')}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Uptrend
              </Button>
              <Button 
                variant={trend === 'down' ? "default" : "outline"} 
                className="flex-1"
                onClick={() => setTrend('down')}
              >
                <TrendingDown className="h-4 w-4 mr-2" />
                Downtrend
              </Button>
            </div>
          </div>
        </div>
        
        <div className="h-80 border rounded-lg p-4 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-muted-foreground flex flex-col items-center">
              <LineChart className="h-12 w-12 mb-2" />
              <p>Fibonacci chart will render here</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-md border overflow-hidden">
          <div className="bg-muted/50 p-2 grid grid-cols-3 text-xs font-medium">
            <div>Fibonacci Level</div>
            <div>Price</div>
            <div>Status</div>
          </div>
          
          <div className="divide-y">
            <div className="p-2 grid grid-cols-3 text-sm">
              <div>0.0</div>
              <div>${fibLevels.level0.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
              <div className="text-muted-foreground">Swing {trend === 'up' ? 'High' : 'Low'}</div>
            </div>
            
            <div className="p-2 grid grid-cols-3 text-sm">
              <div>0.236</div>
              <div>${fibLevels.level236.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
              <div className="text-blue-500">Weak Reaction</div>
            </div>
            
            <div className="p-2 grid grid-cols-3 text-sm">
              <div>0.382</div>
              <div>${fibLevels.level382.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
              <div className="text-indigo-500">Moderate Support</div>
            </div>
            
            <div className="p-2 grid grid-cols-3 text-sm bg-green-500/10">
              <div>0.5</div>
              <div>${fibLevels.level500.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
              <div className="text-green-500 font-medium">Current Price Zone</div>
            </div>
            
            <div className="p-2 grid grid-cols-3 text-sm">
              <div>0.618</div>
              <div>${fibLevels.level618.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
              <div className="text-amber-500">Strong Support</div>
            </div>
            
            <div className="p-2 grid grid-cols-3 text-sm">
              <div>0.786</div>
              <div>${fibLevels.level786.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
              <div className="text-orange-500">Very Strong Support</div>
            </div>
            
            <div className="p-2 grid grid-cols-3 text-sm">
              <div>1.0</div>
              <div>${fibLevels.level1000.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
              <div className="text-muted-foreground">Swing {trend === 'up' ? 'Low' : 'High'}</div>
            </div>
          </div>
        </div>
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {trend === 'up' 
              ? "Current price is finding support at the 0.5 Fibonacci level, suggesting a potential bounce."
              : "Current price is facing resistance at the 0.5 Fibonacci level, watch for potential rejection."
            }
          </AlertDescription>
        </Alert>
        
        <div className="flex justify-end">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FibonacciAnalysis;
