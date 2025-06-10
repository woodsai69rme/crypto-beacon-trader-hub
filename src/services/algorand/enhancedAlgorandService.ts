import algosdk from 'algosdk';
import { COINGECKO_API_URL } from '@/config';

interface CoinGeckoPriceResponse {
  [key: string]: {
    usd: number;
    aud: number;
  };
}

interface AssetData {
  coinId: string;
  symbol: string;
  name: string;
  amount: number;
  price: number;
  value: number;
  priceAUD: number;
  valueAUD: number;
  isNative: boolean;
}

interface AlgorandAccountInfo {
  address: string;
  amount: number;
  assets: AssetData[];
  apps?: any[];
  createdAssets?: any[];
}

export class EnhancedAlgorandService {
  private algodClient: algosdk.Algodv2;

  constructor(algodServer: string, algodPort: string | number, algodToken: string) {
    this.algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.algodClient.getStatus().do();
      return true;
    } catch (error) {
      console.error('Algorand node health check failed:', error);
      return false;
    }
  }

  async getAssetPrice(coinId: string): Promise<{ usd: number; aud: number }> {
    try {
      const url = `${COINGECKO_API_URL}/simple/price?ids=${coinId}&vs_currencies=usd,aud`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: CoinGeckoPriceResponse = await response.json();

      if (data && data[coinId]) {
        return data[coinId];
      } else {
        throw new Error(`Price not found for ${coinId}`);
      }
    } catch (error) {
      console.error(`Failed to fetch price for ${coinId}:`, error);
      return { usd: 0, aud: 0 };
    }
  }

  async getAccountInfo(address: string): Promise<AlgorandAccountInfo> {
    try {
      const accountInfo = await this.algodClient.accountInformation(address).do();
      return {
        address: accountInfo.address,
        amount: accountInfo.amount,
        assets: [], // Initialize as empty, will be populated by getAccountAssets
        apps: accountInfo['apps-local-state'],
        createdAssets: accountInfo['created-assets']
      };
    } catch (error) {
      console.error('Error fetching account information:', error);
      throw error;
    }
  }

async getAccountAssets(address: string): Promise<AssetData[]> {
  try {
    const accountInfo = await this.algodClient.accountInformation(address).do();
    const assets: AssetData[] = [];
    
    // Add ALGO (native asset)
    const algoAmount = accountInfo.amount / 1000000; // Convert microAlgos to Algos
    const algoPrice = await this.getAssetPrice('algorand');
    
    assets.push({
      coinId: 'algorand',
      symbol: 'ALGO',
      name: 'Algorand',
      amount: algoAmount,
      price: algoPrice.usd,
      value: algoAmount * algoPrice.usd,
      priceAUD: algoPrice.aud,
      valueAUD: algoAmount * algoPrice.aud,
      isNative: true
    });

    // Add ASAs (Algorand Standard Assets)
    if (accountInfo.assets) {
      for (const asset of accountInfo.assets) {
        try {
          const assetInfo = await this.algodClient.getAssetByID(asset['asset-id']).do();
          const decimals = assetInfo.params.decimals || 0;
          const amount = asset.amount / Math.pow(10, decimals);
          
          // Try to get price from CoinGecko (this is a simplified approach)
          // In practice, you'd need to map ASA IDs to CoinGecko IDs
          const price = { usd: 0, aud: 0 }; // Default for unknown assets
          
          assets.push({
            coinId: `asa-${asset['asset-id']}`,
            symbol: assetInfo.params['unit-name'] || 'UNKNOWN',
            name: assetInfo.params.name || 'Unknown Asset',
            amount: amount,
            price: price.usd,
            value: amount * price.usd,
            priceAUD: price.aud,
            valueAUD: amount * price.aud,
            isNative: false
          });
        } catch (error) {
          console.error(`Error fetching asset info for ${asset['asset-id']}:`, error);
        }
      }
    }

    return assets;
  } catch (error) {
    console.error('Error fetching account assets:', error);
    throw error;
  }
}

  async getAppLocalState(address: string, appId: number): Promise<any> {
    try {
      const accountInfo = await this.algodClient.accountInformation(address).do();
      const appState = accountInfo['apps-local-state']?.find((app: any) => app.id === appId);
      return appState || null;
    } catch (error) {
      console.error(`Error fetching local state for app ${appId} and account ${address}:`, error);
      return null;
    }
  }

  async getCreatedAssets(address: string): Promise<any[]> {
    try {
      const accountInfo = await this.algodClient.accountInformation(address).do();
      return accountInfo['created-assets'] || [];
    } catch (error) {
      console.error(`Error fetching created assets for account ${address}:`, error);
      return [];
    }
  }
}
