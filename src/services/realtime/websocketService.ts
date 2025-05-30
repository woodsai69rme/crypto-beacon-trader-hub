
export interface PriceUpdate {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  timestamp: number;
}

export interface WebSocketSubscription {
  id: string;
  callback: (data: any) => void;
}

export class WebSocketService {
  private connections: Map<string, WebSocket> = new Map();
  private subscriptions: Map<string, WebSocketSubscription[]> = new Map();
  private reconnectAttempts: Map<string, number> = new Map();
  private maxReconnectAttempts = 5;
  private audExchangeRate = 1.48;

  connectToPriceStream(symbols: string[]): void {
    const url = 'wss://stream.binance.com:9443/ws/stream';
    
    if (this.connections.has('binance-prices')) {
      this.connections.get('binance-prices')?.close();
    }

    try {
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        console.log('Connected to Binance WebSocket');
        this.reconnectAttempts.set('binance-prices', 0);
        
        // Subscribe to price streams for symbols
        const subscribeMessage = {
          method: 'SUBSCRIBE',
          params: symbols.map(symbol => `${symbol.toLowerCase()}@ticker`),
          id: Date.now()
        };
        
        ws.send(JSON.stringify(subscribeMessage));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.stream && data.data) {
            const tickerData = data.data;
            const priceUpdate: PriceUpdate = {
              symbol: tickerData.s.replace('USDT', ''),
              price: parseFloat(tickerData.c) * this.audExchangeRate, // Convert to AUD
              change24h: parseFloat(tickerData.P),
              volume: parseFloat(tickerData.v) * this.audExchangeRate,
              timestamp: Date.now()
            };
            
            this.notifySubscribers('price-update', priceUpdate);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
        this.handleReconnect('binance-prices', () => this.connectToPriceStream(symbols));
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.connections.set('binance-prices', ws);
    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
      this.simulateRealTimeData(symbols);
    }
  }

  subscribe(event: string, callback: (data: any) => void): () => void {
    const subscription: WebSocketSubscription = {
      id: Math.random().toString(36),
      callback
    };

    if (!this.subscriptions.has(event)) {
      this.subscriptions.set(event, []);
    }

    this.subscriptions.get(event)!.push(subscription);

    // Return unsubscribe function
    return () => {
      const subs = this.subscriptions.get(event);
      if (subs) {
        const index = subs.findIndex(s => s.id === subscription.id);
        if (index > -1) {
          subs.splice(index, 1);
        }
      }
    };
  }

  private notifySubscribers(event: string, data: any): void {
    const subscribers = this.subscriptions.get(event);
    if (subscribers) {
      subscribers.forEach(sub => {
        try {
          sub.callback(data);
        } catch (error) {
          console.error('Error in subscription callback:', error);
        }
      });
    }
  }

  private handleReconnect(connectionId: string, reconnectFn: () => void): void {
    const attempts = this.reconnectAttempts.get(connectionId) || 0;
    
    if (attempts < this.maxReconnectAttempts) {
      const delay = Math.pow(2, attempts) * 1000; // Exponential backoff
      
      setTimeout(() => {
        console.log(`Attempting to reconnect ${connectionId} (attempt ${attempts + 1})`);
        this.reconnectAttempts.set(connectionId, attempts + 1);
        reconnectFn();
      }, delay);
    } else {
      console.error(`Max reconnection attempts reached for ${connectionId}`);
    }
  }

  private simulateRealTimeData(symbols: string[]): void {
    // Fallback to simulated data if WebSocket fails
    console.log('Using simulated real-time data');
    
    const interval = setInterval(() => {
      symbols.forEach(symbol => {
        const basePrice = symbol === 'BTCUSDT' ? 67000 : 
                         symbol === 'ETHUSDT' ? 3200 : 
                         symbol === 'ADAUSDT' ? 0.52 : 98;
        
        const priceUpdate: PriceUpdate = {
          symbol: symbol.replace('USDT', ''),
          price: (basePrice + (Math.random() - 0.5) * basePrice * 0.02) * this.audExchangeRate,
          change24h: (Math.random() - 0.5) * 10,
          volume: Math.random() * 1000000 * this.audExchangeRate,
          timestamp: Date.now()
        };
        
        this.notifySubscribers('price-update', priceUpdate);
      });
    }, 2000);

    // Store interval for cleanup
    this.connections.set('simulation', interval as any);
  }

  getAllConnectionStatuses(): Record<string, string> {
    const statuses: Record<string, string> = {};
    
    this.connections.forEach((connection, key) => {
      if (connection instanceof WebSocket) {
        statuses[key] = connection.readyState === WebSocket.OPEN ? 'connected' : 'disconnected';
      } else {
        statuses[key] = 'simulated';
      }
    });
    
    return statuses;
  }

  disconnectAll(): void {
    this.connections.forEach((connection, key) => {
      if (connection instanceof WebSocket) {
        connection.close();
      } else {
        clearInterval(connection);
      }
    });
    
    this.connections.clear();
    this.subscriptions.clear();
    this.reconnectAttempts.clear();
  }
}

export const websocketService = new WebSocketService();
