
export interface ExchangeConfig {
  id: string;
  name: string;
  baseUrl: string;
  apiKey?: string;
  secretKey?: string;
  testnet: boolean;
  supportedFeatures: string[];
}

export interface Order {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop';
  quantity: number;
  price?: number;
  status: 'pending' | 'filled' | 'cancelled' | 'partial';
  timestamp: number;
  fees?: number;
}

export interface Balance {
  asset: string;
  free: number;
  locked: number;
  total: number;
}

export interface OrderBook {
  symbol: string;
  bids: [number, number][];
  asks: [number, number][];
  timestamp: number;
}

export class ExchangeService {
  private exchanges: Map<string, ExchangeConfig> = new Map();
  private defaultExchange: string = 'binance';

  constructor() {
    this.initializeExchanges();
  }

  private initializeExchanges(): void {
    // Binance Configuration
    this.exchanges.set('binance', {
      id: 'binance',
      name: 'Binance',
      baseUrl: 'https://api.binance.com',
      testnet: false,
      supportedFeatures: ['spot', 'futures', 'margin', 'options']
    });

    // Coinbase Pro Configuration
    this.exchanges.set('coinbase', {
      id: 'coinbase',
      name: 'Coinbase Pro',
      baseUrl: 'https://api.exchange.coinbase.com',
      testnet: false,
      supportedFeatures: ['spot']
    });

    // Kraken Configuration
    this.exchanges.set('kraken', {
      id: 'kraken',
      name: 'Kraken',
      baseUrl: 'https://api.kraken.com',
      testnet: false,
      supportedFeatures: ['spot', 'margin', 'futures']
    });

    // Bybit Configuration
    this.exchanges.set('bybit', {
      id: 'bybit',
      name: 'Bybit',
      baseUrl: 'https://api.bybit.com',
      testnet: false,
      supportedFeatures: ['spot', 'derivatives', 'options']
    });
  }

  // Get available exchanges
  getAvailableExchanges(): ExchangeConfig[] {
    return Array.from(this.exchanges.values());
  }

  // Set exchange credentials
  setExchangeCredentials(exchangeId: string, apiKey: string, secretKey: string): boolean {
    const exchange = this.exchanges.get(exchangeId);
    if (!exchange) return false;

    exchange.apiKey = apiKey;
    exchange.secretKey = secretKey;
    
    // Store credentials securely (in production, use proper encryption)
    localStorage.setItem(`exchange_${exchangeId}_apiKey`, apiKey);
    localStorage.setItem(`exchange_${exchangeId}_secretKey`, secretKey);
    
    return true;
  }

