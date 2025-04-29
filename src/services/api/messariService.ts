
import { toast } from "@/components/ui/use-toast";

let apiKey: string | null = null;

export const setMessariApiKey = (key: string) => {
  apiKey = key;
  localStorage.setItem('messariApiKey', key);
  toast({
    title: "API Key Updated",
    description: "Your Messari API key has been updated successfully.",
  });
  return true;
};

export const getMessariApiKey = (): string | null => {
  if (!apiKey) {
    apiKey = localStorage.getItem('messariApiKey');
  }
  return apiKey;
};

export const fetchMessariMetrics = async (assetKey: string) => {
  const key = getMessariApiKey();
  
  if (!key) {
    toast({
      title: "API Key Required",
      description: "Please set your Messari API key in settings.",
      variant: "destructive",
    });
    return null;
  }
  
  try {
    // In a real app, we would use the key for authentication
    const response = await fetch(`https://data.messari.io/api/v1/assets/${assetKey}/metrics`, {
      headers: {
        'x-messari-api-key': key
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch Messari metrics');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching from Messari:", error);
    toast({
      title: "API Error",
      description: "Could not fetch data from Messari API.",
      variant: "destructive",
    });
    
    // Return mock data
    return {
      data: {
        name: assetKey,
        symbol: assetKey.toUpperCase(),
        market_data: {
          price_usd: 45000 + Math.random() * 1000,
          percent_change_usd_last_24_hours: (Math.random() * 10) - 5
        },
        marketcap: {
          current_marketcap_usd: 800000000000 + Math.random() * 20000000000
        },
        supply: {
          circulating: 19000000 + Math.random() * 100000
        },
        roi_data: {
          percent_change_last_1_week: (Math.random() * 15) - 7,
          percent_change_last_1_month: (Math.random() * 20) - 10
        }
      }
    };
  }
};
