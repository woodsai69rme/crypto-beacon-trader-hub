# Crypto Beacon Trading Platform - Developer Guide

## 🎯 Project Overview

Crypto Beacon is a professional-grade cryptocurrency trading platform featuring AI-powered bots, real exchange integration, comprehensive market analytics, and advanced portfolio management tools.

## 🏗️ Architecture & Tech Stack

### Core Technologies
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Shadcn/UI
- **State Management**: React Context API + TanStack Query
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Exchange Integration**: CCXT Library
- **AI Integration**: OpenRouter API
- **Charts**: Recharts
- **Icons**: Lucide React

### Project Structure
```
src/
├── components/           # UI components organized by feature
│   ├── analytics/        # Market analysis and reporting
│   ├── api/             # API management interfaces
│   ├── auth/            # Authentication components
│   ├── dashboard/       # Main dashboard and widgets
│   ├── news/            # News aggregation and sentiment
│   ├── settings/        # Configuration and preferences
│   ├── testing/         # Platform testing and audit tools
│   ├── trading/         # Trading interfaces and AI bots
│   ├── ui/              # Base UI components (Shadcn)
│   └── wallets/         # Crypto wallet integration
├── contexts/            # React context providers
├── hooks/               # Custom React hooks
├── services/            # Business logic and API integrations
│   ├── ai/              # AI trading bot services
│   ├── api/             # External API integrations
│   ├── exchanges/       # Exchange connectivity (CCXT)
│   └── testing/         # Platform audit and testing
├── types/               # TypeScript type definitions
├── utils/               # Helper functions and utilities
└── docs/                # Documentation files
```

## 🚀 Getting Started

### Development Environment Setup

1. **Prerequisites**
   ```bash
   node --version  # Requires Node.js 18+
   npm --version   # or yarn/pnpm
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access Application**
   Navigate to `http://localhost:5173`

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint checking
npm run type-check   # TypeScript checking
npm test             # Run tests
```

## 📝 Core Features

### 1. Authentication System

**Supabase Integration** with demo login capability:

```typescript
import { useAuth } from '@/components/auth/AuthProvider';

const { user, signOut, subscription } = useAuth();

// Demo login available for testing
// Email: demo@cryptobeacon.com
// Password: demo123456
```

### 2. Exchange Integration (CCXT)

**Supported Exchanges**:
- Binance, Coinbase, Kraken, Bybit, OKX, KuCoin
- Bitfinex, Huobi, Gate.io, MEXC

**Implementation**:
```typescript
import { ccxtService } from '@/services/exchanges/ccxtService';

// Connect to exchange
await ccxtService.connectExchange({
  id: 'binance',
  apiKey: 'your-key',
  secret: 'your-secret',
  sandbox: true
});

// Execute trade
const order = await ccxtService.createOrder(
  'binance', 'BTC/USDT', 'market', 'buy', 0.001
);
```

### 3. AI Trading Bots

**Supported Strategies**:
- Trend Following
- Mean Reversion
- Scalping
- Breakout Trading
- Grid Trading
- Cross-Exchange Arbitrage
- Sentiment-Based Trading
- Pattern Recognition

**AI Models** (OpenRouter):
- DeepSeek R1 (free)
- Gemini 2 (free) 
- GPT-4, Claude 3 (paid)

### 4. Paper Trading System

**Features**:
- Risk-free testing environment
- Real market data with simulated execution
- Portfolio tracking and performance metrics
- Strategy backtesting capabilities

### 5. Market Data & Analytics

**Data Sources**:
- CoinGecko API (primary)
- Exchange WebSocket streams
- CCXT unified market data

**Analytics**:
- Real-time price tracking
- Technical indicators (RSI, MACD, Bollinger Bands)
- Market correlation analysis
- Portfolio performance metrics

## 🔧 Development Guidelines

### TypeScript Best Practices

```typescript
// Define interfaces for all props and data structures
interface TradingBotProps {
  bot: AITradingBot;
  onActivate: (botId: string) => void;
  onDeactivate: (botId: string) => void;
}

// Use strict typing for components
const TradingBotCard: React.FC<TradingBotProps> = ({ bot, onActivate, onDeactivate }) => {
  // Component implementation
};

