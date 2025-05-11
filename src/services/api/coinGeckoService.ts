
import enhancedApiService from './enhancedApiService';
import { CryptoData, CryptoChartData } from '@/types/trading';

// CoinGecko API service
const coinGeckoService = {
  /**
   * Get market data for top cryptocurrencies
   */
  async getMarketData(
    currency: string = 'usd',
    count: number = 100,
    page: number = 1,
    sparkline: boolean = false
  ): Promise<CryptoData[]> {
    const endpoint = '/coins/markets';
    const params = {
      vs_currency: currency,
      order: 'market_cap_desc',
      per_page: count,
      page,
      sparkline: sparkline,
      price_change_percentage: '24h'
    };
    
    try {
      const data = await enhancedApiService.makeRequest<any[]>(endpoint, params, {
        preferredProvider: 'coingecko'
      });
      
      return data.map(coin => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        image: coin.image,
        price: coin.current_price,
        priceChange: coin.price_change_24h || 0,
        changePercent: coin.price_change_percentage_24h || 0,
        marketCap: coin.market_cap,
        volume: coin.total_volume,
      }));
    } catch (error) {
      console.error('Failed to fetch market data:', error);
      return [];
    }
  },
  
  /**
   * Get detailed data for a specific coin
   */
  async getCoinData(coinId: string): Promise<CryptoData | null> {
    const endpoint = `/coins/${coinId}`;
    const params = {
      localization: 'false',
      tickers: false,
      market_data: true,
      community_data: false,
      developer_data: false
    };
    
    try {
      const coin = await enhancedApiService.makeRequest<any>(endpoint, params, {
        preferredProvider: 'coingecko'
      });
      
      return {
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        image: coin.image?.large,
        price: coin.market_data?.current_price?.usd,
        priceChange: coin.market_data?.price_change_24h || 0,
        changePercent: coin.market_data?.price_change_percentage_24h || 0,
        marketCap: coin.market_data?.market_cap?.usd,
        volume: coin.market_data?.total_volume?.usd,
      };
    } catch (error) {
      console.error(`Failed to fetch data for coin ${coinId}:`, error);
      return null;
    }
  },
  
  /**
   * Get historical price data for a specific coin
   */
  async getHistoricalPriceData(
    coinId: string,
    days: number | string = '7',
    interval: string = 'daily'
  ): Promise<CryptoChartData | null> {
    const endpoint = `/coins/${coinId}/market_chart`;
    const params = {
      vs_currency: 'usd',
      days: days,
      interval: interval === 'daily' ? 'daily' : undefined
    };
    
    try {
      const data = await enhancedApiService.makeRequest<any>(endpoint, params, {
        preferredProvider: 'coingecko'
      });
      
      return {
        timestamps: data.prices.map((item: [number, number]) => item[0]),
        prices: data.prices.map((item: [number, number]) => item[1]),
        volumes: data.total_volumes.map((item: [number, number]) => item[1])
      };
    } catch (error) {
      console.error(`Failed to fetch historical data for coin ${coinId}:`, error);
      return null;
    }
  }
};

export default coinGeckoService;
