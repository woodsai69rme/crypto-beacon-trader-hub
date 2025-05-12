# Testing Strategy

## Overview

The Crypto Beacon Trader Hub implements a comprehensive testing strategy to ensure code quality, functionality, and reliability. This document outlines our testing approach, methodologies, and best practices.

## Testing Pyramid

Our testing strategy follows the testing pyramid approach, balancing different types of tests for optimal coverage and performance:

```
    /\
   /  \
  /    \
 /  E2E \
/--------\
/ UI Tests \
/------------\
/ Integration  \
/--------------\
/   Unit Tests   \
/------------------\
```

| Test Type | Proportion | Purpose |
|-----------|------------|---------|
| Unit Tests | 70% | Test individual functions and components in isolation |
| Integration Tests | 20% | Test interactions between multiple components or systems |
| UI Tests | 5% | Test user interface components and interactions |
| End-to-End Tests | 5% | Test complete user workflows from start to finish |

## Testing Tools

### Core Testing Libraries

- **Jest**: Primary test runner and assertion library
- **React Testing Library**: Component testing with a user-centric approach
- **Cypress**: End-to-end testing
- **MSW (Mock Service Worker)**: API mocking for integration tests
- **Testing Library User Event**: User interaction simulation

### Additional Testing Utilities

- **jest-dom**: Custom DOM element matchers
- **jest-axe**: Accessibility testing
- **@testing-library/jest-dom**: DOM testing utilities
- **@testing-library/react-hooks**: Testing custom hooks
- **Storybook**: Component development and visual testing

## Unit Testing

### What to Test

- **Pure Functions**: Utility functions, calculations, transformations
- **React Components**: Rendering, props handling, user interactions
- **Custom Hooks**: State changes, side effects, return values
- **Context Providers**: Context value updates and propagation
- **Reducers**: State transitions based on actions

### Testing Approach

- Test components in isolation using mocks for dependencies
- Focus on behavior, not implementation details
- Use snapshot testing sparingly and purposefully
- Test edge cases and error handling
- Follow the Arrange-Act-Assert pattern

### Examples

#### Testing a Utility Function

```typescript
// price-utils.test.ts
import { formatCurrency, calculateProfitLoss } from '../price-utils';

describe('formatCurrency', () => {
  it('should format numbers with 2 decimal places by default', () => {
    expect(formatCurrency(1234.567)).toBe('$1,234.57');
  });

  it('should respect custom decimal precision', () => {
    expect(formatCurrency(1234.567, 4)).toBe('$1,234.5670');
  });

  it('should handle negative numbers', () => {
    expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });
});

describe('calculateProfitLoss', () => {
  it('should calculate profit correctly for long positions', () => {
    const result = calculateProfitLoss({
      entryPrice: 100,
      currentPrice: 150,
      quantity: 2,
      isLong: true,
    });

    expect(result).toBe(100); // (150 - 100) * 2
  });

  it('should calculate loss correctly for long positions', () => {
    const result = calculateProfitLoss({
      entryPrice: 100,
      currentPrice: 80,
      quantity: 2,
      isLong: true,
    });

    expect(result).toBe(-40); // (80 - 100) * 2
  });

  // Additional test cases...
});
```

#### Testing a React Component

