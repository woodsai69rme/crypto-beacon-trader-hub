
# 🔌 API Integration Guide

**Version**: 2.0  
**Last Updated**: January 25, 2025  
**Coverage**: Complete API Integration Reference  

---

## 🎯 Overview

This guide covers all API integrations in the Advanced Crypto Trading Platform, including setup, usage, error handling, and best practices.

---

## 📊 Market Data APIs

### CoinGecko API (Primary)
**Status**: ✅ Integrated  
**Type**: Free tier with rate limits  
**Purpose**: Real-time cryptocurrency prices and market data  

#### Configuration
```typescript
// src/services/api/coinGeckoService.ts
const BASE_URL = 'https://api.coingecko.com/api/v3';
const RATE_LIMIT = 30; // requests per minute (free tier)

class CoinGeckoService {
  async getCurrentPrices(ids: string[], currencies = ['aud']) {
    const response = await fetch(
      `${BASE_URL}/simple/price?ids=${ids.join(',')}&vs_currencies=${currencies.join(',')}&include_24hr_change=true`
    );
    return response.json();
  }
  
  async getMarketData(page = 1, limit = 100) {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=aud&order=market_cap_desc&per_page=${limit}&page=${page}`
    );
    return response.json();
  }
}
```

#### Usage Example
```typescript
import { coinGeckoService } from '@/services/api/coinGeckoService';

// Get current prices
const prices = await coinGeckoService.getCurrentPrices(['bitcoin', 'ethereum']);

// Get market data
const marketData = await coinGeckoService.getMarketData(1, 50);
```

#### Error Handling
```typescript
try {
  const data = await coinGeckoService.getCurrentPrices(['bitcoin']);
} catch (error) {
  if (error.status === 429) {
    // Rate limit exceeded
    console.log('Rate limit exceeded, waiting...');
    await new Promise(resolve => setTimeout(resolve, 60000));
  }
}
```

### Binance API (Secondary)
**Status**: ✅ Integrated  
**Type**: Free public API  
**Purpose**: High-frequency price updates and order book data  

#### WebSocket Integration
```typescript
// src/services/api/binanceWebSocket.ts
class BinanceWebSocket {
  private ws: WebSocket | null = null;
  
  connect(symbols: string[]) {
    const streams = symbols.map(s => `${s.toLowerCase()}@ticker`).join('/');
    this.ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streams}`);
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handlePriceUpdate(data);
    };
  }
  
  private handlePriceUpdate(data: any) {
    // Process real-time price updates
    const priceUpdate = {
      symbol: data.s,
      price: parseFloat(data.c),
      change24h: parseFloat(data.P)
    };
    
    // Emit to subscribers
    this.emit('priceUpdate', priceUpdate);
  }
}
```

---

## 🤖 AI Model APIs

### OpenRouter Integration
**Status**: ✅ Integrated  
**Type**: Paid API with free tier models  
**Purpose**: AI trading signal generation and market analysis  

#### Service Implementation
```typescript
// src/services/ai/openRouterService.ts
class OpenRouterService {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';
  
  async generateTradingSignal(marketData: any, strategy: string, model = 'deepseek/deepseek-r1') {
    const prompt = this.buildTradingPrompt(marketData, strategy);
    
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Crypto Trading Platform'
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert crypto trading analyst.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });
    
    return response.json();
  }
  
  private buildTradingPrompt(marketData: any, strategy: string): string {
    return `
      Analyze the following market data for ${marketData.symbol}:
      Price: $${marketData.price}
      24h Change: ${marketData.change24h}%
      Volume: $${marketData.volume24h}
      
      Using ${strategy} strategy, provide a trading recommendation with:
      1. Signal (BUY/SELL/HOLD)
      2. Confidence (0-100%)
      3. Entry price
      4. Target price
      5. Stop loss
      6. Reasoning
      
