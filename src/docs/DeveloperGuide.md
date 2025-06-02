
# Developer Guide for Crypto Beacon Trading Platform

## Project Overview

Crypto Beacon is a comprehensive cryptocurrency trading platform built with React, TypeScript, and modern web technologies. It features AI-powered trading bots, real-time market data, exchange integrations, and advanced analytics.

## Architecture Overview

### Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with Shadcn/UI components
- **State Management**: React Context API + Custom Hooks
- **Data Fetching**: TanStack Query (React Query)
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Exchange Integration**: CCXT library
- **AI Integration**: OpenRouter API

### Project Structure

```
src/
├── components/           # UI components
│   ├── analytics/        # Analytics and reporting
│   ├── api/             # API management components
│   ├── auth/            # Authentication components
│   ├── dashboard/       # Dashboard widgets and layouts
│   ├── news/            # News and sentiment analysis
│   ├── settings/        # Configuration panels
│   ├── testing/         # Platform testing tools
│   ├── trading/         # Trading interfaces and bots
│   ├── ui/              # Base UI components (Shadcn)
│   └── wallets/         # Wallet integration
├── contexts/            # React context providers
├── hooks/               # Custom React hooks
├── services/            # Business logic and API services
│   ├── ai/              # AI trading bot services
│   ├── api/             # External API integrations
│   ├── exchanges/       # Exchange connectivity
│   └── testing/         # Platform audit services
├── types/               # TypeScript type definitions
├── utils/               # Helper functions
└── docs/                # Documentation
```

## Core Features

### 1. Authentication System

The platform uses Supabase for authentication with the following features:

- Email/password authentication
- Demo login for testing
- Protected routes with session management
- User profile management

#### Implementation Example:

```typescript
import { useAuth } from '@/components/auth/AuthProvider';

const { user, signOut, subscription } = useAuth();

// Protected component
if (!user) {
  return <Navigate to="/auth" replace />;
}
```

### 2. Trading System

#### Paper Trading
- Simulated trading environment
- Mock portfolio management
- Real market data with fake execution

#### Live Trading (CCXT Integration)
- Real exchange connectivity
- Support for 10+ major exchanges
- Real-time order management

#### Supported Exchanges:
- Binance
- Coinbase
- Kraken
- Bybit
- OKX
- KuCoin
- Bitfinex
- Huobi
- Gate.io
- MEXC

### 3. AI Trading Bots

The platform supports multiple AI trading strategies:

- **Trend Following**: Market momentum analysis
- **Mean Reversion**: Price deviation strategies
- **Scalping**: High-frequency trading
- **Breakout Trading**: Technical pattern recognition
- **Grid Trading**: Automated buy/sell grid
- **Arbitrage**: Cross-exchange opportunities
- **Sentiment Analysis**: News-driven trading

#### AI Integration:

```typescript
import { openRouterService } from '@/services/openRouterService';

const generateSignal = await openRouterService.generateTradingSignal(
  marketData,
  'trend-following',
  'deepseek/deepseek-r1'
);
```

### 4. Market Data & Analytics

#### Real-time Data Sources:
- CoinGecko API (free tier)
- Binance WebSocket streams
- Exchange-specific APIs via CCXT

#### Analytics Features:
- Live price monitoring
- Technical indicators (RSI, MACD, Bollinger Bands)
- Market correlations
- Portfolio performance tracking
- Risk assessment tools

### 5. News & Sentiment Analysis

- Multi-source news aggregation
- AI-powered sentiment scoring
- Fake news detection
- Market impact analysis

## Development Setup

### Prerequisites

```bash
Node.js 18+
npm or yarn
Git
```

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Configuration

The platform uses Supabase for backend services. No environment variables are needed for basic functionality, but for full features:

1. Connect to Supabase via the green button in Lovable
2. Configure API keys in Supabase secrets for:
   - OpenRouter (AI features)
   - Exchange APIs (live trading)

## Component Architecture

### Component Guidelines

1. **Single Responsibility**: Each component should have one clear purpose
2. **Composition over Inheritance**: Build complex UIs by composing smaller components
3. **Type Safety**: Use TypeScript interfaces for all props and state
4. **Responsive Design**: All components should work on mobile and desktop

### Example Component Structure:

```typescript
interface ComponentProps {
  data: DataType;
  onAction: (id: string) => void;
}

const Component: React.FC<ComponentProps> = ({ data, onAction }) => {
  const [state, setState] = useState<StateType>(initialState);
  
  const handleEvent = useCallback((id: string) => {
    // Handle event logic
    onAction(id);
  }, [onAction]);

  return (
    <div className="responsive-container">
      {/* Component JSX */}
    </div>
  );
};

export default Component;
```

