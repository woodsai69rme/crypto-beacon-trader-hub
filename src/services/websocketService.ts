
import { toast } from "@/components/ui/use-toast";

type WebSocketListener = (data: any) => void;

interface WebSocketSubscription {
  id: string;
  topic: string;
  listener: WebSocketListener;
}

interface ExchangeWebsocketDetails {
  name: string;
  url: string;
  connected: boolean;
  socket: WebSocket | null;
  subscriptions: WebSocketSubscription[];
  reconnectAttempts: number;
  maxReconnectAttempts: number;
  reconnectDelay: number;
  lastPingTime: number;
}

class WebSocketService {
  private exchanges: Map<string, ExchangeWebsocketDetails> = new Map();
  private pingInterval: number | null = null;
  
  constructor() {
    // Initialize with supported exchanges
    this.exchanges.set('binance', {
      name: 'Binance',
      url: 'wss://stream.binance.com:9443/ws',
      connected: false,
      socket: null,
      subscriptions: [],
      reconnectAttempts: 0,
      maxReconnectAttempts: 5,
      reconnectDelay: 3000, // 3 seconds
      lastPingTime: Date.now()
    });
    
    this.exchanges.set('coinbase', {
      name: 'Coinbase',
      url: 'wss://ws-feed.pro.coinbase.com',
      connected: false,
      socket: null,
      subscriptions: [],
      reconnectAttempts: 0,
      maxReconnectAttempts: 5,
      reconnectDelay: 3000,
      lastPingTime: Date.now()
    });
    
    this.exchanges.set('kraken', {
      name: 'Kraken',
      url: 'wss://ws.kraken.com',
      connected: false,
      socket: null,
      subscriptions: [],
      reconnectAttempts: 0,
      maxReconnectAttempts: 5,
      reconnectDelay: 3000,
      lastPingTime: Date.now()
    });
  }
  
