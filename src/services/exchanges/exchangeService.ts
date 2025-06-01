
interface ExchangeConfig {
  id: string;
  name: string;
  apiKey?: string;
  secretKey?: string;
  passphrase?: string;
  testnet: boolean;
  supportedFeatures: string[];
}

interface PaperBalance {
  asset: string;
  free: number;
  locked: number;
  total: number;
}

interface PaperOrder {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  price?: number;
  status: 'pending' | 'filled' | 'cancelled';
  timestamp: string;
  exchange: string;
}

class ExchangeService {
  private exchanges: ExchangeConfig[] = [
    {
      id: 'binance',
      name: 'Binance',
      testnet: true,
      supportedFeatures: ['spot', 'futures', 'margin', 'staking']
    },
    {
      id: 'coinbase',
      name: 'Coinbase Pro',
      testnet: true,
      supportedFeatures: ['spot', 'staking']
    },
    {
      id: 'kraken',
      name: 'Kraken',
      testnet: true,
      supportedFeatures: ['spot', 'futures', 'margin']
    },
    {
      id: 'kucoin',
      name: 'KuCoin',
      testnet: true,
      supportedFeatures: ['spot', 'futures', 'margin']
    }
  ];

  private paperBalances: PaperBalance[] = [
    { asset: 'USDT', free: 10000, locked: 0, total: 10000 },
    { asset: 'BTC', free: 0.1, locked: 0, total: 0.1 },
    { asset: 'ETH', free: 2.5, locked: 0, total: 2.5 },
    { asset: 'BNB', free: 10, locked: 0, total: 10 }
  ];

  private paperOrders: PaperOrder[] = [];

  getAvailableExchanges(): ExchangeConfig[] {
    return this.exchanges;
  }

  getPaperBalances(): PaperBalance[] {
    return this.paperBalances;
  }

  getPaperOrders(): PaperOrder[] {
    return this.paperOrders;
  }

  async createPaperOrder(
    exchange: string,
    symbol: string,
    side: 'buy' | 'sell',
    quantity: number,
    price?: number
  ): Promise<PaperOrder> {
    const order: PaperOrder = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      symbol,
      side,
      quantity,
      price,
      status: 'filled', // Simulate immediate fill for paper trading
      timestamp: new Date().toISOString(),
      exchange
    };

    this.paperOrders.push(order);

    // Simulate balance updates for paper trading
    if (side === 'buy') {
      const usdtBalance = this.paperBalances.find(b => b.asset === 'USDT');
      const baseAsset = symbol.replace('USDT', '');
      let targetBalance = this.paperBalances.find(b => b.asset === baseAsset);
      
      if (usdtBalance && price) {
        const cost = quantity * price;
        if (usdtBalance.free >= cost) {
          usdtBalance.free -= cost;
          usdtBalance.total = usdtBalance.free + usdtBalance.locked;
          
          if (!targetBalance) {
            targetBalance = { asset: baseAsset, free: 0, locked: 0, total: 0 };
            this.paperBalances.push(targetBalance);
          }
          targetBalance.free += quantity;
          targetBalance.total = targetBalance.free + targetBalance.locked;
        }
      }
    }

    return order;
  }

  clearPaperTradingHistory(): void {
    this.paperOrders = [];
    this.paperBalances = [
      { asset: 'USDT', free: 10000, locked: 0, total: 10000 },
      { asset: 'BTC', free: 0.1, locked: 0, total: 0.1 },
      { asset: 'ETH', free: 2.5, locked: 0, total: 2.5 },
      { asset: 'BNB', free: 10, locked: 0, total: 10 }
    ];
  }

  async testConnection(exchangeId: string): Promise<boolean> {
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Math.random() > 0.1; // 90% success rate
  }

  async getMarketData(symbol: string, exchange?: string): Promise<any> {
    // Simulate market data fetch
    return {
      symbol,
      price: Math.random() * 50000,
      volume: Math.random() * 1000000,
      change24h: (Math.random() - 0.5) * 10
    };
  }
}

export const exchangeService = new ExchangeService();
