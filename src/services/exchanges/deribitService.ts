
import { Exchange } from 'ccxt';

export interface DeribitAccount {
  id: string;
  name: string;
  type: 'main' | 'subaccount';
  currency: string;
  balance: number;
  availableBalance: number;
  maintenanceMargin: number;
  initialMargin: number;
  marginBalance: number;
  unrealizedPnl: number;
  realizedPnl: number;
  totalPnl: number;
}

export interface DeribitPosition {
  instrument: string;
  size: number;
  direction: 'buy' | 'sell';
  averagePrice: number;
  markPrice: number;
  unrealizedPnl: number;
  realizedPnl: number;
  maintenanceMargin: number;
  initialMargin: number;
  leverage: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
}

export interface DeribitOrder {
  id: string;
  instrument: string;
  type: 'limit' | 'market' | 'stop_limit' | 'stop_market';
  side: 'buy' | 'sell';
  amount: number;
  price?: number;
  stopPrice?: number;
  status: 'open' | 'filled' | 'cancelled' | 'rejected';
  filledAmount: number;
  averagePrice?: number;
  timestamp: number;
  fee?: number;
}

export interface DeribitInstrument {
  name: string;
  type: 'future' | 'option';
  baseCurrency: string;
  quoteCurrency: string;
  settlementCurrency: string;
  contractSize: number;
  minTradeAmount: number;
  tickSize: number;
  expirationDate?: string;
  strike?: number;
  optionType?: 'call' | 'put';
}

export interface DeribitOrderBook {
  instrument: string;
  timestamp: number;
  bids: Array<[number, number]>; // [price, quantity]
  asks: Array<[number, number]>; // [price, quantity]
  markPrice: number;
  indexPrice: number;
}

export interface DeribitTrade {
  id: string;
  instrument: string;
  price: number;
  amount: number;
  side: 'buy' | 'sell';
  timestamp: number;
  fee: number;
  orderId: string;
  tradeSeq: number;
}

class DeribitService {
  private exchange: Exchange | null = null;
  private isConnected: boolean = false;
  private credentials: {
    apiKey?: string;
    secret?: string;
    testnet?: boolean;
  } = {};

  constructor() {
    console.log('Deribit service initialized');
  }

