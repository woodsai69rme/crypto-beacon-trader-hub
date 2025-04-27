
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock } from 'lucide-react';
import { AITradingStrategy } from '@/types/trading';

export interface StrategyCardListProps {
  strategies: AITradingStrategy[];
  onSelectStrategy: (strategy: AITradingStrategy) => void;
}

const StrategyCardList: React.FC<StrategyCardListProps> = ({ strategies, onSelectStrategy }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {strategies.map((strategy) => (
        <Card key={strategy.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{strategy.name}</CardTitle>
              <Badge variant={strategy.type === 'custom' ? 'destructive' : 'outline'}>
                {strategy.type.replace('-', ' ')}
              </Badge>
            </div>
            <CardDescription>{strategy.description}</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                <span>Timeframe: {strategy.timeframe}</span>
              </div>
              
              <div className="bg-muted p-2 rounded-md text-xs">
                <div className="font-medium mb-1">Parameters:</div>
                <div className="grid grid-cols-2 gap-1">
                  {Object.entries(strategy.parameters).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span>{key}:</span>
                      <span className="font-mono">{value.toString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="pt-2 border-t">
            <Button 
              variant="ghost" 
              className="w-full justify-between" 
              onClick={() => onSelectStrategy(strategy)}
            >
              <span>Select Strategy</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default StrategyCardList;
