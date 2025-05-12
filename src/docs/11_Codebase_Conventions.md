
# Codebase Conventions

## Overview

This document outlines the coding standards, patterns, and conventions used throughout the Crypto Beacon Trader Hub codebase. Following these conventions ensures consistency, maintainability, and quality across our project.

## Code Style

### General Formatting

We follow a consistent code style enforced by ESLint and Prettier:

- **Indentation**: 2 spaces
- **Line Length**: Maximum 100 characters
- **Semicolons**: Required
- **Quotes**: Single quotes for JavaScript/TypeScript, double quotes for JSX attributes
- **Trailing Commas**: Required for multiline arrays and objects
- **Empty Lines**: Maximum of one consecutive empty line

### TypeScript Specifics

- Explicitly type all function parameters and return values
- Use TypeScript interfaces over types when representing objects
- Prefer readonly properties when values shouldn't change
- Use type unions over enums when possible
- Always specify visibility modifiers in classes (public, private, protected)

### React Components

#### Component Structure

Components should follow this general structure:

```typescript
// Imports
import React from 'react';
import { SomeComponent } from './SomeComponent';

// Types/Interfaces
interface MyComponentProps {
  name: string;
  count: number;
  isActive?: boolean;
}

// Component
export const MyComponent: React.FC<MyComponentProps> = ({
  name,
  count,
  isActive = false,
}) => {
  // State/Hooks
  const [state, setState] = React.useState(initialState);
  
  // Effects
  React.useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // Handlers
  const handleClick = () => {
    // Handler logic
  };
  
  // Helper functions
  const helperFunction = () => {
    // Helper logic
  };
  
  // Render logic (optional for simple components)
  const renderSomething = () => {
    return <div>Rendered content</div>;
  };
  
  // Component render
  return (
    <div>
      {/* JSX content */}
    </div>
  );
};
```

#### Component Organization

- One component per file unless components are tightly coupled
- Group related components in dedicated folders
- Use index.ts files to simplify imports
- Co-locate component styles and tests

### Naming Conventions

#### General Naming

- **CamelCase** for variables, functions, methods, and instances
- **PascalCase** for classes, interfaces, types, enums, and React components
- **UPPER_SNAKE_CASE** for constants
- **kebab-case** for file names, except for React components which use PascalCase

#### Specific Naming Patterns

| Type | Pattern | Example |
|------|---------|---------|
| React Component | PascalCase.tsx | `PriceChart.tsx` |
| Custom Hook | use-kebab-case.ts | `use-trading-account.ts` |
| Context | PascalCaseContext.tsx | `TradingContext.tsx` |
| Interface | IPascalCase or PascalCase | `ITradingAccount` or `TradingAccount` |
| Type | PascalCaseType | `PortfolioDataType` |
| Test File | source-file-name.test.ts | `price-utils.test.ts` |
| Styled Component | StyledPascalCase | `StyledButton` |

#### File Naming Examples

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   └── Input.tsx
│   └── charts/
│       ├── PriceChart.tsx
│       └── VolumeChart.tsx
├── hooks/
│   ├── use-trading-account.ts
│   └── use-market-data.ts
├── utils/
│   ├── date-utils.ts
│   └── price-utils.ts
├── types/
│   └── trading.d.ts
└── contexts/
    └── TradingContext.tsx
