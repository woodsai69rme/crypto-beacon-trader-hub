
import algosdk from 'algosdk';
import { COINGECKO_API_URL, ALGORAND_NETWORKS } from '@/config';

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

type NetworkType = 'mainnet' | 'testnet' | 'betanet';

export class EnhancedAlgorandService {
  private algodClient: algosdk.Algodv2;
  private indexerClient: algosdk.Indexer;
  private currentNetwork: NetworkType = 'mainnet';

  constructor(network: NetworkType = 'mainnet') {
    this.setNetwork(network);
  }

  setNetwork(network: NetworkType): void {
    this.currentNetwork = network;
    const config = ALGORAND_NETWORKS[network];
    
    this.algodClient = new algosdk.Algodv2(
      config.algodToken,
      config.algodServer,
      config.algodPort
    );
    
    this.indexerClient = new algosdk.Indexer(
      config.indexerToken,
      config.indexerServer,
      config.indexerPort
    );
  }

  async healthCheck(): Promise<{ status: boolean; network: NetworkType }> {
    try {
      await this.algodClient.status().do();
      return { status: true, network: this.currentNetwork };
    } catch (error) {
      console.error('Algorand node health check failed:', error);
      return { status: false, network: this.currentNetwork };
    }
  }

  async getNetworkStatus(): Promise<any> {
    try {
      return await this.algodClient.status().do();
    } catch (error) {
      console.error('Error fetching network status:', error);
      throw error;
    }
  }

  async getNetworkMetrics(): Promise<any> {
    try {
      const status = await this.algodClient.status().do();
      return {
        lastRound: status['last-round'],
        timeSinceLastRound: status['time-since-last-round'],
        hasSyncFinished: status['has-sync-finished']
      };
    } catch (error) {
      console.error('Error fetching network metrics:', error);
      return {};
    }
  }

  async getAlgoPrice(): Promise<number> {
    try {
      const response = await fetch(`${COINGECKO_API_URL}/simple/price?ids=algorand&vs_currencies=aud`);
      const data = await response.json();
      return data.algorand?.aud || 0;
    } catch (error) {
      console.error('Error fetching ALGO price:', error);
      return 0;
    }
  }

  isValidAlgorandAddress(address: string): boolean {
    try {
      return algosdk.isValidAddress(address);
    } catch {
      return false;
    }
  }

  async getAccount(address: string): Promise<AlgorandAccountInfo> {
    try {
      const accountInfo = await this.algodClient.accountInformation(address).do();
      
      // Convert bigint to number for amount
      const amount = typeof accountInfo.amount === 'bigint' 
        ? Number(accountInfo.amount) 
        : accountInfo.amount;

      // Process assets to match AssetData interface
      const processedAssets: AssetData[] = [];
      
      if (accountInfo.assets) {
        for (const asset of accountInfo.assets) {
          try {
            const assetInfo = await this.algodClient.getAssetByID(asset['asset-id']).do();
            const decimals = assetInfo.params.decimals || 0;
            const assetAmount = typeof asset.amount === 'bigint' 
              ? Number(asset.amount) / Math.pow(10, decimals)
              : asset.amount / Math.pow(10, decimals);
            
            processedAssets.push({
              coinId: `asa-${asset['asset-id']}`,
              symbol: assetInfo.params['unit-name'] || 'UNKNOWN',
              name: assetInfo.params.name || 'Unknown Asset',
              amount: assetAmount,
              price: 0, // Default price
              value: 0, // Default value
              priceAUD: 0, // Default price in AUD
              valueAUD: 0, // Default value in AUD
              isNative: false
            });
          } catch (error) {
            console.error(`Error processing asset ${asset['asset-id']}:`, error);
          }
        }
      }

      return {
        address: accountInfo.address,
        amount: amount,
        assets: processedAssets,
        apps: accountInfo['apps-local-state'],
        createdAssets: accountInfo['created-assets']
      };
    } catch (error) {
      console.error('Error fetching account information:', error);
      throw error;
    }
  }

  async getPortfolioValue(address: string): Promise<{ totalValue: number }> {
    try {
      const accountInfo = await this.getAccount(address);
      const algoAmount = accountInfo.amount / 1000000; // Convert microAlgos to Algos
      const algoPrice = await this.getAlgoPrice();
      
      return {
        totalValue: algoAmount * algoPrice
      };
    } catch (error) {
      console.error('Error calculating portfolio value:', error);
      return { totalValue: 0 };
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
    return this.getAccount(address);
  }

  async getAccountAssets(address: string): Promise<AssetData[]> {
    try {
      const accountInfo = await this.algodClient.accountInformation(address).do();
      const assets: AssetData[] = [];
      
      // Add ALGO (native asset)
      const algoAmount = (typeof accountInfo.amount === 'bigint' 
        ? Number(accountInfo.amount) 
        : accountInfo.amount) / 1000000; // Convert microAlgos to Algos
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
            const amount = (typeof asset.amount === 'bigint' 
              ? Number(asset.amount) 
              : asset.amount) / Math.pow(10, decimals);
            
            // Try to get price from CoinGecko (this is a simplified approach)
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

// Export both the class and a default instance
export const enhancedAlgorandService = new EnhancedAlgorandService();
export default enhancedAlgorandService;
