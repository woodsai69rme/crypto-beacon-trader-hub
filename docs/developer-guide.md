
# Crypto Dashboard Developer Guide

## Architecture Overview

This crypto dashboard is built with modern frontend technologies:

- **React**: Core UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first styling
- **Shadcn/UI**: Pre-built component system
- **Recharts**: Data visualization
- **TanStack Query**: Data fetching and caching

The application follows a component-based architecture with a focus on:

1. **Modularity**: Small, focused components
2. **Reusability**: Shared utilities and hooks
3. **Maintainability**: Consistent patterns and documentation

## Project Structure

```
src/
├── components/         # UI components
│   ├── charts/         # Chart components
│   │   └── indicators/ # Technical indicator charts
│   ├── dashboard/      # Dashboard-specific components
│   ├── trading/        # Trading-specific components
│   ├── widgets/        # Widget components
│   └── ui/             # Shadcn UI components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API services
│   └── api/            # API service modules
├── types/              # TypeScript types
└── utils/              # Utility functions
```

## Key Features

### Core Dashboard

- **Dashboard Component**: Main container with tab navigation
- **CustomizableDashboard**: User-configurable widgets system
- **Responsive Design**: Adapts to all device sizes
- **Theme Support**: Light, dark, and system themes

### Trading Features

- **FakeTrading**: Practice trading simulator with virtual balance
- **MultiExchangeTrading**: Connect and trade across multiple exchanges
- **TechnicalIndicators**: Advanced chart visualization for analysis
- **CommunityHub**: Social features for trader interaction

### AI-Powered Features

- **AiTradingBots**: Automated trading with smart strategies
- **AIStrategyLibrary**: Comprehensive collection of AI trading strategies
- **AiMarketAnalysis**: AI-powered market insights
- **MarketCorrelations**: Asset correlation analysis
- **PatternRecognition**: ML-based chart pattern detection
- **PriceForecasting**: AI-powered price prediction models

### Real-time Features

- **RealTimePrices**: Live updating price data via websockets
- **RealTimeAlerts**: Instant notification system for price triggers
- **RealTimePortfolio**: Live portfolio value tracking and updates
- **TradeNotifications**: Real-time trade execution notifications
- **OrderBookVisualizer**: Live market depth visualization

## API Integration

The application integrates with multiple cryptocurrency APIs with a fallback system:

### Primary APIs

- **CoinGecko**: Market data, coin prices, historical data
- **CryptoCompare**: Technical indicators, alternative market data
- **Exchangerate.host**: Currency conversion rates

### API Architecture

The API service implementation follows these principles:

1. **Modular Services**: Each API provider has its own service module
2. **Caching Layer**: Efficient caching with customizable expiry times
3. **Fallback Mechanism**: Automatic fallback to alternative providers
4. **Mock Data**: Fallback to mock data when all APIs fail

### API Usage Example

```typescript
// Example using enhanced API hooks
const { data: coins, isLoading, error } = useEnhancedApi(
  fetchTopCoins,
  {
    cacheKey: buildApiCacheKey("topCoins", 20),
    cacheDuration: 5 * 60 * 1000, // 5 minutes
    retries: 2
  }
);
```

### Websocket Integration

The application uses websockets for real-time data:

```typescript
// Example websocket connection
const stopWebsocket = startSimulatedPriceUpdates(
  initialCoins,
  (updatedPrices) => {
    // Process real-time price updates
    setCoins(updatedPrices);
  },
  5000 // Update interval in milliseconds
);

// Clean up on unmount
return () => {
  stopWebsocket();
};
```

## Component Development Guidelines

When adding new components:

1. **Create focused files**: Each component should have its own file
2. **Keep components small**: Aim for 50-150 lines of code
3. **Use TypeScript interfaces**: Define clear props interfaces
4. **Support responsiveness**: Use Tailwind responsive classes
5. **Implement error handling**: Handle loading and error states
6. **Theme support**: Ensure all components work with both light and dark themes

Example component structure:

```tsx
import React from "react";
import { ComponentProps } from "./types";

// Interface definition
interface MyComponentProps {
  title: string;
  data: ComponentProps[];
  isLoading?: boolean;
}

// Component implementation
const MyComponent = ({ title, data, isLoading = false }: MyComponentProps) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <h2>{title}</h2>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default MyComponent;
```

## Custom Hooks

The application includes several custom hooks:

### useEnhancedApi

Advanced API hook with caching and retry logic:

```typescript
const {
  data,
  isLoading,
  isRefreshing,
  error,
  fetchData,
  clearCache
} = useEnhancedApi(apiFunction, {
  cacheKey: "uniqueKey",
  retries: 2,
  onSuccess: (data) => console.log("Success", data)
});
```

### useCurrencyConverter

Handles currency conversion throughout the app:

```typescript
const { activeCurrency, setActiveCurrency, formatValue } = useCurrencyConverter();

// Format a value in the active currency
const formattedPrice = formatValue(product.price);
```

