
import { useState, useEffect } from 'react';

export interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap?: number;
  high24h?: number;
  low24h?: number;
}

export function useRealTimeMarketData(symbols: string[], refreshInterval: number = 5000) {
  const [data, setData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Mock market data for now
        const mockData: MarketData[] = symbols.map(symbol => ({
          symbol,
          price: Math.random() * 50000 + 10000,
          change24h: (Math.random() - 0.5) * 10,
          volume: Math.random() * 1000000000,
          marketCap: Math.random() * 100000000000,
          high24h: Math.random() * 55000 + 10000,
          low24h: Math.random() * 45000 + 10000,
        }));
        
        setData(mockData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval);

    return () => clearInterval(interval);
  }, [symbols, refreshInterval]);

  return { data, loading, error };
}
