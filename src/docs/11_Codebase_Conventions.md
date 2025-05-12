
# Codebase Conventions

## Overview

This document outlines the conventions and standards used throughout the Crypto Beacon Trader Hub codebase. Adhering to these guidelines ensures consistency, maintainability, and code quality across the project.

## File Structure

### Directory Organization

```
src/
├── components/        # React components
│   ├── ui/            # Base UI components
│   ├── charts/        # Chart-specific components
│   ├── dashboard/     # Dashboard-related components
│   ├── trading/       # Trading-specific components
│   └── widgets/       # Standalone widget components
│
├── contexts/          # React context providers
├── hooks/             # React custom hooks
├── services/          # Business logic and API services
│   └── api/           # API client services
│
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
├── styles/            # Global styles and themes
├── tests/             # Test files
└── docs/              # Documentation
```

### File Naming

- **Components**: PascalCase (e.g., `CryptoChart.tsx`, `TradingWidget.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useTradeHistory.ts`, `usePriceData.ts`)
- **Contexts**: PascalCase with `Context` suffix (e.g., `ThemeContext.tsx`)
- **Utilities**: camelCase (e.g., `formatCurrency.ts`, `dateUtils.ts`)
- **Types**: PascalCase for interfaces and types, often in `.d.ts` files
- **Constants**: UPPER_SNAKE_CASE for actual constants, PascalCase for constant objects

### Component Structure

Each component should follow a consistent structure:

```tsx
// Imports
import React from 'react';
import { ComponentProps } from './types';
import { useRelevantHook } from '@/hooks/useRelevantHook';

// Interface (if not imported from types file)
interface Props {
  // Props definitions here
}

// Component
export const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  // Hooks first
  const { data } = useRelevantHook();
  
  // State and derived values
  const [state, setState] = React.useState<string>('');
  const derivedValue = React.useMemo(() => computeSomething(data), [data]);
  
  // Event handlers
  const handleClick = () => {
    // Handler logic
  };
  
  // Side effects
  React.useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // Render methods (for complex sub-components)
  const renderSubComponent = () => {
    return <div>Sub component content</div>;
  };
  
  // Main return
  return (
    <div>
      Component JSX
    </div>
  );
};

export default ComponentName;
```

## TypeScript Conventions

### Type Definitions

- Define interfaces and types in dedicated files when they're shared across multiple components
- Use `.d.ts` extension for declaration files (e.g., `trading.d.ts`)
- Export interfaces and types with descriptive names
- Use type inference when the type is obvious, but be explicit when it's not

### Type Best Practices

- Prefer interfaces for object shapes that will be extended or implemented
- Use type aliases for unions, intersections, and mapped types
- Always define return types for non-trivial functions
- Avoid `any` type; use `unknown` when the type is truly unknown
- Use generics for reusable components and functions

Example:

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

type UserResponse = User | null;

function fetchUser(id: string): Promise<UserResponse> {
  // Implementation
}

// Avoid
function processData(data: any): any {
  // Implementation
}
```

## React Conventions

### Functional Components

- Use functional components with hooks instead of class components
- Export named components as default exports for easier imports
- Use explicit return types when the component's return type is complex

```typescript
// Preferred
const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button onClick={onClick}>{children}</button>
  );
};

export default Button;
```

### Hooks Usage

- Follow the Rules of Hooks (only call hooks at the top level, only call hooks from React functions)
- Create custom hooks for reusable logic
- Keep hook dependencies accurate and minimal
- Use the ESLint rules for hooks to catch issues

### State Management

- Use local component state for UI-specific state
- Use React Context for shared state that doesn't change frequently
- Keep context providers as high in the tree as necessary, but no higher
- Split contexts by domain for better performance

## Styling Conventions

### Tailwind CSS

- Use Tailwind CSS utility classes for component styling
- Follow consistent ordering of utility classes:
  1. Layout (display, position)
  2. Dimensions (width, height)
  3. Spacing (margin, padding)
  4. Typography (font, text)
  5. Colors (bg, text)
  6. Borders
  7. Effects (shadow, opacity)
  8. Interactive (hover, focus)

Example:

```tsx
<div className="flex items-center justify-between w-full h-16 px-4 py-2 text-sm font-medium bg-white border-b shadow-sm hover:bg-gray-50">
  {/* Content here */}