### useTradingPortfolio

Manages portfolio data and trading functionality:

```typescript
const {
  trades,
  balance,
  availableCoins,
  handleExecuteTrade,
  calculatePortfolioValue
} = useTradingPortfolio();

// Execute a trade
handleExecuteTrade('buy', 'bitcoin', 0.1);
```

### useAiTrading

Manages AI trading bot connections and executions:

```typescript
const {
  executeAiTrade,
  connectBotToAccount,
  disconnectBot,
  getConnectedAccount,
  activeBots
} = useAiTrading();

// Connect an AI bot to a trading account
connectBotToAccount('mean-reversion-bot', 'account-123');
```

## Technical Indicators

The application implements several technical indicators:

1. **RSI**: Relative Strength Index for momentum analysis
2. **MACD**: Moving Average Convergence Divergence for trend following
3. **Bollinger Bands**: Volatility indicator showing price channels
4. **Moving Averages**: Multiple timeframe moving averages

Each indicator has its own chart component for optimized rendering and focused updates.

## AI Trading Features

The platform includes advanced AI trading capabilities:

1. **Strategy Library**: Collection of pre-built AI trading strategies
   - Mean reversion strategies
   - Trend following models
   - Volatility-based systems
   - Multi-factor approaches

2. **Pattern Recognition**: Machine learning detection of chart patterns
   - Classical chart patterns (head & shoulders, flags, etc.)
   - Support and resistance levels
   - Trend strength indicators
   - Reversal signals

3. **Real-time Portfolio Analytics**:
   - Position monitoring
   - Performance tracking
   - Risk assessment
   - Trade notifications

## Real-time Features

The application implements real-time data updates through:

1. **Websocket Connections**: For live price data
2. **Polling Mechanisms**: For less time-sensitive data
3. **Event-based Updates**: For user interactions
4. **Push Notifications**: For alerts and important events

Implementation examples:

```typescript
// Real-time price updates
useEffect(() => {
  const stopMonitoring = startPriceMonitoring(
    coinIds,
    (updatedPrices) => {
      setCoins(updatedPrices);
    },
    5000 // Update every 5 seconds
  );

  return () => stopMonitoring();
}, [coinIds]);
```

## Performance Optimization

The application implements several performance optimizations:

1. **API Caching**: Reduces unnecessary network requests
2. **API Fallbacks**: Provides redundancy for service failures
3. **Component Splitting**: Smaller, focused components to reduce rerenders
4. **Virtualized Lists**: Efficient rendering for large datasets
5. **Optimized Re-renders**: Use of React.memo, useMemo, and useCallback
6. **Skeleton Loading States**: Better user experience during data fetching

## Testing Guidelines

When writing tests:

1. **Unit test utilities**: Test utility functions thoroughly
2. **Component testing**: Test component rendering and interactions
3. **Mock API responses**: Use msw or similar for API mocking
4. **Test error states**: Verify error handling works correctly

Example test:

```tsx
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  test('renders correctly with data', () => {
    const testData = [
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' }
    ];
    
    render(<MyComponent title="Test Title" data={testData} />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });
  
  test('shows loading state', () => {
    render(<MyComponent title="Test Title" data={[]} isLoading={true} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
```

## Theme System

The application implements a flexible theme system with:

1. **Light/Dark/System modes**: User-selectable theme preferences
2. **Persistent preferences**: Theme choices saved to localStorage
3. **System preference detection**: Automatic theme based on system settings
4. **Runtime theme switching**: Change themes without page reload

## Adding New Features

When adding new features to the dashboard:

1. **Plan the component structure**
   - Create small, focused components
   - Consider reusability
   - Define clear props interfaces

2. **Implement data fetching**
   - Use Enhanced API hooks for API data
   - Implement proper error handling
   - Add loading states

3. **Create UI components**
   - Follow the existing design system
   - Use Shadcn/UI components
   - Maintain responsive design

4. **Add tests**
   - Unit tests for utilities
   - Component tests for UI elements
   - Integration tests for complex features

## Best Practices

### Performance Optimization

- Use memoization for expensive calculations
- Implement virtualization for long lists
- Optimize rerenders with React.memo and useMemo

### State Management

- Keep state as local as possible
- Use context for truly global state
- Consider atomic state patterns for complex state

### Component Design

- Follow single responsibility principle
- Keep components under 200 lines
- Extract logic to custom hooks

### Type Safety

- Define explicit TypeScript interfaces
- Avoid `any` type when possible
- Use discriminated unions for complex states

### AI Strategy Development

- Follow consistent structure for all strategies
- Include comprehensive metadata (timeframes, risk levels, etc.)
- Implement proper backtesting capabilities
- Document performance characteristics

### Real-time Data Handling

- Implement debounce for frequent updates
- Use proper cleanup for websocket connections
- Handle reconnection scenarios
- Provide fallback mechanisms for disconnections
