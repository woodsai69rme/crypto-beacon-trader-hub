
import { toast } from "@/hooks/use-toast";

interface ExchangeCredentials {
  apiKey: string;
  apiSecret: string;
  passphrase?: string;
  sandbox?: boolean;
}

interface ExchangeAccount {
  id: string;
  name: string;
  exchange: string;
  isConnected: boolean;
  credentials?: ExchangeCredentials;
  balances?: Record<string, number>;
  lastSync?: string;
}

interface OrderRequest {
  symbol: string;
  side: 'buy' | 'sell';
  amount: number;
  price?: number;
  type: 'market' | 'limit' | 'stop';
}

interface OrderResponse {
  orderId: string;
  status: 'pending' | 'filled' | 'cancelled';
  executedAmount: number;
  executedPrice: number;
  timestamp: string;
}

class ExchangeService {
  private accounts: Map<string, ExchangeAccount> = new Map();
  private supportedExchanges = [
    { id: 'binance', name: 'Binance', apiUrl: 'https://api.binance.com' },
    { id: 'coinbase', name: 'Coinbase Pro', apiUrl: 'https://api.pro.coinbase.com' },
    { id: 'kraken', name: 'Kraken', apiUrl: 'https://api.kraken.com' },
    { id: 'bybit', name: 'Bybit', apiUrl: 'https://api.bybit.com' },
    { id: 'okx', name: 'OKX', apiUrl: 'https://www.okx.com/api' },
    { id: 'kucoin', name: 'KuCoin', apiUrl: 'https://api.kucoin.com' }
  ];

  constructor() {
    this.loadStoredAccounts();
  }

  private loadStoredAccounts() {
    try {
      const stored = localStorage.getItem('exchange-accounts');
      if (stored) {
        const accounts = JSON.parse(stored);
        accounts.forEach((account: ExchangeAccount) => {
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
      localStorage.setItem('exchange-accounts', JSON.stringify(accounts));
    } catch (error) {
      console.error('Failed to save accounts:', error);
    }
  }

  async connectExchange(
    exchangeId: string,
    credentials: ExchangeCredentials,
    accountName?: string
  ): Promise<string> {
    const exchange = this.supportedExchanges.find(e => e.id === exchangeId);
    if (!exchange) {
      throw new Error(`Unsupported exchange: ${exchangeId}`);
    }

    // Validate credentials by testing API connection
    const isValid = await this.validateCredentials(exchangeId, credentials);
    if (!isValid) {
      throw new Error('Invalid API credentials');
    }

    const accountId = `${exchangeId}-${Date.now()}`;
    const account: ExchangeAccount = {
      id: accountId,
      name: accountName || `${exchange.name} Account`,
      exchange: exchangeId,
      isConnected: true,
      credentials,
      lastSync: new Date().toISOString()
    };

    // Fetch initial balances
    account.balances = await this.fetchBalances(exchangeId, credentials);

    this.accounts.set(accountId, account);
    this.saveAccounts();

    toast({
      title: "Exchange Connected",
      description: `Successfully connected to ${exchange.name}`,
    });

    return accountId;
  }

  async disconnectExchange(accountId: string): Promise<void> {
    const account = this.accounts.get(accountId);
    if (account) {
      account.isConnected = false;
      account.credentials = undefined;
      this.accounts.set(accountId, account);
      this.saveAccounts();

      toast({
        title: "Exchange Disconnected",
        description: `Disconnected from ${account.name}`,
      });
    }
  }

  async placeOrder(accountId: string, order: OrderRequest): Promise<OrderResponse> {
    const account = this.accounts.get(accountId);
    if (!account || !account.isConnected || !account.credentials) {
      throw new Error('Exchange account not connected');
    }

    // This is a mock implementation - real implementation would use exchange APIs
    const mockResponse: OrderResponse = {
      orderId: `order-${Date.now()}`,
      status: 'pending',
      executedAmount: 0,
      executedPrice: 0,
      timestamp: new Date().toISOString()
    };

    // Simulate order execution
    setTimeout(() => {
      mockResponse.status = 'filled';
      mockResponse.executedAmount = order.amount;
      mockResponse.executedPrice = order.price || 50000; // Mock price

      toast({
        title: "Order Executed",
        description: `${order.side.toUpperCase()} order for ${order.amount} ${order.symbol} executed`,
      });
    }, 2000);

    return mockResponse;
  }

  async fetchBalances(exchangeId: string, credentials: ExchangeCredentials): Promise<Record<string, number>> {
    // Mock implementation - real implementation would call exchange APIs
    const mockBalances: Record<string, number> = {
      'AUD': 10000,
      'BTC': 0.5,
      'ETH': 2.5,
      'ADA': 1000,
      'SOL': 25,
      'DOT': 100
    };

    return mockBalances;
  }

  async syncAccount(accountId: string): Promise<void> {
    const account = this.accounts.get(accountId);
    if (!account || !account.isConnected || !account.credentials) {
      throw new Error('Exchange account not connected');
    }

    try {
      account.balances = await this.fetchBalances(account.exchange, account.credentials);
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

  private async validateCredentials(exchangeId: string, credentials: ExchangeCredentials): Promise<boolean> {
    // Mock validation - real implementation would test API connection
    return credentials.apiKey.length > 10 && credentials.apiSecret.length > 10;
  }

  getAccount(accountId: string): ExchangeAccount | undefined {
    return this.accounts.get(accountId);
  }

  getAllAccounts(): ExchangeAccount[] {
    return Array.from(this.accounts.values());
  }

  getConnectedAccounts(): ExchangeAccount[] {
    return Array.from(this.accounts.values()).filter(account => account.isConnected);
  }

  getSupportedExchanges() {
    return this.supportedExchanges;
  }

  async getOrderHistory(accountId: string): Promise<OrderResponse[]> {
    // Mock implementation
    return [
      {
        orderId: 'order-1',
        status: 'filled',
        executedAmount: 0.1,
        executedPrice: 58000,
        timestamp: new Date(Date.now() - 86400000).toISOString()
      },
      {
        orderId: 'order-2',
        status: 'filled',
        executedAmount: 1.0,
        executedPrice: 3100,
        timestamp: new Date(Date.now() - 43200000).toISOString()
      }
    ];
  }
}

export const exchangeService = new ExchangeService();
