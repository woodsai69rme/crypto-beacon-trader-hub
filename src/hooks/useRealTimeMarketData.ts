
import { useState, useEffect } from 'react';
import { MarketData } from '@/types/trading';

export const useRealTimeMarketData = (symbols: string[] = []) => {
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (symbols.length === 0) return;

    const fetchMarketData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data: Record<string, MarketData> = {};
        
        // Simulate fetching market data for each symbol
        for (const symbol of symbols) {
          // Mock data for demonstration
          data[symbol] = {
            symbol,
            price: Math.random() * 50000 + 10000,
            change24h: (Math.random() - 0.5) * 10,
            volume24h: Math.random() * 1000000,
            high24h: Math.random() * 55000 + 10000,
            low24h: Math.random() * 45000 + 10000,
            timestamp: new Date().toISOString()
          };
        }

        setMarketData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch market data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
    
    // Set up interval for real-time updates
    const interval = setInterval(fetchMarketData, 5000);
    
    return () => clearInterval(interval);
  }, [symbols]);

  return { marketData, isLoading, error };
};

export default useRealTimeMarketData;