      Format as JSON.
    `;
  }
}
```

#### Available Models
```typescript
const AVAILABLE_MODELS = {
  free: [
    'deepseek/deepseek-r1',
    'google/gemini-2.0-flash-exp:free',
    'meta-llama/llama-3.2-3b-instruct:free',
    'microsoft/wizardlm-2-8x22b:free'
  ],
  paid: [
    'openai/gpt-4o',
    'anthropic/claude-3.5-sonnet',
    'google/gemini-pro-1.5',
    'cohere/command-r-plus'
  ]
};
```

---

## ⛓️ Blockchain APIs

### Algorand Integration (Nodely)
**Status**: ✅ Integrated  
**Type**: Free tier with rate limits  
**Purpose**: Algorand network data and account information  

#### Configuration
```typescript
// src/services/algorand/algorandService.ts
class AlgorandService {
  private apiKey = '98D9CE80660AD243893D56D9F125CD2D';
  private endpoints = {
    mainnet: 'https://mainnet-api.4160.nodely.io',
    testnet: 'https://testnet-api.4160.nodely.io',
    indexer: 'https://mainnet-idx.4160.nodely.io'
  };
  
  async getNetworkStatus() {
    const response = await fetch(`${this.endpoints.mainnet}/v2/status`, {
      headers: {
        'X-Algo-api-token': this.apiKey
      }
    });
    return response.json();
  }
  
  async getAccountInfo(address: string) {
    const response = await fetch(`${this.endpoints.mainnet}/v2/accounts/${address}`, {
      headers: {
        'X-Algo-api-token': this.apiKey
      }
    });
    return response.json();
  }
  
  async getAssetInfo(assetId: number) {
    const response = await fetch(`${this.endpoints.mainnet}/v2/assets/${assetId}`, {
      headers: {
        'X-Algo-api-token': this.apiKey
      }
    });
    return response.json();
  }
}
```

---

## 🔄 Automation APIs

### N8N Workflow Integration
**Status**: ✅ Integrated  
**Type**: Self-hosted workflow engine  
**Purpose**: Trading automation and alert management  

#### Service Implementation
```typescript
// src/services/automation/n8nAutomationService.ts
class N8NAutomationService {
  private baseWebhookUrl = 'https://your-n8n-instance.com/webhook';
  
  async sendTradingSignal(signalData: TradingSignalData): Promise<boolean> {
    const webhookUrl = localStorage.getItem('n8n_signal_webhook') || 
      `${this.baseWebhookUrl}/trading-signal`;
      
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        event: 'trading_signal',
        data: signalData,
        source: 'crypto-ai-platform'
      })
    });
    
    return response.ok;
  }
  
  async sendPortfolioUpdate(portfolioData: PortfolioUpdateData): Promise<boolean> {
    const webhookUrl = localStorage.getItem('n8n_portfolio_webhook') || 
      `${this.baseWebhookUrl}/portfolio-update`;
      
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        event: 'portfolio_update',
        data: portfolioData,
        source: 'crypto-ai-platform'
      })
    });
    
    return response.ok;
  }
}
```

#### Webhook Configuration
```typescript
// Configure N8N webhooks
const n8nService = new N8NAutomationService();

// Set webhook URLs
n8nService.setSignalWebhook('https://your-n8n.com/webhook/trading-signal');
n8nService.setPortfolioWebhook('https://your-n8n.com/webhook/portfolio-update');
n8nService.setRiskWebhook('https://your-n8n.com/webhook/risk-alert');
```

---

## 🏦 Exchange APIs

### Exchange Integration Framework
**Status**: 🔄 Partial (Framework Ready)  
**Supported Exchanges**: Binance, Coinbase, Kraken, Bybit, OKX, KuCoin  

#### Exchange Service Base Class
```typescript
// src/services/exchanges/baseExchangeService.ts
abstract class BaseExchangeService {
  protected apiKey: string;
  protected apiSecret: string;
  protected sandbox: boolean;
  
  abstract async getBalance(): Promise<any>;
  abstract async createOrder(order: OrderRequest): Promise<any>;
  abstract async getOrderStatus(orderId: string): Promise<any>;
  abstract async cancelOrder(orderId: string): Promise<any>;
  
  protected sign(message: string): string {
    // Implement exchange-specific signing
    return crypto.createHmac('sha256', this.apiSecret)
      .update(message)
      .digest('hex');
  }
}
```

#### Binance Implementation Example
```typescript
// src/services/exchanges/binanceService.ts
class BinanceService extends BaseExchangeService {
  private baseUrl = this.sandbox ? 
    'https://testnet.binance.vision/api' : 
    'https://api.binance.com/api';
    
  async getBalance() {
    const timestamp = Date.now();
    const queryString = `timestamp=${timestamp}`;
    const signature = this.sign(queryString);
    
    const response = await fetch(`${this.baseUrl}/v3/account?${queryString}&signature=${signature}`, {
      headers: {
        'X-MBX-APIKEY': this.apiKey
      }
    });
    
    return response.json();
  }
  
  async createOrder(order: OrderRequest) {
    const timestamp = Date.now();
    const params = {
      symbol: order.symbol,
      side: order.side,
      type: order.type,
      quantity: order.quantity,
      timestamp
    };
    
    if (order.price) params.price = order.price;
    
    const queryString = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&');
      
    const signature = this.sign(queryString);
    
    const response = await fetch(`${this.baseUrl}/v3/order`, {
      method: 'POST',
      headers: {
        'X-MBX-APIKEY': this.apiKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `${queryString}&signature=${signature}`
    });
    
    return response.json();
  }
}
```

---

## 📊 Data Aggregation Service

### Multi-Source Data Manager
```typescript
// src/services/api/dataAggregationService.ts
class DataAggregationService {
  private sources = {
    primary: coinGeckoService,
    secondary: binanceService,
    tertiary: cryptoCompareService
  };
  
  async getPriceWithFallback(symbol: string): Promise<number> {
    for (const [sourceName, service] of Object.entries(this.sources)) {
      try {
        const price = await service.getPrice(symbol);
        if (price) {
          console.log(`Price for ${symbol} from ${sourceName}: $${price}`);
          return price;
        }
      } catch (error) {
        console.warn(`${sourceName} failed for ${symbol}:`, error.message);
        continue;
      }
    }
    
    throw new Error(`Failed to fetch price for ${symbol} from all sources`);
  }
  
  async getAggregatedMarketData(symbols: string[]) {
    const results = await Promise.allSettled(
      symbols.map(symbol => this.getPriceWithFallback(symbol))
    );
    
    return results
      .map((result, index) => ({
        symbol: symbols[index],
        price: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason : null
      }))
      .filter(item => item.price !== null);
  }
}
```

---

## 🔧 Error Handling & Retry Logic

### Universal Error Handler
```typescript
// src/utils/apiErrorHandler.ts
class ApiErrorHandler {
  static async withRetry<T>(
    apiCall: () => Promise<T>,
    maxRetries = 3,
    backoffMs = 1000
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await apiCall();
      } catch (error) {
        if (attempt === maxRetries) throw error;
        
        const delay = backoffMs * Math.pow(2, attempt - 1);
        
        if (this.isRetryableError(error)) {
          console.warn(`API call failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw error; // Don't retry non-retryable errors
        }
      }
    }
  }
  
  private static isRetryableError(error: any): boolean {
    return (
      error.status >= 500 || // Server errors
      error.status === 429 || // Rate limiting
      error.code === 'NETWORK_ERROR' || // Network issues
      error.code === 'TIMEOUT'
    );
  }
}
```

### Usage with Error Handling
```typescript
// Example: Get prices with retry logic
const getPricesWithRetry = async (symbols: string[]) => {
  return ApiErrorHandler.withRetry(async () => {
    return await coinGeckoService.getCurrentPrices(symbols);
  }, 3, 1000);
};
```

---

## 📈 Rate Limiting & Caching

### Rate Limiter Implementation
```typescript
// src/utils/rateLimiter.ts
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  async waitForSlot(service: string, limitPerMinute: number): Promise<void> {
    const now = Date.now();
    const serviceRequests = this.requests.get(service) || [];
    
    // Remove requests older than 1 minute
    const recentRequests = serviceRequests.filter(
      timestamp => now - timestamp < 60000
    );
    
    if (recentRequests.length >= limitPerMinute) {
      const oldestRequest = Math.min(...recentRequests);
      const waitTime = 60000 - (now - oldestRequest);
      
      console.log(`Rate limit reached for ${service}, waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    recentRequests.push(now);
    this.requests.set(service, recentRequests);
  }
}
```

### Caching Service
```typescript
// src/services/cache/cacheService.ts
class CacheService {
  private cache = new Map<string, { data: any; expires: number }>();
  
  set(key: string, data: any, ttlSeconds = 300): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + (ttlSeconds * 1000)
    });
  }
  
  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttlSeconds = 300
  ): Promise<T> {
    const cached = this.get(key);
    if (cached) return cached;
    
    const data = await fetchFn();
    this.set(key, data, ttlSeconds);
    return data;
  }
}
```

---

## 🔒 Security Best Practices

### API Key Management
```typescript
// src/utils/apiKeyManager.ts
class ApiKeyManager {
  private static encrypt(data: string): string {
    // Use Web Crypto API for encryption
    // This is a simplified example
    return btoa(data); // Use proper encryption in production
  }
  
  private static decrypt(data: string): string {
    return atob(data); // Use proper decryption in production
  }
  
  static storeApiKey(service: string, apiKey: string): void {
    const encrypted = this.encrypt(apiKey);
    localStorage.setItem(`api_key_${service}`, encrypted);
  }
  
  static getApiKey(service: string): string | null {
    const encrypted = localStorage.getItem(`api_key_${service}`);
    return encrypted ? this.decrypt(encrypted) : null;
  }
  
  static removeApiKey(service: string): void {
    localStorage.removeItem(`api_key_${service}`);
  }
}
```

### Request Signing
```typescript
// src/utils/requestSigner.ts
class RequestSigner {
  static signRequest(
    method: string,
    path: string,
    body: string,
    timestamp: number,
    apiSecret: string
  ): string {
    const message = `${method}${path}${timestamp}${body}`;
    
    return crypto
      .createHmac('sha256', apiSecret)
      .update(message)
      .digest('hex');
  }
}
```

---

## 📋 API Testing & Monitoring

### API Health Check
```typescript
// src/services/monitoring/apiHealthCheck.ts
class ApiHealthCheck {
  private services = [
    { name: 'CoinGecko', check: () => coinGeckoService.ping() },
    { name: 'Binance', check: () => binanceService.ping() },
    { name: 'Algorand', check: () => algorandService.getNetworkStatus() },
    { name: 'OpenRouter', check: () => openRouterService.getModels() }
  ];
  
  async checkAllServices(): Promise<ServiceStatus[]> {
    const results = await Promise.allSettled(
      this.services.map(async service => ({
        name: service.name,
        status: await this.checkService(service.check),
        timestamp: new Date().toISOString()
      }))
    );
    
    return results.map((result, index) => ({
      name: this.services[index].name,
      status: result.status === 'fulfilled' ? result.value.status : 'error',
      timestamp: result.status === 'fulfilled' ? result.value.timestamp : new Date().toISOString()
    }));
  }
  
  private async checkService(checkFn: () => Promise<any>): Promise<string> {
    try {
      await checkFn();
      return 'healthy';
    } catch (error) {
      return 'unhealthy';
    }
  }
}
```

---

## 🚀 Performance Optimization

### Request Batching
```typescript
// src/utils/requestBatcher.ts
class RequestBatcher {
  private batches = new Map<string, any[]>();
  private timers = new Map<string, NodeJS.Timeout>();
  
  batch<T>(
    key: string,
    item: T,
    batchFn: (items: T[]) => Promise<any>,
    delay = 100
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.batches.has(key)) {
        this.batches.set(key, []);
      }
      
      this.batches.get(key)!.push({ item, resolve, reject });
      
      if (this.timers.has(key)) {
        clearTimeout(this.timers.get(key)!);
      }
      
      this.timers.set(key, setTimeout(async () => {
        const batch = this.batches.get(key)!;
        this.batches.delete(key);
        this.timers.delete(key);
        
        try {
          const items = batch.map(b => b.item);
          const result = await batchFn(items);
          
          batch.forEach((b, index) => {
            b.resolve(result[index]);
          });
        } catch (error) {
          batch.forEach(b => b.reject(error));
        }
      }, delay));
    });
  }
}
```

---

## 📚 API Documentation

### OpenAPI Specification
The platform includes comprehensive API documentation using OpenAPI 3.0 specification. Access the interactive API documentation at `/api/docs` when running the development server.

### Key Endpoints
```yaml
# Generated OpenAPI spec excerpt
paths:
  /api/v1/market/prices:
    get:
      summary: Get current cryptocurrency prices
      parameters:
        - name: symbols
          in: query
          required: true
          schema:
            type: array
            items:
              type: string
      responses:
        200:
          description: Current prices
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/PriceData'
```

---

**This guide provides comprehensive coverage of all API integrations. For specific implementation details, refer to the individual service files in the codebase.**
