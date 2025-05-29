
// Centralized market data service using real APIs
import { cryptoApiService } from './cryptoApi';

class MarketDataService {
  async getMarketData(coinIds: string[]) {
    try {
      const data = await cryptoApiService.getMarketData(coinIds);
      return data.map(coin => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.current_price,
        changePercent: coin.price_change_percentage_24h,
        volume: coin.total_volume,
        marketCap: coin.market_cap,
        image: coin.image
      }));
    } catch (error) {
      console.error('Error fetching market data:', error);
      return [];
    }
  }

  async getFearGreedIndex() {
    return cryptoApiService.getFearGreedIndex();
  }

  async getCoinHistory(coinId: string, timeframe: string) {
    return cryptoApiService.getCoinHistory(coinId, timeframe.replace('d', ''));
  }

  async getCryptoNews(limit?: number) {
    return cryptoApiService.getCryptoNews(limit);
  }

  async getCoinPrice(coinId: string) {
    return cryptoApiService.getCoinPrice(coinId);
  }
}

export const marketDataService = new MarketDataService();
