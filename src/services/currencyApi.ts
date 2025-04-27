
import { toast } from "@/components/ui/use-toast";
import { CoinOption } from "@/types/trading";

export interface CurrencyRates {
  USD_AUD: number;
  AUD_USD: number;
  USD_EUR: number;
  EUR_USD: number;
  USD_GBP: number;
  GBP_USD: number;
  lastUpdated: string;
}

// Default conversion rates if API fails
const DEFAULT_RATES: CurrencyRates = {
  USD_AUD: 1.48,
  AUD_USD: 0.676,
  USD_EUR: 0.92,
  EUR_USD: 1.087,
  USD_GBP: 0.8,
  GBP_USD: 1.25,
  lastUpdated: new Date().toISOString()
};

// Fetch current exchange rates from API
export async function fetchExchangeRates(): Promise<CurrencyRates> {
  try {
    const response = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=AUD,EUR,GBP');
    
    if (!response.ok) {
      throw new Error('Failed to fetch currency rates');
    }
    
    const data = await response.json();
    
    if (!data.rates || !data.rates.AUD || !data.rates.EUR || !data.rates.GBP) {
      throw new Error('Invalid response format');
    }
    
    const usdAud = data.rates.AUD;
    const usdEur = data.rates.EUR;
    const usdGbp = data.rates.GBP;
    
    return {
      USD_AUD: usdAud,
      AUD_USD: 1 / usdAud,
      USD_EUR: usdEur,
      EUR_USD: 1 / usdEur,
      USD_GBP: usdGbp,
      GBP_USD: 1 / usdGbp,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching currency rates:', error);
    
    // Use default values if API fails
    return DEFAULT_RATES;
  }
}

// Convert price from USD to AUD
export function convertUsdToAud(usdPrice: number, rates: CurrencyRates): number {
  return usdPrice * rates.USD_AUD;
}

// Convert price from AUD to USD
export function convertAudToUsd(audPrice: number, rates: CurrencyRates): number {
  return audPrice * rates.AUD_USD;
}

// Convert price from USD to EUR
export function convertUsdToEur(usdPrice: number, rates: CurrencyRates): number {
  return usdPrice * rates.USD_EUR;
}

// Convert price from USD to GBP
export function convertUsdToGbp(usdPrice: number, rates: CurrencyRates): number {
  return usdPrice * rates.USD_GBP;
}

// Update coin prices with currency rates
export function updateWithCurrencyRates(coins: CoinOption[], rates: CurrencyRates): CoinOption[] {
  return coins.map(coin => ({
    ...coin,
    priceAUD: convertUsdToAud(coin.price, rates),
    priceEUR: convertUsdToEur(coin.price, rates),
    priceGBP: convertUsdToGbp(coin.price, rates)
  }));
}
