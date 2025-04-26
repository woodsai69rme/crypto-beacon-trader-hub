import { toast } from "@/components/ui/use-toast";
import { CoinOption } from "@/types/trading";

// WebSocket connection states
export enum WebSocketState {
  CONNECTING = 'connecting',
  OPEN = 'open',
  CLOSED = 'closed',
  ERROR = 'error'
}

// WebSocket payload types
export type WebSocketMessage = {
  type: string;
  data: any;
}

// WebSocket connection handler
export class WebSocketHandler {
  private ws: WebSocket | null = null;
  private url: string;
  private listeners: Map<string, ((data: any) => void)[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private reconnectTimeoutId: NodeJS.Timeout | null = null;
  private state: WebSocketState = WebSocketState.CLOSED;
  private pingInterval: NodeJS.Timeout | null = null;
  private subscriptions: Map<string, any> = new Map();

  constructor(url: string) {
    this.url = url;
  }

  // Get current connection state
  public getState(): WebSocketState {
    return this.state;
  }

  // Connect to WebSocket server
  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
        resolve();
        return;
      }

      try {
        this.state = WebSocketState.CONNECTING;
        this.ws = new WebSocket(this.url);

        // Connection opened
        this.ws.onopen = () => {
          this.state = WebSocketState.OPEN;
          this.reconnectAttempts = 0;
          console.log('WebSocket connection established');
          
          // Re-subscribe to all previous subscriptions
          this.subscriptions.forEach((params, key) => {
            this.sendSubscription(key, params);
          });
          
          // Start ping interval to keep connection alive
          this.startPingInterval();
          
          resolve();
        };

        // Connection error
        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.state = WebSocketState.ERROR;
          reject(error);
        };

        // Connection closed
        this.ws.onclose = (event) => {
          this.state = WebSocketState.CLOSED;
          console.log('WebSocket connection closed:', event.code, event.reason);
          this.stopPingInterval();
          
          // Attempt to reconnect if not closed explicitly
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectTimeoutId = setTimeout(() => {
              this.reconnectAttempts++;
              console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
              this.connect().catch(() => {
                console.log('Reconnection failed');
              });
            }, this.reconnectInterval);
          } else {
            toast({
              variant: "destructive",
              title: "Connection failed",
              description: "Unable to connect to real-time data service. Please try again later."
            });
          }
        };

        // Listen for messages
        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
      } catch (error) {
        this.state = WebSocketState.ERROR;
        console.error('Error creating WebSocket connection:', error);
        reject(error);
      }
    });
  }

  // Close WebSocket connection
  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;
    }
    
    this.stopPingInterval();
    this.state = WebSocketState.CLOSED;
    this.subscriptions.clear();
  }

  // Send a message to the server
  public send(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Cannot send message.');
    }
  }

  // Add a listener for a specific message type
  public on(type: string, callback: (data: any) => void): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type)?.push(callback);
  }

  // Remove a listener
  public off(type: string, callback: (data: any) => void): void {
    if (this.listeners.has(type)) {
      const callbacks = this.listeners.get(type) || [];
      this.listeners.set(
        type,
        callbacks.filter(cb => cb !== callback)
      );
    }
  }

  // Handle incoming messages
  private handleMessage(message: WebSocketMessage): void {
    // Check for pong response
    if (message.type === 'pong') {
      return;
    }
    
    // Handle regular messages
    const callbacks = this.listeners.get(message.type) || [];
    callbacks.forEach(callback => {
      try {
        callback(message.data);
      } catch (error) {
        console.error('Error in WebSocket callback:', error);
      }
    });
    
    // Also dispatch to "all" listeners
    const allCallbacks = this.listeners.get('all') || [];
    allCallbacks.forEach(callback => {
      try {
        callback(message);
      } catch (error) {
        console.error('Error in WebSocket "all" callback:', error);
      }
    });
  }

  // Start ping interval to keep connection alive
  private startPingInterval(): void {
    this.stopPingInterval();
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping', data: { timestamp: Date.now() } });
      }
    }, 30000); // Send ping every 30 seconds
  }

  // Stop ping interval
  private stopPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }
  
  // Subscribe to crypto price updates
  public subscribeToPrices(symbols: string[]): void {
    if (symbols.length === 0) return;
    
    const key = 'price-updates';
    const params = { symbols };
    this.subscriptions.set(key, params);
    
    this.sendSubscription(key, params);
  }
  
  // Subscribe to order book updates
  public subscribeToOrderBook(symbol: string, depth: number = 10): void {
    if (!symbol) return;
    
    const key = `orderbook-${symbol}`;
    const params = { symbol, depth };
    this.subscriptions.set(key, params);
    
    this.sendSubscription(key, params);
  }
  
  // Send subscription message
  private sendSubscription(type: string, params: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.send({
        type: 'subscribe',
        channel: type,
        params
      });
    }
  }
}

