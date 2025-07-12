
// @ts-ignore
import ccxt from 'ccxt';

export interface DeribitCredentials {
  apiKey: string;
  apiSecret: string;
  sandbox?: boolean;
}

export interface DeribitPosition {
  symbol: string;
  side: 'buy' | 'sell';
  size: number;
  markPrice: number;
  unrealizedPnl: number;
  leverage: number;
}

export interface DeribitOrderbook {
  symbol: string;
  bids: [number, number][];
  asks: [number, number][];
  timestamp: number;
}

export class DeribitService {
  private exchange: any = null;
  private credentials: DeribitCredentials | null = null;
  private connectionActive: boolean = false;

  constructor() {
    this.initializeExchange();
  }

  private initializeExchange() {
    try {
      this.exchange = new (ccxt as any).deribit({
        sandbox: true,
        enableRateLimit: true,
      });
    } catch (error) {
      console.error('Error initializing Deribit exchange:', error);
    }
  }

  get isConnectionActive(): boolean {
    return this.connectionActive && this.exchange !== null;
  }

  async connect(credentials: DeribitCredentials): Promise<boolean> {
    try {
      this.credentials = credentials;
      
      if (!this.exchange) {
        this.initializeExchange();
      }

      if (this.exchange) {
        this.exchange.apiKey = credentials.apiKey;
        this.exchange.secret = credentials.apiSecret;
        this.exchange.sandbox = credentials.sandbox || true;

        // Test connection
        await this.exchange.fetchBalance();
        this.connectionActive = true;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Deribit connection error:', error);
      this.connectionActive = false;
      return false;
    }
  }

  getConnectionStatus(): { connected: boolean; error?: string } {
    return {
      connected: this.connectionActive,
      error: !this.connectionActive ? 'Not connected to Deribit' : undefined
    };
  }

  async getAccountInfo() {
    if (!this.exchange || !this.connectionActive) {
      throw new Error('Not connected to Deribit');
    }

    try {
      const balance = await this.exchange.fetchBalance();
      return {
        balance: balance.total,
        currency: 'BTC',
        equity: balance.total?.BTC || 0,
        marginLevel: 1,
        positions: await this.getPositions()
      };
    } catch (error) {
      console.error('Error fetching Deribit account info:', error);
      throw error;
    }
  }

  async getPositions(): Promise<DeribitPosition[]> {
    if (!this.exchange || !this.connectionActive) {
      return [];
    }

    try {
      const positions = await this.exchange.fetchPositions();
      return positions.map((pos: any) => ({
        symbol: pos.symbol,
        side: pos.side,
        size: pos.contracts,
        markPrice: pos.markPrice,
        unrealizedPnl: pos.unrealizedPnl,
        leverage: pos.leverage
      }));
    } catch (error) {
      console.error('Error fetching positions:', error);
      return [];
    }
  }

  async getOrderbook(symbol: string): Promise<DeribitOrderbook> {
    if (!this.exchange || !this.connectionActive) {
      throw new Error('Not connected to Deribit');
    }

    try {
      const orderbook = await this.exchange.fetchOrderBook(symbol);
      return {
        symbol,
        bids: orderbook.bids,
        asks: orderbook.asks,
        timestamp: orderbook.timestamp || Date.now()
      };
    } catch (error) {
      console.error('Error fetching orderbook:', error);
      throw error;
    }
  }

  async placeOrder(symbol: string, type: 'market' | 'limit', side: 'buy' | 'sell', amount: number, price?: number) {
    if (!this.exchange || !this.connectionActive) {
      throw new Error('Not connected to Deribit');
    }

    try {
      const order = await this.exchange.createOrder(symbol, type, side, amount, price);
      return {
        id: order.id,
        symbol: order.symbol,
        side: order.side,
        type: order.type,
        amount: order.amount,
        price: order.price,
        status: order.status,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  }

  async getMarketData(symbol: string) {
    if (!this.exchange) {
      throw new Error('Exchange not initialized');
    }

    try {
      const ticker = await this.exchange.fetchTicker(symbol);
      return {
        symbol,
        price: ticker.last || 0,
        change24h: ticker.percentage || 0,
        volume24h: ticker.baseVolume || 0,
        high24h: ticker.high || 0,
        low24h: ticker.low || 0,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw error;
    }
  }

  disconnect() {
    this.connectionActive = false;
    this.credentials = null;
    if (this.exchange) {
      this.exchange.apiKey = '';
      this.exchange.secret = '';
    }
  }
}

export const deribitService = new DeribitService();
