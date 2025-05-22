
# Crypto Beacon Trader Hub - Developer Guide

## Overview

This document provides comprehensive guidance for developers working on the Crypto Beacon Trader Hub platform. It covers the project's architecture, development workflow, coding standards, and technical details.

## Project Structure

```
/src
  /components       # Reusable React components
    /ui             # Basic UI components from shadcn/ui
    /widgets        # Complex widget components
    /dashboard      # Dashboard-specific components
    /trading        # Trading-related components
    /portfolio      # Portfolio management components
    /analytics      # Analytics and data visualization components
    /settings       # Settings-related components
    /tickers        # Ticker and news components
  /contexts         # React Context providers
  /hooks            # Custom React hooks
  /lib              # Utility functions and helpers
  /services         # API and data services
  /types            # TypeScript type definitions
  /styles           # Global CSS and styles
  App.tsx           # Main application component
  main.tsx          # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/crypto-beacon-trader-hub.git
cd crypto-beacon-trader-hub

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

Visit `http://localhost:5173` to see the application running.

## Development Workflow

### Branch Strategy

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/feature-name`: For new features
- `bugfix/bug-name`: For bug fixes
- `refactor/refactor-name`: For code refactoring

### Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

```
feat: add new feature
fix: fix bug
docs: update documentation
style: update styling
refactor: refactor code
test: add or update tests
chore: update build tasks, configs, etc.
```

### Development Process

1. Create a feature branch from `develop`
2. Implement your changes with frequent atomic commits
3. Write or update tests and documentation
4. Create a pull request to `develop`
5. Address code review feedback
6. Merge to `develop` once approved

## Coding Standards

### General Guidelines

- Use TypeScript for type safety
- Follow functional component patterns with hooks
- Keep components small and focused on a single responsibility
- Use context for state that needs to be shared across components
- Use ShadCN UI components whenever possible
- Follow the DRY principle (Don't Repeat Yourself)

### File Naming

- Use PascalCase for components: `PortfolioSummary.tsx`
- Use kebab-case for utility files: `format-currency.ts`
- Use camelCase for hooks: `usePortfolio.ts`
- React components should have `.tsx` extension
- Utility files should have `.ts` extension

### Imports

Organize imports in the following order:

1. React and external libraries
2. UI components
3. Local components
4. Hooks and contexts
5. Utilities and helpers
6. Types
7. Assets (images, icons, etc.)

Example:
```typescript
import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent } from '@/components/ui/';
import PortfolioChart from './PortfolioChart';
import { usePortfolio } from '@/hooks/usePortfolio';
import { formatCurrency } from '@/lib/utils';
import { PortfolioAsset } from '@/types/trading';
import { ChartIcon } from '@/assets/icons';
```

### Component Structure

```typescript
import React from 'react';
import { ComponentProps } from '@/types';

interface MyComponentProps {
  // Props definition
}

const MyComponent: React.FC<MyComponentProps> = ({ prop1, prop2 }) => {
  // State and hooks

  // Event handlers

  // Helper functions

  // UI rendering
  return (
    <div>
      {/* Component content */}
    </div>
  );
};

export default MyComponent;
```

### State Management

- Use React Context for global state
- Use component state for local state
- Keep state as close as possible to where it's used
- Update state immutably

### Error Handling

- Use try/catch blocks for API calls and async operations
- Display meaningful error messages to users
- Log errors to console in development
- Consider implementing error boundaries for critical components

## API Integration

### Data Fetching

- Use custom hooks for data fetching
- Implement proper error handling and loading states
- Include caching and re-fetching strategies
- Use Tanstack Query for complex data fetching scenarios

Example:
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['crypto-prices'],
  queryFn: fetchCryptoPrices,
  staleTime: 60000, // 1 minute
});
```

### Mock Services

For development without real APIs:
- Create mock services in the `services/mock` directory
- Use the same interface as the real services
- Toggle between real and mock services using environment variables

## Testing

### Component Testing

- Test component rendering and interactions
- Mock external dependencies
- Test different states (loading, error, success)

### Hook Testing

- Test custom hooks in isolation
- Verify state updates and side effects

### Utility Testing

- Test utility functions with various inputs
- Include edge cases

## Build and Deployment

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Testing the Build Locally

```bash
npm run preview
```

## Documentation

- Document complex components with JSDoc comments
- Keep README.md updated with the latest setup and usage instructions
- Update this developer guide when introducing significant changes

## Troubleshooting

### Common Issues

1. **Build failures due to type errors**
   - Run `tsc --noEmit` to check for type errors
   - Fix all type errors before committing

2. **Styling inconsistencies**
   - Use the design system components
   - Check Tailwind CSS classes for conflicts
   - Use the browser inspector to debug CSS issues

3. **State management problems**
   - Check React DevTools to inspect component hierarchy
   - Verify that context providers are properly set up
   - Ensure state updates are triggering re-renders properly

## Performance Optimization

- Use React.memo for expensive render operations
- Implement virtualization for long lists (react-window or react-virtualized)
- Optimize dependency arrays in useEffect and useMemo hooks
- Use web workers for CPU-intensive operations
- Implement code splitting with React.lazy

## Security Best Practices

- Never store sensitive information in client-side code
- Implement proper authentication and authorization
- Sanitize user inputs to prevent XSS attacks
- Use HTTPS for all API calls
- Follow the principle of least privilege

## Contribution Guidelines

1. Follow the coding standards and development workflow
2. Write meaningful commit messages
3. Update documentation as needed
4. Include tests for new features
5. Request code reviews from team members

## License

This project is covered by the license specified in the LICENSE file at the root of the repository.
