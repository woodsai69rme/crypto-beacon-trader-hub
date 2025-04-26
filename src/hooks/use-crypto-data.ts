
import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchTopCoins, fetchCoinHistory, clearApiCache } from "@/services/enhancedCryptoApi";
import type { CryptoData, CryptoChartData } from "@/services/enhancedCryptoApi";
import { useCurrencyConverter } from "./use-currency-converter";
import { toast } from "@/components/ui/use-toast";

interface UseCryptoDataOptions {
  limit?: number;
  refreshInterval?: number; // in milliseconds, 0 to disable auto-refresh
  initialSort?: 'rank' | 'name' | 'price' | 'change';
  initialSortDirection?: 'asc' | 'desc';
}

export function useCryptoData({
  limit = 100,
  refreshInterval = 0,
  initialSort = 'rank',
  initialSortDirection = 'asc'
}: UseCryptoDataOptions = {}) {
  const [coins, setCoins] = useState<CryptoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [sortBy, setSortBy] = useState<string>(initialSort);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSortDirection);
  
  const { activeCurrency, convertAndFormat } = useCurrencyConverter();
  
  // Function to fetch the coin data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const data = await fetchTopCoins(limit);
      setCoins(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error("Error fetching crypto data:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch cryptocurrency data"));
      
      // Don't clear existing data on error, just show notification
      toast({
        title: "Data fetch error",
        description: "Using cached data. Please try refreshing later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [limit]);
  
  // Initial fetch and set up refresh interval if provided
  useEffect(() => {
    fetchData();
    
    // Set up interval for auto-refresh if enabled
    if (refreshInterval > 0) {
      const intervalId = setInterval(() => {
        fetchData();
      }, refreshInterval);
      
      return () => clearInterval(intervalId);
    }
  }, [fetchData, refreshInterval]);
  
  // Sort the coins based on current sort settings
  const sortedCoins = useMemo(() => {
    if (!coins.length) return [];
    
    return [...coins].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'rank':
          comparison = (a.market_cap_rank || 9999) - (b.market_cap_rank || 9999);
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'symbol':
          comparison = a.symbol.localeCompare(b.symbol);
          break;
        case 'price':
          comparison = a.current_price - b.current_price;
          break;
        case 'change':
          comparison = a.price_change_percentage_24h - b.price_change_percentage_24h;
          break;
        case 'volume':
          comparison = a.total_volume - b.total_volume;
          break;
        case 'marketCap':
          comparison = a.market_cap - b.market_cap;
          break;
        default:
          comparison = (a.market_cap_rank || 9999) - (b.market_cap_rank || 9999);
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [coins, sortBy, sortDirection]);
  
  // Handle sort change
  const handleSort = useCallback((column: string) => {
    // If clicking the same column, toggle direction
    if (sortBy === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, set it and default to ascending
      setSortBy(column);
      setSortDirection('asc');
    }
  }, [sortBy]);
  
  // Manual refresh function
  const refreshData = useCallback(async () => {
    toast({
      title: "Refreshing data",
      description: "Fetching latest cryptocurrency data..."
    });
    
    // Clear cache to ensure fresh data
    clearApiCache();
    await fetchData();
    
    toast({
      title: "Data refreshed",
      description: "Cryptocurrency data has been updated."
    });
  }, [fetchData]);
  
  // Function to fetch historical data for a specific coin
  const fetchHistoricalData = useCallback(async (
    coinId: string, 
    days: number = 7
  ): Promise<CryptoChartData | null> => {
    try {
      return await fetchCoinHistory(coinId, days);
    } catch (err) {
      console.error(`Error fetching historical data for ${coinId}:`, err);
      return null;
    }
  }, []);
  
  // Format price based on current currency
  const formatPrice = useCallback((price: number): string => {
    return convertAndFormat(price, 'USD');
  }, [convertAndFormat]);
  
  return {
    coins: sortedCoins,
    isLoading,
    error,
    lastUpdated,
    refreshData,
    fetchHistoricalData,
    formatPrice,
    sortBy,
    sortDirection,
    handleSort,
    activeCurrency
  };
}
