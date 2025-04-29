
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart, BarChart3, TrendingUp, TrendingDown } from "lucide-react";

const MarketAnalyzer: React.FC = () => {
  return (
    <Card className="shadow-lg border border-border">
      <CardHeader className="bg-card text-card-foreground">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Market Analyzer
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Analyze market trends and patterns
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-secondary/20 p-4 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Market Sentiment</span>
              <span className="text-sm font-medium text-green-500 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                Bullish
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
          
          <div className="bg-secondary/20 p-4 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Volume Analysis</span>
              <span className="text-sm font-medium text-blue-500">Above Average</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border pt-4">
          <h4 className="text-sm font-medium mb-2">Top Market Movers</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/10">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">BTC</div>
                <span>Bitcoin</span>
              </div>
              <span className="text-green-500 flex items-center">
                +5.23% <TrendingUp className="h-3 w-3 ml-1" />
              </span>
            </div>
            
            <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/10">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">ETH</div>
                <span>Ethereum</span>
              </div>
              <span className="text-green-500 flex items-center">
                +3.78% <TrendingUp className="h-3 w-3 ml-1" />
              </span>
            </div>
            
            <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/10">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">SOL</div>
                <span>Solana</span>
              </div>
              <span className="text-red-500 flex items-center">
                -1.45% <TrendingDown className="h-3 w-3 ml-1" />
              </span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border pt-4">
          <h4 className="text-sm font-medium mb-2">Market Events</h4>
          <div className="space-y-2">
            <div className="p-3 bg-secondary/20 rounded-lg">
              <div className="text-sm font-medium">Bitcoin Options Expiry</div>
              <div className="text-xs text-muted-foreground">Tomorrow - Potential volatility expected</div>
            </div>
            <div className="p-3 bg-secondary/20 rounded-lg">
              <div className="text-sm font-medium">Ethereum Network Upgrade</div>
              <div className="text-xs text-muted-foreground">In 3 days - Protocol changes planned</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketAnalyzer;
