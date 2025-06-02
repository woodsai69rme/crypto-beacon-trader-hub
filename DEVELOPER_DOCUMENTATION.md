
# Crypto Beacon Trading Platform - Developer Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Setup & Installation](#setup--installation)
4. [Core Features](#core-features)
5. [API Integrations](#api-integrations)
6. [Testing & Quality Assurance](#testing--quality-assurance)
7. [Deployment](#deployment)
8. [Contributing](#contributing)

## Project Overview

Crypto Beacon is a comprehensive cryptocurrency trading platform built with modern web technologies. It provides:

- **AI-Powered Trading Bots** with multiple strategies
- **Real Exchange Integration** via CCXT library
- **Paper Trading Environment** for testing
- **Real-time Market Data** and analytics
- **News & Sentiment Analysis** with fake news detection
- **Multi-Exchange Support** for major cryptocurrency exchanges
- **Responsive Web Interface** with dark/light themes

### Technology Stack

| Category | Technology |
|----------|------------|
| Frontend | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS + Shadcn/UI |
| State Management | React Context + TanStack Query |
| Authentication | Supabase Auth |
| Database | Supabase PostgreSQL |
| Charts | Recharts |
| Exchange APIs | CCXT Library |
| AI Integration | OpenRouter API |

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React App     │    │   Supabase       │    │  External APIs  │
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │ Components  │ │◄──►│ │ Auth Service │ │    │ │ CCXT        │ │
│ │             │ │    │ │              │ │    │ │ Exchanges   │ │
│ ├─────────────┤ │    │ ├──────────────┤ │    │ ├─────────────┤ │
│ │ Services    │ │◄──►│ │ Database     │ │    │ │ CoinGecko   │ │
│ │             │ │    │ │              │ │    │ │ API         │ │
│ ├─────────────┤ │    │ ├──────────────┤ │    │ ├─────────────┤ │
│ │ Contexts    │ │    │ │ Edge         │ │◄──►│ │ OpenRouter  │ │
│ │             │ │    │ │ Functions    │ │    │ │ AI API      │ │
│ └─────────────┘ │    │ └──────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Component Structure

```
src/components/
├── analytics/          # Data visualization and reporting
├── api/               # API management and monitoring
├── auth/              # Authentication flows
├── dashboard/         # Main dashboard widgets
├── news/              # News aggregation and sentiment
├── settings/          # Configuration panels
├── testing/           # Platform testing tools
├── trading/           # Trading interfaces and bots
├── ui/                # Base UI components (Shadcn)
└── wallets/           # Crypto wallet integration
```

## Setup & Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git for version control

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd crypto-beacon-platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open browser**
Navigate to `http://localhost:5173`

### Development Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm test             # Run tests
```

## Core Features

### 1. Authentication System

**Implementation**: Supabase Auth with custom UI

**Features**:
- Email/password authentication
- Demo login for testing (no email verification)
- Protected routes with session persistence
- User profile management

**Usage Example**:
```typescript
import { useAuth } from '@/components/auth/AuthProvider';

const MyComponent = () => {
  const { user, signOut, subscription } = useAuth();
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  return <div>Welcome, {user.email}!</div>;
};
```

### 2. Trading System

#### Paper Trading
- **Purpose**: Risk-free testing environment
- **Features**: Mock portfolio, real market data, simulated execution
- **Implementation**: Local state management with realistic market simulation

#### Live Trading (CCXT)
- **Purpose**: Real exchange connectivity
- **Supported Exchanges**: Binance, Coinbase, Kraken, Bybit, OKX, KuCoin, Bitfinex, Huobi, Gate.io, MEXC
- **Features**: Real-time order execution, balance management, order history

**Usage Example**:
```typescript
import { ccxtService } from '@/services/exchanges/ccxtService';

// Connect to exchange
await ccxtService.connectExchange({
  id: 'binance',
  name: 'Binance',
  apiKey: 'your-api-key',
  secret: 'your-secret',
  sandbox: true
});

// Execute trade
const order = await ccxtService.createOrder(
  'binance',
  'BTC/USDT',
  'market',
  'buy',
  0.001
);
```

### 3. AI Trading Bots

**Supported Strategies**:
- Trend Following
- Mean Reversion
- Scalping
- Breakout Trading
- Grid Trading
- Arbitrage
- Sentiment Analysis
- Pattern Recognition

**AI Models** (via OpenRouter):
- DeepSeek R1 (free)
- Gemini 2 (free)
- GPT-4 (paid)
- Claude 3 (paid)

**Usage Example**:
```typescript
import { openRouterService } from '@/services/openRouterService';

const signal = await openRouterService.generateTradingSignal(
  marketData,
  'trend-following',
  'deepseek/deepseek-r1'
);
```

### 4. Market Data & Analytics

**Data Sources**:
- CoinGecko API (primary, free)
- Exchange WebSocket streams
- CCXT unified API

**Analytics Features**:
- Real-time price tracking
- Technical indicators (RSI, MACD, Bollinger Bands)
- Portfolio performance metrics
- Risk assessment tools
- Market correlation analysis

### 5. News & Sentiment Analysis

**Features**:
- Multi-source news aggregation
- AI-powered sentiment scoring
- Fake news detection
- Market impact correlation

## API Integrations

### Exchange APIs (CCXT)

CCXT provides unified access to 100+ cryptocurrency exchanges.

**Configuration**:
```typescript
const exchangeConfig = {
  id: 'binance',
  apiKey: 'your-key',
  secret: 'your-secret',
  sandbox: true,     // Use testnet
  enableRateLimit: true
};
```

**Common Operations**:
```typescript
// Fetch balance
const balance = await exchange.fetchBalance();

// Get market data
const ticker = await exchange.fetchTicker('BTC/USDT');

// Place order
const order = await exchange.createOrder(
  'BTC/USDT', 'limit', 'buy', 1, 50000
);
```

### Market Data APIs

**CoinGecko API**:
```typescript
// Price data
const prices = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');

// Market data
const marketData = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7');
```

### AI Integration (OpenRouter)

**Configuration**:
```typescript
const openRouterConfig = {
  apiKey: 'your-openrouter-key',
  baseUrl: 'https://openrouter.ai/api/v1'
};
```

**Trading Signal Generation**:
```typescript
const generateSignal = async (marketData: any, strategy: string) => {
  const prompt = `Analyze this market data and provide a ${strategy} trading signal...`;
  
  const response = await openRouter.chat({
    model: 'deepseek/deepseek-r1',
    messages: [{ role: 'user', content: prompt }]
  });
  
  return JSON.parse(response.choices[0].message.content);
};
```

## Testing & Quality Assurance

### Automated Testing

The platform includes a comprehensive testing system:

```typescript
import { platformAuditService } from '@/services/testing/platformAudit';

const runAudit = async () => {
  const results = await platformAuditService.runFullAudit();
  console.log(`Platform health: ${results.overall}`);
  console.log(`Score: ${results.score}%`);
};
```

**Test Categories**:
- Authentication flow validation
- Trading system functionality
- AI integration verification
- API connectivity tests
- UI component responsiveness
- Performance benchmarks

### Manual Testing Checklist

**Authentication**:
- [ ] Demo login functionality
- [ ] User registration and login
- [ ] Session persistence across refreshes
- [ ] Logout and session cleanup

**Trading**:
- [ ] Paper trading order execution
- [ ] Portfolio balance updates
- [ ] Exchange connectivity (if configured)
- [ ] Order history tracking

**AI Bots**:
- [ ] Bot creation and configuration
- [ ] Strategy selection and execution
- [ ] Performance metrics tracking
- [ ] Error handling and recovery

**UI/UX**:
- [ ] Responsive design on mobile devices
- [ ] Dark/light theme switching
- [ ] Navigation and routing
- [ ] Loading states and error messages

### Performance Testing

**Metrics to Monitor**:
- Bundle size and load times
- Memory usage and leaks
- API response times
- Real-time data update frequency
- Component render performance

**Tools**:
- React DevTools Profiler
- Browser Performance tab
- Platform Test Dashboard
- Lighthouse auditing

## Deployment

### Production Checklist

**Code Quality**:
- [ ] All TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] Build completes without warnings
- [ ] Tests passing

**Configuration**:
- [ ] Environment variables set in Supabase
- [ ] Authentication providers configured
- [ ] API rate limits considered
- [ ] CORS policies configured

**Security**:
- [ ] API keys secured (not in frontend code)
- [ ] HTTPS enforced
- [ ] Content Security Policy configured
- [ ] Input validation implemented

**Performance**:
- [ ] Bundle size optimized
- [ ] Images compressed
- [ ] Lazy loading implemented
- [ ] Caching strategies configured

### Build Process

```bash
# Production build
npm run build

# Deploy to Lovable
# Use the Publish button in Lovable interface

# Deploy to custom hosting
# Copy dist/ folder to your web server
```

### Environment Configuration

**Supabase Setup**:
1. Connect Lovable project to Supabase
2. Configure authentication providers
3. Set up API keys in Supabase secrets
4. Configure CORS and URL settings

**API Keys** (stored in Supabase secrets):
- `OPENROUTER_API_KEY` - For AI trading features
- Exchange API credentials - For live trading

## Contributing

### Development Workflow

1. **Create Feature Branch**
```bash
git checkout -b feature/new-feature
```

2. **Implement Changes**
- Write code with TypeScript
- Add tests for new functionality
- Update documentation
- Follow existing code style

3. **Test Changes**
```bash
npm run lint
npm run type-check
npm test
npm run build
```

4. **Submit Pull Request**
- Write clear commit messages
- Include test coverage
- Update CHANGELOG.md
- Request code review

### Code Style Guidelines

**TypeScript**:
- Use strict mode
- Define interfaces for all props and data structures
- Prefer type unions over any
- Use meaningful variable names

**React**:
- Functional components with hooks
- Use TypeScript for prop types
- Implement error boundaries
- Follow component composition patterns

**Styling**:
- Use Tailwind CSS classes
- Follow responsive design principles
- Maintain consistent spacing and typography
- Support both light and dark themes

### File Organization

**Component Structure**:
```typescript
// ComponentName.tsx
import React, { useState, useEffect } from 'react';
import { ComponentProps } from './types';

interface ComponentNameProps {
  // Define props
}

const ComponentName: React.FC<ComponentNameProps> = ({ ...props }) => {
  // Component implementation
};

export default ComponentName;
```

**Service Structure**:
```typescript
// serviceName.ts
class ServiceName {
  private config: ServiceConfig;
  
  constructor(config: ServiceConfig) {
    this.config = config;
  }
  
  public async method(): Promise<ReturnType> {
    // Service implementation
  }
}

export const serviceName = new ServiceName(config);
```

## Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [CCXT Documentation](https://docs.ccxt.com/)
- [Supabase Documentation](https://supabase.com/docs)

### APIs
- [CoinGecko API](https://www.coingecko.com/en/api)
- [OpenRouter API](https://openrouter.ai/docs)
- [Binance API](https://binance-docs.github.io/apidocs/)

### Community
- [GitHub Repository](https://github.com/crypto-beacon)
- [Discord Community](https://discord.gg/crypto-beacon)
- [Issue Tracker](https://github.com/crypto-beacon/issues)

---

This documentation provides comprehensive guidance for developers working on the Crypto Beacon trading platform. For specific implementation details, refer to the inline code comments and component documentation.
