
import { CoinOption } from "@/types/trading";
import { toast } from "@/components/ui/use-toast";

// Mock service to simulate real-time price updates
class PriceMonitoringService {
  private intervalId: number | null = null;
  private subscribers: Array<(data: CoinOption[]) => void> = [];
  private mockPrices: Record<string, number> = {
    bitcoin: 65000,
    ethereum: 3500,
    solana: 140,
    cardano: 0.45,
    ripple: 0.55,
    dogecoin: 0.12
  };
  
  private mockChangePercents: Record<string, number> = {
    bitcoin: 2.5,
    ethereum: 3.8,
    solana: 5.2,
    cardano: -1.3,
    ripple: 4.1,
    dogecoin: -2.4
  };
  
  // Start monitoring with a given interval in ms
  startMonitoring(intervalMs = 10000): void {
    if (this.intervalId !== null) {
      console.warn('Price monitoring already started');
      return;
    }
    
    // Initial notification
    this.notifySubscribers();
    
    // Set up interval for regular updates
    this.intervalId = window.setInterval(() => {
      this.updatePrices();
      this.notifySubscribers();
    }, intervalMs);
    
    console.log(`Price monitoring started with ${intervalMs}ms interval`);
  }
  
  // Stop price monitoring
  stopMonitoring(): void {
    if (this.intervalId === null) {
      console.warn('Price monitoring not started');
      return;
    }
    
    window.clearInterval(this.intervalId);
    this.intervalId = null;
    console.log('Price monitoring stopped');
  }
  
  // Subscribe to price updates
  subscribe(callback: (data: CoinOption[]) => void): () => void {
    this.subscribers.push(callback);
    
    // Immediately provide current data to the new subscriber
    callback(this.getCurrentPrices());
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }
  
  // Get current coin prices
  getCurrentPrices(): CoinOption[] {
    return [
      {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        price: this.mockPrices.bitcoin,
        changePercent: this.mockChangePercents.bitcoin,
        value: 'bitcoin',
        label: 'Bitcoin (BTC)'
      },
      {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        price: this.mockPrices.ethereum,
        changePercent: this.mockChangePercents.ethereum,
        value: 'ethereum',
        label: 'Ethereum (ETH)'
      },
      {
        id: 'solana',
        name: 'Solana',
        symbol: 'SOL',
        price: this.mockPrices.solana,
        changePercent: this.mockChangePercents.solana,
        value: 'solana',
        label: 'Solana (SOL)'
      },
      {
        id: 'cardano',
        name: 'Cardano',
        symbol: 'ADA',
        price: this.mockPrices.cardano,
        changePercent: this.mockChangePercents.cardano,
        value: 'cardano',
        label: 'Cardano (ADA)'
      },
      {
        id: 'ripple',
        name: 'XRP',
        symbol: 'XRP',
        price: this.mockPrices.ripple,
        changePercent: this.mockChangePercents.ripple,
        value: 'ripple',
        label: 'XRP (XRP)'
      },
      {
        id: 'dogecoin',
        name: 'Dogecoin',
        symbol: 'DOGE',
        price: this.mockPrices.dogecoin,
        changePercent: this.mockChangePercents.dogecoin,
        value: 'dogecoin',
        label: 'Dogecoin (DOGE)'
      }
    ];
  }
  
  // Create a random price update
  private updatePrices(): void {
    const coins = Object.keys(this.mockPrices);
    
    // Update each coin with small random changes
    coins.forEach(coin => {
      // Random price change between -2% and +2%
      const changePercent = (Math.random() * 4) - 2;
      const currentPrice = this.mockPrices[coin];
      const newPrice = currentPrice * (1 + changePercent / 100);
      
      // Update mock data
      this.mockPrices[coin] = Number(newPrice.toFixed(newPrice < 1 ? 4 : 2));
      this.mockChangePercents[coin] = Number((this.mockChangePercents[coin] * 0.8 + changePercent * 0.2).toFixed(2));
    });
    
    // Simulate a price alert occasionally (roughly 1 in 10 updates)
    if (Math.random() < 0.1) {
      const randomCoin = coins[Math.floor(Math.random() * coins.length)];
      const priceChange = this.mockChangePercents[randomCoin] > 0 ? "increased" : "decreased";
      
      toast({
        title: `${randomCoin.charAt(0).toUpperCase() + randomCoin.slice(1)} Alert`,
        description: `Price has ${priceChange} by ${Math.abs(this.mockChangePercents[randomCoin]).toFixed(1)}%`,
        variant: this.mockChangePercents[randomCoin] > 0 ? "default" : "destructive"
      });
    }
  }
  
  // Notify all subscribers with current price data
  private notifySubscribers(): void {
    const currentPrices = this.getCurrentPrices();
    this.subscribers.forEach(callback => {
      try {
        callback(currentPrices);
      } catch (error) {
        console.error('Error in price update subscriber:', error);
      }
    });
  }
}

// Create singleton instance
export const priceMonitor = new PriceMonitoringService();