// Create and export a singleton instance for crypto price updates
export const cryptoWebSocket = new WebSocketHandler('wss://stream.binance.com:9443/ws');

// Simulated real-time price updates (since we're not implementing actual exchange connections)
export function startSimulatedPriceUpdates(
  initialPrices: CoinOption[],
  onPriceUpdate: (prices: CoinOption[]) => void
): () => void {
  // Create a copy of the initial prices
  let prices = [...initialPrices];
  
  // Update prices every second with small random changes
  const intervalId = setInterval(() => {
    prices = prices.map(coin => {
      // Generate a random percentage change between -2% and 2%
      const changePercent = (Math.random() * 4 - 2) / 100;
      const newPrice = coin.price * (1 + changePercent);
      const newPriceAUD = coin.priceAUD ? coin.priceAUD * (1 + changePercent) : undefined;
      
      return {
        ...coin,
        price: newPrice,
        priceAUD: newPriceAUD
      };
    });
    
    // Notify listeners of the updated prices
    onPriceUpdate(prices);
  }, 3000); // Update every 3 seconds
  
  // Return cleanup function
  return () => clearInterval(intervalId);
}

// Create simulated order book data
export function generateSimulatedOrderBook(symbol: string, centerPrice: number, depth: number = 10) {
  const asks = [];
  const bids = [];
  
  // Generate asks (sell orders) slightly above the center price
  for (let i = 0; i < depth; i++) {
    const price = centerPrice * (1 + (i + 1) * 0.001); // Each ask is 0.1% higher
    const volume = Math.random() * 2 + 0.1; // Random volume between 0.1 and 2.1
    asks.push([price, volume]);
  }
  
  // Generate bids (buy orders) slightly below the center price
  for (let i = 0; i < depth; i++) {
    const price = centerPrice * (1 - (i + 1) * 0.001); // Each bid is 0.1% lower
    const volume = Math.random() * 2 + 0.1; // Random volume between 0.1 and 2.1
    bids.push([price, volume]);
  }
  
  // Sort asks ascending and bids descending by price
  asks.sort((a, b) => a[0] - b[0]);
  bids.sort((a, b) => b[0] - a[0]);
  
  return {
    symbol,
    timestamp: Date.now(),
    asks,
    bids
  };
}

// Start simulated order book updates
export function startSimulatedOrderBookUpdates(
  symbol: string,
  initialPrice: number,
  onOrderBookUpdate: (orderBook: any) => void
): () => void {
  // Generate initial order book
  let orderBook = generateSimulatedOrderBook(symbol, initialPrice);
  onOrderBookUpdate(orderBook);
  
  // Update order book every 2 seconds with small changes
  const intervalId = setInterval(() => {
    // Slightly adjust the center price
    const centerPrice = initialPrice * (1 + (Math.random() * 0.04 - 0.02)); // ±2% from initial
    
    // Generate new order book
    orderBook = generateSimulatedOrderBook(symbol, centerPrice);
    onOrderBookUpdate(orderBook);
  }, 2000);
  
  // Return cleanup function
  return () => clearInterval(intervalId);
}
