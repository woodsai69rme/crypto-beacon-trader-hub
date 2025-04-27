
export interface CurrencyRates {
  USD_AUD: number;
  AUD_USD: number;
  USD_EUR: number;
  EUR_USD: number;
  USD_GBP: number;
  GBP_USD: number;
  lastUpdated: string;
}

export interface CurrencyConversion extends CurrencyRates {}
