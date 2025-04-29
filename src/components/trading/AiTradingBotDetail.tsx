
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AiBotTradingProps } from '@/types/trading';
import { Play, Pause, RefreshCw, Settings, TrendingUp } from 'lucide-react';

const AiTradingBotDetail: React.FC<AiBotTradingProps> = ({
  botId,
  strategyId,
  strategyName
}) => {
  const [isRunning, setIsRunning] = React.useState(false);
  const [performance, setPerformance] = React.useState({
    totalTrades: 24,
    successRate: 68,
    profitLoss: 12.34,
    averageTradeTime: '2.5 hrs',
  });

  const handleToggleBot = () => {
    setIsRunning(!isRunning);
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-muted/50">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {strategyName}
          </CardTitle>
          <Button 
            variant={isRunning ? "destructive" : "default"}
            size="sm"
            onClick={handleToggleBot}
          >
            {isRunning ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Stop
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/30 p-3 rounded-md">
              <div className="text-sm text-muted-foreground">Total Trades</div>
              <div className="text-xl font-semibold">{performance.totalTrades}</div>
            </div>
            <div className="bg-muted/30 p-3 rounded-md">
              <div className="text-sm text-muted-foreground">Success Rate</div>
              <div className="text-xl font-semibold">{performance.successRate}%</div>
            </div>
            <div className="bg-muted/30 p-3 rounded-md">
              <div className="text-sm text-muted-foreground">Profit/Loss</div>
              <div className={`text-xl font-semibold ${
                performance.profitLoss > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {performance.profitLoss > 0 ? '+' : ''}{performance.profitLoss}%
              </div>
            </div>
            <div className="bg-muted/30 p-3 rounded-md">
              <div className="text-sm text-muted-foreground">Avg Trade Time</div>
              <div className="text-xl font-semibold">{performance.averageTradeTime}</div>
            </div>
          </div>
          
          <div className="flex justify-between pt-2">
            <Button variant="outline" size="sm" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Configure
            </Button>
            <Button variant="outline" size="sm" className="flex items-center">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Stats
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiTradingBotDetail;
