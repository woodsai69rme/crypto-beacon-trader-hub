
// Real-time WebSocket service for live market data
import { websocketService } from '../websocket/websocketService';

export interface RealTimePrice {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  timestamp: number;
}

export interface RealTimeOrderBook {
  symbol: string;
  bids: [number, number][];
  asks: [number, number][];
  timestamp: number;
}

class RealTimeService {
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();
  private isConnected: boolean = false;

  async connect(): Promise<void> {
    if (this.isConnected) return;

    try {
      // Connect to Binance WebSocket for real-time data
      const symbols = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'SOLUSDT', 'MATICUSDT'];
      websocketService.connectToPriceStream(symbols);
      
      // Subscribe to price updates
      websocketService.subscribe('price-update', (data) => {
        this.notifySubscribers('price', this.transformPriceData(data));
      });

      // Connect to order book streams
      symbols.forEach(symbol => {
        websocketService.connectToOrderBookStream(symbol);
      });

      websocketService.subscribe('orderbook-update', (data) => {
        this.notifySubscribers('orderbook', data);
      });

      this.isConnected = true;
      console.log('Real-time service connected');
    } catch (error) {
      console.error('Failed to connect real-time service:', error);
    }
  }

  subscribe(eventType: string, callback: (data: any) => void): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    
    this.subscribers.get(eventType)!.add(callback);
    
    return () => {
      this.subscribers.get(eventType)?.delete(callback);
    };
  }

  private notifySubscribers(eventType: string, data: any): void {
    const callbacks = this.subscribers.get(eventType);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in real-time subscriber callback:', error);
        }
      });
    }
  }

  private transformPriceData(data: any): RealTimePrice {
    return {
      symbol: data.symbol.replace('USDT', ''),
      price: data.price,
      change24h: data.change24h,
      volume: data.volume,
      timestamp: data.timestamp
    };
  }

  disconnect(): void {
    websocketService.disconnectAll();
    this.subscribers.clear();
    this.isConnected = false;
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export const realTimeService = new RealTimeService();
