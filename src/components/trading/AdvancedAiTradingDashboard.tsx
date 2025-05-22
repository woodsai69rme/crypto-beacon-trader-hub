
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart, Bot, LineChart, ArrowRight } from "lucide-react";
import { useCurrency } from '@/contexts/CurrencyContext';
import { AVAILABLE_STRATEGIES } from '@/services/aiTradingService';

const AdvancedAiTradingDashboard: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const mockPerformance = {
    today: 2.34,
    week: -1.23,
    month: 4.56,
    totalPnl: 1250.75
  };
  
  const mockPredictions = [
    { coin: 'BTC', direction: 'up', confidence: 78, price: 63542.12 },
    { coin: 'ETH', direction: 'up', confidence: 65, price: 3245.87 },
    { coin: 'SOL', direction: 'down', confidence: 52, price: 143.21 },
    { coin: 'ADA', direction: 'down', confidence: 61, price: 0.42 }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            AI Strategy Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">Today</div>
              <div className={`text-lg font-semibold ${mockPerformance.today >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {mockPerformance.today > 0 ? '+' : ''}{mockPerformance.today}%
              </div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">This Week</div>
              <div className={`text-lg font-semibold ${mockPerformance.week >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {mockPerformance.week > 0 ? '+' : ''}{mockPerformance.week}%
              </div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">This Month</div>
              <div className={`text-lg font-semibold ${mockPerformance.month >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {mockPerformance.month > 0 ? '+' : ''}{mockPerformance.month}%
              </div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">Total P/L</div>
              <div className={`text-lg font-semibold ${mockPerformance.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatCurrency(mockPerformance.totalPnl)}
              </div>
            </div>
          </div>
          
          <div className="h-40 bg-muted rounded flex items-center justify-center">
            <p className="text-muted-foreground">Performance chart will be displayed here</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Market Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockPredictions.map(prediction => (
              <div key={prediction.coin} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center font-semibold">
                    {prediction.coin}
                  </div>
                  <div>
                    <div className="font-medium">{prediction.coin}/AUD</div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(prediction.price)}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className={prediction.direction === 'up' ? 'text-green-500' : 'text-red-500'}>
                    {prediction.direction === 'up' ? '▲' : '▼'} {prediction.confidence}%
                  </div>
                  <div className="text-sm text-muted-foreground">Confidence</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Strategy Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[230px] overflow-y-auto">
            {AVAILABLE_STRATEGIES.map(strategy => (
              <div key={strategy.id} className="p-3 border rounded-lg hover:bg-accent/10 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium">{strategy.name}</h4>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    Select
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{strategy.description}</p>
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs bg-muted px-2 py-0.5 rounded">{strategy.type}</span>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded">{strategy.timeframe}</span>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded">{strategy.parameters.riskLevel} risk</span>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full mt-3 flex items-center gap-1">
            <LineChart className="h-4 w-4" />
            Create Custom Strategy
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            Backtest Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 bg-muted rounded flex items-center justify-center mb-4">
            <p className="text-muted-foreground">Backtest chart will be displayed here</p>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="p-2 border rounded">
              <div className="text-xs text-muted-foreground">Win Rate</div>
              <div className="font-semibold">68%</div>
            </div>
            <div className="p-2 border rounded">
              <div className="text-xs text-muted-foreground">Profit Factor</div>
              <div className="font-semibold">1.85</div>
            </div>
            <div className="p-2 border rounded">
              <div className="text-xs text-muted-foreground">Sharpe Ratio</div>
              <div className="font-semibold">1.42</div>
            </div>
            <div className="p-2 border rounded">
              <div className="text-xs text-muted-foreground">Max Drawdown</div>
              <div className="font-semibold">15%</div>
            </div>
          </div>
          
          <Button variant="default" size="sm" className="w-full flex items-center justify-center gap-1">
            Run New Backtest <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedAiTradingDashboard;
