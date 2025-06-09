
import { CoinOption, Trade } from '@/types/trading';

interface ExchangeInfo {
  id: string;
  name: string;
  countries: string[];
  rateLimit: number;
  certified: boolean;
  pro: boolean;
  has: {
    spot: boolean;
    margin: boolean;
    futures: boolean;
    option: boolean;
  };
  urls: {
    logo: string;
    www: string;
    api: string;
  };
}

interface ExchangeBalance {
  currency: string;
  free: number;
  used: number;
  total: number;
}

class ExchangeConnectorService {
  private supportedExchanges: ExchangeInfo[] = [
    {
      id: 'binance',
      name: 'Binance',
      countries: ['MT'],
      rateLimit: 1200,
      certified: true,
      pro: true,
      has: { spot: true, margin: true, futures: true, option: false },
      urls: {
        logo: 'https://user-images.githubusercontent.com/1294454/29604020-d5483cdc-87ee-11e7-94c7-d1a37b6b0f5f.jpg',
        www: 'https://www.binance.com',
        api: 'https://api.binance.com'
      }
    },
    {
      id: 'coinbase',
      name: 'Coinbase Pro',
      countries: ['US'],
      rateLimit: 10000,
      certified: true,
      pro: true,
      has: { spot: true, margin: false, futures: false, option: false },
      urls: {
        logo: 'https://user-images.githubusercontent.com/1294454/41764625-63b7ffde-760a-11e8-996d-a6328fa9347a.jpg',
        www: 'https://pro.coinbase.com',
        api: 'https://api.pro.coinbase.com'
      }
    },
    {
      id: 'kraken',
      name: 'Kraken',
      countries: ['US'],
      rateLimit: 3000,
      certified: true,
      pro: true,
      has: { spot: true, margin: true, futures: true, option: false },
      urls: {
        logo: 'https://user-images.githubusercontent.com/1294454/27766599-22709304-5ede-11e7-9de1-9f33732e5609.jpg',
        www: 'https://www.kraken.com',
        api: 'https://api.kraken.com'
      }
    },
    {
      id: 'bybit',
      name: 'Bybit',
      countries: ['VG'],
      rateLimit: 100,
      certified: true,
      pro: true,
      has: { spot: true, margin: false, futures: true, option: false },
      urls: {
        logo: 'https://user-images.githubusercontent.com/1294454/67288762-2f04a600-f4e6-11e9-9fd6-c60641919491.jpg',
        www: 'https://www.bybit.com',
        api: 'https://api.bybit.com'
      }
    },
    {
      id: 'okx',
      name: 'OKX',
      countries: ['CN', 'US'],
      rateLimit: 100,
      certified: true,
      pro: true,
      has: { spot: true, margin: true, futures: true, option: true },
      urls: {
        logo: 'https://user-images.githubusercontent.com/1294454/152485636-38b19e4a-bece-4dec-979a-5982859ffc04.jpg',
        www: 'https://www.okx.com',
        api: 'https://www.okx.com'
      }
    },
    {
      id: 'kucoin',
      name: 'KuCoin',
      countries: ['SC'],
      rateLimit: 334,
      certified: true,
      pro: true,
      has: { spot: true, margin: true, futures: true, option: false },
      urls: {
        logo: 'https://user-images.githubusercontent.com/1294454/57369448-3cc3aa80-7196-11e9-883e-5ebeb35e4f57.jpg',
        www: 'https://www.kucoin.com',
        api: 'https://api.kucoin.com'
      }
    }
  ];

  private connectedExchanges: Map<string, any> = new Map();

  async getSupportedExchanges(): Promise<ExchangeInfo[]> {
    return this.supportedExchanges;
  }

  async connectExchange(exchangeId: string, apiKey: string, secret: string, sandbox: boolean = true): Promise<boolean> {
    try {
      // In production, would use actual CCXT library
      const mockExchange = {
        id: exchangeId,
        name: this.supportedExchanges.find(e => e.id === exchangeId)?.name || exchangeId,
        apiKey,
        secret,
        sandbox,
        connected: true,
        connectedAt: new Date().toISOString()
      };

      this.connectedExchanges.set(exchangeId, mockExchange);
      console.log(`Connected to ${exchangeId} exchange`);
      return true;
    } catch (error) {
      console.error(`Failed to connect to ${exchangeId}:`, error);
      return false;
    }
  }

  async disconnectExchange(exchangeId: string): Promise<boolean> {
    return this.connectedExchanges.delete(exchangeId);
  }

