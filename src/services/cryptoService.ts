
import { CoinOption } from "@/components/trading/types";

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h?: number;
  priceChangePercentage24h?: number;
  marketCap?: number;
  volume?: number;
  image?: string;
  lastUpdated?: string;
}

// Function to fetch cryptocurrency data
export const fetchCryptoData = async (coinId: string): Promise<CryptoData> => {
  // In a real app, this would connect to a real API
  // For now, we'll simulate a network request with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData: CryptoData = {
        id: coinId,
        name: getCoinName(coinId),
        symbol: getCoinSymbol(coinId),
        price: getMockPrice(coinId),
        priceChange24h: getMockPriceChange(coinId),
        priceChangePercentage24h: getMockPercentageChange(coinId),
        marketCap: getMockMarketCap(coinId),
        volume: getMockVolume(coinId),
        image: `https://assets.coingecko.com/coins/images/${getImageId(coinId)}/large/${coinId}.png`,
        lastUpdated: new Date().toISOString()
      };
      resolve(mockData);
    }, 500);
  });
};

// Function to fetch multiple cryptocurrencies
export const fetchMultipleCryptoData = async (coinIds: string[]): Promise<CryptoData[]> => {
  // Simulate network request with a delay
  return Promise.all(coinIds.map(id => fetchCryptoData(id)));
};

// Function to fetch historical data
export const fetchCryptoHistoricalData = async (
  coinId: string,
  days = 7
): Promise<{ prices: [number, number][]; market_caps: [number, number][]; total_volumes: [number, number][] }> => {
  // Generate mock historical data
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const prices: [number, number][] = [];
  const market_caps: [number, number][] = [];
  const total_volumes: [number, number][] = [];

  const basePrice = getMockPrice(coinId);
  const baseMarketCap = getMockMarketCap(coinId);
  const baseVolume = getMockVolume(coinId);

  // Generate data points for each day
  for (let i = days; i >= 0; i--) {
    const timestamp = now - i * oneDayMs;
    const volatility = 0.05; // 5% daily volatility
    
    // Random walk for price
    const priceChange = (Math.random() - 0.5) * volatility * basePrice;
    const marketCapChange = (Math.random() - 0.5) * volatility * baseMarketCap;
    const volumeChange = (Math.random() - 0.5) * volatility * baseVolume;
    
    prices.push([timestamp, basePrice + priceChange]);
    market_caps.push([timestamp, baseMarketCap + marketCapChange]);
    total_volumes.push([timestamp, baseVolume + volumeChange]);
  }

  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        prices,
        market_caps,
        total_volumes
      });
    }, 500);
  });
};

// Helper functions to generate mock data
function getCoinName(coinId: string): string {
  const names: Record<string, string> = {
    bitcoin: "Bitcoin",
    ethereum: "Ethereum",
    solana: "Solana",
    cardano: "Cardano",
    ripple: "XRP",
    dogecoin: "Dogecoin",
    polkadot: "Polkadot"
  };
  return names[coinId] || coinId.charAt(0).toUpperCase() + coinId.slice(1);
}

function getCoinSymbol(coinId: string): string {
  const symbols: Record<string, string> = {
    bitcoin: "BTC",
    ethereum: "ETH",
    solana: "SOL",
    cardano: "ADA",
    ripple: "XRP",
    dogecoin: "DOGE",
    polkadot: "DOT"
  };
  return symbols[coinId] || coinId.slice(0, 3).toUpperCase();
}

function getImageId(coinId: string): string {
  const imageIds: Record<string, string> = {
    bitcoin: "1",
    ethereum: "279",
    solana: "4128",
    cardano: "975",
    ripple: "44",
    dogecoin: "5",
    polkadot: "12171"
  };
  return imageIds[coinId] || "1";
}

function getMockPrice(coinId: string): number {
  const prices: Record<string, number> = {
    bitcoin: 61245.32,
    ethereum: 3010.45,
    solana: 142.87,
    cardano: 0.45,
    ripple: 0.57,
    dogecoin: 0.14,
    polkadot: 5.98
  };
  return prices[coinId] || Math.random() * 1000;
}

function getMockPriceChange(coinId: string): number {
  const changes: Record<string, number> = {
    bitcoin: 1200,
    ethereum: -120,
    solana: 3.56,
    cardano: -0.02,
    ripple: 0.01,
    dogecoin: -0.004,
    polkadot: 0.25
  };
  return changes[coinId] || (Math.random() - 0.5) * 100;
}

function getMockPercentageChange(coinId: string): number {
  const changes: Record<string, number> = {
    bitcoin: 2.3,
    ethereum: -1.5,
    solana: 3.1,
    cardano: -2.6,
    ripple: 1.8,
    dogecoin: -2.1,
    polkadot: 4.3
  };
  return changes[coinId] || (Math.random() - 0.5) * 10;
}

function getMockMarketCap(coinId: string): number {
  const marketCaps: Record<string, number> = {
    bitcoin: 1180000000000,
    ethereum: 360000000000,
    solana: 90000000000,
    cardano: 24000000000,
    ripple: 32000000000,
    dogecoin: 18000000000,
    polkadot: 7500000000
  };
  return marketCaps[coinId] || Math.random() * 10000000000;
}

function getMockVolume(coinId: string): number {
  const volumes: Record<string, number> = {
    bitcoin: 28000000000,
    ethereum: 15000000000,
    solana: 5200000000,
    cardano: 890000000,
    ripple: 2400000000,
    dogecoin: 1900000000,
    polkadot: 320000000
  };
  return volumes[coinId] || Math.random() * 1000000000;
}

// Convert CryptoData to CoinOption format
export const convertToCoinOption = (cryptoData: CryptoData): CoinOption => {
  return {
    id: cryptoData.id,
    name: cryptoData.name,
    symbol: cryptoData.symbol,
    price: cryptoData.price,
    priceChange: cryptoData.priceChange24h || 0,
    changePercent: cryptoData.priceChangePercentage24h || 0,
    image: cryptoData.image || "",
    volume: cryptoData.volume || 0,
    marketCap: cryptoData.marketCap || 0,
    value: cryptoData.symbol,
    label: `${cryptoData.name} (${cryptoData.symbol})`
  };
};

// Convert array of CryptoData to array of CoinOption
export const convertToCoinOptions = (cryptoDataArray: CryptoData[]): CoinOption[] => {
  return cryptoDataArray.map(convertToCoinOption);
};

// Start monitoring prices with periodic updates
export const startPriceMonitoring = (
  coinIds: string[],
  onUpdate: (data: CoinOption[]) => void,
  interval = 5000
) => {
  // Initial fetch
  fetchMultipleCryptoData(coinIds)
    .then((data) => onUpdate(convertToCoinOptions(data)))
    .catch((error) => console.error("Error fetching initial crypto data:", error));

  // Set up interval for continuous updates
  const timerId = setInterval(() => {
    fetchMultipleCryptoData(coinIds)
      .then((data) => onUpdate(convertToCoinOptions(data)))
      .catch((error) => console.error("Error fetching updated crypto data:", error));
  }, interval);

  // Return a function to stop the monitoring
  return () => clearInterval(timerId);
};
