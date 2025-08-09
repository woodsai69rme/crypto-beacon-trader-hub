
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExtendedAiBotTradingProps } from '@/types/trading';
import { Play, Pause, Square, Settings } from 'lucide-react';

interface AiTradingBotDetailProps {
  bot: ExtendedAiBotTradingProps['bots'][0];
  onUpdate: (bot: ExtendedAiBotTradingProps['bots'][0]) => void;
}

const AiTradingBotDetail: React.FC<AiTradingBotDetailProps> = ({ bot, onUpdate }) => {
  const handleStatusChange = (newStatus: 'active' | 'paused' | 'stopped') => {
    onUpdate({ ...bot, status: newStatus });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{bot.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {bot.description}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={bot.status === 'active' ? 'default' : 'secondary'}>
                {bot.status}
              </Badge>
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange('active')}
                  disabled={bot.status === 'active'}
                >
                  <Play className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange('paused')}
                  disabled={bot.status === 'paused'}
                >
                  <Pause className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange('stopped')}
                  disabled={bot.status === 'stopped'}
                >
                  <Square className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold">{formatCurrency(bot.balance)}</div>
              <p className="text-xs text-muted-foreground">Current Balance</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {bot.performance.totalReturn.toFixed(2)}%
              </div>
              <p className="text-xs text-muted-foreground">Total Return</p>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {bot.performance.winRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">Win Rate</p>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Strategy Configuration</h4>
            <div className="text-sm space-y-1">
              <div>Type: <span className="font-mono">{bot.strategy.type}</span></div>
              <div>Timeframe: <span className="font-mono">{bot.strategy.timeframe}</span></div>
              {bot.model && <div>AI Model: <span className="font-mono">{bot.model}</span></div>}
              {bot.riskLevel && <div>Risk Level: <span className="font-mono">{bot.riskLevel}</span></div>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AiTradingBotDetail;
