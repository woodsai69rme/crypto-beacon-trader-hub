
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AIBot } from '@/types/trading';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface AiBotPerformanceProps {
  bot: AIBot;
}

const AiBotPerformance: React.FC<AiBotPerformanceProps> = ({ bot }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Bot Performance: {bot.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{formatCurrency(bot.balance)}</div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
            </div>
            
            <div className="text-center">
              <div className={`text-2xl font-bold flex items-center justify-center gap-1 ${
                bot.performance.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {bot.performance.totalReturn >= 0 ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
                {formatPercentage(bot.performance.totalReturn)}
              </div>
              <p className="text-sm text-muted-foreground">Total Return</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold">{bot.performance.winRate.toFixed(1)}%</div>
              <p className="text-sm text-muted-foreground">Win Rate</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold">{bot.performance.totalTrades}</div>
              <p className="text-sm text-muted-foreground">Total Trades</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Strategy Details</h4>
              <div className="bg-muted p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Strategy:</span>
                    <div className="font-mono">{bot.strategy.name}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Model:</span>
                    <div className="font-mono">{bot.model || 'Default'}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Risk Level:</span>
                    <div className="font-mono">{bot.riskLevel || 'Medium'}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={bot.status === 'active' ? 'default' : 'secondary'}>
                      {bot.status}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Max Trade Amount:</span>
                    <div className="font-mono">{formatCurrency(bot.maxTradeAmount || 1000)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Target Assets:</span>
                    <div className="font-mono">{(bot.targetAssets || ['BTC', 'ETH']).join(', ')}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {bot.performance.maxDrawdown !== undefined && (
              <div>
                <h4 className="font-medium mb-2">Risk Metrics</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Max Drawdown:</span>
                    <div className="font-mono text-red-600">
                      {formatPercentage(bot.performance.maxDrawdown)}
                    </div>
                  </div>
                  {bot.performance.sharpeRatio !== undefined && (
                    <div>
                      <span className="text-muted-foreground">Sharpe Ratio:</span>
                      <div className="font-mono">
                        {bot.performance.sharpeRatio.toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AiBotPerformance;
