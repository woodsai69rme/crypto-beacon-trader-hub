
# API Documentation

## 1. Authentication

### 1.1 Authentication Methods
The platform uses Supabase Auth with JWT tokens for authentication.

```typescript
// Authentication Headers
Authorization: Bearer {jwt_token}
apikey: {supabase_anon_key}
Content-Type: application/json
```

### 1.2 Login
```http
POST /auth/v1/token
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password",
  "grant_type": "password"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "...",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

## 2. Portfolio Management

### 2.1 Get Portfolios
```http
GET /rest/v1/portfolios
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "name": "Default Portfolio",
    "mode": "paper",
    "current_balance": 10000.00,
    "total_value": 12500.00,
    "total_pnl": 2500.00,
    "positions": [
      {
        "symbol": "BTC",
        "amount": 0.5,
        "average_price": 45000,
        "current_value": 22500
      }
    ],
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### 2.2 Create Portfolio
```http
POST /rest/v1/portfolios
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Trading Portfolio",
  "mode": "live",
  "initial_balance": 50000.00
}
```

### 2.3 Update Portfolio
```http
PUT /rest/v1/portfolios/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Portfolio Name",
  "current_balance": 55000.00
}
```

## 3. Trading Operations

### 3.1 Place Order
```http
POST /rest/v1/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "symbol": "BTC/AUD",
  "side": "buy",
  "type": "market",
  "quantity": 1.0,
  "price": null,
  "portfolio_id": "uuid"
}
```

**Response:**
```json
{
  "id": "uuid",
  "symbol": "BTC/AUD",
  "side": "buy",
  "type": "market",
  "quantity": 1.0,
  "filled_quantity": 1.0,
  "average_fill_price": 45000,
  "status": "filled",
  "created_at": "2024-01-01T00:00:00Z",
  "filled_at": "2024-01-01T00:00:01Z"
}
```

### 3.2 Get Orders
```http
GET /rest/v1/orders?portfolio_id=eq.{portfolio_id}
Authorization: Bearer {token}
```

### 3.3 Cancel Order
```http
DELETE /rest/v1/orders/{id}
Authorization: Bearer {token}
```

## 4. AI Trading Bots

### 4.1 Get Trading Bots
```http
GET /rest/v1/trading_bots
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Trend Following Bot",
    "strategy": "trend-following",
    "ai_model": "gpt-4o-mini",
    "status": "active",
    "risk_level": "medium",
    "max_position_size": 1000.00,
    "target_symbols": ["BTC", "ETH"],
    "performance": {
      "total_trades": 25,
      "win_rate": 68.5,
      "total_return": 12.5,
      "current_value": 1125.00
    },
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### 4.2 Create Trading Bot
```http
POST /rest/v1/trading_bots
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "My AI Bot",
  "strategy": "mean-reversion",
  "ai_model": "gpt-4o-mini",
  "risk_level": "low",
  "max_position_size": 500.00,
  "target_symbols": ["BTC", "ETH", "SOL"],
  "config": {
    "stop_loss_percentage": 5.0,
    "take_profit_percentage": 10.0
  }
}
```

### 4.3 Update Bot Status
```http
PUT /rest/v1/trading_bots/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "paused"
}
```

## 5. Market Data

### 5.1 Get Market Data
```http
GET /rest/v1/market_data_cache?symbol=eq.BTC
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "symbol": "BTC",
    "price_usd": 45000.00,
    "price_aud": 67500.00,
    "change_24h": 2.5,
    "volume_24h_usd": 25000000000,
    "market_cap_usd": 875000000000,
    "last_updated": "2024-01-01T00:00:00Z"
  }
]
```

### 5.2 Get Historical Data
```http
GET /functions/v1/get-historical-data
Authorization: Bearer {token}
Content-Type: application/json

{
  "symbol": "BTC",
  "days": 30,
  "interval": "1d"
}
```

## 6. Alerts and Notifications

### 6.1 Create Price Alert
```http
POST /rest/v1/alerts
Authorization: Bearer {token}
Content-Type: application/json

{
  "symbol": "BTC",
  "type": "price_above",
  "target_value": 50000,
  "is_active": true
}
```

### 6.2 Get Alerts
```http
GET /rest/v1/alerts?is_active=eq.true
Authorization: Bearer {token}
```

### 6.3 Update Alert
```http
PUT /rest/v1/alerts/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "is_active": false
}
```

## 7. Edge Functions

### 7.1 AI Trading Signal
```http
POST /functions/v1/ai-trading-signal
Authorization: Bearer {token}
Content-Type: application/json

