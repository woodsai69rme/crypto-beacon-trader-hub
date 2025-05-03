
import { CoinOption } from '@/types/trading';

// Mock function to simulate real-time price updates
export function startPriceMonitoring(
  coinIds: string[],
  onUpdate: (coins: CoinOption[]) => void,
  interval: number = 5000
) {
  // Initial coins data
  let coins: CoinOption[] = coinIds.map(coinId => {
    let basePrice = 0;
    let symbol = "";
    let name = "";
    let image = "";
    
    switch (coinId) {
      case 'bitcoin':
        basePrice = 69420;
        symbol = "BTC";
        name = "Bitcoin";
        image = "https://assets.coingecko.com/coins/images/1/large/bitcoin.png";
        break;
      case 'ethereum':
        basePrice = 3210;
        symbol = "ETH";
        name = "Ethereum";
        image = "https://assets.coingecko.com/coins/images/279/large/ethereum.png";
        break;
      case 'solana':
        basePrice = 142.5;
        symbol = "SOL";
        name = "Solana";
        image = "https://assets.coingecko.com/coins/images/4128/large/solana.png";
        break;
      case 'cardano':
        basePrice = 0.45;
        symbol = "ADA";
        name = "Cardano";
        image = "https://assets.coingecko.com/coins/images/975/large/cardano.png";
        break;
      case 'ripple':
      case 'xrp':
        basePrice = 0.61;
        symbol = "XRP";
        name = "XRP";
        image = "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png";
        break;
      case 'dogecoin':
        basePrice = 0.138;
        symbol = "DOGE";
        name = "Dogecoin";
        image = "https://assets.coingecko.com/coins/images/5/large/dogecoin.png";
        break;
      default:
        basePrice = 10;
        symbol = coinId.slice(0, 3).toUpperCase();
        name = coinId.charAt(0).toUpperCase() + coinId.slice(1);
        image = "";
    }
    
    return {
      id: coinId,
      name,
      symbol,
      price: basePrice,
      priceChange: 0,
      changePercent: 0,
      image,
      volume: basePrice * 1000000,
      marketCap: basePrice * 10000000,
      value: coinId,
      label: `${name} (${symbol})`
    };
  });

  // Start the update interval
  const intervalId = setInterval(() => {
    // Update each coin with a slight random price movement
    coins = coins.map(coin => {
      // Price movement: random between -0.8% and +1% biased slightly upward
      const movement = (Math.random() * 1.8 - 0.8) / 100;
      const newPrice = coin.price * (1 + movement);
      
      return {
        ...coin,
        price: newPrice,
        priceChange: newPrice - coin.price,
        changePercent: movement * 100
      };
    });
    
    onUpdate(coins);
  }, interval);
  
  // Return function to stop monitoring
  return () => {
    clearInterval(intervalId);
  };
}
