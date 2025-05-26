
import { toast } from "@/hooks/use-toast";

interface ExchangeConfig {
  id: string;
  name: string;
  apiUrl: string;
  sandboxUrl: string;
  supportedOrderTypes: string[];
  feeStructure: {
    maker: number;
    taker: number;
  };
  withdrawalFees: Record<string, number>;
  minOrderSizes: Record<string, number>;
}

interface TradingAccount {
  id: string;
  exchangeId: string;
  name: string;
  apiKey: string;
  apiSecret: string;
  passphrase?: string;
  isActive: boolean;
  isSandbox: boolean;
  balances: Record<string, number>;
  lastSync: string;
  totalValue: number; // in AUD
}

interface OrderRequest {
  accountId: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop' | 'stop_limit';
  amount: number;
  price?: number;
  stopPrice?: number;
  timeInForce?: 'GTC' | 'IOC' | 'FOK';
  reduceOnly?: boolean;
}

interface Order {
  id: string;
  accountId: string;
  exchangeOrderId: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: string;
  amount: number;
  price?: number;
  stopPrice?: number;
  filledAmount: number;
  averagePrice: number;
  status: 'pending' | 'open' | 'filled' | 'cancelled' | 'rejected';
  fees: number;
  timestamp: string;
  updatedAt: string;
}

interface Position {
  symbol: string;
  side: 'long' | 'short';
  size: number;
  entryPrice: number;
  markPrice: number;
  unrealizedPnl: number;
  realizedPnl: number;
  margin: number;
  percentage: number;
}

class RealTradingEngine {
  private exchanges: Map<string, ExchangeConfig> = new Map();
  private accounts: Map<string, TradingAccount> = new Map();
  private orders: Map<string, Order> = new Map();
  private positions: Map<string, Position[]> = new Map();
  private priceCache: Map<string, { price: number; timestamp: number }> = new Map();
  private audConversionRate = 1.52; // Mock AUD/USD rate

  constructor() {
    this.initializeExchanges();
    this.loadStoredAccounts();
    this.startPriceUpdates();
  }

  private initializeExchanges() {
    const exchanges: ExchangeConfig[] = [
      {
        id: 'binance',
        name: 'Binance',
        apiUrl: 'https://api.binance.com',
        sandboxUrl: 'https://testnet.binance.vision',
        supportedOrderTypes: ['market', 'limit', 'stop_loss', 'stop_loss_limit', 'take_profit', 'take_profit_limit'],
        feeStructure: { maker: 0.001, taker: 0.001 },
        withdrawalFees: { BTC: 0.0005, ETH: 0.005, ADA: 1.0 },
        minOrderSizes: { BTCUSDT: 0.00001, ETHUSDT: 0.0001, ADAUSDT: 1 }
      },
      {
        id: 'coinbase',
        name: 'Coinbase Pro',
        apiUrl: 'https://api.pro.coinbase.com',
        sandboxUrl: 'https://api-public.sandbox.pro.coinbase.com',
        supportedOrderTypes: ['market', 'limit', 'stop'],
        feeStructure: { maker: 0.005, taker: 0.005 },
        withdrawalFees: { BTC: 0.0005, ETH: 0.005, ADA: 0.5 },
        minOrderSizes: { 'BTC-USD': 0.001, 'ETH-USD': 0.01, 'ADA-USD': 1 }
      },
      {
        id: 'kraken',
        name: 'Kraken',
        apiUrl: 'https://api.kraken.com',
        sandboxUrl: 'https://api.kraken.com', // Kraken doesn't have sandbox
        supportedOrderTypes: ['market', 'limit', 'stop-loss', 'take-profit'],
        feeStructure: { maker: 0.0016, taker: 0.0026 },
        withdrawalFees: { BTC: 0.00015, ETH: 0.005, ADA: 0.5 },
        minOrderSizes: { XXBTZUSD: 0.0001, XETHZUSD: 0.001, ADAUSD: 1 }
      },
      {
        id: 'kucoin',
        name: 'KuCoin',
        apiUrl: 'https://api.kucoin.com',
        sandboxUrl: 'https://openapi-sandbox.kucoin.com',
        supportedOrderTypes: ['market', 'limit', 'stop'],
        feeStructure: { maker: 0.001, taker: 0.001 },
        withdrawalFees: { BTC: 0.0005, ETH: 0.005, ADA: 1.0 },
        minOrderSizes: { 'BTC-USDT': 0.00001, 'ETH-USDT': 0.0001, 'ADA-USDT': 1 }
      },
      {
        id: 'bybit',
        name: 'Bybit',
        apiUrl: 'https://api.bybit.com',
        sandboxUrl: 'https://api-testnet.bybit.com',
        supportedOrderTypes: ['market', 'limit', 'conditional'],
        feeStructure: { maker: -0.00025, taker: 0.00075 }, // Negative maker fees
        withdrawalFees: { BTC: 0.0005, ETH: 0.005, ADA: 1.0 },
        minOrderSizes: { BTCUSD: 1, ETHUSD: 1, ADAUSD: 1 }
      }
    ];

    exchanges.forEach(exchange => {
      this.exchanges.set(exchange.id, exchange);
    });
  }