```typescript
// PriceAlert.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PriceAlert } from './PriceAlert';

describe('PriceAlert', () => {
  const mockOnCreate = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with default props', () => {
    render(
      <PriceAlert 
        coinId="bitcoin" 
        coinName="Bitcoin"
        currentPrice={45000}
        onCreateAlert={mockOnCreate}
      />
    );

    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('$45,000.00')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create alert/i })).toBeInTheDocument();
  });

  it('should show alert form when create button is clicked', async () => {
    render(
      <PriceAlert 
        coinId="bitcoin" 
        coinName="Bitcoin"
        currentPrice={45000}
        onCreateAlert={mockOnCreate}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: /create alert/i }));
    
    expect(screen.getByLabelText(/target price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/above/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/below/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('should call onCreateAlert with correct data when form is submitted', async () => {
    render(
      <PriceAlert 
        coinId="bitcoin" 
        coinName="Bitcoin"
        currentPrice={45000}
        onCreateAlert={mockOnCreate}
      />
    );

    // Open form
    await userEvent.click(screen.getByRole('button', { name: /create alert/i }));
    
    // Fill form
    await userEvent.clear(screen.getByLabelText(/target price/i));
    await userEvent.type(screen.getByLabelText(/target price/i), '50000');
    await userEvent.click(screen.getByLabelText(/above/i));
    
    // Submit form
    await userEvent.click(screen.getByRole('button', { name: /save/i }));
    
    // Check onCreateAlert was called with correct data
    expect(mockOnCreate).toHaveBeenCalledTimes(1);
    expect(mockOnCreate).toHaveBeenCalledWith({
      coinId: 'bitcoin',
      targetPrice: 50000,
      isAbove: true,
    });
  });

  // Additional tests...
});
```

#### Testing a Custom Hook

```typescript
// use-price-alert.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { usePriceAlert } from './use-price-alert';

describe('usePriceAlert', () => {
  it('should initialize with empty alerts', () => {
    const { result } = renderHook(() => usePriceAlert());
    expect(result.current.alerts).toEqual([]);
  });

  it('should add a new alert', () => {
    const { result } = renderHook(() => usePriceAlert());
    
    act(() => {
      result.current.addAlert({
        coinId: 'bitcoin',
        targetPrice: 50000,
        isAbove: true,
      });
    });
    
    expect(result.current.alerts.length).toBe(1);
    expect(result.current.alerts[0]).toMatchObject({
      coinId: 'bitcoin',
      targetPrice: 50000,
      isAbove: true,
    });
    expect(result.current.alerts[0].id).toBeDefined();
  });

  it('should remove an alert', () => {
    const { result } = renderHook(() => usePriceAlert());
    
    let alertId: string;
    
    act(() => {
      alertId = result.current.addAlert({
        coinId: 'bitcoin',
        targetPrice: 50000,
        isAbove: true,
      }).id;
    });
    
    expect(result.current.alerts.length).toBe(1);
    
    act(() => {
      result.current.removeAlert(alertId);
    });
    
    expect(result.current.alerts.length).toBe(0);
  });

  // Additional tests...
});
```

## Integration Testing

### What to Test

- **Component combinations**: How components work together
- **Context integration**: Components with context providers
- **API interaction**: Services and hooks that interact with APIs
- **Form submissions**: Complete form flows
- **State management**: Complex state interactions across components

### Testing Approach

- Test realistic user scenarios
- Use mock APIs to simulate backend interactions
- Test data flow between components
- Verify that components integrate correctly with contexts and services

### Examples

#### Testing Components with Context

```typescript
// TradingPanel with TradingContext integration test
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TradingProvider } from '../contexts/TradingContext';
import { TradingPanel } from './TradingPanel';

describe('TradingPanel with TradingContext', () => {
  it('should display account balance from context', () => {
    render(
      <TradingProvider initialBalance={10000}>
        <TradingPanel />
      </TradingProvider>
    );
    
    expect(screen.getByText('$10,000.00')).toBeInTheDocument();
  });

  it('should update account balance after trade execution', async () => {
    render(
      <TradingProvider initialBalance={10000}>
        <TradingPanel />
      </TradingProvider>
    );
    
    // Select buy order type
    await userEvent.click(screen.getByText('Buy'));
    
    // Set amount
    await userEvent.clear(screen.getByLabelText('Amount'));
    await userEvent.type(screen.getByLabelText('Amount'), '1');
    
    // Execute trade
    await userEvent.click(screen.getByRole('button', { name: 'Execute Trade' }));
    
    // Check if balance is updated (assuming price is 5000)
    expect(screen.getByText('$5,000.00')).toBeInTheDocument();
  });

  // Additional tests...
});
```

#### Testing API Interactions

