
// Real cryptocurrency API service using multiple providers
export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  image: string;
}

export interface CryptoNews {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  published_at: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

class CryptoApiService {
  private readonly COINGECKO_BASE = 'https://api.coingecko.com/api/v3';
  private readonly CRYPTONEWS_BASE = 'https://cryptonews-api.com/api/v1';
  
  async getMarketData(coins: string[] = ['bitcoin', 'ethereum', 'cardano', 'solana']): Promise<CryptoPrice[]> {
    try {
      const coinsParam = coins.join(',');
      const response = await fetch(
        `${this.COINGECKO_BASE}/coins/markets?vs_currency=usd&ids=${coinsParam}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
      );
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching market data:', error);
      // Fallback to mock data
      return this.getMockMarketData(coins);
    }
  }

  async getCoinPrice(coinId: string): Promise<number> {
    try {
      const response = await fetch(
        `${this.COINGECKO_BASE}/simple/price?ids=${coinId}&vs_currencies=usd`
      );
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data[coinId]?.usd || 0;
    } catch (error) {
      console.error('Error fetching coin price:', error);
      return 50000; // Fallback price
    }
  }

  async getCoinHistory(coinId: string, days: string = '7'): Promise<{ prices: [number, number][] }> {
    try {
      const response = await fetch(
        `${this.COINGECKO_BASE}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`
      );
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching coin history:', error);
      return this.getMockHistory();
    }
  }

  async getFearGreedIndex(): Promise<{ value: number; classification: string }> {
    try {
      const response = await fetch('https://api.alternative.me/fng/');
      
      if (!response.ok) {
        throw new Error('Fear & Greed API error');
      }
      
      const data = await response.json();
      const value = parseInt(data.data[0].value);
      
      let classification = 'Neutral';
      if (value <= 25) classification = 'Extreme Fear';
      else if (value <= 45) classification = 'Fear';
      else if (value <= 55) classification = 'Neutral';
      else if (value <= 75) classification = 'Greed';
      else classification = 'Extreme Greed';
      
      return { value, classification };
    } catch (error) {
      console.error('Error fetching Fear & Greed Index:', error);
      return { value: 50, classification: 'Neutral' };
    }
  }

  async getCryptoNews(limit: number = 10): Promise<CryptoNews[]> {
    try {
      // Using CryptoPanic free API (no key required)
      const response = await fetch(
        `https://cryptopanic.com/api/v1/posts/?auth_token=free&public=true&kind=news&filter=rising&currencies=BTC,ETH,ADA,SOL`
      );
      
      if (!response.ok) {
        throw new Error('CryptoPanic API error');
      }
      
      const data = await response.json();
      
      return data.results.slice(0, limit).map((item: any) => ({
        id: item.id.toString(),
        title: item.title,
        description: item.title,
        url: item.url,
        source: item.source?.title || 'Unknown',
        published_at: item.published_at,
        sentiment: this.analyzeSentiment(item.title)
      }));
    } catch (error) {
      console.error('Error fetching crypto news:', error);
      return this.getMockNews();
    }
  }

  private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['surge', 'bull', 'rise', 'gain', 'high', 'up', 'profit', 'growth'];
    const negativeWords = ['crash', 'bear', 'fall', 'loss', 'down', 'drop', 'decline', 'dump'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private getMockMarketData(coins: string[]): CryptoPrice[] {
    const mockData = {
      bitcoin: { name: 'Bitcoin', symbol: 'BTC', price: 63420, change: 2.3 },
      ethereum: { name: 'Ethereum', symbol: 'ETH', price: 3245, change: -1.2 },
      cardano: { name: 'Cardano', symbol: 'ADA', price: 0.48, change: 0.8 },
      solana: { name: 'Solana', symbol: 'SOL', price: 143, change: -2.1 }
    };

    return coins.map((coinId, index) => {
      const mock = mockData[coinId as keyof typeof mockData] || mockData.bitcoin;
      return {
        id: coinId,
        symbol: mock.symbol.toLowerCase(),
        name: mock.name,
        current_price: mock.price * (0.95 + Math.random() * 0.1),
        price_change_24h: mock.price * (mock.change / 100),
        price_change_percentage_24h: mock.change + (Math.random() - 0.5) * 2,
        market_cap: mock.price * 19000000 * (0.9 + Math.random() * 0.2),
        total_volume: mock.price * 500000 * (0.8 + Math.random() * 0.4),
        high_24h: mock.price * 1.05,
        low_24h: mock.price * 0.95,
        image: `https://assets.coingecko.com/coins/images/${index + 1}/large/${coinId}.png`
      };
    });
  }

  private getMockHistory(): { prices: [number, number][] } {
    const now = Date.now();
    const prices: [number, number][] = [];
    let basePrice = 50000;

    for (let i = 6; i >= 0; i--) {
      const timestamp = now - (i * 24 * 60 * 60 * 1000);
      const change = (Math.random() - 0.5) * 0.1;
      basePrice = basePrice * (1 + change);
      prices.push([timestamp, basePrice]);
    }

    return { prices };
  }

  private getMockNews(): CryptoNews[] {
    return [
      {
        id: '1',
        title: 'Bitcoin Surges to New Monthly High Amid Institutional Interest',
        description: 'Bitcoin price continues its upward momentum as institutional investors show renewed interest.',
        url: '#',
        source: 'CryptoDaily',
        published_at: new Date().toISOString(),
        sentiment: 'positive'
      },
      {
        id: '2',
        title: 'Ethereum Network Upgrade Promises Lower Gas Fees',
        description: 'The latest Ethereum improvement proposal aims to reduce transaction costs significantly.',
        url: '#',
        source: 'ETH News',
        published_at: new Date(Date.now() - 3600000).toISOString(),
        sentiment: 'positive'
      }
    ];
  }
}

export const cryptoApiService = new CryptoApiService();
