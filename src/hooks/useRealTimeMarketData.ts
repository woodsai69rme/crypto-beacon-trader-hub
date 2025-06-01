
import { useState, useEffect, useCallback, useRef } from 'react';
import { CoinOption } from '@/types/trading';

interface RealTimeDataOptions {
  symbols: string[];
  updateInterval?: number;
  enableWebSocket?: boolean;
  maxRetries?: number;
}

interface MarketDataPoint {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  timestamp: number;
}

export const useRealTimeMarketData = (options: RealTimeDataOptions) => {
  const [data, setData] = useState<CoinOption[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const retryCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { 
    symbols, 
    updateInterval = 5000, 
    enableWebSocket = true, 
    maxRetries = 3 
  } = options;

  // Simulate real-time price updates
  const generateMockData = useCallback((): CoinOption[] => {
    return symbols.map((symbol, index) => {
      const basePrice = [45000, 3200, 120, 0.85, 28, 15][index] || 100;
      const volatility = Math.random() * 0.02 - 0.01; // ±1% volatility
      const currentPrice = basePrice * (1 + volatility);
      
      return {
        id: symbol.toLowerCase(),
        name: symbol.charAt(0).toUpperCase() + symbol.slice(1),
        symbol: symbol.toUpperCase(),
        price: currentPrice,
        priceChange: (Math.random() - 0.5) * 1000,
        changePercent: volatility * 100,
        volume: Math.random() * 1000000000,
        marketCap: currentPrice * Math.random() * 21000000,
        value: symbol.toLowerCase(),
        label: `${symbol.charAt(0).toUpperCase() + symbol.slice(1)} (${symbol.toUpperCase()})`
      };
    });
  }, [symbols]);

  // WebSocket connection management
  const connectWebSocket = useCallback(() => {
    if (!enableWebSocket) return;

    try {
      // Mock WebSocket URL - in production, use real crypto data WebSocket
      const wsUrl = 'wss://echo.websocket.org/'; // Mock endpoint
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
        retryCountRef.current = 0;
        
        // Subscribe to price updates for symbols
        symbols.forEach(symbol => {
          wsRef.current?.send(JSON.stringify({
            method: 'SUBSCRIBE',
            params: [`${symbol.toLowerCase()}usdt@ticker`],
            id: Date.now()
          }));
        });
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.data) {
            // Process real WebSocket data here
            updateMarketData(message.data);
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket();
          }, Math.pow(2, retryCountRef.current) * 1000); // Exponential backoff
        } else {
          setError('WebSocket connection failed after maximum retries');
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('WebSocket connection error');
      };

    } catch (err) {
      console.error('Failed to create WebSocket connection:', err);
      setError('Failed to establish real-time connection');
    }
  }, [enableWebSocket, symbols, maxRetries]);

  const updateMarketData = useCallback((newData: any) => {
    setData(prevData => {
      const updatedData = [...prevData];
      // Update logic based on real WebSocket data structure
      // For now, using mock data updates
      return generateMockData();
    });
    setLastUpdate(new Date());
  }, [generateMockData]);

  // Polling fallback
  const pollData = useCallback(async () => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const newData = generateMockData();
      setData(newData);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      console.error('Polling error:', err);
      setError('Failed to fetch market data');
    }
  }, [generateMockData]);

  // Initialize data and connections
  useEffect(() => {
    // Load initial data
    pollData();

    // Set up WebSocket connection
    if (enableWebSocket) {
      connectWebSocket();
    }

    // Set up polling interval as fallback
    const interval = setInterval(pollData, updateInterval);

    return () => {
      clearInterval(interval);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [enableWebSocket, connectWebSocket, pollData, updateInterval]);

  // Manual refresh function
  const refresh = useCallback(() => {
    pollData();
  }, [pollData]);

  // Connection status
  const getConnectionStatus = useCallback(() => {
    if (enableWebSocket) {
      return isConnected ? 'connected' : 'disconnected';
    }
    return 'polling';
  }, [enableWebSocket, isConnected]);

  return {
    data,
    isConnected,
    error,
    lastUpdate,
    refresh,
    connectionStatus: getConnectionStatus()
  };
};

export default useRealTimeMarketData;
