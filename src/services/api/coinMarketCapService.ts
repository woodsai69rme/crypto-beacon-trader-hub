
import { toast } from "@/components/ui/use-toast";

let apiKey: string | null = null;

export const setCoinMarketCapApiKey = (key: string) => {
  apiKey = key;
  localStorage.setItem('coinMarketCapApiKey', key);
  toast({
    title: "API Key Updated",
    description: "Your CoinMarketCap API key has been updated successfully.",
  });
  return true;
};

export const getCoinMarketCapApiKey = (): string | null => {
  if (!apiKey) {
    apiKey = localStorage.getItem('coinMarketCapApiKey');
  }
  return apiKey;
};

export const fetchCoinMarketCapData = async (symbol: string) => {
  const key = getCoinMarketCapApiKey();
  
  if (!key) {
    toast({
      title: "API Key Required",
      description: "Please set your CoinMarketCap API key in settings.",
      variant: "destructive",
    });
    return null;
  }
  
  try {
    // In a real app, we would use the key for authentication and a proxy to avoid CORS issues
    // For demo purposes, we'll return mock data
    return {
      data: {
        [symbol]: {
          name: symbol === 'BTC' ? 'Bitcoin' : symbol === 'ETH' ? 'Ethereum' : 'Cryptocurrency',
          symbol: symbol,
          quote: {
            USD: {
              price: symbol === 'BTC' ? 45000 + Math.random() * 1000 : 
                    symbol === 'ETH' ? 2500 + Math.random() * 100 : 
                    100 + Math.random() * 50,
              percent_change_24h: (Math.random() * 10) - 5,
              market_cap: symbol === 'BTC' ? 800000000000 + Math.random() * 20000000000 : 
                         symbol === 'ETH' ? 300000000000 + Math.random() * 10000000000 : 
                         10000000000 + Math.random() * 1000000000,
              volume_24h: symbol === 'BTC' ? 30000000000 + Math.random() * 1000000000 : 
                          symbol === 'ETH' ? 20000000000 + Math.random() * 1000000000 : 
                          1000000000 + Math.random() * 100000000
            }
          }
        }
      }
    };
  } catch (error) {
    console.error("Error fetching from CoinMarketCap:", error);
    toast({
      title: "API Error",
      description: "Could not fetch data from CoinMarketCap API.",
      variant: "destructive",
    });
    return null;
  }
};
