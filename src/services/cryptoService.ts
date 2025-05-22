
import { CryptoData, CoinOption } from '@/types/trading';
import { generateMockTimeSeriesData } from '@/lib/utils';

// Mock data for demonstration
const mockCoins: CoinOption[] = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 50000, priceChange: 1000, value: "bitcoin", label: "Bitcoin (BTC)" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 3000, priceChange: 100, value: "ethereum", label: "Ethereum (ETH)" },
  { id: "ripple", name: "XRP", symbol: "XRP", price: 0.5, priceChange: 0.02, value: "ripple", label: "XRP (XRP)" },
  { id: "cardano", name: "Cardano", symbol: "ADA", price: 1.2, priceChange: 0.05, value: "cardano", label: "Cardano (ADA)" },
  { id: "solana", name: "Solana", symbol: "SOL", price: 150, priceChange: 7, value: "solana", label: "Solana (SOL)" },
  { id: "polkadot", name: "Polkadot", symbol: "DOT", price: 20, priceChange: 1, value: "polkadot", label: "Polkadot (DOT)" },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", price: 0.2, priceChange: 0.01, value: "dogecoin", label: "Dogecoin (DOGE)" },
  { id: "avalanche", name: "Avalanche", symbol: "AVAX", price: 80, priceChange: 3, value: "avalanche", label: "Avalanche (AVAX)" },
  { id: "chainlink", name: "Chainlink", symbol: "LINK", price: 18, priceChange: 0.7, value: "chainlink", label: "Chainlink (LINK)" },
  { id: "litecoin", name: "Litecoin", symbol: "LTC", price: 150, priceChange: 5, value: "litecoin", label: "Litecoin (LTC)" },
];

// Function to fetch all available coins
export async function fetchCoins(): Promise<CoinOption[]> {
  // In a real application, this would fetch from an API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCoins);
    }, 500);
  });
}

// Function to fetch a specific coin by ID
export async function fetchCoinById(id: string): Promise<CoinOption | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const coin = mockCoins.find(coin => coin.id === id);
      resolve(coin);
    }, 300);
  });
}

// Function to fetch historical coin data
export async function fetchCoinHistory(
  coinId: string,
  timeframe: string = '30d'
): Promise<{ date: string; price: number }[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate mock historical data based on timeframe
      const days = timeframeToDays(timeframe);
      const coin = mockCoins.find(c => c.id === coinId);
      let startPrice = coin ? coin.price * 0.8 : 1000; // 20% lower than current price
      
      const data = generateMockTimeSeriesData(days, startPrice, 0.03)
        .map(item => ({ date: item.date, price: item.value }));
      
      resolve(data);
    }, 800);
  });
}

// Function to convert timeframe string to number of days
function timeframeToDays(timeframe: string): number {
  switch (timeframe) {
    case '1d': return 1;
    case '7d': return 7;
    case '30d': return 30;
    case '90d': return 90;
    case '180d': return 180;
    case '1y': return 365;
    case 'max': return 1825; // 5 years
    default: return 30;
  }
}

// Function to fetch market data
export async function fetchMarketData(): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalMarketCap: 2340000000000, // $2.34 trillion
        totalVolume24h: 125000000000,  // $125 billion
        btcDominance: 42.5,            // 42.5%
        totalCryptocurrencies: 10482,
        totalExchanges: 567,
        lastUpdated: new Date().toISOString(),
      });
    }, 600);
  });
}

// Function to fetch news items
export async function fetchCryptoNews(limit: number = 10): Promise<any[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'news-1',
          title: 'Bitcoin Sets New All-Time High Above $75,000',
          source: 'CryptoNews',
          timestamp: '2023-05-10T14:30:00Z',
          url: 'https://example.com/news/bitcoin-ath',
        },
        {
          id: 'news-2',
          title: 'Ethereum Completes Major Network Upgrade',
          source: 'BlockchainTimes',
          timestamp: '2023-05-10T12:15:00Z',
          url: 'https://example.com/news/ethereum-upgrade',
        },
        {
          id: 'news-3',
          title: 'Regulatory Framework Announced for Crypto in Australia',
          source: 'CryptoDaily',
          timestamp: '2023-05-10T09:45:00Z',
          url: 'https://example.com/news/australia-regulation',
        },
        {
          id: 'news-4',
          title: 'Major Bank Launches Cryptocurrency Custody Service',
          source: 'FinanceToday',
          timestamp: '2023-05-09T16:20:00Z',
          url: 'https://example.com/news/bank-custody',
        },
        {
          id: 'news-5',
          title: 'DeFi Protocol Reports Record Volume',
          source: 'DeFiInsider',
          timestamp: '2023-05-09T11:10:00Z',
          url: 'https://example.com/news/defi-volume',
        },
        {
          id: 'news-6',
          title: 'NFT Market Shows Signs of Recovery',
          source: 'ArtTech',
          timestamp: '2023-05-09T08:30:00Z',
          url: 'https://example.com/news/nft-recovery',
        },
        {
          id: 'news-7',
          title: 'New Stablecoin Regulation Proposed',
          source: 'CryptoRegulation',
          timestamp: '2023-05-08T18:45:00Z',
          url: 'https://example.com/news/stablecoin-regulation',
        },
        {
          id: 'news-8',
          title: 'Major Exchange Expands to Australian Market',
          source: 'ExchangeNews',
          timestamp: '2023-05-08T14:20:00Z',
          url: 'https://example.com/news/exchange-australia',
        },
        {
          id: 'news-9',
          title: 'Cryptocurrency Mining Becomes More Energy Efficient',
          source: 'GreenBlockchain',
          timestamp: '2023-05-08T10:15:00Z',
          url: 'https://example.com/news/mining-efficiency',
        },
        {
          id: 'news-10',
          title: 'Layer-2 Solutions See Increased Adoption',
          source: 'ScalingNews',
          timestamp: '2023-05-07T16:50:00Z',
          url: 'https://example.com/news/layer2-adoption',
        },
      ].slice(0, limit));
    }, 500);
  });
}

// Function to fetch API usage statistics
export async function fetchApiUsage(): Promise<any[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          service: 'CoinGecko',
          currentUsage: 85,
          maxUsage: 100,
          endpoint: '/coins/markets',
          resetTime: '2023-05-10T18:00:00Z',
        },
        {
          service: 'CryptoCompare',
          currentUsage: 450,
          maxUsage: 1000,
          endpoint: '/data/pricemulti',
          resetTime: '2023-05-10T23:59:59Z',
        },
        {
          service: 'Binance',
          currentUsage: 120,
          maxUsage: 1200,
          endpoint: '/api/v3/ticker/price',
          resetTime: '2023-05-11T00:00:00Z',
        },
        {
          service: 'CoinMarketCap',
          currentUsage: 8,
          maxUsage: 10,
          endpoint: '/v1/cryptocurrency/listings/latest',
          resetTime: '2023-05-10T20:00:00Z',
        },
      ]);
    }, 700);
  });
}
