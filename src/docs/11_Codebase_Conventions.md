
# Codebase Conventions

This document outlines the coding conventions and practices used throughout the Crypto Trading Platform codebase to ensure consistency, maintainability, and quality.

## General Principles

- **Clarity Over Cleverness**: Write clear, readable code rather than overly clever solutions
- **Consistency**: Follow established patterns throughout the codebase
- **Modularity**: Build small, focused components and functions
- **DRY (Don't Repeat Yourself)**: Avoid code duplication
- **KISS (Keep It Simple, Stupid)**: Favor simple solutions over complex ones
- **Composition Over Inheritance**: Use component composition patterns

## File Structure

### Directory Organization

```
src/
├── components/           # React components
│   ├── ui/               # UI components (shadcn/ui)
│   ├── layout/           # Layout components
│   ├── widgets/          # Widget components
│   ├── forms/            # Form components
│   └── [feature]/        # Feature-specific components
├── contexts/             # React contexts
├── hooks/                # Custom hooks
├── lib/                  # Utility functions
├── pages/                # Page components
├── services/             # API services
│   ├── api/              # API clients
│   └── [domain]/         # Domain-specific services
├── types/                # TypeScript type definitions
├── styles/               # Global styles
├── constants/            # Constant values
└── utils/                # Utility functions
```

### File Naming

- **Components**: PascalCase (e.g., `PriceChart.tsx`, `TradingWidget.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useTradingAccount.ts`, `usePriceData.ts`)
- **Contexts**: PascalCase with `Context` suffix (e.g., `ThemeContext.tsx`, `AuthContext.tsx`)
- **Utilities**: camelCase (e.g., `formatCurrency.ts`, `calculateProfit.ts`)
- **Types**: PascalCase with `.d.ts` extension (e.g., `trading.d.ts`, `api.d.ts`)
- **Constants**: UPPER_SNAKE_CASE for values, PascalCase for files (e.g., `ApiEndpoints.ts`)

### Import Order

Within each file, organize imports in the following order:

1. External library imports
2. Internal absolute imports
3. Relative imports
4. Style imports

Example:
```typescript
// External libraries
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';

// Internal absolute imports
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/hooks/useCurrency';
import { formatCurrency } from '@/utils/formatters';

// Relative imports
import { TradingForm } from './TradingForm';
import { PriceChart } from './PriceChart';

// Styles
import './TradingWidget.css';
```

## React Conventions

### Component Structure

- Use functional components with hooks
- Keep components focused and small (under 300 lines)
- Extract complex logic to custom hooks
- Use TypeScript interfaces for props

```typescript
// Component example
interface PriceChartProps {
  coinId: string;
  timeframe: string;
  height?: number;
  showVolume?: boolean;
}

export const PriceChart: React.FC<PriceChartProps> = ({ 
  coinId, 
  timeframe, 
  height = 400, 
  showVolume = true 
}) => {
  // Component implementation
  return (
    // JSX
  );
};
```

### Component File Structure

Within component files, follow this structure:

1. Imports
2. Types/Interfaces
3. Helper functions (if small and component-specific)
4. Component definition
5. Export statement

### State Management

- Use hooks for component state (`useState`, `useReducer`)
- Use context for shared state
- Keep state as close as possible to where it's used
- Avoid prop drilling by using context or composition

### Custom Hooks

- Extract reusable logic into custom hooks
- Name hooks with `use` prefix
- Return values in an object for clarity
- Document parameters and return values

```typescript
export function useCryptoData(coinId: string, timeframe: string) {
  const [data, setData] = useState<CryptoData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Hook implementation
  
  return { data, loading, error, refetch };
}
```

## TypeScript Conventions

### Type Definitions

- Define types and interfaces in dedicated `.d.ts` files
- Use interfaces for object shapes that may be extended
- Use type aliases for unions, intersections, and complex types
- Document complex types with JSDoc comments

```typescript
/**
 * Represents a cryptocurrency trading account
 */
export interface TradingAccount {
  id: string;
  name: string;
  balance: number;
  currency: string;
  type: 'paper' | 'live';
  createdAt: string;
}

/**
 * Types of trading operations
 */
export type TradeType = 'buy' | 'sell' | 'limit' | 'stop';
```

### Type vs. Interface

- Use `interface` for object types that may be extended
- Use `type` for unions, primitives, tuples, and complex types
- Be consistent within domains

### Type Safety

- Avoid using `any` type whenever possible
- Use generics for reusable functions and components
- Use union types for variables with multiple potential types
- Use type guards to narrow types when necessary

```typescript
function isTradingAccount(account: any): account is TradingAccount {
  return 'balance' in account && 'currency' in account;
}
```

## JavaScript/TypeScript Conventions

### Variables

- Use `const` by default, `let` when necessary, never `var`
- Use meaningful variable names
- Use camelCase for variables and functions
- Use PascalCase for types, interfaces, and classes

### Functions

- Prefer arrow functions for callbacks
- Use function declarations for named exports
- Keep functions small and focused
- Document complex functions with JSDoc comments

```typescript
/**
 * Calculates the profit/loss percentage between two values
 * @param currentValue The current value
 * @param initialValue The initial value
 * @returns The profit/loss percentage
 */
export function calculateProfitLossPercentage(
  currentValue: number, 
  initialValue: number
): number {
  if (initialValue === 0) return 0;
  return ((currentValue - initialValue) / initialValue) * 100;
}
```

### Error Handling

- Use try/catch blocks for potentially throwing operations
- Provide meaningful error messages
- Use error boundaries for component error handling
- Use toast notifications for user-facing errors

```typescript
try {
  await executeTradeOperation(trade);
} catch (error) {
  console.error('Failed to execute trade:', error);
  toast({
    title: 'Trade Failed',
    description: error instanceof Error ? error.message : 'An unknown error occurred',
    variant: 'destructive',
  });
}
```

### Async/Await

- Prefer async/await over promise chains
- Use try/catch for error handling
- Handle loading states appropriately

```typescript
async function fetchUserData(userId: string) {
  try {
    setLoading(true);
    const data = await apiClient.get(`/users/${userId}`);
    return data;
  } catch (error) {
    handleError(error);
    return null;
  } finally {
    setLoading(false);
  }
}
```

## Styling Conventions

### Tailwind CSS

- Use Tailwind utility classes for styling
- Group Tailwind classes by category (layout, spacing, typography, etc.)
- Extract common patterns to components
- Use consistent spacing and sizing scales

```tsx
<div className="flex flex-col p-4 gap-2 bg-background rounded-lg shadow">
  <h3 className="text-lg font-semibold text-foreground">Trading Widget</h3>
  <div className="grid grid-cols-2 gap-4">
    {/* Content */}
  </div>
</div>
```

### CSS Variables

- Use CSS variables for theme values
- Define variables at the root level
- Use semantic naming for variables

```css
:root {
  --color-primary: #3b82f6;
  --color-primary-dark: #2563eb;
  --spacing-unit: 0.25rem;
}
```

### Theming

- Use the theme context for accessing theme values
- Support light and dark modes
- Use semantic color names in components
- Test components in both themes

## Testing Conventions

### Component Tests

- Test component rendering
- Test user interactions
- Test different prop combinations
- Mock external dependencies

```typescript
// Example component test
describe('PriceChart', () => {
  it('renders correctly with default props', () => {
    render(<PriceChart coinId="bitcoin" timeframe="1d" />);
    expect(screen.getByTestId('price-chart')).toBeInTheDocument();
  });
  
  it('shows volume when showVolume is true', () => {
    render(<PriceChart coinId="bitcoin" timeframe="1d" showVolume={true} />);
    expect(screen.getByTestId('volume-bars')).toBeInTheDocument();
  });
});
```

### Hook Tests

- Test initialization
- Test state updates
- Test return values
- Mock dependencies

### Integration Tests

- Test component interaction
- Test data flow
- Mock API responses

## Documentation

### Code Comments

- Use JSDoc for functions, components, and types
- Keep comments focused and relevant
- Comment complex algorithms and business logic
- Avoid obvious comments

### Markdown Documentation

- Use markdown for comprehensive documentation
- Organize documentation by domain
- Include examples and use cases
- Keep documentation up to date with code changes

## Version Control

### Commit Messages

- Use conventional commits format:
  - `feat`: New feature
  - `fix`: Bug fix
  - `docs`: Documentation changes
  - `chore`: Maintenance tasks
  - `refactor`: Code changes that neither fix bugs nor add features
  - `test`: Adding or updating tests

Example:
```
feat(trading): add trading history export functionality
```

### Branching Strategy

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/feature-name`: New features
- `fix/bug-name`: Bug fixes
- `refactor/area`: Code refactoring

### Pull Requests

- Reference related issues
- Provide clear descriptions
- Include screenshots for UI changes
- Keep PRs focused on single concerns
- Request appropriate reviewers

## Performance Considerations

- Use React.memo for pure components with frequent re-renders
- Use useMemo and useCallback for expensive calculations and callbacks
- Virtualize long lists
- Optimize images and assets
- Use code splitting for large components
- Monitor and optimize bundle size

## Accessibility

- Use semantic HTML elements
- Provide alt text for images
- Ensure keyboard navigation
- Use ARIA attributes when necessary
- Maintain sufficient color contrast
- Test with screen readers

## Security Practices

- Validate input data
- Sanitize output to prevent XSS
- Use parameterized queries for database operations
- Secure API keys and sensitive data
- Implement proper authentication and authorization

## API Standards

### API Service Structure

```typescript
export const userService = {
  // Get user profile
  getProfile: async (userId: string): Promise<UserProfile> => {
    return apiClient.get(`/users/${userId}`);
  },
  
  // Update user profile
  updateProfile: async (userId: string, data: Partial<UserProfile>): Promise<UserProfile> => {
    return apiClient.patch(`/users/${userId}`, data);
  }
};
```

### Error Handling

```typescript
try {
  const data = await userService.getProfile(userId);
  return data;
} catch (error) {
  // Handle different error types
  if (error.status === 404) {
    return null;
  }
  throw error;
}
```

These conventions provide a foundation for maintaining a consistent, maintainable, and high-quality codebase. As the project evolves, this document should be updated to reflect changes in best practices and team consensus.