  private loadStoredAccounts() {
    try {
      const stored = localStorage.getItem('trading-accounts');
      if (stored) {
        const accounts = JSON.parse(stored);
        accounts.forEach((account: TradingAccount) => {
          this.accounts.set(account.id, account);
        });
      }
    } catch (error) {
      console.error('Failed to load stored accounts:', error);
    }
  }

  private saveAccounts() {
    try {
      const accounts = Array.from(this.accounts.values());
      localStorage.setItem('trading-accounts', JSON.stringify(accounts));
    } catch (error) {
      console.error('Failed to save accounts:', error);
    }
  }

  private startPriceUpdates() {
    // Simulate real-time price updates
    setInterval(() => {
      this.updatePrices();
    }, 5000);
  }

  private async updatePrices() {
    const symbols = ['BTC', 'ETH', 'ADA', 'SOL', 'DOT', 'LINK'];
    
    for (const symbol of symbols) {
      // Mock price updates with realistic movements
      const currentPrice = this.priceCache.get(symbol)?.price || this.getBasePrice(symbol);
      const change = (Math.random() - 0.5) * 0.02; // ±1% movement
      const newPrice = currentPrice * (1 + change);
      
      this.priceCache.set(symbol, {
        price: newPrice,
        timestamp: Date.now()
      });
    }
  }

  private getBasePrice(symbol: string): number {
    const basePrices: Record<string, number> = {
      BTC: 95000 * this.audConversionRate,
      ETH: 3500 * this.audConversionRate,
      ADA: 0.85 * this.audConversionRate,
      SOL: 180 * this.audConversionRate,
      DOT: 6.5 * this.audConversionRate,
      LINK: 15 * this.audConversionRate
    };
    return basePrices[symbol] || 100 * this.audConversionRate;
  }

  async connectExchange(
    exchangeId: string,
    credentials: {
      apiKey: string;
      apiSecret: string;
      passphrase?: string;
    },
    accountName: string,
    isSandbox: boolean = false
  ): Promise<string> {
    const exchange = this.exchanges.get(exchangeId);
    if (!exchange) {
      throw new Error(`Unsupported exchange: ${exchangeId}`);
    }

    // Validate credentials
    const isValid = await this.validateCredentials(exchangeId, credentials, isSandbox);
    if (!isValid) {
      throw new Error('Invalid API credentials');
    }

    const accountId = `${exchangeId}-${Date.now()}`;
    const account: TradingAccount = {
      id: accountId,
      exchangeId,
      name: accountName,
      apiKey: credentials.apiKey,
      apiSecret: credentials.apiSecret,
      passphrase: credentials.passphrase,
      isActive: true,
      isSandbox,
      balances: {},
      lastSync: new Date().toISOString(),
      totalValue: 0
    };

    // Fetch initial balances
    await this.syncAccountBalances(accountId);

    this.accounts.set(accountId, account);
    this.saveAccounts();

    toast({
      title: "Exchange Connected",
      description: `Successfully connected to ${exchange.name}${isSandbox ? ' (Sandbox)' : ''}`,
    });

    return accountId;
  }