```

## Directory Structure

### Core Directories

- **`src/components/`**: React components organized by domain or function
- **`src/hooks/`**: Custom React hooks
- **`src/contexts/`**: React context providers
- **`src/services/`**: Business logic and external service integration
- **`src/utils/`**: Utility functions and helpers
- **`src/types/`**: TypeScript type definitions
- **`src/pages/`**: Application pages/routes
- **`src/assets/`**: Static assets (images, fonts, etc.)
- **`src/styles/`**: Global styles and theme definitions

### Component Organization

Components should be organized into logical groups:

```
src/components/
├── ui/                 # Base UI components
├── charts/             # Chart and visualization components
├── dashboard/          # Dashboard-specific components
├── trading/            # Trading-related components
├── portfolio/          # Portfolio management components
├── alerts/             # Alert system components
└── settings/           # User settings components
```

Each component folder may contain:

- Main component file
- Subcomponents
- Component-specific hooks
- Component-specific utilities
- Component tests
- Styles (if not using CSS-in-JS)

## Documentation

### Code Comments

- Use JSDoc comments for functions, interfaces, and classes
- Keep comments current with code changes
- Focus on explaining "why" rather than "what" the code does
- Use inline comments sparingly and only for complex logic

Example:

```typescript
/**
 * Calculates the potential profit or loss for a position
 * 
 * @param entryPrice - The price at which the position was opened
 * @param currentPrice - The current market price
 * @param amount - The position size
 * @param isLong - Whether this is a long (true) or short (false) position
 * @returns The calculated profit or loss in the base currency
 */
function calculatePnL(
  entryPrice: number, 
  currentPrice: number, 
  amount: number, 
  isLong: boolean = true
): number {
  // For short positions, profit direction is reversed
  const multiplier = isLong ? 1 : -1;
  
  // Calculate raw difference and apply position direction
  return (currentPrice - entryPrice) * amount * multiplier;
}
```

### Component Documentation

Each component should have a JSDoc comment describing:
- Purpose of the component
- Props accepted
- Notable behaviors or limitations
- Example usage when helpful

Example:

```typescript
/**
 * PriceAlert - Displays and manages price alerts
 * 
 * Allows users to set, edit, and delete price alerts for cryptocurrencies.
 * Integrates with the alert notification system.
 *
 * @example
 * <PriceAlert 
 *   coinId="bitcoin"
 *   initialPrice={46000}
 *   onAlertCreated={(alert) => console.log('Alert created', alert)}
 * />
 */
export const PriceAlert: React.FC<PriceAlertProps> = (props) => {
  // Component implementation
};
```

## State Management

### React Context

- Use React Context for global state that many components need
- Split contexts by domain (e.g., UserContext, TradingContext, ThemeContext)
- Provide sensible default values for all contexts
- Include both state and actions in context values

Example:

```typescript
// TradingContext.tsx
export const TradingContext = React.createContext<TradingContextType | undefined>(undefined);

export const TradingProvider: React.FC<PropsWithChildren> = ({ children }) => {
  // State and actions
  const value = {
    // State
    accounts: [],
    positions: [],
    // Actions
    createOrder: () => {},
    cancelOrder: () => {},
  };
  
  return (
    <TradingContext.Provider value={value}>
      {children}
    </TradingContext.Provider>
  );
};

// Custom hook to use the context
export const useTrading = (): TradingContextType => {
  const context = React.useContext(TradingContext);
  
  if (context === undefined) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  
  return context;
};
```

### Local Component State

- Use local state for UI-specific state that doesn't affect other components
- Prefer controlled components over uncontrolled when possible
- Use the functional form of setState when new state depends on previous state

Example:

```typescript
// Good - using functional form of setState
const incrementCounter = () => {
  setCounter(prevCounter => prevCounter + 1);
};

