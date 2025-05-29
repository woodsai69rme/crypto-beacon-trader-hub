
import { useState, useEffect } from 'react';
import { realTimeService } from '@/services/realtime/realtimeService';
import { marketDataService } from '@/services/api/marketDataService';

export interface UseRealTimeDataProps {
  symbols?: string[];
  refreshInterval?: number;
  enabled?: boolean;
}

export const useRealTimeData = ({
  symbols = ['bitcoin', 'ethereum', 'cardano', 'solana'],
  refreshInterval = 30000,
  enabled = true
}: UseRealTimeDataProps = {}) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    if (!enabled) return;

    let mounted = true;

    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const marketData = await marketDataService.getMarketData(symbols);
        if (mounted) {
          setData(marketData);
          setLastUpdate(new Date());
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch data');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Initial data fetch
    fetchInitialData();

    // Set up real-time connection
    realTimeService.connect();

    // Subscribe to real-time updates
    const unsubscribe = realTimeService.subscribe('price', (priceUpdate) => {
      if (mounted) {
        setData(prevData => 
          prevData.map(item => 
            item.symbol.toLowerCase() === priceUpdate.symbol.toLowerCase()
              ? { 
                  ...item, 
                  price: priceUpdate.price,
                  changePercent: priceUpdate.change24h,
                  volume: priceUpdate.volume
                }
              : item
          )
        );
        setLastUpdate(new Date());
      }
    });

    // Set up periodic refresh as fallback
    const intervalId = setInterval(fetchInitialData, refreshInterval);

    return () => {
      mounted = false;
      unsubscribe();
      clearInterval(intervalId);
    };
  }, [symbols, refreshInterval, enabled]);

  const refreshData = async () => {
    try {
      setIsLoading(true);
      const marketData = await marketDataService.getMarketData(symbols);
      setData(marketData);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    lastUpdate,
    refreshData,
    isConnected: realTimeService.getConnectionStatus()
  };
};
