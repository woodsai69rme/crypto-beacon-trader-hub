
import axios from "axios";
import type { CurrencyConversion } from "@/types/trading";

// Function to fetch current exchange rates
export async function fetchCurrencyRates(): Promise<CurrencyConversion> {
  try {
    // Use a reliable free exchange rate API
    const response = await axios.get('https://api.exchangerate.host/latest?base=USD&symbols=AUD,EUR,GBP');
    
    if (response.data && response.data.rates) {
      const { AUD = 1.45, EUR = 0.92, GBP = 0.79 } = response.data.rates;
      
      return {
        USD_AUD: AUD,
        AUD_USD: 1 / AUD,
        USD_EUR: EUR,
        EUR_USD: 1 / EUR,
        USD_GBP: GBP,
        GBP_USD: 1 / GBP,
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

// Helper function to update coin prices with currency values
export function updateWithCurrencyPrices(coins: any[], rates: CurrencyConversion): any[] {
  return coins.map(coin => ({
    ...coin,
    priceAUD: coin.price * rates.USD_AUD,
    priceEUR: coin.price * rates.USD_EUR,
    priceGBP: coin.price * rates.USD_GBP
  }));
}

// Function to get default rates when API fails
function getDefaultRates(): CurrencyConversion {
  return {
    USD_AUD: 1.45, // Default fallback rate
    AUD_USD: 0.69, // Default fallback rate
    USD_EUR: 0.92,
    EUR_USD: 1.09,
    USD_GBP: 0.79,
    GBP_USD: 1.27,
    lastUpdated: new Date().toISOString()
  };
}
