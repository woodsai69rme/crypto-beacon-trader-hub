
import { CoinOption } from '@/types/trading';

// Mock price monitoring service
export class PriceMonitoringService {
  private static instance: PriceMonitoringService;
  private subscribers: Map<string, ((price: number) => void)[]> = new Map();
  private prices: Map<string, number> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {}

  public static getInstance(): PriceMonitoringService {
    if (!PriceMonitoringService.instance) {
      PriceMonitoringService.instance = new PriceMonitoringService();
    }
    return PriceMonitoringService.instance;
  }

  subscribe(coinId: string, callback: (price: number) => void): () => void {
    if (!this.subscribers.has(coinId)) {
      this.subscribers.set(coinId, []);
      this.startMonitoring(coinId);
    }

    const callbacks = this.subscribers.get(coinId)!;
    callbacks.push(callback);

    // Return unsubscribe function
    return () => {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
      
      if (callbacks.length === 0) {
        this.stopMonitoring(coinId);
      }
    };
  }

  private startMonitoring(coinId: string): void {
    // Simulate real-time price updates
    const interval = setInterval(() => {
      const currentPrice = this.prices.get(coinId) || this.getInitialPrice(coinId);
      const change = (Math.random() - 0.5) * 0.02; // ±1% change
      const newPrice = currentPrice * (1 + change);
      
      this.prices.set(coinId, newPrice);
      
      const callbacks = this.subscribers.get(coinId) || [];
      callbacks.forEach(callback => callback(newPrice));
    }, 1000);

    this.intervals.set(coinId, interval);
  }

  private stopMonitoring(coinId: string): void {
    const interval = this.intervals.get(coinId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(coinId);
    }
    this.subscribers.delete(coinId);
  }

  private getInitialPrice(coinId: string): number {
    // Mock initial prices
    const mockPrices: Record<string, number> = {
      bitcoin: 45000,
      ethereum: 3200,
      solana: 120,
      cardano: 0.85,
      polkadot: 28,
      chainlink: 15
    };
    return mockPrices[coinId] || 100;
  }

  getCurrentPrice(coinId: string): number {
    return this.prices.get(coinId) || this.getInitialPrice(coinId);
  }

  // Mock data for testing
  getMockCoins(): CoinOption[] {
    const mockData = [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 45000 },
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3200 },
      { id: 'solana', name: 'Solana', symbol: 'SOL', price: 120 },
      { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 0.85 },
      { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', price: 28 },
      { id: 'chainlink', name: 'Chainlink', symbol: 'LINK', price: 15 }
    ];

    return mockData.map(coin => ({
      ...coin,
      priceChange: (Math.random() - 0.5) * 1000,
      changePercent: (Math.random() - 0.5) * 10,
      value: coin.id,
      label: `${coin.name} (${coin.symbol})`
    }));
  }
}

export const priceMonitoringService = PriceMonitoringService.getInstance();

export default priceMonitoringService;