```typescript
// useMarketData.test.ts with MSW
import { renderHook, waitFor } from '@testing-library/react-hooks';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { useMarketData } from './useMarketData';

// Setup Mock Service Worker
const server = setupServer(
  rest.get('https://api.example.com/market-data', (req, res, ctx) => {
    return res(
      ctx.json({
        coins: [
          { id: 'bitcoin', symbol: 'BTC', price: 45000 },
          { id: 'ethereum', symbol: 'ETH', price: 3000 }
        ]
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('useMarketData', () => {
  it('should fetch market data successfully', async () => {
    const { result } = renderHook(() => useMarketData());
    
    // Initially loading
    expect(result.current.isLoading).toBe(true);
    
    // Wait for data to load
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    // Check data
    expect(result.current.data).toEqual([
      { id: 'bitcoin', symbol: 'BTC', price: 45000 },
      { id: 'ethereum', symbol: 'ETH', price: 3000 }
    ]);
    expect(result.current.error).toBeNull();
  });

  it('should handle API errors gracefully', async () => {
    // Override handler for this test
    server.use(
      rest.get('https://api.example.com/market-data', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'Server error' }));
      })
    );
    
    const { result } = renderHook(() => useMarketData());
    
    // Wait for request to complete
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    // Check error state
    expect(result.current.error).not.toBeNull();
    expect(result.current.error?.message).toContain('Failed to fetch market data');
    expect(result.current.data).toEqual([]);
  });

  // Additional tests...
});
```

## UI Testing

### What to Test

- **Component rendering**: Visual correctness of components
- **Responsive design**: Component behavior across screen sizes
- **Theme switching**: Component appearance in different themes
- **Animation and transitions**: Visual effects work as expected
- **Accessibility**: Components meet accessibility standards

### Testing Approach

- Use Storybook for component development and visual testing
- Implement visual regression tests for critical components
- Test responsive behavior with different viewport sizes
- Verify accessibility compliance with automated tools

### Examples

#### Storybook Stories for Visual Testing

```typescript
// Button.stories.tsx
import { Story, Meta } from '@storybook/react';
import { Button, ButtonProps } from './Button';

export default {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select', options: ['default', 'outline', 'ghost', 'link'] }
    },
    size: {
      control: { type: 'select', options: ['default', 'sm', 'lg'] }
    }
  }
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Button',
  variant: 'default',
};

export const Outline = Template.bind({});
Outline.args = {
  children: 'Button',
  variant: 'outline',
};

export const Ghost = Template.bind({});
Ghost.args = {
  children: 'Button',
  variant: 'ghost',
};

export const Link = Template.bind({});
Link.args = {
  children: 'Button Link',
  variant: 'link',
};

export const Small = Template.bind({});
Small.args = {
  children: 'Small Button',
  size: 'sm',
};

export const Large = Template.bind({});
Large.args = {
  children: 'Large Button',
  size: 'lg',
};

export const Disabled = Template.bind({});
Disabled.args = {
  children: 'Disabled Button',
  disabled: true,
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  children: (
    <>
      <ArrowRightIcon className="mr-2 h-4 w-4" /> Button with Icon
    </>
  ),
};
```

#### Accessibility Testing

```typescript
// Button.test.tsx with axe
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from './Button';

expect.extend(toHaveNoViolations);

describe('Button', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<Button>Click Me</Button>);
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });

  // Other button tests...
});
```

## End-to-End Testing

### What to Test

- **Critical user flows**: Registration, login, trading, etc.
- **Multi-step processes**: Complete business workflows
- **System integration**: Frontend-backend communication
- **Performance aspects**: Loading times, interaction responsiveness

### Testing Approach

- Focus on key user journeys rather than exhaustive testing
- Use realistic test data
- Test on multiple browsers when possible
- Include both happy paths and error scenarios

### Examples

#### Cypress E2E Test

