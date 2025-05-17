
import axios from 'axios';
import { CoinOption, PricePoint, CryptoData } from '@/types/trading';

// Helper function to format price with currency symbol
export const formatPrice = (price?: number): string => {
  if (price === undefined || price === null) return 'N/A';
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(price);
};

// Fetch top cryptocurrencies data
export const fetchTopCryptoData = async (limit: number = 10): Promise<CoinOption[]> => {
  try {
    // For demo purposes, generate mock data
    const mockCoins: CoinOption[] = [
      {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        price: 65000 + Math.random() * 1000,
        priceChange: 2.5 + Math.random(),
        changePercent: 2.5 + Math.random(),
        value: 'bitcoin',
        label: 'Bitcoin (BTC)',
        image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
      },
      {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        price: 3500 + Math.random() * 100,
        priceChange: 3.2 + Math.random(),
        changePercent: 3.2 + Math.random(),
        value: 'ethereum',
        label: 'Ethereum (ETH)',
        image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      },
      {
        id: 'solana',
        name: 'Solana',
        symbol: 'SOL',
        price: 150 + Math.random() * 10,
        priceChange: -1.8 + Math.random(),
        changePercent: -1.8 + Math.random(),
        value: 'solana',
        label: 'Solana (SOL)',
        image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
      },
      {
        id: 'cardano',
        name: 'Cardano',
        symbol: 'ADA',
        price: 0.45 + Math.random() * 0.05,
        priceChange: 1.2 + Math.random(),
        changePercent: 1.2 + Math.random(),
        value: 'cardano',
        label: 'Cardano (ADA)',
        image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
      },
      {
        id: 'chainlink',
        name: 'Chainlink',
        symbol: 'LINK',
        price: 15.8 + Math.random(),
        priceChange: 5.6 + Math.random(),
        changePercent: 5.6 + Math.random(),
        value: 'chainlink',
        label: 'Chainlink (LINK)',
        image: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
      },
      {
        id: 'polkadot',
        name: 'Polkadot',
        symbol: 'DOT',
        price: 7.2 + Math.random(),
        priceChange: -0.8 + Math.random(),
        changePercent: -0.8 + Math.random(),
        value: 'polkadot',
        label: 'Polkadot (DOT)',
        image: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png',
      },
      {
        id: 'ripple',
        name: 'XRP',
        symbol: 'XRP',
        price: 0.55 + Math.random() * 0.05,
        priceChange: 0.3 + Math.random(),
        changePercent: 0.3 + Math.random(),
        value: 'ripple',
        label: 'XRP (XRP)',
        image: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
      },
      {
        id: 'avalanche',
        name: 'Avalanche',
        symbol: 'AVAX',
        price: 34.5 + Math.random() * 2,
        priceChange: 4.1 + Math.random(),
        changePercent: 4.1 + Math.random(),
        value: 'avalanche',
        label: 'Avalanche (AVAX)',
        image: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png',
      },
      {
        id: 'dogecoin',
        name: 'Dogecoin',
        symbol: 'DOGE',
        price: 0.12 + Math.random() * 0.01,
        priceChange: -2.4 + Math.random(),
        changePercent: -2.4 + Math.random(),
        value: 'dogecoin',
        label: 'Dogecoin (DOGE)',
        image: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
      },
      {
        id: 'shiba-inu',
        name: 'Shiba Inu',
        symbol: 'SHIB',
        price: 0.000012 + Math.random() * 0.000001,
        priceChange: 1.7 + Math.random(),
        changePercent: 1.7 + Math.random(),
        value: 'shiba-inu',
        label: 'Shiba Inu (SHIB)',
        image: 'https://assets.coingecko.com/coins/images/11939/small/shiba.png',
      }
    ];
    
    return mockCoins.slice(0, limit);
    
    // In a real app, you would fetch from an API:
    // const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
    //   params: {
    //     vs_currency: 'aud',
    //     order: 'market_cap_desc',
    //     per_page: limit,
    //     page: 1,
    //     sparkline: false,
    //   }
    // });
    // return response.data.map((coin: any) => ({
    //   id: coin.id,
    //   name: coin.name,
    //   symbol: coin.symbol,
    //   price: coin.current_price,
    //   priceChange: coin.price_change_24h,
    //   changePercent: coin.price_change_percentage_24h,
    //   marketCap: coin.market_cap,
    //   volume: coin.total_volume,
    //   image: coin.image,
    //   value: coin.id,
    //   label: `${coin.name} (${coin.symbol.toUpperCase()})`,
    // }));
  } catch (error) {
    console.error('Error fetching cryptocurrency data:', error);
    return [];
  }
};

// Alias for backward compatibility
export const fetchCryptoData = fetchTopCryptoData;

// Fetch historical price data for a specific coin
export const fetchCryptoHistory = async (coinId: string, days: number = 7): Promise<PricePoint[]> => {
  try {
    // For demo purposes, generate mock historical data
    const mockHistory: PricePoint[] = [];
    let basePrice: number;
    
    switch (coinId) {
      case 'bitcoin':
        basePrice = 65000;
        break;
      case 'ethereum':
        basePrice = 3500;
        break;
      case 'solana':
        basePrice = 150;
        break;
      default:
        basePrice = 100;
    }
    
    const now = Date.now();
    const interval = days * 24 * 60 * 60 * 1000 / 100; // 100 data points
    
    for (let i = 100; i >= 0; i--) {
      const timestamp = now - (i * interval);
      const date = new Date(timestamp);
      const volatility = 0.02; // 2% price movement
      const randomChange = (Math.random() - 0.5) * volatility * basePrice;
      const price = basePrice + (randomChange * (i / 20));
      
      mockHistory.push({
        timestamp,
        date: date.toISOString(),
        price,
        volume: Math.random() * 1000000,
      });
    }
    
    return mockHistory;
    
    // In a real app, you would fetch from an API:
    // const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`, {
    //   params: {
    //     vs_currency: 'aud',
    //     days: days
    //   }
    // });
    // 
    // return response.data.prices.map((item: [number, number]) => ({
    //   timestamp: item[0],
    //   price: item[1],
    // }));
  } catch (error) {
    console.error(`Error fetching history for ${coinId}:`, error);
    return [];
  }
};
