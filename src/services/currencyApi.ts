
import axios from "axios";
import type { CurrencyConversion } from "@/types/trading";

// Function to fetch current exchange rates
export async function fetchCurrencyRates(): Promise<CurrencyConversion> {
  try {
    // Use a more reliable free exchange rate API
    const response = await axios.get('https://api.exchangerate.host/latest?base=USD&symbols=AUD');
    
    if (response.data && response.data.rates && response.data.rates.AUD) {
      const USD_AUD = response.data.rates.AUD || 1.45; // Default fallback if API fails
      return {
        USD_AUD,
        AUD_USD: 1 / USD_AUD,
        lastUpdated: new Date().toISOString()
      };
    }
    
    console.log("API response:", response.data);
    
    // Fallback if API response doesn't have the expected structure
    console.error("Invalid response format from currency API, using fallback rates");
    return getDefaultRates();
  } catch (error) {
    console.error("Error fetching currency rates:", error);
    return getDefaultRates();
  }
}

// Helper function to update coin prices with AUD values
export function updateWithAUDPrices(coins: any[], audRate: number): any[] {
  return coins.map(coin => ({
    ...coin,
    priceAUD: coin.price * audRate
  }));
}

// Function to get default rates when API fails
function getDefaultRates(): CurrencyConversion {
  return {
    USD_AUD: 1.45, // Default fallback rate
    AUD_USD: 0.69, // Default fallback rate
    lastUpdated: new Date().toISOString()
  };
}