  // Mock trading functions for paper trading
  async createPaperOrder(exchangeId: string, symbol: string, side: 'buy' | 'sell', quantity: number, price?: number): Promise<Order> {
    const orderId = `paper_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Simulate order execution delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 500));
    
    const currentPrice = price || (45000 + Math.random() * 5000); // Mock price
    
    const order: Order = {
      id: orderId,
      symbol,
      side,
      type: price ? 'limit' : 'market',
      quantity,
      price: currentPrice,
      status: 'filled',
      timestamp: Date.now(),
      fees: quantity * currentPrice * 0.001 // 0.1% fee
    };

    // Store order in localStorage for paper trading history
    const paperOrders = JSON.parse(localStorage.getItem('paper_orders') || '[]');
    paperOrders.push(order);
    localStorage.setItem('paper_orders', JSON.stringify(paperOrders));

    return order;
  }

  // Get paper trading orders
  getPaperOrders(): Order[] {
    return JSON.parse(localStorage.getItem('paper_orders') || '[]');
  }

  // Clear paper trading history
  clearPaperTradingHistory(): void {
    localStorage.removeItem('paper_orders');
  }

  // Get mock balances for paper trading
  getPaperBalances(): Balance[] {
    const defaultBalances: Balance[] = [
      { asset: 'USDT', free: 10000, locked: 0, total: 10000 },
      { asset: 'BTC', free: 0, locked: 0, total: 0 },
      { asset: 'ETH', free: 0, locked: 0, total: 0 },
      { asset: 'ADA', free: 0, locked: 0, total: 0 },
      { asset: 'SOL', free: 0, locked: 0, total: 0 }
    ];

    const storedBalances = localStorage.getItem('paper_balances');
    return storedBalances ? JSON.parse(storedBalances) : defaultBalances;
  }

  // Update paper balances after trades
  updatePaperBalances(balances: Balance[]): void {
    localStorage.setItem('paper_balances', JSON.stringify(balances));
  }

  // Get mock order book
  async getOrderBook(exchangeId: string, symbol: string): Promise<OrderBook> {
    // Mock order book data
    const basePrice = 45000;
    const bids: [number, number][] = [];
    const asks: [number, number][] = [];

    // Generate mock bids (below current price)
    for (let i = 0; i < 20; i++) {
      const price = basePrice - (i + 1) * 10;
      const quantity = Math.random() * 5 + 0.1;
      bids.push([price, quantity]);
    }

    // Generate mock asks (above current price)
    for (let i = 0; i < 20; i++) {
      const price = basePrice + (i + 1) * 10;
      const quantity = Math.random() * 5 + 0.1;
      asks.push([price, quantity]);
    }

    return {
      symbol,
      bids: bids.sort((a, b) => b[0] - a[0]), // Sort bids descending
      asks: asks.sort((a, b) => a[0] - b[0]), // Sort asks ascending
      timestamp: Date.now()
    };
  }

  // Binance API integration (public endpoints)
  async getBinanceMarketData(symbol: string = 'BTCUSDT') {
    try {
      const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
      if (!response.ok) throw new Error('Binance API error');
      return await response.json();
    } catch (error) {
      console.error('Binance API error:', error);
      return null;
    }
  }

  // Binance Klines (candlestick data)
  async getBinanceKlines(symbol: string = 'BTCUSDT', interval: string = '1h', limit: number = 100) {
    try {
      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
      );
      if (!response.ok) throw new Error('Binance Klines API error');
      return await response.json();
    } catch (error) {
      console.error('Binance Klines API error:', error);
      return null;
    }
  }

  // Coinbase Pro public market data
  async getCoinbaseMarketData(productId: string = 'BTC-USD') {
    try {
      const response = await fetch(`https://api.exchange.coinbase.com/products/${productId}/ticker`);
      if (!response.ok) throw new Error('Coinbase API error');
      return await response.json();
    } catch (error) {
      console.error('Coinbase API error:', error);
      return null;
    }
  }

  // Exchange rate conversion
  async convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    // Mock conversion rates (in production, use real exchange rate API)
    const rates: Record<string, number> = {
      'USD_AUD': 1.5,
      'AUD_USD': 0.67,
      'BTC_USD': 45000,
      'ETH_USD': 3200,
      'BTC_AUD': 67500,
      'ETH_AUD': 4800
    };

    const rateKey = `${fromCurrency}_${toCurrency}`;
    const rate = rates[rateKey] || 1;
    
    return amount * rate;
  }

  // Portfolio value calculation
  async calculatePortfolioValue(balances: Balance[], baseCurrency: string = 'AUD'): Promise<number> {
    let totalValue = 0;

    for (const balance of balances) {
      if (balance.total > 0) {
        if (balance.asset === baseCurrency) {
          totalValue += balance.total;
        } else {
          const convertedValue = await this.convertCurrency(balance.total, balance.asset, baseCurrency);
          totalValue += convertedValue;
        }
      }
    }

    return totalValue;
  }

  // Risk management checks
  validateOrder(order: Partial<Order>, balance: Balance, maxRiskPerTrade: number = 0.02): { valid: boolean; message: string } {
    if (!order.quantity || order.quantity <= 0) {
      return { valid: false, message: 'Invalid quantity' };
    }

    if (!order.price || order.price <= 0) {
      return { valid: false, message: 'Invalid price' };
    }

    const orderValue = order.quantity * order.price;
    const maxAllowedRisk = balance.total * maxRiskPerTrade;

    if (orderValue > maxAllowedRisk) {
      return { valid: false, message: `Order exceeds maximum risk limit (${(maxRiskPerTrade * 100).toFixed(1)}%)` };
    }

    if (orderValue > balance.free) {
      return { valid: false, message: 'Insufficient balance' };
    }

    return { valid: true, message: 'Order validated successfully' };
  }
}

export const exchangeService = new ExchangeService();
