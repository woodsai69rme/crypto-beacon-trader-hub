
import { CoinOption, CryptoData } from '@/types/trading';
import { toast } from '@/components/ui/use-toast';

const API_BASE_URL = "https://api.coingecko.com/api/v3";

export async function fetchCryptoHistoricalData(coinId: string, days: number = 7) {
  try {
    // For the demo we'll use mock data instead of real API calls
    return generateMockHistoricalData(coinId, days);
  } catch (error) {
    console.error("Error fetching historical data:", error);
    toast({
      title: "API Error",
      description: "Could not load historical data. Using fallback data.",
      variant: "destructive"
    });
    return generateMockHistoricalData(coinId, days);
  }
}

export async function fetchMultipleCryptoData(coinIds: string[]) {
  try {
    // For the demo we'll use mock data instead of real API calls
    return generateMockMultipleCoinData(coinIds);
  } catch (error) {
    console.error("Error fetching multiple crypto data:", error);
    toast({
      title: "API Error",
      description: "Could not load crypto data. Using fallback data.",
      variant: "destructive"
    });
    return generateMockMultipleCoinData(coinIds);
  }
}

export function convertToCoinOptions(data: any[]): CoinOption[] {
  return data.map(coin => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol.toUpperCase(),
    price: coin.current_price || 0,
    priceChange: coin.price_change_24h || 0,
    changePercent: coin.price_change_percentage_24h || 0,
    image: coin.image,
    volume: coin.total_volume || 0,
    marketCap: coin.market_cap || 0,
    value: coin.id,
    label: `${coin.name} (${coin.symbol.toUpperCase()})`
  }));
}

// Mock data generators
function generateMockHistoricalData(coinId: string, days: number) {
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const prices = [];
  const market_caps = [];
  const total_volumes = [];
  
  // Base values that differ by coin
  let basePrice = 0;
  let baseVolume = 0;
  let baseMarketCap = 0;
  
  switch (coinId) {
    case 'bitcoin':
      basePrice = 60000;
      baseVolume = 30000000000;
      baseMarketCap = 1200000000000;
      break;
    case 'ethereum':
      basePrice = 3000;
      baseVolume = 15000000000;
      baseMarketCap = 360000000000;
      break;
    case 'solana':
      basePrice = 120;
      baseVolume = 3000000000;
      baseMarketCap = 60000000000;
      break;
    default:
      basePrice = 100;
      baseVolume = 1000000000;
      baseMarketCap = 10000000000;
  }
  
  // Generate data points for each day
  for (let i = 0; i <= days; i++) {
    const timestamp = now - (days - i) * oneDayMs;
    
    // Create some price variation
    const randomVariation = (Math.random() - 0.5) * 0.05; // 5% variation up or down
    const priceMultiplier = 1 + randomVariation;
    const volumeMultiplier = 1 + (Math.random() - 0.5) * 0.2; // 20% volume variation
    const marketCapMultiplier = priceMultiplier * (1 + (Math.random() - 0.5) * 0.02); // Market cap follows price but with some variation
    
    const dailyPrice = basePrice * priceMultiplier * (1 + (i * 0.01)); // Small uptrend
    const dailyVolume = baseVolume * volumeMultiplier;
    const dailyMarketCap = baseMarketCap * marketCapMultiplier * (1 + (i * 0.01)); // Market cap follows price trend
    
    prices.push([timestamp, dailyPrice]);
    total_volumes.push([timestamp, dailyVolume]);
    market_caps.push([timestamp, dailyMarketCap]);
  }
  
  return {
    prices,
    market_caps,
    total_volumes
  };
}

function generateMockMultipleCoinData(coinIds: string[]) {
  return coinIds.map(coinId => {
    let price = 0;
    let priceChange = 0;
    let marketCap = 0;
    let volume = 0;
    let image = "";
    
    switch (coinId) {
      case 'bitcoin':
        price = 61245.32 + (Math.random() - 0.5) * 1000;
        priceChange = (Math.random() - 0.3) * 1000;
        marketCap = 1180000000000;
        volume = 28000000000;
        image = "https://assets.coingecko.com/coins/images/1/large/bitcoin.png";
        break;
      case 'ethereum':
        price = 3010.45 + (Math.random() - 0.5) * 100;
        priceChange = (Math.random() - 0.5) * 50;
        marketCap = 360000000000;
        volume = 15000000000;
        image = "https://assets.coingecko.com/coins/images/279/large/ethereum.png";
        break;
      case 'solana':
        price = 121.33 + (Math.random() - 0.5) * 10;
        priceChange = (Math.random() - 0.4) * 5;
        marketCap = 90000000000;
        volume = 5200000000;
        image = "https://assets.coingecko.com/coins/images/4128/large/solana.png";
        break;
      case 'cardano':
        price = 0.45 + (Math.random() - 0.5) * 0.05;
        priceChange = (Math.random() - 0.5) * 0.02;
        marketCap = 24000000000;
        volume = 890000000;
        image = "https://assets.coingecko.com/coins/images/975/large/cardano.png";
        break;
      case 'ripple':
      case 'xrp':
        price = 0.61 + (Math.random() - 0.5) * 0.05;
        priceChange = (Math.random() - 0.5) * 0.03;
        marketCap = 32000000000;
        volume = 2400000000;
        image = "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png";
        break;
      default:
        price = 10 + (Math.random() * 100);
        priceChange = (Math.random() - 0.5) * 1;
        marketCap = 1000000000 * (Math.random() * 10);
        volume = 100000000 * (Math.random() * 10);
        image = "";
    }
    
    const changePercent = (priceChange / price) * 100;
    
    return {
      id: coinId,
      name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
      symbol: coinId.slice(0, 3).toUpperCase(),
      price,
      priceChange,
      changePercent,
      image,
      volume,
      marketCap,
      value: coinId,
      label: `${coinId.charAt(0).toUpperCase() + coinId.slice(1)} (${coinId.slice(0, 3).toUpperCase()})`
    };
  });
}

export async function searchCoins(query: string): Promise<CoinOption[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  // Mock search results instead of API call
  const mockCoins: CoinOption[] = [
    { 
      id: "bitcoin", 
      name: "Bitcoin", 
      symbol: "BTC", 
      price: 61245.32,
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      value: "bitcoin",
      label: "Bitcoin (BTC)"
    },
    { 
      id: "ethereum", 
      name: "Ethereum", 
      symbol: "ETH", 
      price: 3010.45,
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      value: "ethereum",
      label: "Ethereum (ETH)"
    },
    { 
      id: "solana", 
      name: "Solana", 
      symbol: "SOL", 
      price: 121.33,
      image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      value: "solana",
      label: "Solana (SOL)"
    },
    { 
      id: "cardano", 
      name: "Cardano", 
      symbol: "ADA", 
      price: 0.45,
      image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
      value: "cardano",
      label: "Cardano (ADA)"
    },
    { 
      id: "ripple", 
      name: "XRP", 
      symbol: "XRP", 
      price: 0.61,
      image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
      value: "ripple",
      label: "XRP (XRP)"
    }
  ];
  
  // Filter based on search query
  const filteredCoins = mockCoins.filter(
    coin => 
      coin.name.toLowerCase().includes(query.toLowerCase()) || 
      coin.symbol.toLowerCase().includes(query.toLowerCase())
  );
  
  return filteredCoins;
}
