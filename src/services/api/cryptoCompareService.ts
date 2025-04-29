
import { toast } from "@/components/ui/use-toast";

// API key storage
let apiKey = '';

/**
 * Set the CryptoCompare API key
 * @param key - The API key to set
 */
export const setCryptoCompareApiKey = (key: string): void => {
  apiKey = key;
  localStorage.setItem('cryptoCompareApiKey', key);
  toast({
    title: "CryptoCompare API Key Updated",
    description: "Your API key has been saved successfully.",
  });
};

/**
 * Get the saved CryptoCompare API key
 * @returns The saved API key or an empty string
 */
export const getCryptoCompareApiKey = (): string => {
  if (!apiKey) {
    apiKey = localStorage.getItem('cryptoCompareApiKey') || '';
  }
  return apiKey;
};

/**
 * Check if the CryptoCompare API key is set
 * @returns True if the API key is set, false otherwise
 */
export const hasCryptoCompareApiKey = (): boolean => {
  return !!getCryptoCompareApiKey();
};

/**
 * Reset the CryptoCompare API key
 */
export const resetCryptoCompareApiKey = (): void => {
  apiKey = '';
  localStorage.removeItem('cryptoCompareApiKey');
  toast({
    title: "CryptoCompare API Key Removed",
    description: "Your API key has been removed successfully.",
  });
};

/**
 * Verify if a CryptoCompare API key is valid
 * @param key - The API key to verify
 * @returns A promise resolving to true if valid, false otherwise
 */
export const verifyCryptoCompareApiKey = async (key: string): Promise<boolean> => {
  try {
    // Simulate API verification with a delay
    await new Promise(resolve => setTimeout(resolve, 800));
    // In a real app, this would make an actual API request
    return key.length > 24; // Simple validation for example purposes
  } catch (error) {
    console.error("Error verifying CryptoCompare API key:", error);
    return false;
  }
};