```typescript
// login-flow.spec.ts
describe('Login Flow', () => {
  beforeEach(() => {
    // Clear cookies and local storage between tests
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('should successfully log in with valid credentials', () => {
    // Visit the login page
    cy.visit('/login');

    // Type in credentials
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('Password123!');

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Assert redirect to dashboard
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome back').should('be.visible');
    
    // Assert user data is loaded
    cy.get('[data-testid="user-balance"]').should('be.visible');
  });

  it('should show error message with invalid credentials', () => {
    cy.visit('/login');

    // Type in invalid credentials
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('WrongPassword!');

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Assert error message
    cy.contains('Invalid email or password').should('be.visible');
    
    // Assert URL is still /login
    cy.url().should('include', '/login');
  });

  it('should navigate to forgot password page', () => {
    cy.visit('/login');

    // Click forgot password link
    cy.contains('Forgot password?').click();

    // Assert redirect to forgot password page
    cy.url().should('include', '/forgot-password');
  });

  // Additional tests...
});
```

#### Trading Flow E2E Test

```typescript
// trading-flow.spec.ts
describe('Trading Flow', () => {
  beforeEach(() => {
    // Login before each test
    cy.login('test@example.com', 'Password123!');
    cy.visit('/trading');
  });

  it('should execute a market buy order', () => {
    // Select market order type
    cy.get('[data-testid="order-type-market"]').click();

    // Select buy side
    cy.get('[data-testid="order-side-buy"]').click();

    // Enter amount
    cy.get('input[name="amount"]').clear().type('0.1');

    // Check order preview
    cy.get('[data-testid="order-preview"]').should('contain', '0.1 BTC');
    
    // Submit order
    cy.get('button[type="submit"]').click();

    // Confirm success message
    cy.contains('Order executed successfully').should('be.visible');
    
    // Check portfolio updated
    cy.get('[data-testid="portfolio-positions"]').should('contain', 'BTC');
  });

  // Additional tests for limit orders, selling, etc.
});
```

## Performance Testing

### What to Test

- **Initial load performance**: Time to interactive, bundle size
- **Runtime performance**: Animation smoothness, rendering optimization
- **Memory usage**: Checking for leaks during extended use

### Testing Approach

- Use Lighthouse for overall performance scoring
- Implement React Profiler for component optimization
- Test with large datasets to identify performance bottlenecks
- Monitor memory usage during extended usage scenarios

### Examples

#### React Profiler Setup

```typescript
// App.tsx with Profiler for performance monitoring
import { Profiler } from 'react';

function onRenderCallback(
  id: string,
  phase: "mount" | "update",
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) {
  if (process.env.NODE_ENV === 'development') {
    console.log({
      id,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime
    });
  }
  
  // In production, send to analytics service
  if (process.env.NODE_ENV === 'production' && actualDuration > 10) {
    // logPerformanceMetric({
    //   componentId: id,
    //   duration: actualDuration
    // });
  }
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      {/* App content */}
    </Profiler>
  );
}
```

## Testing Workflow

### Pre-commit Testing

Before code is committed:

1. Linting and type checking
2. Unit tests for changed files
3. Format verification

### Continuous Integration Testing

When PRs are created or updated:

1. All unit and integration tests
2. Build verification
3. Bundle size analysis
4. Performance regression checks

### Release Testing

Before deploying to production:

1. E2E tests on staging environment
2. Visual regression tests
3. Performance benchmarks
4. Accessibility compliance checks

## Test Coverage

### Coverage Goals

We aim to maintain the following test coverage levels:

- **Unit Tests**: 80%+ coverage of lines and branches
- **Integration Tests**: Key workflows and component integrations
- **E2E Tests**: Critical user journeys and business processes

### Coverage Reports

Coverage reports are generated after test runs and include:

- Overall coverage percentages
- Coverage by directory
- Uncovered lines and functions
- Coverage trends over time

## Mocking Strategy

### What to Mock

- External APIs
- Authentication services
- Date/time functions
- Complex calculations not under test
- Browser APIs when needed

### How to Mock

- Use Jest mock functions for simple mocks
- Use MSW for API mocking
- Create dedicated mock implementations for complex services
- Use dependency injection to facilitate mocking

### Example: Service Mocking

