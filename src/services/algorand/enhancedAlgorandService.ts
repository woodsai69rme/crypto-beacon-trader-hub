
// Enhanced Algorand API Service with complete integration
const ALGORAND_API_TOKEN = '98D9CE80660AD243893D56D9F125CD2D';
const MAINNET_API = 'https://mainnet-api.4160.nodely.io';
const MAINNET_INDEXER = 'https://mainnet-idx.4160.nodely.io';
const TESTNET_API = 'https://testnet-api.4160.nodely.io';
const TESTNET_INDEXER = 'https://testnet-idx.4160.nodely.io';
const BETANET_API = 'https://betanet-api.4160.nodely.io';
const BETANET_INDEXER = 'https://betanet-idx.4160.nodely.io';

// IPFS Gateway configuration
const IPFS_GATEWAY = 'https://nodely.io/ipfs/';

interface AlgorandNetworkStatus {
  'last-round': number;
  'time-since-last-round': number;
  'catchup-time': number;
  'has-sync-finished': boolean;
  'stopped-at-unsupported-round': boolean;
}

interface AlgorandAccountInfo {
  address: string;
  amount: number;
  assets: AlgorandAssetHolding[];
  'created-at-round': number;
  'min-balance': number;
  status: string;
  'apps-local-state'?: any[];
  'apps-total-schema'?: any;
}

interface AlgorandAssetHolding {
  'asset-id': number;
  amount: number;
  'is-frozen': boolean;
}

interface AlgorandAssetInfo {
  index: number;
  params: {
    name: string;
    'unit-name': string;
    total: number;
    decimals: number;
    creator: string;
    url?: string;
    'metadata-hash'?: string;
    'default-frozen'?: boolean;
  };
}

interface AlgorandTransaction {
  id: string;
  'confirmed-round': number;
  'round-time': number;
  sender: string;
  'tx-type': string;
  fee: number;
  'payment-transaction'?: {
    amount: number;
    receiver: string;
  };
  'asset-transfer-transaction'?: {
    'asset-id': number;
    amount: number;
    receiver: string;
  };
}

interface TimeravelSnapshot {
  account: AlgorandAccountInfo;
  round: number;
  timestamp: number;
}

type NetworkType = 'mainnet' | 'testnet' | 'betanet';

class EnhancedAlgorandService {
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
    
