
# Developer Documentation - Crypto Trading Platform

## Project Overview

This is a comprehensive cryptocurrency trading platform built with React, TypeScript, and modern web technologies. The platform supports both paper trading and live trading modes, AI-powered trading bots, real-time market data, news analysis, Web3 integration, and social trading features.

## Technology Stack

### Frontend
- **React 18** - Component-based UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching

### Backend Integration
- **Supabase** - Backend-as-a-Service (auth, database, storage)
- **OpenRouter** - AI model access for trading analysis
- **Algorand** - Blockchain integration via Nodely API

### Key Libraries
- **Recharts** - Chart visualization
- **Lucide React** - Icon library
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **CCXT** - Cryptocurrency exchange integration

## Architecture Overview

```
src/
├── components/           # React components
│   ├── ui/              # Base UI components (shadcn/ui)
│   ├── trading/         # Trading-related components
│   ├── analytics/       # Analytics and charting
│   ├── news/           # News and sentiment analysis
│   ├── web3/           # Web3 wallet integration
│   ├── social/         # Social trading features
│   └── auth/           # Authentication components
├── contexts/           # React contexts for state management
├── services/           # API services and integrations
│   ├── algorand/       # Algorand blockchain service
│   ├── openrouter/     # AI model service
│   ├── exchanges/      # Exchange integrations
│   └── freeApis/       # Free API aggregator
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── docs/               # Documentation
```

## Core Features

### 1. Trading System
- **Paper Trading**: Risk-free trading with virtual funds
- **Live Trading**: Real trading with exchange integration
- **Multi-Currency Support**: AUD-focused with USD, EUR, GBP support
- **Order Management**: Buy/sell orders with market data

### 2. AI Trading Bots
- **Multiple Strategies**: Trend following, mean reversion, breakout, etc.
- **AI Models**: Integration with OpenRouter (DeepSeek, Gemini, Claude, GPT-4)
- **Performance Tracking**: Win rate, profit factor, Sharpe ratio
- **Risk Management**: Configurable risk levels and stop losses

### 3. Market Data & Analytics
- **Real-time Prices**: Multiple data sources aggregation
- **Technical Indicators**: RSI, MACD, Bollinger Bands, etc.
- **Portfolio Analytics**: Performance tracking and risk assessment
- **Historical Data**: Price charts and backtesting capabilities

### 4. News & Sentiment Analysis
- **News Aggregation**: Multiple crypto news sources
- **Sentiment Scoring**: AI-powered sentiment analysis
- **Fake News Detection**: AI models to identify misinformation
- **Market Impact**: Correlation between news and price movements

### 5. Web3 Integration
- **Wallet Connection**: MetaMask, WalletConnect support
- **DeFi Positions**: Aave, Uniswap, Lido integration tracking
- **On-chain Analytics**: Algorand blockchain integration
- **Cross-chain Assets**: Multi-blockchain portfolio tracking

### 6. Social Trading
- **Community Features**: Follow top traders
- **Copy Trading**: Replicate successful strategies
- **Leaderboards**: Performance rankings
- **Signal Sharing**: Trading signals and insights

## API Integrations

### Free APIs
1. **CoinGecko** - Market data and prices
2. **CryptoCompare** - News and additional market data
3. **CoinCap** - Alternative price feeds
4. **Algorand (Nodely)** - Blockchain data with provided credentials

### Paid/Premium APIs
1. **OpenRouter** - AI model access for trading analysis
2. **Exchange APIs** - Direct trading capabilities
3. **Premium news feeds** - Enhanced news sources

