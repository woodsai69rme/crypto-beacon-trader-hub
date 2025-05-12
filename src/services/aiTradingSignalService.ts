
import { TradingSignal } from '@/components/trading/types';
import { toast } from '@/components/ui/use-toast';

// Generate mock trading signals for demonstration
export const generateMockSignals = (count: number = 5): TradingSignal[] => {
  const signals: TradingSignal[] = [];
  const coins = ['bitcoin', 'ethereum', 'solana', 'cardano', 'binancecoin'];
  const sources = ['LSTM Model', 'Transformer Model', 'Random Forest', 'Sentiment Analysis', 'Pattern Recognition'];
  const types: Array<'buy' | 'sell' | 'hold'> = ['buy', 'sell', 'hold'];
  
  // Weight types to have more buys than sells, and fewer holds
  const weightedTypes: Array<'buy' | 'sell' | 'hold'> = [
    ...Array(5).fill('buy'),
    ...Array(3).fill('sell'),
    ...Array(2).fill('hold')
  ];
  
  // Generate realistic buy reasons
  const buyReasons = [
    'Strong bullish divergence detected',
    'Price broke above key resistance',
    'Moving averages show bullish cross',
    'RSI indicates oversold conditions',
    'Volume increasing on upward movement',
    'Positive sentiment detected in news',
    'Price forming bullish pattern'
  ];
  
  // Generate realistic sell reasons
  const sellReasons = [
    'Bearish divergence forming',
    'Price approaching strong resistance',
    'Moving averages show bearish cross',
    'RSI indicates overbought conditions',
    'Volume decreasing during price rise',
    'Negative sentiment detected in news',
    'Price forming bearish pattern'
  ];
  
  // Generate realistic hold reasons
  const holdReasons = [
    'Market in consolidation phase',
    'Mixed signals from indicators',
    'Price within neutral zone',
    'Insufficient confidence for directional trade',
    'Awaiting confirmation of trend direction',
    'Low trading volume suggests caution'
  ];
  
  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;
  
  for (let i = 0; i < count; i++) {
    const coinId = coins[Math.floor(Math.random() * coins.length)];
    const type = weightedTypes[Math.floor(Math.random() * weightedTypes.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const timestamp = new Date(now - Math.random() * 3 * dayInMs).toISOString();
    
    // Select an appropriate reason based on the signal type
    let reason;
    if (type === 'buy') {
      reason = buyReasons[Math.floor(Math.random() * buyReasons.length)];
    } else if (type === 'sell') {
      reason = sellReasons[Math.floor(Math.random() * sellReasons.length)];
    } else {
      reason = holdReasons[Math.floor(Math.random() * holdReasons.length)];
    }
    
    signals.push({
      id: `signal-${Date.now()}-${i}`,
      coinId,
      type,
      price: type === 'buy' ? 20000 + Math.random() * 1000 : 20000 - Math.random() * 1000,
      confidence: 0.6 + Math.random() * 0.3, // 60-90% confidence
      source,
      timestamp,
      reason
    });
  }
  
  // Sort by most recent first
  return signals.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Get trading signals for a specific coin
export const getSignalsForCoin = async (coinId: string): Promise<TradingSignal[]> => {
  try {
    // In a real implementation, this would fetch data from an API
    // For now, generate mock data
    const allSignals = generateMockSignals(10);
    return allSignals.filter(signal => signal.coinId === coinId);
  } catch (error) {
    console.error('Error fetching signals for coin:', error);
    toast({
      title: 'Error',
      description: 'Could not fetch trading signals',
      variant: 'destructive'
    });
    return [];
  }
};

// Get recent trading signals across all coins
export const getRecentSignals = async (limit: number = 10): Promise<TradingSignal[]> => {
  try {
    // In a real implementation, this would fetch data from an API
    // For now, generate mock data
    return generateMockSignals(limit);
  } catch (error) {
    console.error('Error fetching recent signals:', error);
    toast({
      title: 'Error',
      description: 'Could not fetch recent signals',
      variant: 'destructive'
    });
    return [];
  }
};

// Get high confidence signals (confidence > 0.8)
export const getHighConfidenceSignals = async (limit: number = 5): Promise<TradingSignal[]> => {
  try {
    // Generate more signals than needed and filter
    const allSignals = generateMockSignals(limit * 3);
    const highConfidenceSignals = allSignals.filter(signal => signal.confidence > 0.8);
    
    // Return requested number of signals, or all if fewer than requested
    return highConfidenceSignals.slice(0, limit);
  } catch (error) {
    console.error('Error fetching high confidence signals:', error);
    toast({
      title: 'Error',
      description: 'Could not fetch high confidence signals',
      variant: 'destructive'
    });
    return [];
  }
};

export default {
  generateMockSignals,
  getSignalsForCoin,
  getRecentSignals,
  getHighConfidenceSignals
};
