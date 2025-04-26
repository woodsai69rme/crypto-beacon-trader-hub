
import { toast } from "@/components/ui/use-toast";
import type { CoinOption } from "@/types/trading";
import { updateWithAUDPrices } from "./currencyApi";
import { CryptoData } from "./cryptoApi";

// Free API endpoints
const COINGECKO_API = "https://api.coingecko.com/api/v3";
const CRYPTOCOMPARE_API = "https://min-api.cryptocompare.com/data";

export async function fetchLatestPrices(coinIds: string[]): Promise<CoinOption[]> {
  try {
    // Try CoinGecko first
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=${coinIds.join(",")}&vs_currencies=usd`
    );
    
    if (!response.ok) {
      throw new Error("CoinGecko API failed");
    }
    
    const data = await response.json();
    return Object.entries(data).map(([id, priceData]: [string, any]) => ({
      id,
      price: priceData.usd,
      name: id.charAt(0).toUpperCase() + id.slice(1), // Capitalize first letter
      symbol: id.toUpperCase().slice(0, 4), // Use first 4 letters as symbol
    }));
  } catch (error) {
    console.error("CoinGecko API error:", error);
    
    // Fallback to CryptoCompare
    try {
      const symbols = coinIds.map(id => id.toUpperCase()).join(",");
      const response = await fetch(
        `${CRYPTOCOMPARE_API}/pricemulti?fsyms=${symbols}&tsyms=USD`
      );
      
      if (!response.ok) {
        throw new Error("CryptoCompare API failed");
      }
      
      const data = await response.json();
      return Object.entries(data).map(([symbol, priceData]: [string, any]) => ({
        id: symbol.toLowerCase(),
        price: priceData.USD,
        name: symbol,
        symbol,
      }));
    } catch (secondError) {
      console.error("CryptoCompare API error:", secondError);
      toast({
        title: "Price Update Failed",
        description: "Using fallback prices. Will retry soon.",
        variant: "destructive",
      });
      
      // Return default mock prices as final fallback
      return [
        { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 61245.32 },
        { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 3010.45 },
        { id: "solana", name: "Solana", symbol: "SOL", price: 142.87 },
        { id: "cardano", name: "Cardano", symbol: "ADA", price: 0.45 },
        { id: "ripple", name: "XRP", symbol: "XRP", price: 0.57 },
        { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", price: 0.14 },
      ];
    }
  }
}

export function startPriceMonitoring(
  coinIds: string[],
  onPriceUpdate: (prices: CoinOption[]) => void,
  interval: number = 60000 // Default 1 minute
): () => void {
  // Initial fetch
  fetchLatestPrices(coinIds).then(onPriceUpdate);
  
  // Set up interval
  const intervalId = setInterval(async () => {
    const prices = await fetchLatestPrices(coinIds);
    onPriceUpdate(prices);
  }, interval);
  
  // Return cleanup function
  return () => clearInterval(intervalId);
}