  async validateCredentials(
    exchangeId: string,
    credentials: any,
    isSandbox: boolean
  ): Promise<boolean> {
    // Mock validation - in production, test API connection
    const minKeyLength = 20;
    return credentials.apiKey.length >= minKeyLength && 
           credentials.apiSecret.length >= minKeyLength;
  }

  async syncAccountBalances(accountId: string): Promise<void> {
    const account = this.accounts.get(accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    try {
      // Mock balance fetching - in production, call exchange APIs
      const mockBalances = await this.fetchBalancesFromExchange(account);
      
      account.balances = mockBalances;
      account.totalValue = this.calculateTotalValue(mockBalances);
      account.lastSync = new Date().toISOString();
      
      this.accounts.set(accountId, account);
      this.saveAccounts();

      toast({
        title: "Account Synced",
        description: `${account.name} balances updated`,
      });
    } catch (error) {
      console.error('Failed to sync account:', error);
      toast({
        title: "Sync Failed",
        description: `Failed to sync ${account.name}`,
        variant: "destructive",
      });
    }
  }

  private async fetchBalancesFromExchange(account: TradingAccount): Promise<Record<string, number>> {
    // Mock implementation - replace with actual exchange API calls
    const baseBalances: Record<string, number> = {
      AUD: 10000 + Math.random() * 5000,
      BTC: Math.random() * 0.5,
      ETH: Math.random() * 5,
      ADA: Math.random() * 1000,
      SOL: Math.random() * 50,
      DOT: Math.random() * 100,
      LINK: Math.random() * 200
    };

    // Add some variance based on exchange
    const multiplier = account.exchangeId === 'binance' ? 1.2 : 
                      account.exchangeId === 'coinbase' ? 0.8 : 1.0;

    Object.keys(baseBalances).forEach(asset => {
      if (asset !== 'AUD') {
        baseBalances[asset] *= multiplier;
      }
    });

    return baseBalances;
  }

  private calculateTotalValue(balances: Record<string, number>): number {
    let total = balances.AUD || 0;
    
    Object.entries(balances).forEach(([asset, amount]) => {
      if (asset !== 'AUD' && amount > 0) {
        const price = this.priceCache.get(asset)?.price || this.getBasePrice(asset);
        total += amount * price;
      }
    });
    
    return total;
  }

  async placeOrder(orderRequest: OrderRequest): Promise<Order> {
    const account = this.accounts.get(orderRequest.accountId);
    if (!account || !account.isActive) {
      throw new Error('Account not found or inactive');
    }

    const exchange = this.exchanges.get(account.exchangeId);
    if (!exchange) {
      throw new Error('Exchange configuration not found');
    }

    // Validate order
    this.validateOrder(orderRequest, account, exchange);

    // Calculate order details
    const currentPrice = this.getCurrentPrice(orderRequest.symbol);
    const orderPrice = orderRequest.type === 'market' ? currentPrice : (orderRequest.price || currentPrice);
    const orderValue = orderRequest.amount * orderPrice;
    const fees = this.calculateFees(orderRequest, exchange, orderValue);

    // Check balance
    if (orderRequest.side === 'buy') {
      const audBalance = account.balances.AUD || 0;
      if (orderValue + fees > audBalance) {
        throw new Error('Insufficient AUD balance');
      }
    } else {
      const assetBalance = account.balances[orderRequest.symbol] || 0;
      if (orderRequest.amount > assetBalance) {
        throw new Error(`Insufficient ${orderRequest.symbol} balance`);
      }
    }

    // Create order
    const orderId = `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const order: Order = {
      id: orderId,
      accountId: orderRequest.accountId,
      exchangeOrderId: `exchange-${orderId}`,
      symbol: orderRequest.symbol,
      side: orderRequest.side,
      type: orderRequest.type,
      amount: orderRequest.amount,
      price: orderRequest.price,
      stopPrice: orderRequest.stopPrice,
      filledAmount: 0,
      averagePrice: 0,
      status: 'pending',
      fees: 0,
      timestamp: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.orders.set(orderId, order);

    // Simulate order execution
    setTimeout(() => {
      this.executeOrder(orderId);
    }, 1000 + Math.random() * 2000); // 1-3 second delay

    toast({
      title: "Order Placed",
      description: `${orderRequest.side.toUpperCase()} order for ${orderRequest.amount} ${orderRequest.symbol} placed`,
    });

    return order;
  }

  private validateOrder(orderRequest: OrderRequest, account: TradingAccount, exchange: ExchangeConfig): void {
    // Check order type support
    if (!exchange.supportedOrderTypes.includes(orderRequest.type)) {
      throw new Error(`Order type ${orderRequest.type} not supported by ${exchange.name}`);
    }

    // Check minimum order size
    const minSize = exchange.minOrderSizes[`${orderRequest.symbol}USDT`] || 
                   exchange.minOrderSizes[`${orderRequest.symbol}-USD`] || 
                   0.00001;
    
    if (orderRequest.amount < minSize) {
      throw new Error(`Order amount below minimum size of ${minSize}`);
    }

    // Validate limit order price
    if (orderRequest.type === 'limit' && !orderRequest.price) {
      throw new Error('Limit orders require a price');
    }

    // Validate stop order price
    if ((orderRequest.type === 'stop' || orderRequest.type === 'stop_limit') && !orderRequest.stopPrice) {
      throw new Error('Stop orders require a stop price');
    }
  }

  private getCurrentPrice(symbol: string): number {
    const cached = this.priceCache.get(symbol);
    if (cached && Date.now() - cached.timestamp < 10000) { // 10 second cache
      return cached.price;
    }
    return this.getBasePrice(symbol);
  }

  private calculateFees(orderRequest: OrderRequest, exchange: ExchangeConfig, orderValue: number): number {
    const feeRate = orderRequest.type === 'market' ? exchange.feeStructure.taker : exchange.feeStructure.maker;
    return Math.abs(orderValue * feeRate);
  }

  private async executeOrder(orderId: string): Promise<void> {
    const order = this.orders.get(orderId);
    if (!order) return;

    const account = this.accounts.get(order.accountId);
    if (!account) return;

    try {
      // Simulate order execution
      const executionPrice = this.getCurrentPrice(order.symbol);
      const slippage = order.type === 'market' ? (Math.random() - 0.5) * 0.002 : 0; // ±0.1% slippage for market orders
      const finalPrice = executionPrice * (1 + slippage);
      
      // Update order
      order.status = 'filled';
      order.filledAmount = order.amount;
      order.averagePrice = finalPrice;
      order.fees = this.calculateFees(
        { ...order, price: finalPrice } as OrderRequest,
        this.exchanges.get(account.exchangeId)!,
        order.amount * finalPrice
      );
      order.updatedAt = new Date().toISOString();

      // Update account balances
      if (order.side === 'buy') {
        const totalCost = order.amount * finalPrice + order.fees;
        account.balances.AUD = (account.balances.AUD || 0) - totalCost;
        account.balances[order.symbol] = (account.balances[order.symbol] || 0) + order.amount;
      } else {
        const totalReceived = order.amount * finalPrice - order.fees;
        account.balances.AUD = (account.balances.AUD || 0) + totalReceived;
        account.balances[order.symbol] = (account.balances[order.symbol] || 0) - order.amount;
      }

      account.totalValue = this.calculateTotalValue(account.balances);
      account.lastSync = new Date().toISOString();

      this.orders.set(orderId, order);
      this.accounts.set(order.accountId, account);
      this.saveAccounts();

      toast({
        title: "Order Executed",
        description: `${order.side.toUpperCase()} ${order.amount} ${order.symbol} at ${finalPrice.toFixed(2)} AUD`,
      });

    } catch (error) {
      console.error('Order execution failed:', error);
      
      order.status = 'rejected';
      order.updatedAt = new Date().toISOString();
      this.orders.set(orderId, order);

      toast({
        title: "Order Failed",
        description: `Failed to execute order: ${error.message}`,
        variant: "destructive",
      });
    }
  }

  async cancelOrder(orderId: string): Promise<boolean> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status !== 'open' && order.status !== 'pending') {
      throw new Error('Order cannot be cancelled');
    }

    order.status = 'cancelled';
    order.updatedAt = new Date().toISOString();
    this.orders.set(orderId, order);

    toast({
      title: "Order Cancelled",
      description: `Order ${orderId} has been cancelled`,
    });

    return true;
  }

  async getPositions(accountId: string): Promise<Position[]> {
    const account = this.accounts.get(accountId);
    if (!account) return [];

    const positions: Position[] = [];
    
    Object.entries(account.balances).forEach(([symbol, amount]) => {
      if (symbol !== 'AUD' && amount > 0) {
        const currentPrice = this.getCurrentPrice(symbol);
        const entryPrice = currentPrice * (0.95 + Math.random() * 0.1); // Mock entry price
        const unrealizedPnl = (currentPrice - entryPrice) * amount;
        
        positions.push({
          symbol,
          side: 'long',
          size: amount,
          entryPrice,
          markPrice: currentPrice,
          unrealizedPnl,
          realizedPnl: 0, // Mock - would track from order history
          margin: 0, // Spot trading
          percentage: (unrealizedPnl / (entryPrice * amount)) * 100
        });
      }
    });

    return positions;
  }

  // Portfolio analysis methods
  async getPortfolioAnalysis(accountId: string): Promise<{
    totalValue: number;
    dayChange: number;
    weekChange: number;
    monthChange: number;
    allocation: Record<string, number>;
    riskMetrics: {
      volatility: number;
      sharpeRatio: number;
      maxDrawdown: number;
      beta: number;
    };
  }> {
    const account = this.accounts.get(accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    const allocation: Record<string, number> = {};
    const totalValue = account.totalValue;

    Object.entries(account.balances).forEach(([asset, amount]) => {
      if (amount > 0) {
        const value = asset === 'AUD' ? amount : amount * this.getCurrentPrice(asset);
        allocation[asset] = (value / totalValue) * 100;
      }
    });

    // Mock performance calculations
    const dayChange = (Math.random() - 0.5) * 0.1; // ±5%
    const weekChange = (Math.random() - 0.5) * 0.2; // ±10%
    const monthChange = (Math.random() - 0.5) * 0.4; // ±20%

    return {
      totalValue,
      dayChange,
      weekChange,
      monthChange,
      allocation,
      riskMetrics: {
        volatility: 0.15 + Math.random() * 0.1, // 15-25%
        sharpeRatio: 0.5 + Math.random() * 1.5, // 0.5-2.0
        maxDrawdown: -(0.05 + Math.random() * 0.15), // -5% to -20%
        beta: 0.8 + Math.random() * 0.4 // 0.8-1.2
      }
    };
  }

  // Getters
  getAccount(accountId: string): TradingAccount | undefined {
    return this.accounts.get(accountId);
  }

  getAllAccounts(): TradingAccount[] {
    return Array.from(this.accounts.values());
  }

  getActiveAccounts(): TradingAccount[] {
    return Array.from(this.accounts.values()).filter(account => account.isActive);
  }

  getOrder(orderId: string): Order | undefined {
    return this.orders.get(orderId);
  }

  getOrderHistory(accountId?: string): Order[] {
    let orders = Array.from(this.orders.values());
    if (accountId) {
      orders = orders.filter(order => order.accountId === accountId);
    }
    return orders.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  getExchanges(): ExchangeConfig[] {
    return Array.from(this.exchanges.values());
  }

  getCurrentPrices(): Record<string, number> {
    const prices: Record<string, number> = {};
    this.priceCache.forEach((data, symbol) => {
      prices[symbol] = data.price;
    });
    return prices;
  }
}

export const realTradingEngine = new RealTradingEngine();
export default realTradingEngine;
