
import { CoinOption, CryptoData } from "@/types/trading";

/**
 * Fetches top cryptocurrencies by market cap
 * @param limit Number of coins to fetch
 * @returns Promise resolving to an array of CoinOption objects
 */
export async function fetchTopCoins(limit: number = 10): Promise<CoinOption[]> {
  try {
    // In a real application, this would fetch from an API like CoinGecko
    // For demo purposes, we'll return mock data
    console.log(`Fetching top ${limit} coins`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return getMockCoins(limit);
  } catch (error) {
    console.error("Error fetching top coins:", error);
    return [];
  }
}

/**
 * Fetches detailed data for a specific cryptocurrency
 * @param coinId The ID of the coin to fetch
 * @returns Promise resolving to a CryptoData object
 */
export async function fetchCoinDetails(coinId: string): Promise<CryptoData | null> {
  try {
    console.log(`Fetching details for coin: ${coinId}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const mockCoins = getMockCoins(20);
    const matchedCoin = mockCoins.find(coin => coin.id === coinId);
    
    if (!matchedCoin) {
      return null;
    }
    
    // Convert CoinOption to CryptoData
    return {
      id: matchedCoin.id,
      symbol: matchedCoin.symbol,
      name: matchedCoin.name,
      image: matchedCoin.image,
      current_price: matchedCoin.price,
      market_cap: matchedCoin.marketCap || 0,
      market_cap_rank: matchedCoin.rank || 0,
      fully_diluted_valuation: matchedCoin.marketCap ? matchedCoin.marketCap * 1.1 : null,
      total_volume: matchedCoin.volume || 0,
      high_24h: matchedCoin.price * 1.05,
      low_24h: matchedCoin.price * 0.95,
      price_change_24h: matchedCoin.priceChange || 0,
      price_change_percentage_24h: matchedCoin.changePercent || 0,
      market_cap_change_24h: (matchedCoin.marketCap || 0) * ((matchedCoin.changePercent || 0) / 100),
      market_cap_change_percentage_24h: (matchedCoin.changePercent || 0) * 0.8,
      circulating_supply: Math.floor(Math.random() * 100000000),
      total_supply: Math.floor(Math.random() * 200000000),
      max_supply: Math.floor(Math.random() * 300000000),
      ath: matchedCoin.price * (1 + Math.random() * 5),
      ath_change_percentage: -Math.random() * 30,
      ath_date: new Date(Date.now() - Math.random() * 31536000000).toISOString(),
      atl: matchedCoin.price * (0.1 + Math.random() * 0.2),
      atl_change_percentage: Math.random() * 1000 + 500,
      atl_date: new Date(Date.now() - Math.random() * 157680000000).toISOString(),
      roi: null,
      last_updated: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error fetching coin details for ${coinId}:`, error);
    return null;
  }
}

/**
 * Generates mock coin data
 * @param count Number of mock coins to generate
 * @returns Array of CoinOption objects
 */
function getMockCoins(count: number): CoinOption[] {
  const baseCoinData: CoinOption[] = [
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      price: 60000 + Math.random() * 2000,
      priceAUD: 90000 + Math.random() * 3000,
      priceEUR: 55000 + Math.random() * 1800,
      priceGBP: 48000 + Math.random() * 1500,
      priceChange: 1200 + Math.random() * 200,
      changePercent: 2.3 + Math.random(),
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      volume: 28000000000 + Math.random() * 1000000000,
      marketCap: 1180000000000 + Math.random() * 10000000000,
      rank: 1
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      price: 3000 + Math.random() * 200,
      priceAUD: 4500 + Math.random() * 300,
      priceEUR: 2800 + Math.random() * 180,
      priceGBP: 2400 + Math.random() * 150,
      priceChange: -120 + Math.random() * 40,
      changePercent: -1.5 + Math.random() * 0.5,
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      volume: 15000000000 + Math.random() * 500000000,
      marketCap: 360000000000 + Math.random() * 5000000000,
      rank: 2
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      price: 121 + Math.random() * 10,
      priceAUD: 180 + Math.random() * 15,
      priceEUR: 110 + Math.random() * 9,
      priceGBP: 95 + Math.random() * 8,
      priceChange: 3.56 + Math.random(),
      changePercent: 3.1 + Math.random() * 0.5,
      image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      volume: 5200000000 + Math.random() * 200000000,
      marketCap: 90000000000 + Math.random() * 2000000000,
      rank: 3
    },
    {
      id: "cardano",
      name: "Cardano",
      symbol: "ADA",
      price: 0.45 + Math.random() * 0.05,
      priceAUD: 0.67 + Math.random() * 0.07,
      priceEUR: 0.42 + Math.random() * 0.04,
      priceGBP: 0.36 + Math.random() * 0.03,
      priceChange: -0.02 + Math.random() * 0.01,
      changePercent: -2.6 + Math.random(),
      image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
      volume: 890000000 + Math.random() * 50000000,
      marketCap: 24000000000 + Math.random() * 500000000,
      rank: 4
    },
    {
      id: "ripple",
      name: "XRP",
      symbol: "XRP",
      price: 0.61 + Math.random() * 0.05,
      priceAUD: 0.91 + Math.random() * 0.07,
      priceEUR: 0.57 + Math.random() * 0.04,
      priceGBP: 0.48 + Math.random() * 0.03,
      priceChange: 0.01 + Math.random() * 0.005,
      changePercent: 1.8 + Math.random() * 0.5,
      image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
      volume: 2400000000 + Math.random() * 100000000,
      marketCap: 32000000000 + Math.random() * 500000000,
      rank: 5
    },
    {
      id: "dogecoin",
      name: "Dogecoin",
      symbol: "DOGE",
      price: 0.138 + Math.random() * 0.01,
      priceAUD: 0.207 + Math.random() * 0.015,
      priceEUR: 0.128 + Math.random() * 0.009,
      priceGBP: 0.107 + Math.random() * 0.008,
      priceChange: -0.004 + Math.random() * 0.001,
      changePercent: -2.1 + Math.random(),
      image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
      volume: 1900000000 + Math.random() * 100000000,
      marketCap: 18000000000 + Math.random() * 500000000,
      rank: 6
    }
  ];
  
  // Add more mock coins if needed
  const extraCoins: CoinOption[] = [];
  
  for (let i = baseCoinData.length; i < count; i++) {
    const rank = i + 1;
    const randomPrice = 0.1 + Math.random() * (1000 / (rank + 5));
    const randomSymbol = `CRY${rank}`;
    
    extraCoins.push({
      id: `crypto-${rank}`,
      name: `Crypto ${rank}`,
      symbol: randomSymbol,
      price: randomPrice,
      priceAUD: randomPrice * 1.5,
      priceEUR: randomPrice * 0.9,
      priceGBP: randomPrice * 0.78,
      priceChange: randomPrice * (Math.random() * 0.2 - 0.1),
      changePercent: (Math.random() * 10 - 5),
      image: `https://cryptoicons.org/api/color/${randomSymbol.toLowerCase()}/64`,
      volume: Math.random() * 500000000,
      marketCap: randomPrice * 1000000 * (100 - rank),
      rank: rank
    });
  }
  
  return [...baseCoinData, ...extraCoins].slice(0, count);
}
