
import { WalletProvider, WalletAccount } from '@/types/trading';

interface Web3Window extends Window {
  ethereum?: any;
  solana?: any;
  algorand?: any;
}

class WalletIntegrationService {
  private connectedWallets: Map<string, WalletProvider> = new Map();

  async detectWallets(): Promise<WalletProvider[]> {
    const wallets: WalletProvider[] = [];
    const web3Window = window as Web3Window;

    // MetaMask detection
    if (web3Window.ethereum?.isMetaMask) {
      wallets.push({
        id: 'metamask',
        name: 'MetaMask',
        icon: '🦊',
        logo: '/logos/metamask.svg',
        description: 'Popular Ethereum wallet',
        isInstalled: true,
        isConnected: false,
        accounts: []
      });
    }

    // WalletConnect detection
    wallets.push({
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: '🔗',
      logo: '/logos/walletconnect.svg',
      description: 'Connect to mobile wallets',
      isInstalled: true,
      isConnected: false,
      accounts: []
    });

    // Phantom (Solana) detection
    if (web3Window.solana?.isPhantom) {
      wallets.push({
        id: 'phantom',
        name: 'Phantom',
        icon: '👻',
        logo: '/logos/phantom.svg',
        description: 'Solana wallet',
        isInstalled: true,
        isConnected: false,
        accounts: []
      });
    }

    // Algorand wallets
    wallets.push({
      id: 'algorand',
      name: 'Algorand Wallet',
      icon: '⚡',
      logo: '/logos/algorand.svg',
      description: 'Official Algorand wallet',
      isInstalled: true,
      isConnected: false,
      accounts: []
    });

    return wallets;
  }

  async connectWallet(walletId: string): Promise<WalletAccount[]> {
    const web3Window = window as Web3Window;
    let accounts: WalletAccount[] = [];

    try {
      switch (walletId) {
        case 'metamask':
          accounts = await this.connectMetaMask();
          break;
        case 'phantom':
          accounts = await this.connectPhantom();
          break;
        case 'algorand':
          accounts = await this.connectAlgorand();
          break;
        default:
          accounts = this.getMockAccounts(walletId);
      }

      if (accounts.length > 0) {
        const wallet: WalletProvider = {
          id: walletId,
          name: this.getWalletName(walletId),
          icon: this.getWalletIcon(walletId),
          isInstalled: true,
          isConnected: true,
          accounts
        };
        this.connectedWallets.set(walletId, wallet);
      }

      return accounts;
    } catch (error) {
      console.error(`Error connecting to ${walletId}:`, error);
      return this.getMockAccounts(walletId);
    }
  }

  private async connectMetaMask(): Promise<WalletAccount[]> {
    const web3Window = window as Web3Window;
    if (!web3Window.ethereum) throw new Error('MetaMask not found');

    const accounts = await web3Window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    return accounts.map((address: string) => ({
      address,
      balance: Math.random() * 10,
      assets: [],
      network: 'ethereum',
      provider: 'metamask'
    }));
  }

  private async connectPhantom(): Promise<WalletAccount[]> {
    const web3Window = window as Web3Window;
    if (!web3Window.solana) throw new Error('Phantom not found');

    const response = await web3Window.solana.connect();
    return [{
      address: response.publicKey.toString(),
      balance: Math.random() * 100,
      assets: [],
      network: 'solana',
      provider: 'phantom'
    }];
  }

  private async connectAlgorand(): Promise<WalletAccount[]> {
    // Mock Algorand connection - in production would use AlgoSigner or similar
    return [{
      address: 'ALGORAND_MOCK_ADDRESS_123456789ABCDEF',
      balance: Math.random() * 1000,
      assets: [],
      network: 'algorand',
      provider: 'algorand'
    }];
  }

  private getMockAccounts(walletId: string): WalletAccount[] {
    return [{
      address: `${walletId.toUpperCase()}_MOCK_ADDRESS_123456789`,
      balance: Math.random() * 1000,
      assets: [],
      network: this.getWalletNetwork(walletId),
      provider: walletId
    }];
  }

  private getWalletName(walletId: string): string {
    const names: Record<string, string> = {
      metamask: 'MetaMask',
      phantom: 'Phantom',
      algorand: 'Algorand Wallet',
      walletconnect: 'WalletConnect'
    };
    return names[walletId] || walletId;
  }

  private getWalletIcon(walletId: string): string {
    const icons: Record<string, string> = {
      metamask: '🦊',
      phantom: '👻',
      algorand: '⚡',
      walletconnect: '🔗'
    };
    return icons[walletId] || '💼';
  }

  private getWalletNetwork(walletId: string): string {
    const networks: Record<string, string> = {
      metamask: 'ethereum',
      phantom: 'solana',
      algorand: 'algorand',
      walletconnect: 'ethereum'
    };
    return networks[walletId] || 'unknown';
  }

  async disconnectWallet(walletId: string): Promise<void> {
    this.connectedWallets.delete(walletId);
    console.log(`Disconnected from ${walletId}`);
  }

  getConnectedWallets(): WalletProvider[] {
    return Array.from(this.connectedWallets.values());
  }

  async getWalletBalance(address: string, network: string): Promise<number> {
    // Mock implementation - in production would fetch real balances
    return Math.random() * 1000;
  }
}

export const walletIntegrationService = new WalletIntegrationService();
export default walletIntegrationService;