### Context Providers

The application uses several context providers for state management:

```typescript
// Currency conversion and display
<CurrencyProvider>
  // Trading state and portfolio
  <TradingProvider>
    // AI bot management
    <AiTradingProvider>
      // Your components
    </AiTradingProvider>
  </TradingProvider>
</CurrencyProvider>
```

## API Integration

### Service Layer Pattern

All external API calls are abstracted through service classes:

```typescript
class ApiService {
  private baseUrl: string;
  
  async fetchData<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  }
}
```

### Error Handling

Consistent error handling across the application:

```typescript
try {
  const data = await apiService.fetchData('/endpoint');
  // Handle success
} catch (error) {
  console.error('API Error:', error);
  toast({
    title: "Error",
    description: "Failed to fetch data",
    variant: "destructive",
  });
}
```

## Testing Strategy

### Platform Audit System

The platform includes a comprehensive testing and audit system:

```typescript
import { platformAuditService } from '@/services/testing/platformAudit';

const auditResults = await platformAuditService.runFullAudit();
```

#### Test Categories:
- Authentication flow testing
- Trading functionality validation
- AI integration verification
- Data service connectivity
- UI component responsiveness
- Performance monitoring

### Manual Testing Checklist

1. **Authentication**
   - [ ] Demo login works
   - [ ] User registration flow
   - [ ] Session persistence
   - [ ] Logout functionality

2. **Trading**
   - [ ] Paper trading executes orders
   - [ ] Portfolio updates correctly
   - [ ] Exchange connectivity (if configured)
   - [ ] Order history tracking

3. **AI Bots**
   - [ ] Bot creation and configuration
   - [ ] Strategy execution
   - [ ] Performance tracking
   - [ ] Error handling

4. **UI/UX**
   - [ ] Responsive design on mobile
   - [ ] Dark/light theme switching
   - [ ] Navigation functionality
   - [ ] Loading states

## Deployment

### Production Checklist

- [ ] All TypeScript errors resolved
- [ ] Build completes without warnings
- [ ] Environment variables configured in Supabase
- [ ] Authentication providers configured
- [ ] API rate limits considered
- [ ] Error monitoring setup
- [ ] Performance optimization applied

### Build Commands

```bash
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # ESLint checking
npm run type-check # TypeScript checking
```

## Best Practices

### Code Quality

1. **TypeScript**: Use strict mode and define interfaces for all data structures
2. **Error Boundaries**: Implement error boundaries for component failures
3. **Performance**: Use React.memo and useMemo for expensive operations
4. **Accessibility**: Ensure keyboard navigation and screen reader support

### Security Considerations

1. **API Keys**: Never expose private keys in frontend code
2. **User Input**: Validate and sanitize all user inputs
3. **Authentication**: Implement proper session management
4. **HTTPS**: Use secure connections for all API calls

### Performance Optimization

1. **Code Splitting**: Lazy load components with React.lazy
2. **Memoization**: Cache expensive calculations
3. **Bundle Analysis**: Monitor bundle size regularly
4. **Image Optimization**: Use appropriate image formats and sizes

## Troubleshooting

### Common Issues

1. **CCXT Connection Errors**: Check API credentials and sandbox mode
2. **Build Failures**: Verify TypeScript definitions and imports
3. **Authentication Issues**: Confirm Supabase configuration
4. **Performance Problems**: Use React DevTools Profiler

### Debug Tools

- React DevTools for component inspection
- Browser DevTools for network and console debugging
- Platform Test Dashboard for system health monitoring

## Contributing

### Development Workflow

1. Create feature branch from main
2. Implement changes with tests
3. Update documentation
4. Submit pull request
5. Code review and merge

### Code Style

- Use Prettier for formatting
- Follow ESLint rules
- Write descriptive commit messages
- Document complex logic with comments

## Resources

### Documentation Links
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/UI](https://ui.shadcn.com/)
- [CCXT Documentation](https://docs.ccxt.com/)
- [Supabase Documentation](https://supabase.com/docs)

### Community
- [Project Discord](https://discord.gg/crypto-beacon)
- [GitHub Repository](https://github.com/crypto-beacon/platform)
- [Issue Tracker](https://github.com/crypto-beacon/platform/issues)

This developer guide provides comprehensive documentation for working with the Crypto Beacon trading platform. For specific implementation details, refer to the inline code comments and component documentation.