  async getExchangeBalance(exchangeId: string): Promise<ExchangeBalance[]> {
    const exchange = this.connectedExchanges.get(exchangeId);
    if (!exchange) throw new Error(`Exchange ${exchangeId} not connected`);

    // Mock balances
    return [
      { currency: 'BTC', free: 0.5, used: 0.1, total: 0.6 },
      { currency: 'ETH', free: 5.2, used: 1.8, total: 7.0 },
      { currency: 'USDT', free: 10000, used: 2000, total: 12000 },
      { currency: 'AUD', free: 5000, used: 1000, total: 6000 }
    ];
  }

  async getExchangeMarkets(exchangeId: string): Promise<CoinOption[]> {
    const exchange = this.connectedExchanges.get(exchangeId);
    if (!exchange) throw new Error(`Exchange ${exchangeId} not connected`);

    // Mock markets
    return [
      {
        id: 'BTC/USDT',
        name: 'Bitcoin',
        symbol: 'BTC',
        price: 104000,
        value: 'BTC/USDT',
        label: 'Bitcoin (BTC/USDT)',
        changePercent: 2.5,
        volume: 1500000000
      },
      {
        id: 'ETH/USDT',
        name: 'Ethereum',
        symbol: 'ETH',
        price: 3800,
        value: 'ETH/USDT',
        label: 'Ethereum (ETH/USDT)',
        changePercent: 1.8,
        volume: 800000000
      },
      {
        id: 'ALGO/USDT',
        name: 'Algorand',
        symbol: 'ALGO',
        price: 0.48,
        value: 'ALGO/USDT',
        label: 'Algorand (ALGO/USDT)',
        changePercent: -0.5,
        volume: 45000000
      }
    ];
  }

  async placeOrder(
    exchangeId: string, 
    symbol: string, 
    type: 'market' | 'limit', 
    side: 'buy' | 'sell', 
    amount: number, 
    price?: number
  ): Promise<any> {
    const exchange = this.connectedExchanges.get(exchangeId);
    if (!exchange) throw new Error(`Exchange ${exchangeId} not connected`);

    // Mock order placement
    const order = {
      id: `${exchangeId}-${Date.now()}`,
      symbol,
      type,
      side,
      amount,
      price: price || 0,
      filled: 0,
      remaining: amount,
      status: 'open',
      timestamp: new Date().toISOString(),
      exchange: exchangeId
    };

    console.log(`Placed ${side} order for ${amount} ${symbol} on ${exchangeId}`);
    return order;
  }

  async getOrderHistory(exchangeId: string, symbol?: string): Promise<any[]> {
    const exchange = this.connectedExchanges.get(exchangeId);
    if (!exchange) throw new Error(`Exchange ${exchangeId} not connected`);

    // Mock order history
    return [
      {
        id: `${exchangeId}-1`,
        symbol: 'BTC/USDT',
        type: 'market',
        side: 'buy',
        amount: 0.01,
        price: 103500,
        filled: 0.01,
        status: 'closed',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `${exchangeId}-2`,
        symbol: 'ETH/USDT',
        type: 'limit',
        side: 'sell',
        amount: 1,
        price: 3800,
        filled: 1,
        status: 'closed',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      }
    ];
  }

  async getArbitrageOpportunities(): Promise<any[]> {
    const opportunities = [];
    const exchanges = Array.from(this.connectedExchanges.keys());

    if (exchanges.length < 2) return opportunities;

    // Mock arbitrage opportunities
    opportunities.push({
      symbol: 'BTC/USDT',
      buyExchange: exchanges[0],
      sellExchange: exchanges[1],
      buyPrice: 103800,
      sellPrice: 104200,
      spread: 400,
      spreadPercent: 0.39,
      maxAmount: 0.5,
      estimatedProfit: 200
    });

    return opportunities;
  }

  async getConnectedExchanges(): Promise<string[]> {
    return Array.from(this.connectedExchanges.keys());
  }

  async syncPortfolioFromExchanges(): Promise<any> {
    const portfolio = { totalValue: 0, assets: [], exchanges: {} };

    for (const [exchangeId, exchange] of this.connectedExchanges) {
      try {
        const balances = await this.getExchangeBalance(exchangeId);
        const exchangeValue = balances.reduce((total, balance) => {
          // Mock price conversion
          const price = balance.currency === 'BTC' ? 104000 : 
                       balance.currency === 'ETH' ? 3800 : 1;
          return total + (balance.total * price);
        }, 0);

        portfolio.totalValue += exchangeValue;
        (portfolio.exchanges as any)[exchangeId] = {
          balances,
          value: exchangeValue
        };
      } catch (error) {
        console.error(`Error syncing ${exchangeId}:`, error);
      }
    }

    return portfolio;
  }
}

export const exchangeConnectorService = new ExchangeConnectorService();
export default exchangeConnectorService;
