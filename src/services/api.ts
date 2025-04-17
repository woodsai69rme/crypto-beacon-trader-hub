
import { QueryClient } from "@tanstack/react-query";

// Base URL for API requests
const API_BASE_URL = "https://api.example.com/v1";

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});

// Helper for making API requests
export async function fetchApi<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    "Content-Type": "application/json",
  };
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API request failed with status ${response.status}`);
  }
  
  return response.json();
}

// API endpoints
export const cryptoApi = {
  // Market data
  getMarketOverview: () => 
    fetchApi<any>("/market/overview"),
    
  getCoinData: (coinId: string) => 
    fetchApi<any>(`/coins/${coinId}`),
    
  getHistoricalData: (coinId: string, days: number = 30) => 
    fetchApi<any>(`/coins/${coinId}/history?days=${days}`),
    
  // User data
  getUserPortfolio: (userId: string) => 
    fetchApi<any>(`/users/${userId}/portfolio`),
    
  getUserWatchlist: (userId: string) => 
    fetchApi<any>(`/users/${userId}/watchlist`),
    
  // Transactions
  addTransaction: (data: any) => 
    fetchApi<any>("/transactions", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  // Alerts
  setAlert: (data: any) => 
    fetchApi<any>("/alerts", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Mock implementation for demo purposes
export const mockApi = {
  getMarketOverview: async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      totalMarketCap: 1823456789012,
      totalVolume: 123456789012,
      btcDominance: 42.5,
      topGainers: [
        { id: "bitcoin", symbol: "BTC", name: "Bitcoin", price: 50123.45, change24h: 5.2 },
        { id: "ethereum", symbol: "ETH", name: "Ethereum", price: 3123.45, change24h: 3.8 },
      ],
      topLosers: [
        { id: "cardano", symbol: "ADA", name: "Cardano", price: 0.45, change24h: -2.3 },
        { id: "solana", symbol: "SOL", name: "Solana", price: 98.76, change24h: -1.5 },
      ]
    };
  },
};
