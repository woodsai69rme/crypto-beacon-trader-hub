
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ModelResult } from './types';
import { AlertCircle, TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Trade } from '@/types/trading';

interface ModelResultsProps {
  results: ModelResult[];
  isRunning: boolean;
  onTrade?: (trade: any) => void;
}

const ModelResults: React.FC<ModelResultsProps> = ({ results, isRunning, onTrade }) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const handleExecuteTrade = (result: ModelResult) => {
    if (!onTrade || result.action === 'hold') return;
    
    const trade: Trade = {
      id: `ai-trade-${Date.now()}`,
      coinId: 'bitcoin',
      coinName: 'Bitcoin',
      coinSymbol: 'BTC',
      type: result.action,
      amount: result.suggestedAmount || 0.1,
      price: result.suggestedPrice || 20000,
      totalValue: (result.suggestedAmount || 0.1) * (result.suggestedPrice || 20000),
      timestamp: new Date().toISOString(),
      currency: 'USD',
      botGenerated: true,
      total: (result.suggestedAmount || 0.1) * (result.suggestedPrice || 20000)
    };
    
    onTrade(trade);
  };

  return (
    <div className="space-y-4">
      {!isRunning && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="h-12 w-12 mb-2 text-muted-foreground" />
          <h3 className="text-lg font-medium">No Results Available</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Start the AI model to generate trading recommendations
          </p>
        </div>
      )}

      {isRunning && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <h3 className="text-lg font-medium">Analyzing Market Data</h3>
          <p className="text-sm text-muted-foreground mt-1">
            The AI model is currently processing market patterns
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((result, index) => (
            <Card key={`result-${index}`} className={
              result.action === 'buy' ? 'border-l-4 border-l-green-500' :
              result.action === 'sell' ? 'border-l-4 border-l-red-500' :
              'border-l-4 border-l-gray-500'
            }>
              <CardContent className="p-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {result.action === 'buy' && <TrendingUp className="h-5 w-5 mr-2 text-green-500" />}
                      {result.action === 'sell' && <TrendingDown className="h-5 w-5 mr-2 text-red-500" />}
                      {result.action === 'hold' && <Minus className="h-5 w-5 mr-2 text-gray-500" />}
                      
                      <div>
                        <span className="font-medium capitalize">{result.action}</span>
                        <Badge variant="outline" className="ml-2">
                          {(result.confidence * 100).toFixed(0)}% confidence
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTimestamp(result.timestamp)}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{result.reasoning}</p>
                  
                  {result.action !== 'hold' && result.suggestedAmount && result.suggestedPrice && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Amount:</span>{' '}
                        <span className="font-medium">{result.suggestedAmount.toFixed(4)} BTC</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Price:</span>{' '}
                        <span className="font-medium">${result.suggestedPrice.toFixed(2)}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Value:</span>{' '}
                        <span className="font-medium">
                          ${(result.suggestedAmount * result.suggestedPrice).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {onTrade && result.action !== 'hold' && (
                    <div className="mt-2">
                      <Button 
                        size="sm"
                        variant={result.action === 'buy' ? 'default' : 'destructive'}
                        className="capitalize"
                        onClick={() => handleExecuteTrade(result)}
                      >
                        Execute {result.action}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelResults;
