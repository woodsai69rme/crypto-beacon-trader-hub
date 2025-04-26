
# API Documentation

## Overview
This document outlines the API endpoints and data structures used by the Crypto Dashboard application. The application interacts with various cryptocurrency data providers to fetch market data, portfolio information, and other relevant information.

## Authentication
API requests requiring authentication use bearer tokens. To authenticate:
1. Obtain an API key from the user settings
2. Include the token in the Authorization header: `Authorization: Bearer <your_token>`

## Base URLs
- Production API: `https://api.cryptodashboard.com/v1`
- Development API: `https://dev-api.cryptodashboard.com/v1`

## Endpoints

### Market Data
- `GET /markets/overview` - Get overall market statistics
- `GET /markets/coins` - List all available coins
- `GET /markets/coins/:id` - Get detailed information about a specific coin
- `GET /markets/coins/:id/history` - Get historical price data for a coin
- `GET /markets/technical-indicators/:id` - Get technical indicators for a specific coin
- `GET /markets/correlations` - Get correlation matrix between assets

### User Portfolio
- `GET /portfolio` - Get user's portfolio summary
- `POST /portfolio/transactions` - Add a new transaction
- `PUT /portfolio/transactions/:id` - Update an existing transaction
- `DELETE /portfolio/transactions/:id` - Remove a transaction

### Watchlist
- `GET /watchlist` - Get user's watchlist
- `POST /watchlist` - Add a coin to watchlist
- `DELETE /watchlist/:id` - Remove a coin from watchlist

### Alerts
- `GET /alerts` - Get user's configured alerts
- `POST /alerts` - Create a new alert
- `PUT /alerts/:id` - Update an alert
- `DELETE /alerts/:id` - Delete an alert

### Fake Trading System
- `GET /fake-trading/account` - Get fake trading account details
- `GET /fake-trading/transactions` - Get fake trading transaction history
- `POST /fake-trading/execute` - Execute a fake trade
- `POST /fake-trading/reset` - Reset fake trading account
- `GET /fake-trading/performance` - Get performance metrics for the fake trading account

### AI Market Insights
- `GET /ai/insights` - Get AI-generated market insights
- `GET /ai/insights/:category` - Get insights by category (trends, signals, alerts, predictions)
- `GET /ai/insights/coin/:coinId` - Get AI insights for a specific cryptocurrency
- `POST /ai/insights/generate` - Trigger generation of new insights
- `GET /ai/models` - Get information about available AI models

### Technical Analysis
- `GET /analysis/technical/:coinId` - Get technical indicators for a specific coin
- `GET /analysis/technical/:coinId/:indicator` - Get specific technical indicator data
- `GET /analysis/correlations` - Get correlation matrix between assets
- `GET /analysis/patterns/:coinId` - Get detected chart patterns for a coin
- `GET /analysis/risk-assessment` - Get risk assessment for user portfolio

## Data Models

### Coin
```typescript
interface Coin {
  id: string;          // Unique identifier
  symbol: string;      // Trading symbol (e.g., 'BTC')
  name: string;        // Full name (e.g., 'Bitcoin')
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  image: string;       // URL to coin image
}
```

### Transaction
```typescript
interface Transaction {
  id: string;
  coin_id: string;
  type: 'buy' | 'sell';
  amount: number;
  price_per_coin: number;
  total_value: number;
  timestamp: string;   // ISO date string
  fee: number;
  exchange: string;
}
```

### Alert
```typescript
interface Alert {
  id: string;
  coin_id: string;
  condition: 'above' | 'below';
  price: number;
  notification_method: string[];  // 'email', 'push', 'sms'
  active: boolean;
  created_at: string;
}
```

### FakeTrade
```typescript
interface FakeTrade {
  id: string;
  coin_id: string;
  coin_symbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  total_value: number;
  timestamp: string;   // ISO date string
  current_value?: number;
  profit_loss?: number;
}
```

### FakeTradingAccount
```typescript
interface FakeTradingAccount {
  id: string;
  user_id: string;
  balance: number;
  initial_balance: number;
  portfolio_value: number;
  performance_percentage: number;
  created_at: string;
  updated_at: string;
}
```

### MarketInsight
```typescript
interface MarketInsight {
  id: string;
  type: 'trend' | 'signal' | 'alert' | 'prediction';
  title: string;
  description: string;
  coins: string[];     // Array of related coin IDs
  confidence: number;  // 0-100 confidence score
  impact: 'high' | 'medium' | 'low';
  timestamp: string;
  tags: string[];
  model: string;       // AI model used for generation
  sources?: string[];  // Data sources used for analysis
}
```

### TechnicalIndicator
```typescript
interface TechnicalIndicator {
  coin_id: string;
  timestamp: string;
  indicators: {
    rsi: number;       // Relative Strength Index
    macd: number;      // Moving Average Convergence Divergence
    signal: number;    // MACD Signal Line
    histogram: number; // MACD Histogram
    sma20: number;     // Simple Moving Average (20 periods)
    sma50: number;     // Simple Moving Average (50 periods)
    sma200: number;    // Simple Moving Average (200 periods)
    ema12: number;     // Exponential Moving Average (12 periods)
    ema26: number;     // Exponential Moving Average (26 periods)
    upper_band: number; // Upper Bollinger Band
    lower_band: number; // Lower Bollinger Band
  };
}
```

### AssetCorrelation
```typescript
interface AssetCorrelation {
  base_asset: string;
  quote_asset: string;
  correlation: number;  // -1 to 1 correlation coefficient
  period: string;       // Time period for correlation calculation
  timestamp: string;
}
```

## Error Handling
All API endpoints return standard HTTP status codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

Error responses include a JSON body with error details:
```json
{
  "error": {
    "code": "invalid_request",
    "message": "The request was invalid",
    "details": "..."
  }
}
```

## Rate Limiting
API requests are rate-limited to 100 requests per minute per API key. When a rate limit is exceeded, the API returns a 429 Too Many Requests response.

## Changelog
- **v1.0.0** (2025-04-01): Initial release
- **v1.0.1** (2025-04-15): Added portfolio performance endpoints
- **v1.0.2** (2025-04-26): Added fake trading system endpoints
- **v1.0.3** (2025-04-30): Added AI market insights endpoints
- **v1.0.4** (2025-05-05): Added technical indicator and correlation analysis endpoints
