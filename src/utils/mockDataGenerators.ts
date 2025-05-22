
import { CoinOption, PortfolioBenchmark } from "@/types/trading";

export const generateCryptoData = (count: number): CoinOption[] => {
  const coins = [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", basePrice: 42000, volatility: 0.05 },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", basePrice: 3400, volatility: 0.06 },
    { id: "cardano", name: "Cardano", symbol: "ADA", basePrice: 1.2, volatility: 0.07 },
    { id: "solana", name: "Solana", symbol: "SOL", basePrice: 120, volatility: 0.08 },
    { id: "polkadot", name: "Polkadot", symbol: "DOT", basePrice: 28, volatility: 0.06 },
    { id: "ripple", name: "Ripple", symbol: "XRP", basePrice: 0.75, volatility: 0.05 },
    { id: "binancecoin", name: "Binance Coin", symbol: "BNB", basePrice: 480, volatility: 0.04 },
    { id: "avalanche", name: "Avalanche", symbol: "AVAX", basePrice: 85, volatility: 0.09 },
    { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", basePrice: 0.15, volatility: 0.12 },
    { id: "chainlink", name: "Chainlink", symbol: "LINK", basePrice: 16, volatility: 0.08 },
    { id: "uniswap", name: "Uniswap", symbol: "UNI", basePrice: 22, volatility: 0.07 },
    { id: "litecoin", name: "Litecoin", symbol: "LTC", basePrice: 150, volatility: 0.06 }
  ];

  return coins.slice(0, count).map((coin, index) => {
    const changePercent = (Math.random() - 0.5) * coin.volatility * 20;
    const price = coin.basePrice * (1 + changePercent/100);
    const priceChange = price - coin.basePrice;
    
    return {
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      value: coin.id,
      label: coin.name,
      price,
      priceChange,
      changePercent,
      volume: Math.random() * 10000000000,
      marketCap: price * (Math.random() * 100000000 + 10000000),
      rank: index + 1,
      image: `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/${coin.symbol.toLowerCase()}.png`,
      priceAUD: price * 1.48,
      priceEUR: price * 0.92,
      priceGBP: price * 0.79
    };
  });
};

export const generateHistoricalData = (days: number, volatility: number, startPrice: number): { date: string; value: number; performance: number }[] => {
  const data = [];
  let currentPrice = startPrice;
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random price change with some trend
    const change = (Math.random() - 0.5) * volatility * currentPrice;
    currentPrice = Math.max(currentPrice + change, 0.1);
    
    const performance = ((currentPrice / startPrice) - 1) * 100;
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(currentPrice.toFixed(2)),
      performance: parseFloat(performance.toFixed(2))
    });
  }
  
  return data;
};

export const generateBenchmarkData = (): PortfolioBenchmark[] => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 90);
  
  const bitcoinData = generateHistoricalData(90, 0.03, 38000);
  const ethereumData = generateHistoricalData(90, 0.04, 2800);
  const sp500Data = generateHistoricalData(90, 0.01, 4500);
  const goldData = generateHistoricalData(90, 0.005, 1800);
  const bondData = generateHistoricalData(90, 0.002, 100);
  
  return [
    {
      id: "portfolio",
      name: "Your Portfolio",
      symbol: "PORT",
      type: "crypto",
      data: generateHistoricalData(90, 0.025, 10000),
      color: "#3b82f6",
      performance: 12.5,
      lastUpdated: new Date().toISOString()
    },
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      type: "crypto",
      data: bitcoinData,
      color: "#f7931a",
      performance: bitcoinData[bitcoinData.length - 1].performance,
      lastUpdated: new Date().toISOString()
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      type: "crypto",
      data: ethereumData,
      color: "#627eea",
      performance: ethereumData[ethereumData.length - 1].performance,
      lastUpdated: new Date().toISOString()
    },
    {
      id: "sp500",
      name: "S&P 500",
      symbol: "SPX",
      type: "index",
      data: sp500Data,
      color: "#22c55e",
      performance: sp500Data[sp500Data.length - 1].performance,
      lastUpdated: new Date().toISOString()
    },
    {
      id: "gold",
      name: "Gold",
      symbol: "XAU",
      type: "index",
      data: goldData,
      color: "#eab308",
      performance: goldData[goldData.length - 1].performance,
      lastUpdated: new Date().toISOString()
    },
    {
      id: "bonds",
      name: "US Treasury Bonds",
      symbol: "BOND",
      type: "index",
      data: bondData,
      color: "#a855f7",
      performance: bondData[bondData.length - 1].performance,
      lastUpdated: new Date().toISOString()
    }
  ];
};