// Avoid - direct value update using previous value
const incrementCounter = () => {
  setCounter(counter + 1); // Potential stale state issues
};
```

### Custom Hooks

- Extract complex stateful logic into custom hooks
- Name hooks with the "use" prefix
- Return an object with named properties for multiple values
- Design hooks for reusability across components

Example:

```typescript
// use-pagination.ts
export function usePagination<T>(items: T[], itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const goToPage = (page: number) => {
    const validPage = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(validPage);
  };
  
  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage: () => goToPage(currentPage + 1),
    prevPage: () => goToPage(currentPage - 1),
    firstPage: () => goToPage(1),
    lastPage: () => goToPage(totalPages),
  };
}
```

## Error Handling

### Error Boundaries

- Use React Error Boundaries to catch and handle errors in component trees
- Implement custom error boundaries for specific sections of the app
- Provide fallback UIs that allow users to recover or report issues

Example:

```typescript
// ErrorBoundary.tsx
export class ErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Component error:', error, info);
    // Log to error reporting service
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    
    return this.props.children;
  }
}
```

### API Error Handling

- Use consistent error handling patterns across API calls
- Implement retry logic for transient failures
- Provide meaningful error messages to users
- Log detailed error information for debugging

Example:

```typescript
async function fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      throw new ApiError({
        status: response.status,
        statusText: response.statusText,
        data: errorData,
      });
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      // Handle specific API errors
      handleApiError(error);
      throw error;
    }
    
    // Handle network or other errors
    console.error('API request failed:', error);
    throw new Error('Failed to connect to the service. Please try again later.');
  }
}
```

## Testing

### Test Organization

- Co-locate tests with the code they test when possible
- Use descriptive test names that explain the expected behavior
- Group related tests with describe blocks
- Follow the Arrange-Act-Assert pattern

Example:

```typescript
// calculatePnL.test.ts
describe('calculatePnL function', () => {
  describe('long positions', () => {
    it('should return positive profit when current price is higher than entry price', () => {
      // Arrange
      const entryPrice = 100;
      const currentPrice = 120;
      const amount = 1;
      const isLong = true;
      
      // Act
      const result = calculatePnL(entryPrice, currentPrice, amount, isLong);
      
      // Assert
      expect(result).toBe(20);
    });
    
    it('should return negative profit (loss) when current price is lower than entry price', () => {
      // Arrange
      const entryPrice = 100;
      const currentPrice = 80;
      const amount = 1;
      const isLong = true;
      
      // Act
      const result = calculatePnL(entryPrice, currentPrice, amount, isLong);
      
      // Assert
      expect(result).toBe(-20);
    });
  });
  
  describe('short positions', () => {
    // Similar tests for short positions
  });
});
```

### Component Testing

- Test components in isolation using mocks for dependencies
- Focus on testing behavior rather than implementation details
- Use user-event for simulating user interactions
- Test accessibility features

Example:

```typescript
// PriceAlert.test.tsx
describe('PriceAlert component', () => {
  it('should display the current price', () => {
    // Arrange
    render(<PriceAlert coinId="bitcoin" initialPrice={46000} />);
    
    // Assert
    expect(screen.getByText('$46,000.00')).toBeInTheDocument();
  });
  
  it('should call onAlertCreated when alert form is submitted', async () => {
    // Arrange
    const handleAlertCreated = jest.fn();
    render(
      <PriceAlert 
        coinId="bitcoin" 
        initialPrice={46000}
        onAlertCreated={handleAlertCreated} 
      />
    );
    
    // Act
    await userEvent.click(screen.getByText('Create Alert'));
    await userEvent.type(screen.getByLabelText('Target Price'), '50000');
    await userEvent.click(screen.getByText('Above'));
    await userEvent.click(screen.getByText('Save'));
    
    // Assert
    expect(handleAlertCreated).toHaveBeenCalledWith({
      coinId: 'bitcoin',
      targetPrice: 50000,
      type: 'above',
    });
  });
});
```

## Performance Optimization

### Component Optimization

- Use memo for expensive components that render often
- Implement useMemo for expensive calculations
- Use useCallback for handlers passed to child components
- Avoid anonymous functions in render methods

Example:

```typescript
// Using React.memo for a component
export const CoinListItem = React.memo<CoinListItemProps>(({ coin, onSelect }) => {
  return (
    <li onClick={() => onSelect(coin.id)}>
      {coin.name} ({coin.symbol}): ${coin.price}
    </li>
  );
});

