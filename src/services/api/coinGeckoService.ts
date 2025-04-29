
import { toast } from "@/components/ui/use-toast";

// API key storage
let apiKey = '';

/**
 * Set the CoinGecko API key
 * @param key - The API key to set
 */
export const setCoinGeckoApiKey = (key: string): void => {
  apiKey = key;
  localStorage.setItem('coinGeckoApiKey', key);
  toast({
    title: "CoinGecko API Key Updated",
    description: "Your API key has been saved successfully.",
  });
};

/**
 * Get the saved CoinGecko API key
 * @returns The saved API key or an empty string
 */
export const getCoinGeckoApiKey = (): string => {
  if (!apiKey) {
    apiKey = localStorage.getItem('coinGeckoApiKey') || '';
  }
  return apiKey;
};

/**
 * Check if the CoinGecko API key is set
 * @returns True if the API key is set, false otherwise
 */
export const hasCoinGeckoApiKey = (): boolean => {
  return !!getCoinGeckoApiKey();
};

/**
 * Reset the CoinGecko API key
 */
export const resetCoinGeckoApiKey = (): void => {
  apiKey = '';
  localStorage.removeItem('coinGeckoApiKey');
  toast({
    title: "CoinGecko API Key Removed",
    description: "Your API key has been removed successfully.",
  });
};

/**
 * Verify if a CoinGecko API key is valid
 * @param key - The API key to verify
 * @returns A promise resolving to true if valid, false otherwise
 */
export const verifyCoinGeckoApiKey = async (key: string): Promise<boolean> => {
  try {
    // Simulate API verification with a delay
    await new Promise(resolve => setTimeout(resolve, 800));
    // In a real app, this would make an actual API request
    return key.length > 16; // Simple validation for example purposes
  } catch (error) {
    console.error("Error verifying CoinGecko API key:", error);
    return false;
  }
};