### Algorand Integration
- **API Token**: `98D9CE80660AD243893D56D9F125CD2D`
- **Mainnet API**: `https://mainnet-api.4160.nodely.io`
- **Indexer API**: `https://mainnet-idx.4160.nodely.io`
- **Features**: Account data, asset info, time travel queries

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation
```bash
# Clone repository
git clone <repository-url>
cd crypto-trading-platform

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup
The application uses Supabase for backend services. Connect your Supabase project through the Lovable interface for:
- User authentication
- Data persistence
- Edge functions
- Secrets management

### API Keys Configuration
Store sensitive API keys in Supabase secrets:
- `OPENROUTER_API_KEY` - For AI trading analysis
- `EXCHANGE_API_KEYS` - For live trading (when implemented)

## Component Architecture

### State Management
- **React Context** - Global state (Trading, Currency, AI Trading)
- **Local State** - Component-specific state with useState
- **Form State** - React Hook Form for complex forms

### Key Contexts
1. **TradingContext** - Trading accounts, transactions, balances
2. **CurrencyContext** - Currency preferences and conversion
3. **AiTradingContext** - AI bots, strategies, performance
4. **AuthContext** - User authentication state

### Component Patterns
- **Compound Components** - Complex UI patterns (Tabs, Dialogs)
- **Provider Pattern** - Context providers for state
- **Hook Pattern** - Custom hooks for reusable logic
- **Render Props** - Flexible component composition

## Data Flow

### Trading Flow
1. User selects trading pair and amount
2. Order validation and risk checks
3. Execute trade (paper or live mode)
4. Update portfolio and transaction history
5. Performance calculations and analytics

### AI Bot Flow
1. User configures bot strategy and parameters
2. Bot analyzes market data using AI models
3. Generate trading signals based on strategy
4. Execute trades (if auto-trading enabled)
5. Track performance and adjust parameters

### Data Sources Flow
1. Aggregate data from multiple free APIs
2. Fallback to mock data if APIs fail
3. Cache responses for performance
4. Real-time updates via WebSocket (where available)

## Security Considerations

### API Security
- Never expose API keys in client-side code
- Use Supabase secrets for sensitive credentials
- Implement rate limiting for API calls
- Validate all user inputs

### Trading Security
- Implement proper authorization for live trading
- Use paper mode as default for new users
- Validate all trading parameters
- Implement emergency stop mechanisms

### Data Privacy
- Encrypt sensitive user data
- Implement proper access controls
- Follow GDPR compliance guidelines
- Regular security audits

## Performance Optimization

### Code Splitting
- Lazy loading for route components
- Dynamic imports for large dependencies
- Component-level code splitting

### Data Optimization
- API response caching
- Debounced API calls
- Pagination for large datasets
- Efficient re-rendering with React.memo

### Bundle Optimization
- Tree shaking for unused code
- Optimized asset loading
- CDN delivery for static assets
- Progressive Web App features

## Testing Strategy

### Unit Testing
- Component testing with React Testing Library
- Hook testing with React Hooks Testing Library
- Service testing for API integrations
- Utility function testing

### Integration Testing
- User flow testing
- API integration testing
- Cross-component interaction testing

### End-to-End Testing
- Complete user journeys
- Trading flow testing
- Authentication flow testing
- Mobile responsiveness testing

## Deployment

### Build Process
```bash
# Production build
npm run build

# Preview production build
npm run preview
```

### Deployment Platforms
- **Lovable** - Integrated deployment
- **Vercel** - Alternative hosting
- **Netlify** - Static site deployment
- **Custom domains** - Available with paid plans

### Environment Configuration
- Production API endpoints
- Performance monitoring
- Error tracking setup
- Analytics integration

## Monitoring & Maintenance

### Error Tracking
- Error boundaries for React components
- API error logging
- User action tracking
- Performance monitoring

### Analytics
- User engagement metrics
- Trading performance analytics
- API usage statistics
- Feature adoption tracking

### Maintenance Tasks
- Regular dependency updates
- Security patches
- Performance optimizations
- Feature enhancements based on user feedback

## Future Enhancements

### Planned Features
1. **Advanced Charting** - TradingView integration
2. **Mobile App** - React Native implementation
3. **More Exchanges** - Additional exchange integrations
4. **Advanced AI** - Custom AI model training
5. **Institutional Features** - Advanced tools for professional traders

### Scalability Considerations
- Microservices architecture for backend
- Event-driven architecture for real-time features
- Horizontal scaling for high-volume trading
- Global CDN for international users

## Contributing

### Code Standards
- TypeScript strict mode
- ESLint and Prettier configuration
- Conventional commit messages
- Component documentation

### Pull Request Process
1. Feature branch from main
2. Implement changes with tests
3. Update documentation
4. Code review process
5. Merge after approval

### Development Guidelines
- Follow existing code patterns
- Write comprehensive tests
- Document complex logic
- Performance considerations for all changes

---

This platform represents a comprehensive solution for cryptocurrency trading with modern web technologies, AI integration, and a focus on user experience and security.
