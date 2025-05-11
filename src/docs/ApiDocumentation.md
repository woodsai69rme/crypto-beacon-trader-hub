
# API Documentation for Lovable Trading Platform

## Introduction

This document provides comprehensive documentation for the API integrations available in the Lovable Trading Platform. The platform supports multiple cryptocurrency data providers and trading APIs, each with specific endpoints, authentication methods, and rate limiting considerations.

## Supported API Providers

The platform currently integrates with the following API providers:

1. **CoinGecko API**: Comprehensive cryptocurrency market data
2. **Binance API**: Trading and market data from Binance exchange
3. **Kraken API**: Trading and market data from Kraken exchange

Additional providers can be configured through the API Provider Management interface.

## Authentication

### API Key Management

All API keys are stored securely and managed through the API Provider Management interface:

- API keys are encrypted in local storage
- Keys are never exposed in client-side code
- Minimal permissions should be used for API keys
- Regular key rotation is recommended

### Authentication Methods

Different providers use various authentication methods:

- **Header-based**: API key sent in request headers (CoinGecko, Kraken)
- **Query parameter**: API key included in request URL (some Binance endpoints)
- **JWT**: Token-based authentication (custom APIs)

## CoinGecko API Integration

### Endpoints

| Endpoint | Description | Parameters | Example |
|----------|-------------|------------|---------|
| `/coins/markets` | List all supported coins price, volume, market cap | `vs_currency`, `ids`, `order`, `per_page`, `page`, `sparkline` | `GET /coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false` |
| `/coins/{id}` | Get current data for a coin | `id`, `localization`, `tickers`, `market_data`, `community_data`, `developer_data`, `sparkline` | `GET /coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false` |
| `/coins/{id}/market_chart` | Get historical market data | `id`, `vs_currency`, `days`, `interval` | `GET /coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily` |

### Usage Example

```typescript
import { fetchCryptoPrices } from '@/services/enhancedCryptoApi';

// Get prices for specific coins
const cryptoData = await fetchCryptoPrices(['bitcoin', 'ethereum', 'solana']);
```

### Rate Limits

- Free tier: 10-50 calls/minute
- Pro tier: Higher limits based on subscription
- Current usage visible in API Usage Metrics component

## Binance API Integration

### Endpoints

| Endpoint | Description | Parameters | Example |
|----------|-------------|------------|---------|
| `/ticker/24hr` | 24-hour rolling window price change statistics | `symbol` (optional) | `GET /ticker/24hr?symbol=BTCUSDT` |
| `/klines` | Kline/candlestick data | `symbol`, `interval`, `startTime`, `endTime`, `limit` | `GET /klines?symbol=BTCUSDT&interval=1h&limit=500` |
| `/depth` | Order book depth | `symbol`, `limit` | `GET /depth?symbol=BTCUSDT&limit=100` |

### Authentication

Binance API requires an API key and secret for authenticated endpoints:

```typescript
const headers = {
  'X-MBX-APIKEY': apiKey
};

// For signed endpoints
const signature = createSignature(queryString, apiSecret);
const signedUrl = `${url}?${queryString}&signature=${signature}`;
```

### Rate Limits

- Standard: 1200 weight per minute
- Weight varies by endpoint
- IP-based rate limiting enforced

## Kraken API Integration

### Endpoints

| Endpoint | Description | Parameters | Example |
|----------|-------------|------------|---------|
| `/public/Ticker` | Get ticker information | `pair` | `GET /0/public/Ticker?pair=XBTEUR,ETHEUR` |
| `/public/OHLC` | Get OHLC data | `pair`, `interval`, `since` | `GET /0/public/OHLC?pair=XBTEUR&interval=60` |
| `/public/Depth` | Get order book | `pair`, `count` | `GET /0/public/Depth?pair=XBTEUR&count=10` |

### Authentication for Private API

Kraken private API endpoints require authentication using:

1. API key
2. Nonce (increasing integer, typically timestamp)
3. Signature created using HMAC-SHA512

```typescript
const nonce = Date.now().toString();
const postData = `nonce=${nonce}&ordertype=limit&pair=XBTEUR&price=37500&type=buy&volume=1.25`;
const signature = createSignature(path, postData, apiSecret);

const headers = {
  'API-Key': apiKey,
  'API-Sign': signature
};
```

### Rate Limits

- Tier 0-3 accounts have varying rate limits
- Limits based on number of requests per sliding time window
- Error 429 returned when limit exceeded

## Custom API Integration

### Adding a New API Provider

To integrate a custom API:

1. Navigate to API Provider Management
2. Click "Add Provider"
3. Enter provider details:
   - Name
   - Base URL
   - API key (if required)
   - Usage limit
4. Configure individual endpoints
5. Test the connection

### Required Configuration

Each API provider requires:

- Base URL for API requests
- Authentication mechanism (if any)
- Endpoint definitions
- Rate limit information

## Error Handling

### Common API Errors

| HTTP Code | Meaning | Handling Strategy |
|-----------|---------|-------------------|
| 400 | Bad Request | Check parameters and format |
| 401 | Unauthorized | Verify API key and permissions |
| 403 | Forbidden | Check IP restrictions or permissions |
| 429 | Too Many Requests | Implement backoff strategy |
| 500 | Server Error | Retry with exponential backoff |

### Implementation Example

```typescript
const fetchWithRetry = async (url, options, maxRetries = 3) => {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const response = await fetch(url, options);
      
      if (response.status === 429) {
        // Rate limited
        const retryAfter = response.headers.get('Retry-After') || Math.pow(2, retries);
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        retries++;
        continue;
      }
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      if (retries === maxRetries - 1) throw error;
      retries++;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
    }
  }
};
```

## API Usage Monitoring

### Metrics Tracked

- Request count by endpoint
- Success/failure ratio
- Response times
- Rate limit consumption
- Errors by type

### Viewing API Usage

1. Navigate to the API Usage Metrics component
2. View real-time usage statistics
3. Monitor rate limit consumption
4. Check for approaching limits

## Best Practices

### Optimizing API Usage

- Cache frequently accessed data
- Batch requests when possible
- Implement staggered polling for real-time data
- Use websockets for high-frequency updates
- Implement proper error handling and retries

### Security Considerations

- Store API keys securely
- Use read-only API keys when possible
- Implement proper error handling to avoid exposing sensitive information
- Validate and sanitize all API responses
- Use HTTPS for all requests

## Websocket Integration

### Available Websocket Feeds

Some providers offer websocket connections for real-time data:

- **Binance**: Market data and user data streams
- **Kraken**: Market data feeds
- **Custom**: User-configured websocket endpoints

### Example Websocket Implementation

```typescript
const connectWebsocket = (url) => {
  const ws = new WebSocket(url);
  
  ws.onopen = () => {
    console.log('WebSocket connected');
    // Subscribe to specific feeds
    ws.send(JSON.stringify({
      method: 'SUBSCRIBE',
      params: ['btcusdt@trade', 'btcusdt@depth'],
      id: Date.now()
    }));
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Process data updates
    updateRealTimeData(data);
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  ws.onclose = () => {
    console.log('WebSocket disconnected, reconnecting...');
    setTimeout(() => connectWebsocket(url), 2000);
  };
  
  return ws;
};
```

## Conclusion

This API documentation provides a comprehensive guide to the API integrations available in the Lovable Trading Platform. For specific implementation details, refer to the individual service files in the `services/` directory.

For questions or support regarding API integration, please consult the Developer Guide or reach out to the development team.
