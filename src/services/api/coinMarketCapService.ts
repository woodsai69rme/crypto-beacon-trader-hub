
import { toast } from "@/components/ui/use-toast";

// API key storage
let apiKey = '';

/**
 * Set the CoinMarketCap API key
 * @param key - The API key to set
 */
export const setCoinMarketCapApiKey = (key: string): void => {
  apiKey = key;
  localStorage.setItem('coinMarketCapApiKey', key);
  toast({
    title: "CoinMarketCap API Key Updated",
    description: "Your API key has been saved successfully.",
  });
};

/**
 * Get the saved CoinMarketCap API key
 * @returns The saved API key or an empty string
 */
export const getCoinMarketCapApiKey = (): string => {
  if (!apiKey) {
    apiKey = localStorage.getItem('coinMarketCapApiKey') || '';
  }
  return apiKey;
};

/**
 * Check if the CoinMarketCap API key is set
 * @returns True if the API key is set, false otherwise
 */
export const hasCoinMarketCapApiKey = (): boolean => {
  return !!getCoinMarketCapApiKey();
};

/**
 * Reset the CoinMarketCap API key
 */
export const resetCoinMarketCapApiKey = (): void => {
  apiKey = '';
  localStorage.removeItem('coinMarketCapApiKey');
  toast({
    title: "CoinMarketCap API Key Removed",
    description: "Your API key has been removed successfully.",
  });
};

/**
 * Verify if a CoinMarketCap API key is valid
 * @param key - The API key to verify
 * @returns A promise resolving to true if valid, false otherwise
 */
export const verifyCoinMarketCapApiKey = async (key: string): Promise<boolean> => {
  try {
    // Simulate API verification with a delay
    await new Promise(resolve => setTimeout(resolve, 800));
    // In a real app, this would make an actual API request
    return key.length > 30; // Simple validation for example purposes
  } catch (error) {
    console.error("Error verifying CoinMarketCap API key:", error);
    return false;
  }
};
