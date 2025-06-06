
// Enhanced Algorand API Service with complete integration
const ALGORAND_API_TOKEN = '98D9CE80660AD243893D56D9F125CD2D';
const MAINNET_API = 'https://mainnet-api.4160.nodely.io';
const MAINNET_INDEXER = 'https://mainnet-idx.4160.nodely.io';
const TESTNET_API = 'https://testnet-api.4160.nodely.io';
const TESTNET_INDEXER = 'https://testnet-idx.4160.nodely.io';
const BETANET_API = 'https://betanet-api.4160.nodely.io';
const BETANET_INDEXER = 'https://betanet-idx.4160.nodely.io';

interface AlgorandNetworkStatus {
  'last-round': number;
  'time-since-last-round': number;
  'catchup-time': number;
  'has-sync-finished': boolean;
}

type NetworkType = 'mainnet' | 'testnet' | 'betanet';

class AlgorandService {
  private currentNetwork: NetworkType = 'mainnet';
  private headers = {
    'X-Algo-api-token': ALGORAND_API_TOKEN,
    'Content-Type': 'application/json'
  };

  private getApiUrl(): string {
    switch (this.currentNetwork) {
      case 'testnet': return TESTNET_API;
      case 'betanet': return BETANET_API;
      default: return MAINNET_API;
    }
  }

  private getIndexerUrl(): string {
    switch (this.currentNetwork) {
      case 'testnet': return TESTNET_INDEXER;
      case 'betanet': return BETANET_INDEXER;
      default: return MAINNET_INDEXER;
    }
  }

  async setNetwork(network: NetworkType): Promise<void> {
    this.currentNetwork = network;
    console.log(`Algorand network switched to: ${network}`);
  }

  async getNetworkStatus(): Promise<AlgorandNetworkStatus> {
    try {
      const response = await fetch(`${this.getApiUrl()}/v2/status`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching Algorand network status:', error);
      throw error;
    }
  }

  async getAccount(address: string): Promise<any> {
    try {
      const response = await fetch(`${this.getIndexerUrl()}/v2/accounts/${address}`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.account;
    } catch (error) {
      console.error('Error fetching Algorand account:', error);
      throw error;
    }
  }

  async getAccountSnapshot(address: string, round: number): Promise<any> {
    try {
      const response = await fetch(
        `${this.getIndexerUrl()}/x2/account/${address}/snapshot/${round}/0`,
        { headers: this.headers }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching account snapshot:', error);
      throw error;
    }
  }

  async getAlgoPrice(): Promise<number> {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=algorand&vs_currencies=aud');
      const data = await response.json();
      return data.algorand?.aud || 0.48;
    } catch (error) {
      console.error('Error fetching ALGO price:', error);
      return 0.48;
    }
  }

  async getPortfolioValue(address: string): Promise<{ totalValue: number; assets: any[] }> {
    try {
      const account = await this.getAccount(address);
      const algoPrice = await this.getAlgoPrice();
      
      const algoBalance = account.amount / 1000000;
      const algoValueAUD = algoBalance * algoPrice;
      
      const assets = [{
        symbol: 'ALGO',
        name: 'Algorand',
        balance: algoBalance,
        priceAUD: algoPrice,
        valueAUD: algoValueAUD,
        isNative: true
      }];

      return {
        totalValue: algoValueAUD,
        assets
      };
    } catch (error) {
      console.error('Error calculating portfolio value:', error);
      return { totalValue: 0, assets: [] };
    }
  }

  getMockData() {
    return {
      network: this.currentNetwork,
      status: 'connected',
      lastRound: 12345678,
      accounts: [
        {
          address: 'ALGORAND_DEMO_ADDRESS_123456789',
          balance: 1250.5,
          assets: ['ALGO', 'USDC', 'USDT'],
          valueAUD: 600.24
        }
      ],
      prices: {
        ALGO: {
          price: 0.48,
          change24h: 2.5,
          volume: 85000000,
          marketCap: 3500000000
        }
      }
    };
  }
}

export const algorandService = new AlgorandService();
export default algorandService;
