import React from 'react';
import { WalletProvider } from '@/types/trading';

// Example implementation (partial)
const walletProviders: WalletProvider[] = [
  {
    id: 'metamask',
    name: 'MetaMask',
    logo: 'https://metamask.io/images/metamask-fox.svg',
    description: 'Connect to your MetaMask wallet',
    icon: 'metamask-icon',
    supported: true,
    isInstalled: window.ethereum?.isMetaMask,
    isConnected: false
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    logo: 'https://walletconnect.org/walletconnect-logo.png',
    description: 'Connect via WalletConnect',
    icon: 'walletconnect-icon',
    supported: true,
    isInstalled: false,
    isConnected: false
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    logo: 'https://coinbase.com/assets/press/coinbase-icon.png',
    description: 'Connect to Coinbase Wallet',
    icon: 'coinbase-icon',
    supported: true,
    isInstalled: window.ethereum?.isCoinbaseWallet,
    isConnected: false
  },
  {
    id: 'phantom',
    name: 'Phantom',
    logo: 'https://phantom.app/img/phantom.png',
    description: 'Connect to Phantom Wallet',
    icon: 'phantom-icon',
    supported: true,
    isInstalled: true,
    isConnected: false
  }
];

const TradingDashboard: React.FC = () => {
  const [selectedWallet, setSelectedWallet] = React.useState<string | null>(null);
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [isConnected, setIsConnected] = React.useState(false);
  const [walletAddress, setWalletAddress] = React.useState<string | null>(null);
  const [walletBalance, setWalletBalance] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const connectWallet = async (walletId: string) => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful connection
      setSelectedWallet(walletId);
      setIsConnected(true);
      setWalletAddress('0x1234...5678');
      setWalletBalance(1.234);
      
      console.log(`Connected to ${walletId}`);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setSelectedWallet(null);
    setIsConnected(false);
    setWalletAddress(null);
    setWalletBalance(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Trading Dashboard</h1>
      
      {!isConnected ? (
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Connect Wallet</h2>
          <p className="text-muted-foreground mb-6">
            Connect your wallet to start trading cryptocurrencies.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {walletProviders.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => connectWallet(wallet.id)}
                disabled={isConnecting}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center">
                  {wallet.logo && (
                    <img 
                      src={wallet.logo} 
                      alt={wallet.name} 
                      className="w-8 h-8 mr-3" 
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{wallet.name}</h3>
                    <p className="text-sm text-muted-foreground">{wallet.description}</p>
                  </div>
                </div>
                {wallet.isInstalled && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Installed
                  </span>
                )}
              </button>
            ))}
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded">
              {error}
            </div>
          )}
          
          {isConnecting && (
            <div className="mt-4 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2">Connecting...</span>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Wallet Connected</h2>
            <button
              onClick={disconnectWallet}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
            >
              Disconnect
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg">
              <h3 className="text-sm text-muted-foreground mb-1">Wallet Address</h3>
              <p className="font-mono">{walletAddress}</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="text-sm text-muted-foreground mb-1">Balance</h3>
              <p className="text-xl font-semibold">{walletBalance} ETH</p>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Trading Options</h3>
            <p className="text-muted-foreground">
              Trading features will be implemented here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingDashboard;
