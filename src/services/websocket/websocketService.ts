
export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

export interface PriceUpdate {
  symbol: string;
  price: number;
  volume: number;
  change24h: number;
  timestamp: number;
}

export interface OrderBookUpdate {
  symbol: string;
  bids: [number, number][];
  asks: [number, number][];
  timestamp: number;
}

export class WebSocketService {
  private connections: Map<string, WebSocket> = new Map();
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();
  private reconnectAttempts: Map<string, number> = new Map();
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  // Binance WebSocket for real-time price updates
  connectToPriceStream(symbols: string[]): void {
    const streamName = symbols.map(s => `${s.toLowerCase()}@ticker`).join('/');
    const url = `wss://stream.binance.com:9443/ws/${streamName}`;
    
    this.connect('binance-prices', url, (data) => {
      if (data.e === '24hrTicker') {
        const priceUpdate: PriceUpdate = {
          symbol: data.s,
          price: parseFloat(data.c),
          volume: parseFloat(data.v),
          change24h: parseFloat(data.P),
          timestamp: Date.now()
        };
        this.notifySubscribers('price-update', priceUpdate);
      }
    });
  }

  // Binance Order Book Stream
  connectToOrderBookStream(symbol: string): void {
    const url = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth20@100ms`;
    
    this.connect(`orderbook-${symbol}`, url, (data) => {
      const orderBookUpdate: OrderBookUpdate = {
        symbol: data.s || symbol,
        bids: data.bids?.map((bid: string[]) => [parseFloat(bid[0]), parseFloat(bid[1])]) || [],
        asks: data.asks?.map((ask: string[]) => [parseFloat(ask[0]), parseFloat(ask[1])]) || [],
        timestamp: Date.now()
      };
      this.notifySubscribers('orderbook-update', orderBookUpdate);
    });
  }

  // Generic WebSocket connection handler
  private connect(connectionId: string, url: string, onMessage: (data: any) => void): void {
    if (this.connections.has(connectionId)) {
      this.connections.get(connectionId)?.close();
    }

    try {
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        console.log(`WebSocket connected: ${connectionId}`);
        this.reconnectAttempts.set(connectionId, 0);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log(`WebSocket closed: ${connectionId}`, event.code, event.reason);
        this.handleReconnect(connectionId, url, onMessage);
      };

      ws.onerror = (error) => {
        console.error(`WebSocket error: ${connectionId}`, error);
      };

      this.connections.set(connectionId, ws);
    } catch (error) {
      console.error(`Failed to create WebSocket connection: ${connectionId}`, error);
    }
  }

  private handleReconnect(connectionId: string, url: string, onMessage: (data: any) => void): void {
    const attempts = this.reconnectAttempts.get(connectionId) || 0;
    
    if (attempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        console.log(`Reconnecting WebSocket: ${connectionId} (attempt ${attempts + 1})`);
        this.reconnectAttempts.set(connectionId, attempts + 1);
        this.connect(connectionId, url, onMessage);
      }, this.reconnectDelay * Math.pow(2, attempts));
    } else {
      console.error(`Max reconnection attempts reached for: ${connectionId}`);
    }
  }

  // Subscribe to specific event types
  subscribe(eventType: string, callback: (data: any) => void): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    
    this.subscribers.get(eventType)!.add(callback);
    
    // Return unsubscribe function
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
          console.error('Error in WebSocket subscriber callback:', error);
        }
      });
    }
  }

  // Disconnect specific connection
  disconnect(connectionId: string): void {
    const ws = this.connections.get(connectionId);
    if (ws) {
      ws.close();
      this.connections.delete(connectionId);
      this.reconnectAttempts.delete(connectionId);
    }
  }

  // Disconnect all connections
  disconnectAll(): void {
    this.connections.forEach((ws, connectionId) => {
      ws.close();
    });
    this.connections.clear();
    this.reconnectAttempts.clear();
    this.subscribers.clear();
  }

  // Get connection status
  getConnectionStatus(connectionId: string): string {
    const ws = this.connections.get(connectionId);
    if (!ws) return 'disconnected';
    
    switch (ws.readyState) {
      case WebSocket.CONNECTING: return 'connecting';
      case WebSocket.OPEN: return 'connected';
      case WebSocket.CLOSING: return 'closing';
      case WebSocket.CLOSED: return 'closed';
      default: return 'unknown';
    }
  }

  // Get all connection statuses
  getAllConnectionStatuses(): Record<string, string> {
    const statuses: Record<string, string> = {};
    this.connections.forEach((_, connectionId) => {
      statuses[connectionId] = this.getConnectionStatus(connectionId);
    });
    return statuses;
  }
}

export const websocketService = new WebSocketService();
