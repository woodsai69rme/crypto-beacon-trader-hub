
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TradingSignal } from './types';
import { getRecentSignals, getHighConfidenceSignals } from '@/services/aiTradingSignalService';
import { TrendingUp, TrendingDown, Minus, AlertCircle, Sparkles } from 'lucide-react';

interface TradingSignalsProps {
  limit?: number;
  highConfidenceOnly?: boolean;
  showFullCard?: boolean;
  className?: string;
  onSelectSignal?: (signal: TradingSignal) => void;
}

const TradingSignals: React.FC<TradingSignalsProps> = ({
  limit = 5,
  highConfidenceOnly = false,
  showFullCard = true,
  className = "",
  onSelectSignal
}) => {
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchSignals = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const fetchedSignals = highConfidenceOnly 
          ? await getHighConfidenceSignals(limit)
          : await getRecentSignals(limit);
        
        setSignals(fetchedSignals);
      } catch (err) {
        console.error('Error fetching trading signals:', err);
        setError('Failed to load trading signals');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSignals();
  }, [limit, highConfidenceOnly]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const handleSignalClick = (signal: TradingSignal) => {
    if (onSelectSignal) {
      onSelectSignal(signal);
    }
  };
  
  const renderSignalIcon = (type: 'buy' | 'sell' | 'hold') => {
    switch (type) {
      case 'buy':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'sell':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'hold':
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const renderSignalsList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
          <p className="text-muted-foreground">{error}</p>
        </div>
      );
    }
    
    if (signals.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No trading signals available</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-3">
        {signals.map((signal) => (
          <div 
            key={signal.id} 
            className={`flex items-center justify-between border rounded-lg p-3 ${
              signal.type === 'buy' 
                ? 'border-green-200 dark:border-green-900' 
                : signal.type === 'sell' 
                ? 'border-red-200 dark:border-red-900' 
                : 'border'
            }`}
            onClick={() => handleSignalClick(signal)}
            style={{ cursor: onSelectSignal ? 'pointer' : 'default' }}
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                {renderSignalIcon(signal.type)}
                <span className="font-medium capitalize">{signal.type}</span>
                <Badge variant="outline">{signal.coinId.toUpperCase()}</Badge>
                {signal.confidence > 0.8 && (
                  <Badge className="bg-amber-500">
                    <Sparkles className="h-3 w-3 mr-1" />
                    High Confidence
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground">{signal.reason}</div>
              <div className="flex items-center text-xs space-x-2">
                <span>{formatDate(signal.timestamp)}</span>
                <span>•</span>
                <span>{signal.source}</span>
                <span>•</span>
                <span className="font-medium">${signal.price.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  if (!showFullCard) {
    return (
      <div className={className}>
        {renderSignalsList()}
      </div>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          {highConfidenceOnly ? 'High Confidence Signals' : 'Recent Trading Signals'}
        </CardTitle>
        <CardDescription>
          AI-generated trading signals based on technical analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderSignalsList()}
      </CardContent>
    </Card>
  );
};

export default TradingSignals;
