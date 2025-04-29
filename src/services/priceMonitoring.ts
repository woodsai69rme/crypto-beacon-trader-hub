
import { CoinOption } from '@/types/trading';

// Mock price update function to simulate real-time updates
export const startPriceMonitoring = (
  coinIds: string[],
  onUpdate: (updatedCoins: CoinOption[]) => void,
  interval: number = 5000
): () => void => {
  let previousPrices: Record<string, number> = {};
  
  // Store initial mock data for coins
  const baseCoins: Record<string, CoinOption> = {
    "bitcoin": { 
      id: "bitcoin", 
      name: "Bitcoin", 
      symbol: "BTC", 
      price: 61245.32,
      priceChange: 0,
      changePercent: 0,
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      volume: 28000000000,
      marketCap: 1180000000000
    },
    "ethereum": { 
      id: "ethereum", 
      name: "Ethereum", 
      symbol: "ETH", 
      price: 3010.45,
      priceChange: 0,
      changePercent: 0,
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      volume: 15000000000,
      marketCap: 360000000000
    },
    "solana": { 
      id: "solana", 
      name: "Solana", 
      symbol: "SOL", 
      price: 142.87,
      priceChange: 0,
      changePercent: 0,
      image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      volume: 5200000000,
      marketCap: 90000000000
    },
    "cardano": { 
      id: "cardano", 
      name: "Cardano", 
      symbol: "ADA", 
      price: 0.45,
      priceChange: 0,
      changePercent: 0,
      image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
      volume: 890000000,
      marketCap: 24000000000
    },
    "ripple": { 
      id: "ripple", 
      name: "XRP", 
      symbol: "XRP", 
      price: 0.57,
      priceChange: 0,
      changePercent: 0,
      image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
      volume: 2400000000,
      marketCap: 32000000000
    },
    "dogecoin": { 
      id: "dogecoin", 
      name: "Dogecoin", 
      symbol: "DOGE", 
      price: 0.14,
      priceChange: 0,
      changePercent: 0,
      image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
      volume: 1900000000,
      marketCap: 18000000000
    }
  };
  
  // Store the initial prices
  coinIds.forEach(id => {
    if (baseCoins[id]) {
      previousPrices[id] = baseCoins[id].price;
    }
  });
  
  // Function to generate a new mock price
  const generateNewPrice = (id: string): number => {
    const baseCoin = baseCoins[id];
    if (!baseCoin) return 0;
    
    const basePrice = baseCoin.price;
    const volatility = id === "bitcoin" ? 0.005 : id === "ethereum" ? 0.008 : 0.012;
    const change = basePrice * volatility * (Math.random() * 2 - 1);
    
    return Number((previousPrices[id] + change).toFixed(2));
  };
  
  // Function to update prices
  const updatePrices = () => {
    const updatedCoins: CoinOption[] = coinIds
      .filter(id => baseCoins[id])
      .map(id => {
        const newPrice = generateNewPrice(id);
        const priceChange = newPrice - previousPrices[id];
        const changePercent = (priceChange / previousPrices[id]) * 100;
        
        // Update previous price for next time
        previousPrices[id] = newPrice;
        
        return {
          ...baseCoins[id],
          price: newPrice,
          priceChange: Number(priceChange.toFixed(2)),
          changePercent: Number(changePercent.toFixed(2))
        };
      });
    
    onUpdate(updatedCoins);
  };
  
  // Start interval
  const timer = setInterval(updatePrices, interval) as unknown as number;
  
  // Return function to stop monitoring
  return () => {
    clearInterval(timer);
  };
};
