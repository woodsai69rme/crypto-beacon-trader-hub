
import { toast } from "@/components/ui/use-toast";
import type { CurrencyConversion } from "@/types/trading";

const API_BASE_URL = "https://api.exchangerate.host";

export const fetchCurrencyRates = async (): Promise<CurrencyConversion> => {
  try {
    const response = await fetch(`${API_BASE_URL}/latest?base=USD&symbols=AUD`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch currency rates");
    }
    
    const data = await response.json();
    
    return {
      USD_AUD: data.rates.AUD || 1.45, // Default fallback rate
      AUD_USD: 1 / (data.rates.AUD || 1.45),
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error fetching currency rates:", error);
    // Return fallback rates if the API fails
    return {
      USD_AUD: 1.45, // Approximate AUD/USD rate
      AUD_USD: 0.69, // Approximate USD/AUD rate
      lastUpdated: new Date().toISOString()
    };
  }
};

// Update crypto prices with AUD conversion
export const updateWithAUDPrices = (
  coins: any[], 
  conversionRate: number
): any[] => {
  return coins.map(coin => ({
    ...coin,
    priceAUD: coin.price * conversionRate
  }));
};
