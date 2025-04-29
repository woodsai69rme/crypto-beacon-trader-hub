
import { toast } from "@/components/ui/use-toast";

// Mock API key storage
let apiKey: string | null = null;

export const setCryptoCompareApiKey = (key: string) => {
  apiKey = key;
  localStorage.setItem('cryptoCompareApiKey', key);
  return true;
};

export const getCryptoCompareApiKey = (): string | null => {
  if (!apiKey) {
    apiKey = localStorage.getItem('cryptoCompareApiKey');
  }
  return apiKey;
};

export const fetchPriceMulti = async (fromSymbols: string[], toSymbols: string[]): Promise<Record<string, Record<string, number>>> => {
  try {
    const key = getCryptoCompareApiKey();
    const headers: HeadersInit = {};
    
    if (key) {
      headers['authorization'] = `Apikey ${key}`;
    }
    
    const fsyms = fromSymbols.join(',');
    const tsyms = toSymbols.join(',');
    
    const response = await fetch(
      `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${fsyms}&tsyms=${tsyms}`,
      { headers }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch prices from CryptoCompare');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching from CryptoCompare:", error);
    toast({
      title: "API Error",
      description: "Could not fetch data from CryptoCompare API. Using mock data instead.",
      variant: "destructive",
    });
    
    // Return mock data
    const mockData: Record<string, Record<string, number>> = {};
    
    fromSymbols.forEach(from => {
      mockData[from] = {};
      toSymbols.forEach(to => {
        let rate = 1;
        if (from === 'BTC' && to === 'USD') rate = 58000;
        else if (from === 'ETH' && to === 'USD') rate = 3500;
        else if (from === 'BTC' && to === 'EUR') rate = 54000;
        else if (from === 'ETH' && to === 'EUR') rate = 3250;
        mockData[from][to] = rate;
      });
    });
    
    return mockData;
  }
};

export const fetchHistoricalDaily = async (
  symbol: string,
  currency: string = 'USD',
  limit: number = 30
): Promise<{ time: number; close: number; high: number; low: number; open: number; volumefrom: number; volumeto: number }[]> => {
  try {
    const key = getCryptoCompareApiKey();
    const headers: HeadersInit = {};
    
    if (key) {
      headers['authorization'] = `Apikey ${key}`;
    }
    
    const response = await fetch(
      `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=${currency}&limit=${limit}`,
      { headers }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch historical data from CryptoCompare');
    }
    
    const data = await response.json();
    return data.Data.Data;
  } catch (error) {
    console.error("Error fetching from CryptoCompare:", error);
    toast({
      title: "API Error",
      description: "Could not fetch historical data from CryptoCompare API. Using mock data instead.",
      variant: "destructive",
    });
    
    // Generate mock historical data
    const mockData = [];
    const now = Math.floor(Date.now() / 1000);
    let price = symbol === 'BTC' ? 58000 : 3500;
    
    for (let i = limit; i >= 0; i--) {
      const time = now - i * 24 * 60 * 60;
      const change = (Math.random() - 0.5) * 0.05; // -2.5% to +2.5%
      price = price * (1 + change);
      
      mockData.push({
        time,
        close: price,
        high: price * 1.02,
        low: price * 0.98,
        open: price * (1 - change/2),
        volumefrom: 1000 * Math.random() * 100,
        volumeto: price * 1000 * Math.random() * 100
      });
    }
    
    return mockData;
  }
};
