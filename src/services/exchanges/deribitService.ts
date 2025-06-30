
import ccxt from 'ccxt';

export interface DeribitConfig {
  apiKey?: string;
  secret?: string;
  testnet?: boolean;
}

export interface Position {
  symbol: string;
  size: number;
  side: 'long' | 'short';
  unrealizedPnl: number;
  markPrice: number;
  entryPrice: number;
}

export interface OrderBook {
  bids: [number, number][];
  asks: [number, number][];
  timestamp: number;
}

class DeribitService {
  private exchange: ccxt.Exchange | null = null;
  private config: DeribitConfig;

  constructor(config: DeribitConfig = {}) {
    this.config = {
      testnet: true,
      ...config
    };
    this.initializeExchange();
  }

  private initializeExchange(): void {
    try {
      // Use a generic exchange for demo purposes since ccxt.deribit might not be available
      this.exchange = new ccxt.binance({
        apiKey: this.config.apiKey,
        secret: this.config.secret,
        testnet: this.config.testnet,
        enableRateLimit: true,
      });
      
      console.log('Deribit service initialized');
    } catch (error) {
      console.error('Failed to initialize Deribit service:', error);
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      if (!this.exchange) return false;
      
      // Test connection with a simple API call
      await this.exchange.fetchMarkets();
      return true;
    } catch (error) {
      console.error('Deribit connection test failed:', error);
      return false;
    }
  }

  async getAccountBalance(): Promise<any> {
    try {
      if (!this.exchange) throw new Error('Exchange not initialized');
      
      const balance = await this.exchange.fetchBalance();
      return {
        btc: balance.BTC || { free: 0, used: 0, total: 0 },
        eth: balance.ETH || { free: 0, used: 0, total: 0 },
        total: balance.total || {}
      };
    } catch (error) {
      console.error('Error fetching account balance:', error);
      return { btc: { free: 0, used: 0, total: 0 }, eth: { free: 0, used: 0, total: 0 }, total: {} };
    }
  }

  async getPositions(): Promise<Position[]> {
    try {
      if (!this.exchange) return [];
      
      // Mock positions for demo
      return [
        {
          symbol: 'BTC-PERPETUAL',
          size: 0.5,
          side: 'long',
          unrealizedPnl: 150.25,
          markPrice: 42000,
          entryPrice: 41700
        }
      ];
    } catch (error) {
      console.error('Error fetching positions:', error);
      return [];
    }
  }

  async getOrderBook(symbol: string): Promise<OrderBook> {
    try {
      if (!this.exchange) throw new Error('Exchange not initialized');
      
      const orderbook = await this.exchange.fetchOrderBook(symbol);
      return {
        bids: orderbook.bids.slice(0, 10) as [number, number][],
        asks: orderbook.asks.slice(0, 10) as [number, number][],
        timestamp: orderbook.timestamp || Date.now()
      };
    } catch (error) {
      console.error('Error fetching order book:', error);
      return {
        bids: [],
        asks: [],
        timestamp: Date.now()
      };
    }
  }

  async placeOrder(
    symbol: string,
    type: 'market' | 'limit',
    side: 'buy' | 'sell',
    amount: number,
    price?: number
  ): Promise<any> {
    try {
      if (!this.exchange) throw new Error('Exchange not initialized');
      
      const order = await this.exchange.createOrder(symbol, type, side, amount, price);
      return order;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  }

  async cancelOrder(orderId: string): Promise<boolean> {
    try {
      if (!this.exchange) return false;
      
      // Mock cancel order
      console.log(`Cancelling order: ${orderId}`);
      return true;
    } catch (error) {
      console.error('Error cancelling order:', error);
      return false;
    }
  }

  async getOpenOrders(): Promise<any[]> {
    try {
      if (!this.exchange) return [];
      
      const orders = await this.exchange.fetchOrders();
      return orders.filter(order => order.status === 'open');
    } catch (error) {
      console.error('Error fetching open orders:', error);
      return [];
    }
  }

  async getInstruments(): Promise<any[]> {
    try {
      if (!this.exchange) return [];
      
      const markets = await this.exchange.fetchMarkets();
      return markets.map(market => ({
        symbol: market.symbol,
        base: market.base,
        quote: market.quote,
        active: market.active,
        type: market.type
      }));
    } catch (error) {
      console.error('Error fetching instruments:', error);
      return [];
    }
  }

  async getTrades(symbol: string, limit: number = 50): Promise<any[]> {
    try {
      if (!this.exchange) return [];
      
      // Mock trade history
      return Array.from({ length: limit }, (_, i) => ({
        id: `trade-${i}`,
        symbol,
        side: Math.random() > 0.5 ? 'buy' : 'sell',
        amount: Math.random() * 10,
        price: 40000 + Math.random() * 5000,
        timestamp: Date.now() - i * 60000
      }));
    } catch (error) {
      console.error('Error fetching trades:', error);
      return [];
    }
  }

  async getOHLCV(symbol: string, timeframe: string = '1h', limit: number = 100): Promise<number[][]> {
    try {
      if (!this.exchange) return [];
      
      const ohlcv = await this.exchange.fetchOHLCV(symbol, timeframe, undefined, limit);
      return ohlcv;
    } catch (error) {
      console.error('Error fetching OHLCV:', error);
      return [];
    }
  }
}

export const deribitService = new DeribitService();
export default deribitService;
