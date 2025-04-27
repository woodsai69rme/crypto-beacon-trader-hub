
// Fix for the expected 3 arguments error
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  image: string;
}

interface UseCryptoDataOptions {
  limit?: number;
  currency?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  refreshInterval?: number | null;
}

const defaultOptions: UseCryptoDataOptions = {
  limit: 50,
  currency: 'usd',
  sortBy: 'market_cap_rank',
  order: 'asc',
  refreshInterval: 60000, // 1 minute
};

export function useCryptoData(options: UseCryptoDataOptions = {}, dependencies: any[] = []) {
  const mergedOptions = { ...defaultOptions, ...options };
  const { limit, currency, sortBy, order, refreshInterval } = mergedOptions;

  const [data, setData] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets`,
        {
          params: {
            vs_currency: currency,
            order: `${sortBy}_${order}`,
            per_page: limit,
            page: 1,
            sparkline: false,
          },
        }
      );
      setData(response.data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch crypto data'));
    } finally {
      setLoading(false);
    }
  }, [currency, limit, order, sortBy]);

  useEffect(() => {
    fetchData();

    const intervalId =
      refreshInterval !== null
        ? setInterval(() => {
            fetchData();
          }, refreshInterval)
        : null;

    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [fetchData, refreshInterval, ...dependencies]);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
    lastUpdated,
  };
}

export default useCryptoData;
