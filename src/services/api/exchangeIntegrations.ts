
import { toast } from "@/components/ui/use-toast";

export interface ExchangeCredentials {
  apiKey: string;
  apiSecret: string;
  passphrase?: string;
  additionalParams?: Record<string, string>;
}

export interface Exchange {
  id: string;
  name: string;
  logo?: string;
  website: string;
  apiDocs: string;
  supportedFeatures: {
    spotTrading: boolean;
    marginTrading: boolean;
    futuresTrading: boolean;
    stakingSupport: boolean;
    apiRateLimit: number; // requests per minute
    websocketSupport: boolean;
  };
  connectionStatus: 'connected' | 'disconnected' | 'error';
  lastConnected?: string;
  credentials?: ExchangeCredentials;
}

// List of supported exchanges
export const supportedExchanges: Exchange[] = [
  {
    id: 'binance',
    name: 'Binance',
    website: 'https://binance.com',
    apiDocs: 'https://binance-docs.github.io/apidocs/',
    supportedFeatures: {
      spotTrading: true,
      marginTrading: true,
      futuresTrading: true,
      stakingSupport: true,
      apiRateLimit: 1200,
      websocketSupport: true
    },
    connectionStatus: 'disconnected'
  },
  {
    id: 'coinbase',
    name: 'Coinbase',
    website: 'https://coinbase.com',
    apiDocs: 'https://docs.cloud.coinbase.com/exchange/docs',
    supportedFeatures: {
      spotTrading: true,
      marginTrading: false,
      futuresTrading: false,
      stakingSupport: true,
      apiRateLimit: 300,
      websocketSupport: true
    },
    connectionStatus: 'disconnected'
  },
  {
    id: 'kraken',
    name: 'Kraken',
    website: 'https://kraken.com',
    apiDocs: 'https://docs.kraken.com/rest/',
    supportedFeatures: {
      spotTrading: true,
      marginTrading: true,
      futuresTrading: true,
      stakingSupport: true,
      apiRateLimit: 600,
      websocketSupport: true
    },
    connectionStatus: 'disconnected'
  },
  {
    id: 'kucoin',
    name: 'KuCoin',
    website: 'https://kucoin.com',
    apiDocs: 'https://docs.kucoin.com/',
    supportedFeatures: {
      spotTrading: true,
      marginTrading: true,
      futuresTrading: true,
      stakingSupport: true,
      apiRateLimit: 300,
      websocketSupport: true
    },
    connectionStatus: 'disconnected'
  },
  {
    id: 'bybit',
    name: 'Bybit',
    website: 'https://bybit.com',
    apiDocs: 'https://bybit-exchange.github.io/docs/',
    supportedFeatures: {
      spotTrading: true,
      marginTrading: true,
      futuresTrading: true,
      stakingSupport: false,
      apiRateLimit: 600,
      websocketSupport: true
    },
    connectionStatus: 'disconnected'
  },
  {
    id: 'okx',
    name: 'OKX',
    website: 'https://okx.com',
    apiDocs: 'https://www.okx.com/docs-v5/',
    supportedFeatures: {
      spotTrading: true,
      marginTrading: true,
      futuresTrading: true,
      stakingSupport: true,
      apiRateLimit: 600,
      websocketSupport: true
    },
    connectionStatus: 'disconnected'
  },
  {
    id: 'bitfinex',
    name: 'Bitfinex',
    website: 'https://bitfinex.com',
    apiDocs: 'https://docs.bitfinex.com/',
    supportedFeatures: {
      spotTrading: true,
      marginTrading: true,
      futuresTrading: false,
      stakingSupport: true,
      apiRateLimit: 300,
      websocketSupport: true
    },
    connectionStatus: 'disconnected'
  },
  {
    id: 'huobi',
    name: 'Huobi',
    website: 'https://huobi.com',
    apiDocs: 'https://huobiapi.github.io/docs/',
    supportedFeatures: {
      spotTrading: true,
      marginTrading: true,
      futuresTrading: true,
      stakingSupport: true,
      apiRateLimit: 300,
      websocketSupport: true
    },
    connectionStatus: 'disconnected'
  },
  {
    id: 'ftx',
    name: 'FTX',
    website: 'https://ftx.com',
    apiDocs: 'https://docs.ftx.com/',
    supportedFeatures: {
      spotTrading: true,
      marginTrading: true,
      futuresTrading: true,
      stakingSupport: true,
      apiRateLimit: 600,
      websocketSupport: true
    },
    connectionStatus: 'disconnected'
  },
  {
    id: 'gate',
    name: 'Gate.io',
    website: 'https://gate.io',
    apiDocs: 'https://www.gate.io/docs/apiv4/',
    supportedFeatures: {
      spotTrading: true,
      marginTrading: true,
      futuresTrading: true,
      stakingSupport: true,
      apiRateLimit: 300,
      websocketSupport: true
    },
    connectionStatus: 'disconnected'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    website: 'https://gemini.com',
    apiDocs: 'https://docs.gemini.com/',
    supportedFeatures: {
      spotTrading: true,
      marginTrading: false,
      futuresTrading: false,
      stakingSupport: true,
      apiRateLimit: 150,
      websocketSupport: true
    },
    connectionStatus: 'disconnected'
  },
  {
    id: 'bitstamp',
    name: 'Bitstamp',
    website: 'https://bitstamp.net',
    apiDocs: 'https://www.bitstamp.net/api/',
    supportedFeatures: {
      spotTrading: true,
      marginTrading: false,
      futuresTrading: false,
      stakingSupport: false,
      apiRateLimit: 120,
      websocketSupport: true
    },
    connectionStatus: 'disconnected'
  },
  {
    id: 'bittrex',
    name: 'Bittrex',
    website: 'https://bittrex.com',
    apiDocs: 'https://bittrex.github.io/api/',
    supportedFeatures: {
      spotTrading: true,
      marginTrading: false,
      futuresTrading: false,
      stakingSupport: true,
      apiRateLimit: 180,
      websocketSupport: true
    },
    connectionStatus: 'disconnected'
  },
  {
    id: 'mexc',
    name: 'MEXC',
    website: 'https://mexc.com',
    apiDocs: 'https://mexcdevelop.github.io/apidocs/',
    supportedFeatures: {
      spotTrading: true,
      marginTrading: true,
      futuresTrading: true,
      stakingSupport: true,
      apiRateLimit: 300,
      websocketSupport: true
    },
    connectionStatus: 'disconnected'
  },
  {
    id: 'binance_us',
    name: 'Binance US',
    website: 'https://binance.us',
    apiDocs: 'https://docs.binance.us/',
    supportedFeatures: {
      spotTrading: true,
      marginTrading: false,
      futuresTrading: false,
      stakingSupport: true,
      apiRateLimit: 600,
      websocketSupport: true
    },
    connectionStatus: 'disconnected'
  }
];

