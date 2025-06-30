
import { useState, useEffect } from 'react';
import { MarketData } from '@/types/trading';

interface UseRealTimeMarketDataReturn {
  marketData: MarketData[];
  loading: boolean;
  error: string | null;
  refreshData: () => void;
}

const useRealTimeMarketData = (symbols: string[] = ['BTC', 'ETH', 'SOL', 'ADA']): UseRealTimeMarketDataReturn => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock data for now - replace with real API calls
      const mockData: MarketData[] = symbols.map(symbol => ({
        symbol,
        price: Math.random() * 50000 + 1000,
        change24h: (Math.random() - 0.5) * 20,
        volume: Math.random() * 1000000000,
        marketCap: Math.random() * 100000000000,
        high24h: Math.random() * 55000 + 1000,
        low24h: Math.random() * 45000 + 1000,
      }));

      setMarketData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch market data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    
    // Update every 30 seconds
    const interval = setInterval(fetchMarketData, 30000);
    
    return () => clearInterval(interval);
  }, [symbols.join(',')]);

  return {
    marketData,
    loading,
    error,
    refreshData: fetchMarketData,
  };
};

export default useRealTimeMarketData;