// In parent component
const CoinList = ({ coins }) => {
  // Memoize handler function
  const handleSelectCoin = useCallback((coinId: string) => {
    // Selection logic
  }, [/* dependencies */]);
  
  // Memoize expensive calculation
  const sortedCoins = useMemo(() => {
    return [...coins].sort((a, b) => b.marketCap - a.marketCap);
  }, [coins]);
  
  return (
    <ul>
      {sortedCoins.map(coin => (
        <CoinListItem 
          key={coin.id}
          coin={coin}
          onSelect={handleSelectCoin}
        />
      ))}
    </ul>
  );
};
```

### Data Fetching Optimization

- Use TanStack Query (React Query) for data fetching and caching
- Implement appropriate cache invalidation strategies
- Use pagination and infinite scrolling for large datasets
- Implement data prefetching for improved UX

Example:

```typescript
// Using React Query for data fetching
const { isLoading, error, data } = useQuery({
  queryKey: ['marketData', coinId],
  queryFn: () => fetchMarketData(coinId),
  staleTime: 30000,
  cacheTime: 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus: true,
  retry: 3,
});
```

## Best Practices

### Accessibility

- Always use semantic HTML elements
- Ensure proper keyboard navigation
- Include proper ARIA attributes where needed
- Maintain sufficient color contrast
- Test with screen readers

Example:

```jsx
// Accessible form input
<div>
  <label htmlFor="priceInput">Price ($)</label>
  <input
    id="priceInput"
    type="number"
    value={price}
    onChange={handlePriceChange}
    aria-describedby="priceHelpText"
    min="0"
    step="0.01"
  />
  <p id="priceHelpText" className="help-text">
    Enter the target price in USD.
  </p>
</div>
```

### Imports and Exports

- Use named exports by default
- Use default exports only for main components in a file
- Group imports by type (React, third-party, internal)
- Avoid importing entire libraries when only specific parts are needed

Example:

```typescript
// External imports
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

// Internal imports - absolute path
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/format-currency';

// Internal imports - relative path
import { useTradingHistory } from '../../hooks/use-trading-history';
import { TradeHistoryType } from './types';

// Named exports
export const TradeHistoryItem = ({ trade }) => {
  // Component implementation
};

// Default export for main component
export default function TradeHistory() {
  // Component implementation
}
```

### Async Code

- Use async/await over promise chains for better readability
- Handle errors properly in async functions
- Avoid mixing async/await with .then()/.catch()
- Use Promise.all for concurrent operations

Example:

```typescript
// Good - consistent async/await
async function fetchUserData(userId: string) {
  try {
    const user = await fetchUser(userId);
    const preferences = await fetchUserPreferences(userId);
    
    return {
      ...user,
      preferences,
    };
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw new Error('Could not load user data');
  }
}

// Good - concurrent requests
async function fetchDashboardData(userId: string) {
  try {
    const [user, portfolio, marketData] = await Promise.all([
      fetchUser(userId),
      fetchPortfolio(userId),
      fetchMarketData(),
    ]);
    
    return {
      user,
      portfolio,
      marketData,
    };
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    throw new Error('Could not load dashboard');
  }
}
```

## Version Control

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Common types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc)
- `refactor`: Code changes that neither fix a bug nor add a feature
- `perf`: Performance improvements
- `test`: Adding or modifying tests
- `chore`: Changes to the build process or auxiliary tools

Example:

```
feat(trading): implement limit order functionality

Add support for limit orders in the trading interface.
- Add limit price input
- Implement order validation
- Update order preview component

Closes #123
```

### Pull Requests

- Keep PRs focused on a single feature or bug fix
- Include a clear description of changes
- Reference related issues
- Add appropriate reviewers
- Include screenshots for UI changes
- Ensure all CI checks pass

## Mobile Responsiveness

- Use Tailwind's responsive breakpoints consistently
- Test across multiple device sizes
- Implement adaptive layouts rather than just scaling
- Consider touch interactions for mobile users

Example:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content that adjusts to different screen sizes */}
</div>
```

## Internationalization

- Use a consistent i18n library (react-i18next)
- Extract all user-facing strings to translation files
- Handle pluralization properly
- Consider right-to-left (RTL) language support

Example:

```jsx
// Using react-i18next
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('dashboard.welcome', { username: user.name })}</h1>
      <p>{t('dashboard.portfolio.value', { value: formatCurrency(portfolio.value) })}</p>
      <p>{t('dashboard.portfolio.trades', { count: trades.length })}</p>
    </div>
  );
}
```

## Further Reading

For more detailed guidance, refer to:

- [React Official Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
- [Testing Library Documentation](https://testing-library.com/docs/)
