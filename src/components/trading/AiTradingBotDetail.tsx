
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExtendedAiBotTradingProps } from '@/types/trading';
import { Bot, Play, Pause, Settings } from 'lucide-react';

const AiTradingBotDetail: React.FC<ExtendedAiBotTradingProps> = ({
  botId,
  strategyId,
  strategyName = 'Default Strategy',
  onClose
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Trading Bot Details
        </CardTitle>
        <CardDescription>
          Bot ID: {botId} | Strategy: {strategyName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="default">Active</Badge>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Settings className="h-4 w-4 mr-1" />
              Configure
            </Button>
            <Button size="sm" variant="outline">
              <Pause className="h-4 w-4 mr-1" />
              Pause
            </Button>
            {onClose && (
              <Button size="sm" variant="outline" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-muted rounded">
            <div className="text-sm text-muted-foreground">Total Return</div>
            <div className="text-xl font-bold text-green-600">+12.5%</div>
          </div>
          <div className="p-3 bg-muted rounded">
            <div className="text-sm text-muted-foreground">Win Rate</div>
            <div className="text-xl font-bold">68%</div>
          </div>
        </div>

        {strategyId && (
          <div className="p-3 border rounded">
            <div className="text-sm font-medium mb-1">Strategy Configuration</div>
            <div className="text-xs text-muted-foreground">
              Strategy ID: {strategyId}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AiTradingBotDetail;
