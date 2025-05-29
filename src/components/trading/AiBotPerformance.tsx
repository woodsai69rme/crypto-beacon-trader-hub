
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AiBot } from '@/contexts/AiTradingContext';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';

interface AiBotPerformanceProps {
  bot: AiBot;
}

const AiBotPerformance: React.FC<AiBotPerformanceProps> = ({ bot }) => {
  const { performance } = bot;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Performance: {bot.name}</span>
          <Badge variant={bot.isActive ? "default" : "secondary"}>
            {bot.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Trades</span>
            </div>
            <div className="text-2xl font-bold">{performance.totalTrades}</div>
            <p className="text-xs text-muted-foreground">
              Since {new Date(bot.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Win Rate</span>
            </div>
            <div className="text-2xl font-bold">{(performance.winRate * 100).toFixed(1)}%</div>
            <Progress value={performance.winRate * 100} className="w-full" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Total Return</span>
            </div>
            <div className={`text-2xl font-bold ${performance.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {performance.totalReturn >= 0 ? '+' : ''}{(performance.totalReturn * 100).toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Since inception
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Max Drawdown</span>
            </div>
            <div className="text-2xl font-bold text-red-600">
              -{(performance.maxDrawdown * 100).toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Worst decline
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <span className="text-sm font-medium">Sharpe Ratio</span>
            <div className="text-xl font-bold">{performance.sharpeRatio.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Risk-adjusted return ({performance.sharpeRatio > 1 ? 'Good' : performance.sharpeRatio > 0.5 ? 'Fair' : 'Poor'})
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">Strategy & Model</span>
            <div className="space-y-1">
              <Badge variant="outline">{bot.strategy}</Badge>
              <Badge variant="outline">{bot.model}</Badge>
              <Badge variant="outline">Risk: {bot.riskLevel}</Badge>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Bot Configuration</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Max Trade Amount:</span>
              <div className="font-medium">AUD {bot.maxTradeAmount.toLocaleString()}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Target Assets:</span>
              <div className="font-medium">{bot.targetAssets.join(', ')}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Created:</span>
              <div className="font-medium">{new Date(bot.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiBotPerformance;