    // Verify connection to new network
    try {
      await this.getNetworkStatus();
      console.log(`Successfully connected to ${network}`);
    } catch (error) {
      console.error(`Failed to connect to ${network}:`, error);
      throw new Error(`Failed to switch to ${network} network`);
    }
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
      console.log('Algorand network status:', data);
      return data;
    } catch (error) {
      console.error('Error fetching Algorand network status:', error);
      throw error;
    }
  }

  async getAccount(address: string): Promise<AlgorandAccountInfo> {
    try {
      const response = await fetch(`${this.getIndexerUrl()}/v2/accounts/${address}`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Algorand account data:', data);
      return data.account;
    } catch (error) {
      console.error('Error fetching Algorand account:', error);
      throw error;
    }
  }

  async getAssetInfo(assetId: number): Promise<AlgorandAssetInfo> {
    try {
      const response = await fetch(`${this.getIndexerUrl()}/v2/assets/${assetId}`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.asset;
    } catch (error) {
      console.error('Error fetching Algorand asset info:', error);
      throw error;
    }
  }

  // Time Travel Balance Query Implementation
  async getAccountSnapshot(address: string, round: number, assetId: number = 0): Promise<TimeravelSnapshot> {
    try {
      const response = await fetch(
        `${this.getIndexerUrl()}/x2/account/${address}/snapshot/${round}/${assetId}`,
        { headers: this.headers }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        account: data.account,
        round: round,
        timestamp: data.timestamp || Date.now()
      };
    } catch (error) {
      console.error('Error fetching account snapshot:', error);
      throw error;
    }
  }

  async searchTransactions(params: Record<string, any> = {}): Promise<{ transactions: AlgorandTransaction[] }> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
      
      const response = await fetch(
        `${this.getIndexerUrl()}/v2/transactions?${queryParams}`,
        { headers: this.headers }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching transactions:', error);
      throw error;
    }
  }

  async getAccountTransactions(address: string, limit: number = 10): Promise<AlgorandTransaction[]> {
    try {
      const result = await this.searchTransactions({
        address,
        limit,
        'tx-type': 'pay'
      });
      return result.transactions || [];
    } catch (error) {
      console.error('Error fetching account transactions:', error);
      return [];
    }
  }

  async getAssetHoldings(address: string): Promise<AlgorandAssetHolding[]> {
    try {
      const account = await this.getAccount(address);
      return account.assets || [];
    } catch (error) {
      console.error('Error fetching asset holdings:', error);
      return [];
    }
  }

  async getAlgoPrice(): Promise<number> {
    try {
      // Get ALGO price from CoinGecko and convert to AUD
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=algorand&vs_currencies=aud');
      const data = await response.json();
      return data.algorand?.aud || 0.48; // Fallback price in AUD
    } catch (error) {
      console.error('Error fetching ALGO price:', error);
      return 0.48; // Fallback price in AUD
    }
  }

  async getPortfolioValue(address: string): Promise<{ totalValue: number; assets: any[] }> {
    try {
      const account = await this.getAccount(address);
      const algoPrice = await this.getAlgoPrice();
      
      // Convert microAlgos to Algos and then to AUD
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

      // Add asset holdings
      if (account.assets && account.assets.length > 0) {
        for (const holding of account.assets) {
          try {
            const assetInfo = await this.getAssetInfo(holding['asset-id']);
            const assetBalance = holding.amount / Math.pow(10, assetInfo.params.decimals);
            
            assets.push({
              assetId: holding['asset-id'],
              symbol: assetInfo.params['unit-name'] || `ASA-${holding['asset-id']}`,
              name: assetInfo.params.name || `Asset ${holding['asset-id']}`,
              balance: assetBalance,
              priceAUD: 0, // Would need price feed for ASAs
              valueAUD: 0,
              isNative: false,
              decimals: assetInfo.params.decimals
            });
          } catch (error) {
            console.error(`Error fetching asset ${holding['asset-id']} info:`, error);
          }
        }
      }

      return {
        totalValue: algoValueAUD, // Currently only counting ALGO value
        assets
      };
    } catch (error) {
      console.error('Error calculating portfolio value:', error);
      return { totalValue: 0, assets: [] };
    }
  }

  // IPFS Integration
  async getIPFSContent(hash: string): Promise<any> {
    try {
      const response = await fetch(`${IPFS_GATEWAY}${hash}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch IPFS content: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching IPFS content:', error);
      throw error;
    }
  }

  async getOptimizedImage(hash: string, width?: number, height?: number, quality?: number): Promise<string> {
    let url = `${IPFS_GATEWAY}${hash}`;
    const params = new URLSearchParams();
    
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    if (quality) params.append('q', quality.toString());
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    return url;
  }

  // Advanced Analytics
  async getNetworkMetrics(): Promise<any> {
    try {
      const status = await this.getNetworkStatus();
      const algoPrice = await this.getAlgoPrice();
      
      return {
        lastRound: status['last-round'],
        timeSinceLastRound: status['time-since-last-round'],
        catchupTime: status['catchup-time'],
        hasSyncFinished: status['has-sync-finished'],
        algoPrice: algoPrice,
        network: this.currentNetwork,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching network metrics:', error);
      throw error;
    }
  }

  // Portfolio Tracking with Historical Data
  async getPortfolioHistory(address: string, rounds: number[] = []): Promise<any[]> {
    const history = [];
    
    try {
      for (const round of rounds) {
        const snapshot = await this.getAccountSnapshot(address, round);
        const algoPrice = await this.getAlgoPrice(); // In production, get historical price
        
        const algoBalance = snapshot.account.amount / 1000000;
        const valueAUD = algoBalance * algoPrice;
        
        history.push({
          round,
          timestamp: snapshot.timestamp,
          balance: algoBalance,
          valueAUD,
          assets: snapshot.account.assets?.length || 0
        });
      }
    } catch (error) {
      console.error('Error fetching portfolio history:', error);
    }
    
    return history;
  }

  // Utility methods
  formatAlgoAmount(microAlgos: number): number {
    return microAlgos / 1000000;
  }

  formatAssetAmount(amount: number, decimals: number): number {
    return amount / Math.pow(10, decimals);
  }

  isValidAlgorandAddress(address: string): boolean {
    // Basic validation - Algorand addresses are 58 characters long
    return typeof address === 'string' && address.length === 58;
  }

  async healthCheck(): Promise<{ status: boolean; network: string; lastRound?: number }> {
    try {
      const status = await this.getNetworkStatus();
      return {
        status: true,
        network: this.currentNetwork,
        lastRound: status['last-round']
      };
    } catch (error) {
      console.error('Algorand health check failed:', error);
      return {
        status: false,
        network: this.currentNetwork
      };
    }
  }

  // Demo data for testing
  getMockAlgorandData() {
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

export const enhancedAlgorandService = new EnhancedAlgorandService();
export default enhancedAlgorandService;