</div>
```

### Component Styling

- Use component composition for complex UI components
- Leverage Tailwind's `@apply` directive in rare cases where the same set of classes is used frequently
- Use CSS variables for theme values
- Use `className` props to allow component styling customization from parent components

## Code Quality

### Linting & Formatting

- ESLint for code quality and consistency
- Prettier for code formatting
- TypeScript strict mode enabled
- Run linting before commits

### Import Order

Use consistent import ordering:

1. External packages
2. React and related packages
3. Internal modules (with absolute imports)
4. Local imports (with relative imports)
5. Asset imports (CSS, images)

Example:

```typescript
// External packages
import { v4 as uuidv4 } from 'uuid';

// React and related
import React, { useState, useEffect } from 'react';

// Internal modules (absolute imports)
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters';

// Local imports (relative imports)
import { ChildComponent } from './ChildComponent';

// Assets
import './styles.css';
import logoImage from './logo.png';
```

### Error Handling

- Use try/catch blocks for error handling
- Create custom error types when needed
- Log errors with context information
- Provide user-friendly error messages
- Use error boundaries for React component errors

```typescript
try {
  await api.fetchData();
} catch (error) {
  console.error('Error fetching data:', error);
  showUserFriendlyError('Unable to load data. Please try again later.');
}
```

## Testing Conventions

### Test File Organization

- Place test files alongside implementation files or in a `__tests__` folder
- Use `.test.ts` or `.test.tsx` extension for test files
- Follow the same directory structure as the source code

### Component Tests

- Focus on behavior, not implementation details
- Test user interactions and component outputs
- Use React Testing Library for component tests
- Avoid testing third-party library functionality

Example:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button component', () => {
  test('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Hook Tests

- Test custom hooks with @testing-library/react-hooks
- Verify state changes and return values
- Mock external dependencies

### Service Tests

- Test service functions in isolation
- Mock API responses
- Test error handling

## Documentation

### Code Comments

- Use JSDoc-style comments for functions and components
- Comment complex algorithms and business logic
- Keep comments up-to-date with code changes
- Don't comment what is obvious from the code

Example:

```typescript
/**
 * Calculates the weighted average price of multiple assets
 * @param {Asset[]} assets - Array of assets with price and quantity
 * @returns {number} - The weighted average price
 */
export function calculateWAP(assets: Asset[]): number {
  // Implementation
}
```

### README Files

- Include README.md files in major directories explaining the purpose and contents
- Document usage examples for reusable components

## Git Workflow

### Commit Messages

Follow the Conventional Commits specification:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding or modifying tests
- `chore:` for maintenance tasks

Example:

```
feat: add currency conversion support to portfolio view
```

### Pull Requests

- Keep PRs focused on a single task or feature
- Include a clear description of changes
- Reference issues that the PR addresses
- Add screenshots for UI changes
- Ensure all tests pass before requesting review

## Performance Considerations

### Optimization Techniques

- Use React.memo for components that render often but rarely change
- Use useCallback for functions passed as props to memoized components
- Use useMemo for expensive calculations
- Implement virtualization for long lists
- Avoid unnecessary re-renders

Example:

```typescript
const MemoizedComponent = React.memo(({ value }) => {
  return <div>{value}</div>;
});

const ParentComponent = () => {
  const [count, setCount] = useState(0);
  
  // Memoize callback to prevent MemoizedComponent from re-rendering
  const handleClick = useCallback(() => {
    console.log('Clicked!');
  }, []);
  
  // Memoize expensive calculation
  const expensiveValue = useMemo(() => {
    return computeExpensiveValue(count);
  }, [count]);
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <MemoizedComponent value={expensiveValue} onClick={handleClick} />
    </div>
  );
};
```

### Bundle Size Considerations

- Use dynamic imports for code splitting
- Analyze bundle size regularly
- Be mindful of large dependencies

## Accessibility Standards

- Use semantic HTML elements
- Include proper ARIA attributes when needed
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Test with screen readers

## Security Practices

- Sanitize user inputs
- Avoid direct DOM manipulation
- Use secure authentication methods
- Implement proper CSRF protection
- Follow the principle of least privilege

## Conclusion

Following these codebase conventions will ensure that the Crypto Beacon Trader Hub remains maintainable, robust, and consistent as it continues to evolve. These guidelines should be considered a living document, and may be updated as the project grows and best practices evolve.
