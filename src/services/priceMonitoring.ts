
import { CoinOption } from "@/components/trading/EnhancedFakeTrading";

// Mock price monitoring service to simulate price updates
export const startPriceMonitoring = (
  coinIds: string[],
  onUpdate: (coins: CoinOption[]) => void,
  intervalMs: number = 5000
): (() => void) => {
  // Function to generate random price updates
  const generatePriceUpdates = (ids: string[]): CoinOption[] => {
    return ids.map(id => {
      // Base values for different coins
      let basePrice = 0;
      let symbol = '';
      let name = '';
      let image = '';
      let volume = 0;
      let marketCap = 0;
      
      switch (id) {
        case 'bitcoin':
          basePrice = 58000;
          symbol = 'BTC';
          name = 'Bitcoin';
          image = "https://assets.coingecko.com/coins/images/1/large/bitcoin.png";
          volume = 48941516789;
          marketCap = 1143349097968;
          break;
        case 'ethereum':
          basePrice = 3100;
          symbol = 'ETH';
          name = 'Ethereum';
          image = "https://assets.coingecko.com/coins/images/279/large/ethereum.png";
          volume = 21891456789;
          marketCap = 373952067386;
          break;
        case 'solana':
          basePrice = 150;
          symbol = 'SOL';
          name = 'Solana';
          image = "https://assets.coingecko.com/coins/images/4128/large/solana.png";
          volume = 3578912345;
          marketCap = 67891234567;
          break;
        case 'cardano':
          basePrice = 0.45;
          symbol = 'ADA';
          name = 'Cardano';
          image = "https://assets.coingecko.com/coins/images/975/large/cardano.png";
          volume = 467891234;
          marketCap = 15893456789;
          break;
        case 'ripple':
          basePrice = 0.61;
          symbol = 'XRP';
          name = 'XRP';
          image = "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png";
          volume = 2400000000;
          marketCap = 32000000000;
          break;
        case 'dogecoin':
          basePrice = 0.13;
          symbol = 'DOGE';
          name = 'Dogecoin';
          image = "https://assets.coingecko.com/coins/images/5/large/dogecoin.png";
          volume = 1900000000;
          marketCap = 18000000000;
          break;
        default:
          basePrice = 100;
          symbol = 'UNKNOWN';
          name = 'Unknown Coin';
          image = "";
          volume = 1000000;
          marketCap = 10000000;
      }
      
      // Generate random price change (between -2% and +2%)
      const randomChange = (Math.random() * 4 - 2) / 100;
      const price = basePrice * (1 + randomChange);
      const priceChange = basePrice * randomChange;
      const changePercent = randomChange * 100;
      
      return {
        id,
        name,
        symbol,
        price,
        priceChange,
        changePercent,
        image,
        volume,
        marketCap,
        value: id,
        label: `${name} (${symbol})`
      };
    });
  };
  
  // Set up interval for price updates
  const intervalId = setInterval(() => {
    const updatedCoins = generatePriceUpdates(coinIds);
    onUpdate(updatedCoins);
  }, intervalMs);
  
  // Return a cleanup function
  return () => {
    clearInterval(intervalId);
  };
};
