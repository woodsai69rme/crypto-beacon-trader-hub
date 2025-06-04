
// Algorand API Service using provided credentials
const ALGORAND_API_TOKEN = '98D9CE80660AD243893D56D9F125CD2D';
const MAINNET_API = 'https://mainnet-api.4160.nodely.io';
const MAINNET_INDEXER = 'https://mainnet-idx.4160.nodely.io';

interface AlgorandAccount {
  address: string;
  amount: number;
  assets: any[];
  'created-at-round': number;
}

interface AlgorandAsset {
  index: number;
  params: {
    name: string;
    'unit-name': string;
    total: number;
    decimals: number;
    creator: string;
  };
}

class AlgorandService {
  private headers = {
    'X-Algo-api-token': ALGORAND_API_TOKEN,
    'Content-Type': 'application/json'
  };

  async getNetworkStatus() {
    try {
      const response = await fetch(`${MAINNET_API}/v2/status`, {
        headers: this.headers
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching Algorand network status:', error);
      throw error;
    }
  }

  async getAccount(address: string): Promise<AlgorandAccount> {
    try {
      const response = await fetch(`${MAINNET_INDEXER}/v2/accounts/${address}`, {
        headers: this.headers
      });
      const data = await response.json();
      return data.account;
    } catch (error) {
      console.error('Error fetching Algorand account:', error);
      throw error;
    }
  }

  async getAssetInfo(assetId: number): Promise<AlgorandAsset> {
    try {
      const response = await fetch(`${MAINNET_INDEXER}/v2/assets/${assetId}`, {
        headers: this.headers
      });
      const data = await response.json();
      return data.asset;
    } catch (error) {
      console.error('Error fetching Algorand asset info:', error);
      throw error;
    }
  }

  async getAccountSnapshot(address: string, round: number, assetId: number = 0) {
    try {
      const response = await fetch(
        `${MAINNET_INDEXER}/x2/account/${address}/snapshot/${round}/${assetId}`,
        { headers: this.headers }
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching account snapshot:', error);
      throw error;
    }
  }

  async searchTransactions(params: any = {}) {
    try {
      const queryParams = new URLSearchParams(params);
      const response = await fetch(
        `${MAINNET_INDEXER}/v2/transactions?${queryParams}`,
        { headers: this.headers }
      );
      return await response.json();
    } catch (error) {
      console.error('Error searching transactions:', error);
      throw error;
    }
  }

  // Mock price data for demo purposes
  getMockAlgorandPrices() {
    return {
      ALGO: {
        price: 0.32,
        change24h: 2.5,
        volume: 85000000,
        marketCap: 2500000000
      }
    };
  }
}

export const algorandService = new AlgorandService();
export default algorandService;