  async connect(apiKey: string, secret: string, testnet: boolean = true): Promise<boolean> {
    try {
      // Dynamic import to avoid build issues
      const ccxt = await import('ccxt');
      
      this.exchange = new ccxt.deribit({
        apiKey,
        secret,
        sandbox: testnet,
        enableRateLimit: true,
        timeout: 30000,
        options: {
          defaultType: 'future',
        },
      });

      // Test the connection
      await this.exchange.loadMarkets();
      
      this.credentials = { apiKey, secret, testnet };
      this.isConnected = true;

      console.log(`✅ Connected to Deribit ${testnet ? 'Testnet' : 'Mainnet'}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to connect to Deribit:', error);
      this.isConnected = false;
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.exchange) {
      await this.exchange.close();
      this.exchange = null;
    }
    this.isConnected = false;
    console.log('Disconnected from Deribit');
  }

  isConnectionActive(): boolean {
    return this.isConnected && this.exchange !== null;
  }

  async getAccount(): Promise<DeribitAccount | null> {
    if (!this.exchange) {
      throw new Error('Not connected to Deribit');
    }

    try {
      const balance = await this.exchange.fetchBalance();
      
      // Deribit typically uses BTC as the main currency
      const btcBalance = balance['BTC'] || {};
      
      return {
        id: 'main',
        name: 'Main Account',
        type: 'main',
        currency: 'BTC',
        balance: btcBalance.total || 0,
        availableBalance: btcBalance.free || 0,
        maintenanceMargin: 0, // Would need specific API call
        initialMargin: 0, // Would need specific API call
        marginBalance: btcBalance.total || 0,
        unrealizedPnl: 0, // Would be calculated from positions
        realizedPnl: 0, // Would need specific API call
        totalPnl: 0,
      };
    } catch (error) {
      console.error('Error fetching Deribit account:', error);
      return null;
    }
  }

  async getPositions(): Promise<DeribitPosition[]> {
    if (!this.exchange) {
      throw new Error('Not connected to Deribit');
    }

    try {
      const positions = await this.exchange.fetchPositions();
      
      return positions
        .filter((pos: any) => pos.contracts !== 0)
        .map((pos: any) => ({
          instrument: pos.symbol,
          size: Math.abs(pos.contracts),
          direction: pos.side as 'buy' | 'sell',
          averagePrice: pos.entryPrice || 0,
          markPrice: pos.markPrice || 0,
          unrealizedPnl: pos.unrealizedPnl || 0,
          realizedPnl: 0, // Would need additional API call
          maintenanceMargin: pos.maintenanceMargin || 0,
          initialMargin: pos.initialMargin || 0,
          leverage: pos.leverage || 1,
          delta: 0, // Greeks would need specific API calls
          gamma: 0,
          theta: 0,
          vega: 0,
        }));
    } catch (error) {
      console.error('Error fetching Deribit positions:', error);
      return [];
    }
  }

  async getInstruments(type: 'future' | 'option' = 'future'): Promise<DeribitInstrument[]> {
    if (!this.exchange) {
      throw new Error('Not connected to Deribit');
    }

    try {
      const markets = await this.exchange.loadMarkets();
      
      return Object.values(markets)
        .filter((market: any) => market.type === type)
        .map((market: any) => ({
          name: market.symbol,
          type,
          baseCurrency: market.base,
          quoteCurrency: market.quote,
          settlementCurrency: market.settle || market.quote,
          contractSize: market.contractSize || 1,
          minTradeAmount: market.limits?.amount?.min || 0,
          tickSize: market.precision?.price || 0.01,
          expirationDate: market.expiry ? new Date(market.expiry).toISOString() : undefined,
          strike: market.strike,
          optionType: market.optionType as 'call' | 'put' | undefined,
        }));
    } catch (error) {
      console.error('Error fetching Deribit instruments:', error);
      return [];
    }
  }

  async createOrder(
    instrument: string,
    type: 'limit' | 'market' | 'stop_limit' | 'stop_market',
    side: 'buy' | 'sell',
    amount: number,
    price?: number,
    stopPrice?: number
  ): Promise<DeribitOrder | null> {
    if (!this.exchange) {
      throw new Error('Not connected to Deribit');
    }

    try {
      const orderParams: any = {};
      
      if (type === 'stop_limit' || type === 'stop_market') {
        orderParams.stopPrice = stopPrice;
      }

      const order = await this.exchange.createOrder(
        instrument,
        type,
        side,
        amount,
        price,
        undefined,
        undefined,
        orderParams
      );

      return {
        id: order.id,
        instrument: order.symbol,
        type: type,
        side: side,
        amount: order.amount,
        price: order.price,
        stopPrice: stopPrice,
        status: order.status as 'open' | 'filled' | 'cancelled' | 'rejected',
        filledAmount: order.filled || 0,
        averagePrice: order.average,
        timestamp: order.timestamp || Date.now(),
        fee: order.fee?.cost,
      };
    } catch (error) {
      console.error('Error creating Deribit order:', error);
      return null;
    }
  }

  async cancelOrder(orderId: string, instrument?: string): Promise<boolean> {
    if (!this.exchange) {
      throw new Error('Not connected to Deribit');
    }

    try {
      await this.exchange.cancelOrder(orderId, instrument);
      console.log(`✅ Cancelled Deribit order: ${orderId}`);
      return true;
    } catch (error) {
      console.error('Error cancelling Deribit order:', error);
      return false;
    }
  }

  async getOrders(instrument?: string, status?: string): Promise<DeribitOrder[]> {
    if (!this.exchange) {
      throw new Error('Not connected to Deribit');
    }

    try {
      const orders = status === 'open' 
        ? await this.exchange.fetchOpenOrders(instrument)
        : await this.exchange.fetchOrders(instrument);

      return orders.map((order: any) => ({
        id: order.id,
        instrument: order.symbol,
        type: order.type as 'limit' | 'market' | 'stop_limit' | 'stop_market',
        side: order.side as 'buy' | 'sell',
        amount: order.amount,
        price: order.price,
        stopPrice: order.stopPrice,
        status: order.status as 'open' | 'filled' | 'cancelled' | 'rejected',
        filledAmount: order.filled || 0,
        averagePrice: order.average,
        timestamp: order.timestamp || Date.now(),
        fee: order.fee?.cost,
      }));
    } catch (error) {
      console.error('Error fetching Deribit orders:', error);
      return [];
    }
  }

  async getOrderBook(instrument: string): Promise<DeribitOrderBook | null> {
    if (!this.exchange) {
      throw new Error('Not connected to Deribit');
    }

    try {
      const orderBook = await this.exchange.fetchOrderBook(instrument);
      const ticker = await this.exchange.fetchTicker(instrument);

      return {
        instrument,
        timestamp: Date.now(),
        bids: orderBook.bids.slice(0, 20), // Top 20 bids
        asks: orderBook.asks.slice(0, 20), // Top 20 asks
        markPrice: ticker.last || 0,
        indexPrice: ticker.info?.index_price || ticker.last || 0,
      };
    } catch (error) {
      console.error('Error fetching Deribit order book:', error);
      return null;
    }
  }

  async getTrades(instrument?: string, limit: number = 100): Promise<DeribitTrade[]> {
    if (!this.exchange) {
      throw new Error('Not connected to Deribit');
    }

    try {
      const trades = await this.exchange.fetchMyTrades(instrument, undefined, limit);

      return trades.map((trade: any) => ({
        id: trade.id,
        instrument: trade.symbol,
        price: trade.price,
        amount: trade.amount,
        side: trade.side as 'buy' | 'sell',
        timestamp: trade.timestamp || Date.now(),
        fee: trade.fee?.cost || 0,
        orderId: trade.order || '',
        tradeSeq: trade.info?.trade_seq || 0,
      }));
    } catch (error) {
      console.error('Error fetching Deribit trades:', error);
      return [];
    }
  }

  async getOHLCV(
    instrument: string,
    timeframe: string = '1m',
    limit: number = 100
  ): Promise<Array<[number, number, number, number, number, number]> | null> {
    if (!this.exchange) {
      throw new Error('Not connected to Deribit');
    }

    try {
      const ohlcv = await this.exchange.fetchOHLCV(instrument, timeframe, undefined, limit);
      return ohlcv;
    } catch (error) {
      console.error('Error fetching Deribit OHLCV:', error);
      return null;
    }
  }

  async calculateGreeks(instrument: string): Promise<{
    delta: number;
    gamma: number;
    theta: number;
    vega: number;
  } | null> {
    // This would require specific Deribit API calls for options Greeks
    // For now, return mock data
    if (instrument.includes('C') || instrument.includes('P')) {
      return {
        delta: Math.random() * 0.8 + 0.1,
        gamma: Math.random() * 0.01,
        theta: -Math.random() * 0.1,
        vega: Math.random() * 0.2,
      };
    }
    return null;
  }

  getConnectionStatus(): {
    connected: boolean;
    testnet: boolean;
    lastUpdate: string;
  } {
    return {
      connected: this.isConnected,
      testnet: this.credentials.testnet || true,
      lastUpdate: new Date().toISOString(),
    };
  }

  // Utility methods for common operations
  async quickBuyFuture(instrument: string, amount: number, price?: number): Promise<DeribitOrder | null> {
    return this.createOrder(instrument, price ? 'limit' : 'market', 'buy', amount, price);
  }

  async quickSellFuture(instrument: string, amount: number, price?: number): Promise<DeribitOrder | null> {
    return this.createOrder(instrument, price ? 'limit' : 'market', 'sell', amount, price);
  }

  async closePosition(instrument: string): Promise<boolean> {
    const positions = await this.getPositions();
    const position = positions.find(p => p.instrument === instrument);
    
    if (!position) {
      console.log(`No position found for ${instrument}`);
      return false;
    }

    const oppositeSide = position.direction === 'buy' ? 'sell' : 'buy';
    const order = await this.createOrder(instrument, 'market', oppositeSide, position.size);
    
    return order !== null;
  }
}

export const deribitService = new DeribitService();
export default deribitService;
