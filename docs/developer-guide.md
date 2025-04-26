
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
│   ├── dashboard/      # Dashboard-specific components
│   ├── trading/        # Trading-specific components
│   ├── community/      # Community-specific components
│   └── ui/             # Shadcn UI components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API services
├── types/              # TypeScript types
└── utils/              # Utility functions
```

## Key Features

### Core Dashboard

- **Dashboard Component**: Main container with tab navigation
- **CustomizableDashboard**: User-configurable widgets system
- **Responsive Design**: Adapts to all device sizes

### Trading Features

- **FakeTrading**: Practice trading simulator with virtual balance
- **MultiExchangeTrading**: Connect and trade across multiple exchanges
- **TradingEducation**: Educational resources and professional signals
- **CommunityHub**: Social features for trader interaction

### AI-Powered Features

- **AiTradingBots**: Automated trading with smart strategies
- **AiMarketAnalysis**: AI-powered market insights
- **MarketCorrelations**: Asset correlation analysis

## Data Flow

The application uses a combination of:

1. **Local state**: Component-specific UI state
2. **React Context**: Cross-component shared state
3. **React Query**: API data fetching and caching
4. **Local Storage**: Persistent user data

### Example Data Flow

```
User Action → Component Handler → API Call → Update UI
```

For example, when executing a trade:

```
Click "Buy" → handleExecuteTrade() → Update trade history → Update balance → Show toast
```

## Component Development Guidelines

When adding new components:

1. **Create focused files**: Each component should have its own file
2. **Keep components small**: Aim for 50-150 lines of code
3. **Use TypeScript interfaces**: Define clear props interfaces
4. **Support responsiveness**: Use Tailwind responsive classes
5. **Implement error handling**: Handle loading and error states

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

### useCurrencyConverter

Handles currency conversion throughout the app:

```typescript
const { activeCurrency, setActiveCurrency, formatValue } = useCurrencyConverter();

// Format a value in the active currency
const formattedPrice = formatValue(product.price);
```

### useLocalStorage

Persists state in localStorage:

```typescript
const [settings, setSettings] = useLocalStorage("userSettings", defaultSettings);

// Update settings
setSettings({ ...settings, theme: "dark" });
```

### useTradingPortfolio

Manages the trading functionality:

```typescript
const {
  trades,
  balance,
  availableCoins,
  handleExecuteTrade
} = useTradingPortfolio();

// Execute a trade
handleExecuteTrade("buy", "bitcoin", 0.5);
```

## AI Trading Implementation

The AI trading system uses:

1. **Predefined strategies**: Collection of AI trading strategies
2. **Strategy customization**: User-adjustable parameters
3. **Backtesting**: Historical performance simulation
4. **Execution engine**: Automated trading based on strategy signals

### Strategy Definition

```typescript
interface TradingStrategy {
  id: string;
  name: string;
  type: "momentum" | "mean-reversion" | "breakout" | "ai-predictive";
  riskLevel: "low" | "medium" | "high";
  parameters: Record<string, any>;
  // Additional properties
}
```

## API Integration

The application integrates with multiple cryptocurrency APIs:

### Primary APIs

- **CoinGecko**: Market data, coin prices, historical data
- **Exchangerate.host**: Currency conversion rates

### API Implementation

API services are organized in the `src/services/` directory:

- `cryptoApi.ts`: Cryptocurrency data
- `currencyApi.ts`: Currency conversion
- `marketDataService.ts`: Market metrics

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

## Adding New Features

When adding new features to the dashboard:

1. **Plan the component structure**
   - Create small, focused components
   - Consider reusability
   - Define clear props interfaces

2. **Implement data fetching**
   - Use React Query for API data
   - Implement error handling
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
