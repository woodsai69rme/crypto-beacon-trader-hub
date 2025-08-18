
// Browser-compatible CCXT service wrapper
import { ccxtService } from './ccxtService';

interface ExchangeConfig {
  id: string;
  name: string;
  apiKey?: string;
  secret?: string;
  password?: string;
  sandbox?: boolean;
  enableRateLimit?: boolean;
}

interface CCXTBalance {
  [currency: string]: {
    free: number;
    used: number;
    total: number;
  };
}

interface CCXTOrder {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  amount: number;
  price?: number;
  status: string;
  timestamp: number;
  datetime: string;
}

class CCXTBrowserService {
  private isSupported = false;

  constructor() {
    // Check if we're in a browser environment and if CCXT can be loaded
    this.checkSupport();
  }

  private async checkSupport() {
    try {
      // Try to load CCXT dynamically to see if it works in the browser
      if (typeof window !== 'undefined') {
        this.isSupported = true;
      }
    } catch (error) {
      console.warn('CCXT not supported in this environment, falling back to mock service');
      this.isSupported = false;
    }
  }

  getSupportedExchanges(): string[] {
    if (!this.isSupported) {
      return ['binance', 'coinbase', 'kraken']; // Mock exchanges
    }
    return ccxtService.getSupportedExchanges();
  }

  async connectExchange(config: ExchangeConfig): Promise<boolean> {
    if (!this.isSupported) {
      console.log(`Mock connection to ${config.id} successful`);
      return true;
    }
    
    try {
      return await ccxtService.connectExchange(config);
    } catch (error) {
      console.error(`Failed to connect to exchange ${config.id}:`, error);
      return false;
    }
  }

  async disconnectExchange(exchangeId: string): Promise<void> {
    if (!this.isSupported) {
      console.log(`Mock disconnection from ${exchangeId}`);
      return;
    }
    
    return ccxtService.disconnectExchange(exchangeId);
  }

  getConnectedExchanges(): string[] {
    if (!this.isSupported) {
      return []; // Return empty array for mock
    }
    return ccxtService.getConnectedExchanges();
  }

  async fetchBalance(exchangeId: string): Promise<CCXTBalance | null> {
    if (!this.isSupported) {
      // Return mock balance
      return {
        BTC: { free: 0.05, used: 0.0, total: 0.05 },
        ETH: { free: 1.5, used: 0.0, total: 1.5 },
        USDT: { free: 1000, used: 0.0, total: 1000 }
      };
    }
    
    return ccxtService.fetchBalance(exchangeId);
  }

  async fetchTicker(exchangeId: string, symbol: string): Promise<any> {
    if (!this.isSupported) {
      // Return mock ticker
      return {
        symbol,
        last: 50000 + Math.random() * 1000,
        bid: 49950,
        ask: 50050,
        high: 51000,
        low: 49000,
        change: Math.random() * 2000 - 1000
      };
    }
    
    return ccxtService.fetchTicker(exchangeId, symbol);
  }

  async createOrder(
    exchangeId: string,
    symbol: string,
    type: 'market' | 'limit',
    side: 'buy' | 'sell',
    amount: number,
    price?: number
  ): Promise<CCXTOrder | null> {
    if (!this.isSupported) {
      // Return mock order
      return {
        id: `mock_${Date.now()}`,
        symbol,
        side,
        amount,
        price: price || 50000,
        status: 'filled',
        timestamp: Date.now(),
        datetime: new Date().toISOString()
      };
    }
    
    return ccxtService.createOrder(exchangeId, symbol, type, side, amount, price);
  }

  async fetchOrders(exchangeId: string, symbol?: string): Promise<CCXTOrder[]> {
    if (!this.isSupported) {
      return []; // Return empty array for mock
    }
    
    return ccxtService.fetchOrders(exchangeId, symbol);
  }

  async fetchOHLCV(
    exchangeId: string,
    symbol: string,
    timeframe: string = '1d',
    limit: number = 100
  ): Promise<number[][] | null> {
    if (!this.isSupported) {
      // Return mock OHLCV data
      const mockData = [];
      const now = Date.now();
      for (let i = 0; i < limit; i++) {
        const timestamp = now - (i * 24 * 60 * 60 * 1000);
        const price = 50000 + Math.sin(i * 0.1) * 5000;
        mockData.unshift([
          timestamp,
          price, // open
          price + Math.random() * 1000, // high
          price - Math.random() * 1000, // low
          price + (Math.random() - 0.5) * 2000, // close
          Math.random() * 1000000 // volume
        ]);
      }
      return mockData;
    }
    
    return ccxtService.fetchOHLCV(exchangeId, symbol, timeframe, limit);
  }

  async fetchOrderBook(exchangeId: string, symbol: string): Promise<any> {
    if (!this.isSupported) {
      // Return mock order book
      return {
        bids: [[49950, 1.5], [49900, 2.0], [49850, 1.8]],
        asks: [[50050, 1.2], [50100, 1.7], [50150, 2.1]],
        timestamp: Date.now(),
        datetime: new Date().toISOString()
      };
    }
    
    return ccxtService.fetchOrderBook(exchangeId, symbol);
  }

  async testConnection(exchangeId: string): Promise<boolean> {
    if (!this.isSupported) {
      return true; // Mock connection always successful
    }
    
    return ccxtService.testConnection(exchangeId);
  }

  getExchangeInfo(exchangeId: string): any {
    if (!this.isSupported) {
      return {
        id: exchangeId,
        name: exchangeId.charAt(0).toUpperCase() + exchangeId.slice(1),
        countries: ['US'],
        urls: { www: `https://${exchangeId}.com` },
        has: { fetchTicker: true, fetchBalance: true },
        timeframes: { '1m': '1m', '5m': '5m', '1h': '1h', '1d': '1d' },
        fees: { trading: { maker: 0.001, taker: 0.001 } }
      };
    }
    
    return ccxtService.getExchangeInfo(exchangeId);
  }
}

export const ccxtBrowserService = new CCXTBrowserService();