```typescript
// marketService.ts
export interface MarketService {
  getCurrentPrice(coinId: string): Promise<number>;
  getPriceHistory(coinId: string, days: number): Promise<PricePoint[]>;
  // Other methods...
}

// mockMarketService.ts
export class MockMarketService implements MarketService {
  getCurrentPrice(coinId: string): Promise<number> {
    return Promise.resolve(coinId === 'bitcoin' ? 45000 : 3000);
  }
  
  getPriceHistory(coinId: string, days: number): Promise<PricePoint[]> {
    const points: PricePoint[] = [];
    const now = Date.now();
    
    for (let i = 0; i < days * 24; i++) {
      points.push({
        timestamp: now - i * 60 * 60 * 1000,
        price: coinId === 'bitcoin' 
          ? 45000 + Math.random() * 5000 - 2500 
          : 3000 + Math.random() * 300 - 150
      });
    }
    
    return Promise.resolve(points);
  }
  
  // Implement other methods...
}
```

## Testing Best Practices

### Code Organization

- Co-locate tests with the code they test
- Use consistent naming conventions
- Group related tests with describe blocks
- Keep test files focused and manageable

### Test Quality

- Tests should be deterministic (same result every time)
- Tests should be independent (no dependencies between tests)
- Test behavior, not implementation details
- Test edge cases and error conditions
- Write clear test descriptions that explain what's being tested

### Debugging

- Use test.only or describe.only to focus on specific tests
- Use console.log or debug tools when needed
- Use test.todo for planned but not implemented tests
- Implement good error messages for failed tests

## Accessibility Testing

### Testing Approach

- Automated testing with jest-axe
- Test keyboard navigation
- Verify screen reader compatibility
- Test content for proper semantic structure

### Example: Automated Accessibility Testing

```typescript
// Dialog.test.tsx
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Dialog } from './Dialog';

describe('Dialog', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(
      <Dialog 
        title="Confirmation" 
        isOpen={true}
        onClose={() => {}}
      >
        <p>Are you sure you want to proceed?</p>
        <button>Confirm</button>
        <button>Cancel</button>
      </Dialog>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should trap focus when open', async () => {
    render(
      <Dialog 
        title="Confirmation" 
        isOpen={true}
        onClose={() => {}}
      >
        <p>Are you sure you want to proceed?</p>
        <button>Confirm</button>
        <button>Cancel</button>
      </Dialog>
    );
    
    // First element in the dialog should be focused
    expect(document.activeElement).toBe(screen.getByRole('dialog'));
    
    // Tab through elements should keep focus within dialog
    userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Confirm' }));
    
    userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Cancel' }));
    
    userEvent.tab();
    expect(document.activeElement).not.toBe(document.body); // Focus should still be in dialog
  });
});
```

## Testing Documentation

### Test Documentation Practices

- Document testing approach for complex components
- Include explanations for non-obvious test scenarios
- Document mocking strategies and test data generation
- Maintain up-to-date testing guidelines

### Component Test Documentation Example

```typescript
/**
 * TradingPanel.test.tsx
 * 
 * Testing strategy:
 * 
 * 1. Component Rendering
 *    - Test initial render state
 *    - Test different prop configurations
 * 
 * 2. User Interactions
 *    - Test order type selection
 *    - Test side (buy/sell) selection
 *    - Test amount input validation
 *    - Test order placement
 * 
 * 3. Error Handling
 *    - Test validation errors
 *    - Test API error handling
 *    - Test edge cases (insufficient balance, etc.)
 * 
 * 4. Integration
 *    - Test integration with TradingContext
 *    - Test order execution flow
 * 
 * Note: API calls are mocked using MSW in the setup.ts file.
 */

// Test implementation follows...
```

## Continuous Improvement

- Regularly review test coverage and identify gaps
- Refactor tests for maintainability as codebase evolves
- Keep testing dependencies up to date
- Share testing best practices across the team
- Run performance analysis on the test suite itself and optimize

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Cypress Documentation](https://docs.cypress.io)
- [Mock Service Worker](https://mswjs.io/docs/)
- [Storybook Testing](https://storybook.js.org/docs/react/writing-tests/introduction)