  /**
   * Connect to an exchange websocket
   * @param exchangeId The exchange identifier
   * @returns Promise that resolves when connection is established or fails
   */
  public connect(exchangeId: string): Promise<boolean> {
    const exchange = this.exchanges.get(exchangeId);
    if (!exchange) {
      return Promise.reject(new Error(`Exchange ${exchangeId} not found`));
    }
    
    if (exchange.connected && exchange.socket) {
      return Promise.resolve(true);
    }
    
    return new Promise((resolve, reject) => {
      try {
        const socket = new WebSocket(exchange.url);
        
        socket.onopen = () => {
          exchange.connected = true;
          exchange.socket = socket;
          exchange.reconnectAttempts = 0;
          exchange.lastPingTime = Date.now();
          
          console.log(`Connected to ${exchange.name} WebSocket`);
          
          // Start ping interval if not already started
          if (!this.pingInterval) {
            this.startPingInterval();
          }
          
          // Subscribe to all existing subscriptions
          for (const sub of exchange.subscriptions) {
            this.sendSubscription(exchangeId, sub);
          }
          
          toast({
            title: "WebSocket Connected",
            description: `Successfully connected to ${exchange.name} WebSocket`,
          });
          
          resolve(true);
        };
        
        socket.onclose = (event) => {
          exchange.connected = false;
          exchange.socket = null;
          
          console.log(`Disconnected from ${exchange.name} WebSocket: ${event.code} ${event.reason}`);
          
          // Attempt reconnection if not closed cleanly
          if (event.code !== 1000) {
            this.attemptReconnect(exchangeId);
          }
          
          resolve(false);
        };
        
        socket.onerror = (error) => {
          console.error(`WebSocket error for ${exchange.name}:`, error);
          
          exchange.connected = false;
          
          toast({
            title: "WebSocket Error",
            description: `Error connecting to ${exchange.name} WebSocket`,
            variant: "destructive"
          });
          
          reject(error);
        };
        
        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(exchangeId, data);
          } catch (e) {
            console.error(`Failed to parse WebSocket message:`, e);
          }
        };
      } catch (error) {
        console.error(`Failed to create WebSocket for ${exchange.name}:`, error);
        reject(error);
      }
    });
  }
  
  /**
   * Subscribe to a specific topic on an exchange
   * @param exchangeId The exchange identifier
   * @param topic The topic to subscribe to (e.g. ticker, trades)
   * @param symbol The trading pair symbol (e.g. BTC/USD)
   * @param listener Callback function for received data
   * @returns Subscription ID for use in unsubscribing
   */
  public subscribe(
    exchangeId: string,
    topic: string,
    symbol: string,
    listener: WebSocketListener
  ): string {
    const exchange = this.exchanges.get(exchangeId);
    if (!exchange) {
      throw new Error(`Exchange ${exchangeId} not found`);
    }
    
    // Create subscription
    const subscriptionId = `${exchangeId}-${topic}-${symbol}-${Date.now()}`;
    const subscription: WebSocketSubscription = {
      id: subscriptionId,
      topic: this.formatTopicForExchange(exchangeId, topic, symbol),
      listener
    };
    
    // Add to subscriptions list
    exchange.subscriptions.push(subscription);
    
    // If connected, send subscription request
    if (exchange.connected && exchange.socket) {
      this.sendSubscription(exchangeId, subscription);
    } else {
      // Not connected, attempt to connect
      this.connect(exchangeId).catch(error => {
        console.error(`Failed to connect to ${exchange.name} WebSocket:`, error);
      });
    }
    
    return subscriptionId;
  }
  
  /**
   * Unsubscribe from a topic
   * @param subscriptionId The ID returned from subscribe()
   */
  public unsubscribe(subscriptionId: string): void {
    for (const [exchangeId, exchange] of this.exchanges.entries()) {
      const index = exchange.subscriptions.findIndex(sub => sub.id === subscriptionId);
      
      if (index !== -1) {
        const subscription = exchange.subscriptions[index];
        
        // Remove from array
        exchange.subscriptions.splice(index, 1);
        
        // If connected, send unsubscribe message
        if (exchange.connected && exchange.socket) {
          this.sendUnsubscription(exchangeId, subscription);
        }
        
        break;
      }
    }
  }
  
  /**
   * Disconnect from all or specific exchange WebSocket
   * @param exchangeId Optional exchange to disconnect from. If not specified, disconnects from all.
   */
  public disconnect(exchangeId?: string): void {
    if (exchangeId) {
      const exchange = this.exchanges.get(exchangeId);
      if (exchange && exchange.connected && exchange.socket) {
        exchange.socket.close(1000, "Disconnected by user");
        exchange.connected = false;
        exchange.socket = null;
        console.log(`Disconnected from ${exchange.name} WebSocket`);
      }
    } else {
      // Disconnect from all
      for (const [id, exchange] of this.exchanges.entries()) {
        if (exchange.connected && exchange.socket) {
          exchange.socket.close(1000, "Disconnected by user");
          exchange.connected = false;
          exchange.socket = null;
          console.log(`Disconnected from ${exchange.name} WebSocket`);
        }
      }
      
      // Clear ping interval
      if (this.pingInterval) {
        window.clearInterval(this.pingInterval);
        this.pingInterval = null;
      }
    }
  }
  
  /**
   * Check if connected to an exchange
   * @param exchangeId The exchange identifier
   * @returns True if connected
   */
  public isConnected(exchangeId: string): boolean {
    const exchange = this.exchanges.get(exchangeId);
    return exchange ? exchange.connected : false;
  }
  
  /**
   * Get list of supported exchanges
   * @returns Array of exchange IDs
   */
  public getSupportedExchanges(): string[] {
    return Array.from(this.exchanges.keys());
  }
  
  /**
   * Format a topic for a specific exchange
   * Different exchanges have different subscription formats
   */
  private formatTopicForExchange(exchangeId: string, topic: string, symbol: string): string {
    // Format symbol to exchange-specific format
    let formattedSymbol = symbol.toLowerCase().replace('/', '');
    
    switch (exchangeId) {
      case 'binance':
        // Binance uses lowercase symbols without slashes
        return `${formattedSymbol}@${topic}`;
        
      case 'coinbase':
        // Coinbase uses uppercase symbols with dashes
        formattedSymbol = symbol.replace('/', '-');
        return `${topic}:${formattedSymbol}`;
        
      case 'kraken':
        // Kraken uses the pair name directly in most cases
        return `${topic}:${symbol}`;
        
      default:
        return `${topic}_${formattedSymbol}`;
    }
  }
  
  /**
   * Send subscription request to exchange
   */
  private sendSubscription(exchangeId: string, subscription: WebSocketSubscription): void {
    const exchange = this.exchanges.get(exchangeId);
    if (!exchange || !exchange.socket) return;
    
    let message: any;
    
    switch (exchangeId) {
      case 'binance':
        message = {
          method: 'SUBSCRIBE',
          params: [subscription.topic],
          id: Date.now()
        };
        break;
        
      case 'coinbase':
        message = {
          type: 'subscribe',
          channels: [subscription.topic]
        };
        break;
        
      case 'kraken':
        message = {
          name: 'subscribe',
          reqid: Date.now(),
          subscription: {
            name: subscription.topic.split(':')[0]
          },
          pair: [subscription.topic.split(':')[1]]
        };
        break;
        
      default:
        message = {
          action: 'subscribe',
          topic: subscription.topic
        };
    }
    
    try {
      exchange.socket.send(JSON.stringify(message));
    } catch (error) {
      console.error(`Failed to send subscription to ${exchange.name}:`, error);
    }
  }
  
  /**
   * Send unsubscription request to exchange
   */
  private sendUnsubscription(exchangeId: string, subscription: WebSocketSubscription): void {
    const exchange = this.exchanges.get(exchangeId);
    if (!exchange || !exchange.socket) return;
    
    let message: any;
    
    switch (exchangeId) {
      case 'binance':
        message = {
          method: 'UNSUBSCRIBE',
          params: [subscription.topic],
          id: Date.now()
        };
        break;
        
      case 'coinbase':
        message = {
          type: 'unsubscribe',
          channels: [subscription.topic]
        };
        break;
        
      case 'kraken':
        message = {
          name: 'unsubscribe',
          reqid: Date.now(),
          subscription: {
            name: subscription.topic.split(':')[0]
          },
          pair: [subscription.topic.split(':')[1]]
        };
        break;
        
      default:
        message = {
          action: 'unsubscribe',
          topic: subscription.topic
        };
    }
    
    try {
      exchange.socket.send(JSON.stringify(message));
    } catch (error) {
      console.error(`Failed to send unsubscription to ${exchange.name}:`, error);
    }
  }
  
  /**
   * Handle incoming WebSocket message
   */
  private handleMessage(exchangeId: string, data: any): void {
    const exchange = this.exchanges.get(exchangeId);
    if (!exchange) return;
    
    // Update last ping time
    exchange.lastPingTime = Date.now();
    
    // Handle different exchange message formats
    let topic: string | null = null;
    let messageData: any = null;
    
    switch (exchangeId) {
      case 'binance':
        // Binance stream name is in the "stream" field
        if (data.stream) {
          topic = data.stream;
          messageData = data.data;
        }
        break;
        
      case 'coinbase':
        // Coinbase has "type" field
        if (data.type === 'ticker') {
          topic = `ticker:${data.product_id}`;
          messageData = data;
        }
        break;
        
      case 'kraken':
        // Kraken messages can be complex
        if (Array.isArray(data) && data.length >= 2) {
          const channelName = data[data.length - 2];
          const pair = data[data.length - 1];
          topic = `${channelName}:${pair}`;
          messageData = data[1];
        }
        break;
        
      default:
        // Generic format
        topic = data.topic || data.channel || null;
        messageData = data.data || data;
    }
    
    // If we identified the topic, notify all matching subscribers
    if (topic) {
      for (const subscription of exchange.subscriptions) {
        if (subscription.topic === topic || topic.startsWith(subscription.topic)) {
          // Deliver to listener
          try {
            subscription.listener(messageData);
          } catch (error) {
            console.error(`Error in WebSocket listener:`, error);
          }
        }
      }
    }
  }
  
  /**
   * Try to reconnect to a WebSocket
   */
  private attemptReconnect(exchangeId: string): void {
    const exchange = this.exchanges.get(exchangeId);
    if (!exchange) return;
    
    if (exchange.reconnectAttempts >= exchange.maxReconnectAttempts) {
      console.log(`Maximum reconnect attempts (${exchange.maxReconnectAttempts}) reached for ${exchange.name}`);
      
      toast({
        title: "WebSocket Disconnected",
        description: `Could not reconnect to ${exchange.name} after ${exchange.maxReconnectAttempts} attempts`,
        variant: "destructive"
      });
      
      return;
    }
    
    exchange.reconnectAttempts++;
    const delay = exchange.reconnectDelay * exchange.reconnectAttempts;
    
    console.log(`Attempting to reconnect to ${exchange.name} in ${delay}ms (attempt ${exchange.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect(exchangeId).catch(error => {
        console.error(`Reconnect attempt failed for ${exchange.name}:`, error);
      });
    }, delay);
  }
  
  /**
   * Start ping interval to monitor WebSocket connections
   */
  private startPingInterval(): void {
    if (this.pingInterval) {
      window.clearInterval(this.pingInterval);
    }
    
    this.pingInterval = window.setInterval(() => {
      const now = Date.now();
      
      // Check each exchange connection
      for (const [exchangeId, exchange] of this.exchanges.entries()) {
        if (exchange.connected && exchange.socket) {
          // Check if we haven't received any message in a while
          const sinceLastPing = now - exchange.lastPingTime;
          
          // If more than 60 seconds, send ping or reconnect
          if (sinceLastPing > 60000) {
            try {
              // Try to send ping if supported by exchange
              switch (exchangeId) {
                case 'binance':
                  exchange.socket.send(JSON.stringify({ method: 'ping' }));
                  break;
                  
                case 'coinbase':
                  // Coinbase doesn't have a specific ping format
                  // Just check if the socket is still open
                  if (exchange.socket.readyState !== WebSocket.OPEN) {
                    throw new Error('Socket not open');
                  }
                  break;
                  
                case 'kraken':
                  exchange.socket.send(JSON.stringify({ name: 'ping' }));
                  break;
                  
                default:
                  exchange.socket.send('ping');
              }
              
              // Update ping time
              exchange.lastPingTime = now;
            } catch (e) {
              console.error(`Failed to ping ${exchange.name}, reconnecting:`, e);
              
              // Force reconnect
              exchange.socket.close();
              exchange.connected = false;
              exchange.socket = null;
              
              this.attemptReconnect(exchangeId);
            }
          }
        }
      }
    }, 30000); // Check every 30 seconds
  }
}

// Export a singleton instance
export const webSocketService = new WebSocketService();

/**
 * Hook-friendly wrapper function to subscribe to websocket data
 * @param exchangeId Exchange ID
 * @param topic Topic to subscribe to
 * @param symbol Trading pair
 * @param onData Data callback function
 * @returns Function to unsubscribe
 */
export function useWebSocketSubscription(
  exchangeId: string,
  topic: string,
  symbol: string,
  onData: WebSocketListener
): () => void {
  let subscriptionId: string | null = null;
  
  try {
    // Subscribe and get subscription ID
    subscriptionId = webSocketService.subscribe(exchangeId, topic, symbol, onData);
  } catch (error) {
    console.error(`Failed to subscribe to ${topic} for ${symbol} on ${exchangeId}:`, error);
  }
  
  // Return unsubscribe function
  return () => {
    if (subscriptionId) {
      webSocketService.unsubscribe(subscriptionId);
    }
  };
}

export default webSocketService;
