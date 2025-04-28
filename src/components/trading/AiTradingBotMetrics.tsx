
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Clock, ArrowUpDown } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface AiTradingBotMetricsProps {
  botId: string;
  isRunning: boolean;
}

const AiTradingBotMetrics: React.FC<AiTradingBotMetricsProps> = ({ botId, isRunning }) => {
  const { theme } = useTheme();
  const [currentMetrics] = useState({
    profitLoss: 2.8,
    winRate: 0.68,
    tradesExecuted: 25,
    volumeTraded: 128500,
    averageTradeDuration: "4h 12m",
    profitFactor: 1.85,
    lastTrade: {
      type: "buy",
      pair: "BTC/USD",
      price: 86500,
      timestamp: new Date(Date.now() - 1000 * 60 * 15)
    }
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Trading Metrics</CardTitle>
          <Badge variant={isRunning ? "default" : "outline"}>
            {isRunning ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-3 border rounded-md">
            <div className="text-sm text-muted-foreground">Profit/Loss</div>
            <div className={`text-xl font-bold ${currentMetrics.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {currentMetrics.profitLoss > 0 ? '+' : ''}{currentMetrics.profitLoss}%
            </div>
          </div>
          
          <div className="p-3 border rounded-md">
            <div className="text-sm text-muted-foreground">Win Rate</div>
            <div className="text-xl font-bold">
              {(currentMetrics.winRate * 100).toFixed(0)}%
            </div>
          </div>
          
          <div className="p-3 border rounded-md">
            <div className="text-sm text-muted-foreground">Trades</div>
            <div className="text-xl font-bold">
              {currentMetrics.tradesExecuted}
            </div>
          </div>
          
          <div className="p-3 border rounded-md">
            <div className="text-sm text-muted-foreground">Volume</div>
            <div className="text-xl font-bold">
              ${currentMetrics.volumeTraded.toLocaleString()}
            </div>
          </div>
          
          <div className="p-3 border rounded-md">
            <div className="text-sm text-muted-foreground">Avg Duration</div>
            <div className="text-xl font-bold flex items-center">
              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
              {currentMetrics.averageTradeDuration}
            </div>
          </div>
          
          <div className="p-3 border rounded-md">
            <div className="text-sm text-muted-foreground">Profit Factor</div>
            <div className="text-xl font-bold">
              {currentMetrics.profitFactor}
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="text-sm font-medium mb-2">Recent Activity</div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 border rounded-md">
              <div className="flex items-center">
                {currentMetrics.lastTrade.type === 'buy' ? (
                  <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-2 text-red-500" />
                )}
                <div>
                  <div className="font-medium">
                    {currentMetrics.lastTrade.type.toUpperCase()} {currentMetrics.lastTrade.pair}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {currentMetrics.lastTrade.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  ${currentMetrics.lastTrade.price.toLocaleString()}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-2 border rounded-md">
              <div className="flex items-center">
                <ArrowUpDown className="h-4 w-4 mr-2 text-blue-500" />
                <div>
                  <div className="font-medium">Signal Change</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(Date.now() - 1000 * 60 * 25).toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <div>
                <Badge variant="outline">MACD Crossover</Badge>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-2 border rounded-md">
              <div className="flex items-center">
                <TrendingDown className="h-4 w-4 mr-2 text-red-500" />
                <div>
                  <div className="font-medium">SELL ETH/USD</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(Date.now() - 1000 * 60 * 45).toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">$3,450</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="text-sm font-medium mb-2">Performance Chart</div>
          
          {/* Simple mock performance chart */}
          <div className="h-40 border rounded-md p-2 relative">
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              {isRunning ? (
                <div className="h-full w-full">
                  <svg viewBox="0 0 100 20" className="w-full h-full">
                    <path 
                      d="M0,10 L5,12 L10,8 L15,14 L20,10 L25,12 L30,7 L35,9 L40,6 L45,8 L50,4 L55,9 L60,2 L65,7 L70,4 L75,10 L80,2 L85,6 L90,1 L95,4 L100,2" 
                      fill="none" 
                      stroke={theme === "dark" ? "#10b981" : "#059669"} 
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              ) : (
                "Bot is currently inactive. Start to see performance."
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiTradingBotMetrics;
