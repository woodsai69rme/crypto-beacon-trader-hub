
# API Documentation

This document provides an overview of the APIs used in the application, including external services and internal API handlers.

## External API Services

### Cryptocurrency Data APIs

#### CoinGecko API

Used for fetching real-time cryptocurrency price data and market information.

**Base URL**: `https://api.coingecko.com/api/v3`

**Key Endpoints**:
- `/coins/markets` - Get list of coins with market data
- `/coins/{id}/market_chart` - Get historical market data
- `/coins/{id}` - Get current data for a specific coin

**Implementation**: 
```typescript
// Example usage in cryptoService.ts
export async function fetchTopCryptoData(limit = 10) {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`;
  // ... implementation
}
```

### News and Market Data

Used for fetching cryptocurrency news and market analysis data.

**Base URL**: Various providers

**Implementation**:
```typescript
// Example in enhancedCryptoApi.ts
export async function getLatestNews(limit = 10) {
  // Implementation to fetch latest crypto news
}
```

### OpenRouter API

Used for accessing various AI models for trading strategy generation and market analysis.

**Base URL**: `https://openrouter.ai/api`

**Key Endpoints**:
- `/v1/chat/completions` - Generate completions from AI models

**Authentication**: API key required

**Implementation**:
```typescript
// Example in openRouterService.ts
export async function generateTradingStrategy(params) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: selectedModel,
      messages: [
        { role: 'system', content: 'You are a cryptocurrency trading expert.' },
        { role: 'user', content: params.prompt }
      ],
    }),
  });
  // Process response
}
```

## Internal API Services

### Trading Service

**File**: `/src/services/tradingService.ts`

**Key Functions**:
- `executeTrade(trade)`: Process a trade order
- `getPortfolioValue(holdings)`: Calculate current portfolio value
- `analyzeTradeHistory(trades)`: Analyze past trading performance

### Portfolio Analysis Service

**File**: `/src/services/portfolioService.ts`

**Key Functions**:
- `calculateReturns(portfolio, timeframe)`: Calculate portfolio returns
- `getAssetAllocation(holdings)`: Get current asset allocation

### AI Portfolio Service

**File**: `/src/services/aiPortfolioService.ts`

**Key Functions**:
- `analyzePortfolio(account)`: Generate AI analysis of portfolio
- `optimizePortfolio(account, riskTolerance)`: Get portfolio optimization suggestions

### Authentication Service

**File**: `/src/services/authService.ts`

**Key Functions**:
- `login(credentials)`: Authenticate user
- `register(userDetails)`: Register new user
- `validateSession()`: Validate current session

### Mock Data Service

**File**: `/src/services/mockDataService.ts`

**Key Functions**:
- `generateMockTrades(params)`: Generate simulated trading data
- `generateMockPortfolio()`: Create a mock portfolio for demo purposes

## Data Models

### Trade

```typescript
interface Trade {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  totalValue: number;
  timestamp: string;
  currency: SupportedCurrency;
  total: number;
  tags?: string[];
}
```

### TradingAccount

```typescript
interface TradingAccount {
  id: string;
  name: string;
  trades: Trade[];
  balance: number;
  currency: SupportedCurrency;
  createdAt: string;
}
```

### AITradingStrategy

```typescript
interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  profitPotential: 'low' | 'medium' | 'high';
  timeframe: 'short' | 'medium' | 'long';
  indicators: string[];
  triggers: string[];
  implementation?: string;
  recommendation?: string;
  confidence?: number;
  backtestResults?: {
    winRate: number;
    profitFactor: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
}
```

## Error Handling

API requests use a consistent error handling pattern:

```typescript
try {
  const data = await fetchData();
  return processData(data);
} catch (error) {
  console.error(`Error in operation: ${error.message}`);
  toast({
    title: "Operation Failed",
    description: "Failed to complete the requested operation",
    variant: "destructive"
  });
  throw error;
}
```

## API Rate Limiting

External API calls implement rate limiting to prevent exceeding API provider limits:

- Request caching for repeated calls
- Throttling for high-frequency requests
- Batch operations where possible

## Security Considerations

- API keys are stored securely and not exposed in client-side code
- HTTPS is used for all API communication
- Input validation is performed on all API requests
- Authentication is required for sensitive operations
