
import ccxt from 'ccxt';
import { useToast } from '@/hooks/use-toast';

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

class CCXTService {
  private exchanges: Map<string, ccxt.Exchange> = new Map();
  private supportedExchanges = [
    'binance',
    'coinbase',
    'kraken',
    'bybit',
    'okx',
    'kucoin',
    'bitfinex',
    'huobi',
    'gateio',
    'mexc'
  ];

  constructor() {
    console.log('CCXT Service initialized with supported exchanges:', this.supportedExchanges);
  }

  getSupportedExchanges(): string[] {
    return this.supportedExchanges;
  }

  async connectExchange(config: ExchangeConfig): Promise<boolean> {
    try {
      if (!this.supportedExchanges.includes(config.id)) {
        throw new Error(`Exchange ${config.id} is not supported`);
      }

      const ExchangeClass = (ccxt as any)[config.id];
      
      if (!ExchangeClass) {
        throw new Error(`Exchange class for ${config.id} not found`);
      }

      const exchange = new ExchangeClass({
        apiKey: config.apiKey,
        secret: config.secret,
        password: config.password,
        sandbox: config.sandbox || false,
        enableRateLimit: config.enableRateLimit !== false,
        timeout: 30000,
      });

      // Test the connection
      await exchange.loadMarkets();
      
      this.exchanges.set(config.id, exchange);

      console.log(`Successfully connected to ${config.id}`);
      return true;
    } catch (error) {
      console.error(`Failed to connect to ${config.id}:`, error);
      return false;
    }
  }

  async disconnectExchange(exchangeId: string): Promise<void> {
    const exchange = this.exchanges.get(exchangeId);
    if (exchange) {
      await exchange.close();
      this.exchanges.delete(exchangeId);
      console.log(`Disconnected from ${exchangeId}`);
    }
  }

  getConnectedExchanges(): string[] {
    return Array.from(this.exchanges.keys());
  }

  async fetchBalance(exchangeId: string): Promise<CCXTBalance | null> {
    try {
      const exchange = this.exchanges.get(exchangeId);
      if (!exchange) {
        throw new Error(`Exchange ${exchangeId} is not connected`);
      }

      const balance = await exchange.fetchBalance();
      return balance;
    } catch (error) {
      console.error(`Failed to fetch balance from ${exchangeId}:`, error);
      return null;
    }
  }

  async fetchTicker(exchangeId: string, symbol: string): Promise<any> {
    try {
      const exchange = this.exchanges.get(exchangeId);
      if (!exchange) {
        throw new Error(`Exchange ${exchangeId} is not connected`);
      }

      const ticker = await exchange.fetchTicker(symbol);
      return ticker;
    } catch (error) {
      console.error(`Failed to fetch ticker for ${symbol} from ${exchangeId}:`, error);
      return null;
    }
  }

  async createOrder(
    exchangeId: string,
    symbol: string,
    type: 'market' | 'limit',
    side: 'buy' | 'sell',
    amount: number,
    price?: number
  ): Promise<CCXTOrder | null> {
    try {
      const exchange = this.exchanges.get(exchangeId);
      if (!exchange) {
        throw new Error(`Exchange ${exchangeId} is not connected`);
      }

      const order = await exchange.createOrder(symbol, type, side, amount, price);
      console.log(`${side.toUpperCase()} order for ${amount} ${symbol} created successfully`);
      return order as CCXTOrder;
    } catch (error) {
      console.error(`Failed to create order on ${exchangeId}:`, error);
      return null;
    }
  }

  async fetchOrders(exchangeId: string, symbol?: string): Promise<CCXTOrder[]> {
    try {
      const exchange = this.exchanges.get(exchangeId);
      if (!exchange) {
        throw new Error(`Exchange ${exchangeId} is not connected`);
      }

      const orders = symbol 
        ? await exchange.fetchOrders(symbol)
        : await exchange.fetchOrders();
      
      return orders as CCXTOrder[];
    } catch (error) {
      console.error(`Failed to fetch orders from ${exchangeId}:`, error);
      return [];
    }
  }

  async fetchOHLCV(
    exchangeId: string,
    symbol: string,
    timeframe: string = '1d',
    limit: number = 100
  ): Promise<number[][] | null> {
    try {
      const exchange = this.exchanges.get(exchangeId);
      if (!exchange) {
        throw new Error(`Exchange ${exchangeId} is not connected`);
      }

      const ohlcv = await exchange.fetchOHLCV(symbol, timeframe, undefined, limit);
      return ohlcv;
    } catch (error) {
      console.error(`Failed to fetch OHLCV for ${symbol} from ${exchangeId}:`, error);
      return null;
    }
  }

  async fetchOrderBook(exchangeId: string, symbol: string): Promise<any> {
    try {
      const exchange = this.exchanges.get(exchangeId);
      if (!exchange) {
        throw new Error(`Exchange ${exchangeId} is not connected`);
      }

      const orderBook = await exchange.fetchOrderBook(symbol);
      return orderBook;
    } catch (error) {
      console.error(`Failed to fetch order book for ${symbol} from ${exchangeId}:`, error);
      return null;
    }
  }

  async testConnection(exchangeId: string): Promise<boolean> {
    try {
      const exchange = this.exchanges.get(exchangeId);
      if (!exchange) {
        return false;
      }

      await exchange.fetchStatus();
      return true;
    } catch (error) {
      console.error(`Connection test failed for ${exchangeId}:`, error);
      return false;
    }
  }

  getExchangeInfo(exchangeId: string): any {
    const exchange = this.exchanges.get(exchangeId);
    if (!exchange) {
      return null;
    }

    return {
      id: exchange.id,
      name: exchange.name,
      countries: exchange.countries,
      urls: exchange.urls,
      has: exchange.has,
      timeframes: exchange.timeframes,
      fees: exchange.fees,
    };
  }
}

export const ccxtService = new CCXTService();