// Define API response types
interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
}
```

### Component Architecture

**File Structure**:
```typescript
// Component file organization
ComponentName.tsx           # Main component
ComponentName.types.ts      # Type definitions
ComponentName.test.tsx      # Unit tests
index.ts                    # Barrel export
```

**Component Pattern**:
```typescript
import React, { useState, useEffect, useCallback } from 'react';
import { ComponentProps } from './types';

interface ComponentNameProps {
  // Props interface
}

const ComponentName: React.FC<ComponentNameProps> = ({ ...props }) => {
  // Hooks (useState, useEffect, custom hooks)
  // Event handlers
  // Render logic
  
  return (
    <div className="responsive-container">
      {/* Component JSX */}
    </div>
  );
};

export default ComponentName;
```

### State Management

**Context Pattern**:
```typescript
interface ContextType {
  data: DataType;
  actions: {
    updateData: (data: DataType) => void;
    resetData: () => void;
  };
}

const Context = createContext<ContextType | undefined>(undefined);

export const useContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useContext must be used within Provider');
  }
  return context;
};
```

### Service Layer Pattern

```typescript
class TradingService {
  private baseUrl: string;
  
  async executeOrder(orderData: OrderData): Promise<OrderResult> {
    try {
      const response = await fetch(`${this.baseUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Trading service error:', error);
      throw error;
    }
  }
}

export const tradingService = new TradingService();
```

## 🔌 API Integrations

### CCXT Exchange Integration

```typescript
// Exchange configuration
const exchangeConfig = {
  id: 'binance',
  apiKey: process.env.BINANCE_API_KEY,
  secret: process.env.BINANCE_SECRET,
  sandbox: true,  // Use testnet for development
  enableRateLimit: true
};

// Market data fetching
const ticker = await exchange.fetchTicker('BTC/USDT');
const orderBook = await exchange.fetchOrderBook('BTC/USDT');
const ohlcv = await exchange.fetchOHLCV('BTC/USDT', '1h', undefined, 100);
```

### AI Integration (OpenRouter)

```typescript
import { openRouterService from '@/services/openRouterService';

// Generate trading signal
const signal = await openRouterService.generateTradingSignal(
  marketData,
  'trend-following',
  'deepseek/deepseek-r1'  // Free model
);

// Process AI response
const tradingDecision = {
  action: signal.action,      // 'BUY', 'SELL', 'HOLD'
  confidence: signal.confidence,
  reasoning: signal.reasoning
};
```

### Market Data APIs

```typescript
// CoinGecko price data
const priceData = await fetch(
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,aud'
);

// Historical market data
const marketData = await fetch(
  'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7'
);
```

## 🧪 Testing & Quality Assurance

### Platform Audit System

```typescript
import { platformAuditService } from '@/services/testing/platformAudit';

// Run comprehensive platform audit
const auditResults = await platformAuditService.runFullAudit();

console.log(`Overall health: ${auditResults.overall}`);
console.log(`Health score: ${auditResults.score}%`);

// Review specific test results
auditResults.results.forEach(result => {
  console.log(`${result.category}: ${result.status} - ${result.message}`);
});
```

**Test Categories**:
- Authentication flow validation
- Trading system functionality  
- AI integration verification
- Market data connectivity
- UI component responsiveness
- Performance benchmarks

### Manual Testing Checklist

```markdown
## Authentication
- [ ] Demo login works (demo@cryptobeacon.com / demo123456)
- [ ] User registration and email verification
- [ ] Session persistence across browser refreshes
- [ ] Logout functionality and session cleanup

## Trading System
- [ ] Paper trading order execution
- [ ] Portfolio balance updates
- [ ] Exchange connectivity (if API keys configured)
- [ ] Order history and trade tracking

## AI Trading Bots
- [ ] Bot creation and strategy selection
- [ ] AI signal generation and execution
- [ ] Performance metrics tracking
- [ ] Error handling and recovery

## User Interface
- [ ] Responsive design on mobile devices
- [ ] Dark/light theme switching
- [ ] Navigation and routing functionality
- [ ] Loading states and error messages
```

## 🚀 Deployment

### Production Checklist

**Code Quality**:
- [ ] All TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] Build completes without warnings
- [ ] All tests passing

**Configuration**:
- [ ] Supabase project connected
- [ ] Authentication providers configured
- [ ] API keys set in Supabase secrets
- [ ] CORS and URL settings configured

**Security**:
- [ ] No sensitive data in frontend code
- [ ] HTTPS enforced for all API calls
- [ ] Input validation implemented
- [ ] Rate limiting configured

**Performance**:
- [ ] Bundle size optimized
- [ ] Lazy loading implemented
- [ ] Images optimized
- [ ] Caching strategies configured

### Build and Deploy

```bash
# Production build
npm run build

# Deploy using Lovable
# Click the "Publish" button in Lovable interface

# Deploy to custom hosting
# Upload dist/ folder to your web server
```

## 🔐 Security Best Practices

### API Key Management

```typescript
// ❌ Never do this (exposes keys)
const apiKey = 'sk-1234567890abcdef';

// ✅ Use Supabase secrets instead
const response = await supabase.functions.invoke('trading-bot', {
  body: { action: 'buy', symbol: 'BTC/USDT' }
});
```

### Input Validation

```typescript
// Validate user inputs
const validateOrderData = (order: OrderInput): OrderData => {
  if (!order.symbol || typeof order.symbol !== 'string') {
    throw new Error('Invalid symbol');
  }
  
  if (!order.amount || order.amount <= 0) {
    throw new Error('Invalid amount');
  }
  
  return {
    symbol: order.symbol.toUpperCase(),
    amount: Math.abs(order.amount),
    // ... other validated fields
  };
};
```

## 📊 Performance Optimization

### React Performance

```typescript
// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return calculateComplexMetrics(marketData);
}, [marketData]);

// Memoize callbacks to prevent unnecessary re-renders
const handleOrderSubmit = useCallback((orderData: OrderData) => {
  submitOrder(orderData);
}, [submitOrder]);

// Use React.memo for pure components
const PriceDisplay = React.memo<PriceDisplayProps>(({ price, currency }) => {
  return <span>{formatCurrency(price, currency)}</span>;
});
```

### Bundle Optimization

```typescript
// Lazy load components
const TradingDashboard = lazy(() => import('@/components/trading/TradingDashboard'));
const AnalyticsDashboard = lazy(() => import('@/components/analytics/AnalyticsDashboard'));

// Use dynamic imports for large dependencies
const loadChartingLibrary = async () => {
  const { Chart } = await import('chart.js');
  return Chart;
};
```

## 🐛 Debugging & Troubleshooting

### Common Issues

**CCXT Connection Errors**:
```typescript
// Check API credentials and sandbox mode
if (error.message.includes('Invalid API-key')) {
  console.error('Check your API key configuration');
}

if (error.message.includes('Signature mismatch')) {
  console.error('Check your API secret configuration');
}
```

**Authentication Issues**:
```typescript
// Debug auth state
useEffect(() => {
  console.log('Auth state:', { user, session });
}, [user, session]);

// Check Supabase configuration
console.log('Supabase URL:', supabase.supabaseUrl);
```

**Performance Issues**:
```typescript
// Monitor component re-renders
useEffect(() => {
  console.log('Component re-rendered:', componentName);
});

// Profile expensive operations
console.time('Expensive Operation');
const result = expensiveFunction();
console.timeEnd('Expensive Operation');
```

## 🤝 Contributing

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/trading-bot-enhancement

# Make changes and commit
git add .
git commit -m "feat: add sentiment analysis to trading bot"

# Push and create pull request
git push origin feature/trading-bot-enhancement
```

### Commit Message Format

```
feat: add new trading strategy
fix: resolve CCXT connection issue
docs: update API documentation
style: improve component styling
refactor: extract trading logic to service
test: add unit tests for portfolio calculations
chore: update dependencies
```

## 📚 Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/UI](https://ui.shadcn.com/)
- [CCXT Documentation](https://docs.ccxt.com/)
- [Supabase Documentation](https://supabase.com/docs)

### APIs and Services
- [CoinGecko API](https://www.coingecko.com/en/api/documentation)
- [OpenRouter API](https://openrouter.ai/docs)
- [Binance API](https://binance-docs.github.io/apidocs/)

### Development Tools
- [VS Code Extensions](https://marketplace.visualstudio.com/vscode)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [TypeScript Playground](https://www.typescriptlang.org/play)

### Community
- [Project Discord](https://discord.gg/crypto-beacon)
- [GitHub Repository](https://github.com/crypto-beacon)
- [Issue Tracker](https://github.com/crypto-beacon/issues)

---

This guide provides comprehensive information for developers working on the Crypto Beacon trading platform. For the latest updates and detailed implementation guides, refer to the documentation in the `src/docs/` directory.
