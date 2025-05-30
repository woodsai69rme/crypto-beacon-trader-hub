
import { useState, useEffect } from 'react';
import { cryptoApiService } from '@/services/api/cryptoApi';
import { websocketService } from '@/services/realtime/websocketService';
import { CoinOption } from '@/types/trading';

export const useRealTimeData = (coinIds: string[] = []) => {
  const [data, setData] = useState<CoinOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    let mounted = true;
    
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const initialData = coinIds.length > 0 
          ? await cryptoApiService.getMarketData(coinIds)
          : await cryptoApiService.getTopCryptocurrencies(10);
          
        if (mounted) {
          setData(initialData);
          setLastUpdate(new Date());
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load data');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadInitialData();

    // Setup WebSocket for real-time updates
    const symbols = coinIds.length > 0 
      ? coinIds.map(id => `${id.toUpperCase()}USDT`)
      : ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'SOLUSDT'];
      
    websocketService.connectToPriceStream(symbols);

    const unsubscribe = websocketService.subscribe('price-update', (priceUpdate) => {
      if (mounted) {
        setData(prevData => 
          prevData.map(coin => {
            if (coin.symbol === priceUpdate.symbol) {
              return {
                ...coin,
                price: priceUpdate.price,
                changePercent: priceUpdate.change24h,
                volume: priceUpdate.volume
              };
            }
            return coin;
          })
        );
        setLastUpdate(new Date());
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [coinIds.join(',')]);

  const refreshData = async () => {
    try {
      setError(null);
      const freshData = coinIds.length > 0 
        ? await cryptoApiService.getMarketData(coinIds)
        : await cryptoApiService.getTopCryptocurrencies(10);
      setData(freshData);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    }
  };

  return {
    data,
    loading,
    error,
    lastUpdate,
    refreshData
  };
};
