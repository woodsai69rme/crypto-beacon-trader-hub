
import { toast } from "@/components/ui/use-toast";
import { CryptoData } from "@/types/trading";

// Mock API key storage
let apiKey: string | null = null;

export const setCoinMarketCapApiKey = (key: string) => {
  apiKey = key;
  localStorage.setItem('coinMarketCapApiKey', key);
  return true;
};

export const getCoinMarketCapApiKey = (): string | null => {
  if (!apiKey) {
    apiKey = localStorage.getItem('coinMarketCapApiKey');
  }
  return apiKey;
};

export const fetchLatestListings = async (limit: number = 10): Promise<CryptoData[]> => {
  try {
    // In a real app, we'd use the API key with proper CORS handling
    // This would usually be done through a backend proxy
    // For demo purposes, we'll generate mock data
    
    throw new Error('Using mock data');
    
  } catch (error) {
    console.error("Error fetching from CoinMarketCap:", error);
    // Only show toast for real API errors, not our mock data
    if (!(error instanceof Error && error.message === 'Using mock data')) {
      toast({
        title: "API Error",
        description: "Could not fetch data from CoinMarketCap API. Using mock data instead.",
        variant: "destructive",
      });
    }
    
    // Return mock data
    return import("../cryptoApi").then(module => module.getMockCryptoData().slice(0, limit));
  }
};

export const fetchMetadata = async (ids: string[]): Promise<Record<string, any>> => {
  try {
    // In a real app, we'd use the API key with proper CORS handling
    throw new Error('Using mock data');
    
  } catch (error) {
    console.error("Error fetching metadata from CoinMarketCap:", error);
    // Only show toast for real API errors, not our mock data
    if (!(error instanceof Error && error.message === 'Using mock data')) {
      toast({
        title: "API Error",
        description: "Could not fetch metadata from CoinMarketCap API. Using mock data instead.",
        variant: "destructive",
      });
    }
    
    // Return mock metadata
    const mockMetadata: Record<string, any> = {};
    
    ids.forEach(id => {
      if (id === '1') { // Bitcoin
        mockMetadata[id] = {
          name: 'Bitcoin',
          symbol: 'BTC',
          logo: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
          description: 'Bitcoin is the first decentralized cryptocurrency...',
          urls: {
            website: ['https://bitcoin.org/'],
            twitter: ['https://twitter.com/bitcoin'],
            reddit: ['https://reddit.com/r/bitcoin'],
            message_board: ['https://bitcointalk.org'],
            explorer: ['https://blockchain.info/', 'https://blockchair.com/bitcoin'],
            source_code: ['https://github.com/bitcoin/bitcoin']
          },
          tags: ['mineable', 'pow', 'store-of-value']
        };
      } else if (id === '1027') { // Ethereum
        mockMetadata[id] = {
          name: 'Ethereum',
          symbol: 'ETH',
          logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
          description: 'Ethereum is a global, open-source platform for decentralized applications...',
          urls: {
            website: ['https://ethereum.org/'],
            twitter: ['https://twitter.com/ethereum'],
            reddit: ['https://reddit.com/r/ethereum'],
            message_board: ['https://forum.ethereum.org/'],
            explorer: ['https://etherscan.io/'],
            source_code: ['https://github.com/ethereum/go-ethereum']
          },
          tags: ['mineable', 'pow', 'smart-contracts']
        };
      } else {
        // Generic metadata for other coins
        mockMetadata[id] = {
          name: `Coin ${id}`,
          symbol: `COIN${id}`,
          logo: 'https://via.placeholder.com/200',
          description: 'A cryptocurrency with various features and use cases.',
          urls: {
            website: ['https://example.com'],
          },
          tags: ['blockchain', 'cryptocurrency']
        };
      }
    });
    
    return mockMetadata;
  }
};