{
  "symbol": "BTC/AUD",
  "strategy": "trend-following",
  "model": "gpt-4o-mini",
  "market_data": {
    "current_price": 45000,
    "volume_24h": 1000000,
    "price_change_24h": 2.5
  },
  "risk_tolerance": "MEDIUM"
}
```

**Response:**
```json
{
  "signal": "BUY",
  "confidence": 75,
  "reasoning": "Strong upward trend with high volume confirmation",
  "suggested_entry": 45200,
  "suggested_stop_loss": 43000,
  "suggested_take_profit": 48000,
  "risk_reward_ratio": 2.3
}
```

### 7.2 Market Analysis
```http
POST /functions/v1/market-analysis
Authorization: Bearer {token}
Content-Type: application/json

{
  "symbols": ["BTC", "ETH", "SOL"],
  "analysis_type": "correlation",
  "timeframe": "7d"
}
```

### 7.3 Risk Calculation
```http
POST /functions/v1/risk-calculation
Authorization: Bearer {token}
Content-Type: application/json

{
  "portfolio_id": "uuid",
  "risk_metrics": ["var", "sharpe_ratio", "max_drawdown"]
}
```

## 8. Real-time Subscriptions

### 8.1 Portfolio Updates
```typescript
const subscription = supabase
  .channel('portfolio-updates')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'portfolios',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    console.log('Portfolio updated:', payload);
  })
  .subscribe();
```

### 8.2 Market Data Updates
```typescript
const marketSubscription = supabase
  .channel('market-data')
  .on('broadcast', { 
    event: 'price-update' 
  }, (payload) => {
    console.log('Price update:', payload);
  })
  .subscribe();
```

### 8.3 Trading Signals
```typescript
const signalSubscription = supabase
  .channel('trading-signals')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'trading_signals',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    console.log('New trading signal:', payload.new);
  })
  .subscribe();
```

## 9. Error Handling

### 9.1 Error Response Format
```json
{
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Insufficient balance to place order",
    "details": {
      "required": 1000.00,
      "available": 500.00
    }
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "request_id": "uuid"
}
```

### 9.2 Common Error Codes
| Code | Description | HTTP Status |
|------|-------------|-------------|
| `UNAUTHORIZED` | Invalid or expired token | 401 |
| `FORBIDDEN` | Insufficient permissions | 403 |
| `NOT_FOUND` | Resource not found | 404 |
| `VALIDATION_ERROR` | Invalid input data | 400 |
| `INSUFFICIENT_BALANCE` | Not enough funds | 400 |
| `RATE_LIMIT_EXCEEDED` | Too many requests | 429 |
| `INTERNAL_ERROR` | Server error | 500 |

## 10. Rate Limiting

### 10.1 Rate Limits
| Endpoint | Limit | Window |
|----------|-------|--------|
| `/auth/*` | 10 requests | 1 minute |
| `/rest/v1/*` | 100 requests | 1 minute |
| `/functions/v1/*` | 60 requests | 1 minute |
| Trading operations | 30 requests | 1 minute |

### 10.2 Rate Limit Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 11. Webhooks

### 11.1 Webhook Events
- `order.filled` - Order execution completed
- `bot.signal` - AI bot generated trading signal
- `alert.triggered` - Price alert triggered
- `portfolio.updated` - Portfolio value changed

### 11.2 Webhook Payload
```json
{
  "event": "order.filled",
  "data": {
    "order_id": "uuid",
    "symbol": "BTC/AUD",
    "side": "buy",
    "quantity": 1.0,
    "fill_price": 45000
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "signature": "sha256_signature"
}
```

## 12. API Versioning

### 12.1 Version Strategy
- Current version: `v1`
- Breaking changes require new version
- Backward compatibility maintained for 12 months
- Version specified in URL path: `/rest/v1/`

### 12.2 Version Headers
```http
API-Version: 1.0
Accept-Version: 1.0
```

## 13. SDK and Client Libraries

### 13.1 JavaScript/TypeScript SDK
```typescript
import { CryptoTradingClient } from '@crypto-platform/sdk';

const client = new CryptoTradingClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.cryptoplatform.com'
});

// Get portfolios
const portfolios = await client.portfolios.list();

// Place order
const order = await client.orders.create({
  symbol: 'BTC/AUD',
  side: 'buy',
  type: 'market',
  quantity: 1.0
});
```

### 13.2 Python SDK
```python
from crypto_platform import CryptoTradingClient

client = CryptoTradingClient(
    api_key='your-api-key',
    base_url='https://api.cryptoplatform.com'
)

# Get portfolios
portfolios = client.portfolios.list()

# Place order
order = client.orders.create(
    symbol='BTC/AUD',
    side='buy',
    type='market',
    quantity=1.0
)
```