class ExchangeIntegrationService {
  private exchanges: Map<string, Exchange> = new Map();
  private storageKey = 'exchange-api-connections';
  
  constructor() {
    this.init();
  }
  
  private init(): void {
    // Load stored exchange connections
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (storedData) {
        const storedExchanges = JSON.parse(storedData);
        supportedExchanges.forEach(exchange => {
          const storedExchange = storedExchanges.find((e: Exchange) => e.id === exchange.id);
          if (storedExchange) {
            exchange.connectionStatus = storedExchange.connectionStatus;
            exchange.lastConnected = storedExchange.lastConnected;
            // Don't store actual credentials in localStorage as plaintext
            exchange.credentials = storedExchange.credentials 
              ? { ...storedExchange.credentials, apiSecret: '••••••••' } 
              : undefined;
          }
          this.exchanges.set(exchange.id, exchange);
        });
      } else {
        // Initialize with defaults
        supportedExchanges.forEach(exchange => {
          this.exchanges.set(exchange.id, exchange);
        });
      }
    } catch (error) {
      console.error('Failed to load exchange connections:', error);
      // Initialize with defaults on error
      supportedExchanges.forEach(exchange => {
        this.exchanges.set(exchange.id, exchange);
      });
    }
  }
  
  private saveExchanges(): void {
    try {
      // Create a copy without sensitive information
      const exchangesToSave = Array.from(this.exchanges.values()).map(exchange => ({
        ...exchange,
        credentials: exchange.credentials 
          ? { 
              apiKey: exchange.credentials.apiKey,
              // Don't store actual secret in localStorage
              apiSecret: exchange.credentials.apiSecret === '••••••••' 
                ? '••••••••' 
                : '••••••••', 
              passphrase: exchange.credentials.passphrase ? '••••••••' : undefined,
              additionalParams: exchange.credentials.additionalParams
            } 
          : undefined
      }));
      
      localStorage.setItem(this.storageKey, JSON.stringify(exchangesToSave));
    } catch (error) {
      console.error('Failed to save exchange connections:', error);
    }
  }
  
  public getAllExchanges(): Exchange[] {
    return Array.from(this.exchanges.values());
  }
  
  public getExchange(id: string): Exchange | undefined {
    return this.exchanges.get(id);
  }
  
  public async connectExchange(
    id: string, 
    credentials: ExchangeCredentials
  ): Promise<boolean> {
    const exchange = this.exchanges.get(id);
    if (!exchange) {
      toast({
        title: "Connection Failed",
        description: `Exchange with ID ${id} not found.`,
        variant: "destructive"
      });
      return false;
    }
    
    try {
      // In a real app, we would validate the API credentials here
      // For demo purposes, we'll just simulate a successful connection
      
      // Simulating API validation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      exchange.connectionStatus = 'connected';
      exchange.lastConnected = new Date().toISOString();
      exchange.credentials = {
        apiKey: credentials.apiKey,
        apiSecret: '••••••••', // Mask the secret for storage
        passphrase: credentials.passphrase ? '••••••••' : undefined,
        additionalParams: credentials.additionalParams
      };
      
      this.exchanges.set(id, exchange);
      this.saveExchanges();
      
      toast({
        title: "Connection Successful",
        description: `Successfully connected to ${exchange.name}.`,
      });
      
      return true;
    } catch (error) {
      console.error(`Failed to connect to ${exchange.name}:`, error);
      
      exchange.connectionStatus = 'error';
      this.exchanges.set(id, exchange);
      this.saveExchanges();
      
      toast({
        title: "Connection Failed",
        description: `Failed to connect to ${exchange.name}. Please check your API keys and try again.`,
        variant: "destructive"
      });
      
      return false;
    }
  }
  
  public disconnectExchange(id: string): void {
    const exchange = this.exchanges.get(id);
    if (!exchange) return;
    
    exchange.connectionStatus = 'disconnected';
    exchange.credentials = undefined;
    
    this.exchanges.set(id, exchange);
    this.saveExchanges();
    
    toast({
      title: "Disconnected",
      description: `Successfully disconnected from ${exchange.name}.`,
    });
  }
  
  public testConnection(id: string): Promise<boolean> {
    const exchange = this.exchanges.get(id);
    if (!exchange || !exchange.credentials) {
      toast({
        title: "Test Failed",
        description: "Exchange not connected. Please connect first.",
        variant: "destructive"
      });
      return Promise.resolve(false);
    }
    
    // Simulating API test
    return new Promise(resolve => {
      setTimeout(() => {
        toast({
          title: "Connection Test Successful",
          description: `Successfully connected to ${exchange.name}.`,
        });
        resolve(true);
      }, 1500);
    });
  }
}

// Create and export a singleton instance
export const exchangeService = new ExchangeIntegrationService();
