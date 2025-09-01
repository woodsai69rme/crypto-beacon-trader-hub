
# 🧪 Testing Guide - Crypto Beacon Trading Platform

## Overview

This comprehensive testing guide covers all aspects of testing the Crypto Beacon Trading Platform, including unit tests, integration tests, end-to-end tests, performance testing, security testing, and automated CI/CD testing pipelines.

## Testing Stack

### Core Testing Technologies
- **Test Runner**: Vitest (fast, ESM-native)
- **React Testing**: React Testing Library
- **E2E Testing**: Playwright
- **API Testing**: Supertest + MSW (Mock Service Worker)
- **Performance Testing**: Lighthouse CI
- **Security Testing**: npm audit + custom security tests
- **Coverage**: c8 (built into Vitest)

### Testing Structure
```
tests/
├── unit/                 # Unit tests
│   ├── components/       # Component tests
│   ├── hooks/           # Custom hook tests
│   ├── services/        # Service layer tests
│   └── utils/           # Utility function tests
├── integration/         # Integration tests
│   ├── api/             # API integration tests
│   ├── database/        # Database integration tests
│   └── auth/           # Authentication tests
├── e2e/                # End-to-end tests
│   ├── trading/        # Trading flow tests
│   ├── auth/           # Authentication flow tests
│   └── dashboard/      # Dashboard functionality tests
├── performance/        # Performance tests
├── security/          # Security tests
├── accessibility/     # A11y tests
└── mocks/            # Mock data and services
```

## Test Configuration

### Vitest Configuration
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'c8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.*',
        'src/types/',
        'src/mocks/'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

### Test Setup File
```typescript
// tests/setup.ts
import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './mocks/server';

// Setup MSW server
beforeAll(() => server.listen());
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
```

## Unit Testing

### Component Testing
```typescript
// tests/unit/components/TradingForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TradingForm } from '@/components/trading/TradingForm';
import { TradingProvider } from '@/contexts/TradingContext';

describe('TradingForm', () => {
  const mockProps = {
    onSubmit: vi.fn(),
    availableCoins: [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 50000 }
    ],
    formatCurrency: (value: number) => `$${value.toFixed(2)}`
  };

  const renderWithProvider = (props = mockProps) => {
    return render(
      <TradingProvider>
        <TradingForm {...props} />
      </TradingProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders trading form with all required fields', () => {
    renderWithProvider();
    
    expect(screen.getByLabelText(/select coin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/trade type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit trade/i })).toBeInTheDocument();
  });

  it('validates form inputs correctly', async () => {
    renderWithProvider();
    
    const submitButton = screen.getByRole('button', { name: /submit trade/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/coin is required/i)).toBeInTheDocument();
      expect(screen.getByText(/amount must be greater than 0/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    // Select coin
    const coinSelect = screen.getByLabelText(/select coin/i);
    await user.click(coinSelect);
    await user.click(screen.getByText('Bitcoin (BTC)'));

    // Enter amount
    const amountInput = screen.getByLabelText(/amount/i);
    await user.type(amountInput, '0.1');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit trade/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        coinId: 'bitcoin',
        coinName: 'Bitcoin',
        coinSymbol: 'BTC',
        type: 'buy',
        amount: 0.1,
        price: 50000,
        totalValue: 5000,
        currency: 'AUD',
        timestamp: expect.any(String),
        id: expect.any(String)
      });
    });
  });

  it('calculates total value correctly', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    const coinSelect = screen.getByLabelText(/select coin/i);
    await user.click(coinSelect);
    await user.click(screen.getByText('Bitcoin (BTC)'));

    const amountInput = screen.getByLabelText(/amount/i);
    await user.type(amountInput, '0.5');

    await waitFor(() => {
      expect(screen.getByText(/total: \$25,000\.00/i)).toBeInTheDocument();
    });
  });
});
```

### Hook Testing
```typescript
// tests/unit/hooks/useTradingAccounts.test.ts
import { renderHook, act } from '@testing-library/react';
import { useTradingAccounts } from '@/hooks/useTradingAccounts';
import { TradingProvider } from '@/contexts/TradingContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <TradingProvider>{children}</TradingProvider>
);

describe('useTradingAccounts', () => {
  it('initializes with default account', () => {
    const { result } = renderHook(() => useTradingAccounts(), { wrapper });

    expect(result.current.accounts).toHaveLength(1);
    expect(result.current.activeAccount.type).toBe('paper');
    expect(result.current.activeAccount.balance).toBe(100000);
  });

  it('creates new trading account', () => {
    const { result } = renderHook(() => useTradingAccounts(), { wrapper });

    act(() => {
      result.current.createAccount({
        name: 'Test Account',
        type: 'paper',
        balance: 50000,
        currency: 'USD'
      });
    });

    expect(result.current.accounts).toHaveLength(2);
    expect(result.current.accounts[1].name).toBe('Test Account');
    expect(result.current.accounts[1].balance).toBe(50000);
  });

  it('switches active account', () => {
    const { result } = renderHook(() => useTradingAccounts(), { wrapper });

    act(() => {
      result.current.createAccount({
        name: 'Second Account',
        type: 'paper',
        balance: 75000,
        currency: 'EUR'
      });
    });

    const secondAccountId = result.current.accounts[1].id;

    act(() => {
      result.current.setActiveAccount(secondAccountId);
    });

    expect(result.current.activeAccount.id).toBe(secondAccountId);
    expect(result.current.activeAccount.name).toBe('Second Account');
  });

  it('executes trade and updates balance', () => {
    const { result } = renderHook(() => useTradingAccounts(), { wrapper });

    const trade = {
      id: 't1',
      coinId: 'bitcoin',
      coinName: 'Bitcoin',
      coinSymbol: 'BTC',
      type: 'buy' as const,
      amount: 0.1,
      price: 50000,
      totalValue: 5000,
      timestamp: new Date().toISOString(),
      currency: 'AUD' as const
    };

    act(() => {
      result.current.executeTrade(trade);
    });

    expect(result.current.activeAccount.balance).toBe(95000); // 100000 - 5000
    expect(result.current.activeAccount.trades).toHaveLength(1);
    expect(result.current.activeAccount.trades[0]).toEqual(trade);
  });
});
```

### Service Layer Testing
```typescript
// tests/unit/services/cryptoApi.test.ts
import { cryptoApiService } from '@/services/cryptoApi';
import { server } from '../../mocks/server';
import { http, HttpResponse } from 'msw';

describe('CryptoApiService', () => {
  it('fetches cryptocurrency data successfully', async () => {
    server.use(
      http.get('https://api.coingecko.com/api/v3/coins/markets', () => {
        return HttpResponse.json([
          {
            id: 'bitcoin',
            symbol: 'btc',
            name: 'Bitcoin',
            current_price: 50000,
            market_cap: 1000000000,
            price_change_percentage_24h: 2.5
          }
        ]);
      })
    );

    const data = await cryptoApiService.fetchMarketData();

    expect(data).toHaveLength(1);
    expect(data[0].id).toBe('bitcoin');
    expect(data[0].current_price).toBe(50000);
  });

  it('handles API errors gracefully', async () => {
    server.use(
      http.get('https://api.coingecko.com/api/v3/coins/markets', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    await expect(cryptoApiService.fetchMarketData()).rejects.toThrow('Failed to fetch market data');
  });

  it('implements rate limiting', async () => {
    const startTime = Date.now();
    
    // Make multiple rapid requests
    const promises = Array(5).fill(null).map(() => cryptoApiService.fetchMarketData());
    await Promise.all(promises);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Should take at least some time due to rate limiting
    expect(duration).toBeGreaterThan(100);
  });

  it('caches responses correctly', async () => {
    const spy = vi.spyOn(global, 'fetch');
    
    // First call
    await cryptoApiService.fetchMarketData();
    expect(spy).toHaveBeenCalledTimes(1);
    
    // Second call within cache window
    await cryptoApiService.fetchMarketData();
    expect(spy).toHaveBeenCalledTimes(1); // Should use cache
    
    spy.mockRestore();
  });
});
```

## Integration Testing

### API Integration Tests
```typescript
// tests/integration/api/trading.test.ts
import { setupTestDatabase, cleanupTestDatabase } from '../helpers/database';
import { createTestUser, createTestAccount } from '../helpers/fixtures';
import { tradingApiClient } from '@/services/api/trading';

describe('Trading API Integration', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  beforeEach(async () => {
    await cleanupTestDatabase();
  });

  it('creates and retrieves trading account', async () => {
    const user = await createTestUser();
    
    const accountData = {
      name: 'Test Trading Account',
      type: 'paper',
      balance: 100000,
      currency: 'AUD'
    };

    const createdAccount = await tradingApiClient.createAccount(user.id, accountData);
    expect(createdAccount.id).toBeDefined();
    expect(createdAccount.name).toBe(accountData.name);

    const retrievedAccount = await tradingApiClient.getAccount(createdAccount.id);
    expect(retrievedAccount).toEqual(createdAccount);
  });

  it('executes trade and updates portfolio', async () => {
    const user = await createTestUser();
    const account = await createTestAccount(user.id);

    const trade = {
      coinId: 'bitcoin',
      coinName: 'Bitcoin',
      coinSymbol: 'BTC',
      type: 'buy',
      amount: 0.1,
      price: 50000,
      totalValue: 5000,
      currency: 'AUD'
    };

    const executedTrade = await tradingApiClient.executeTrade(account.id, trade);
    expect(executedTrade.id).toBeDefined();

    const updatedAccount = await tradingApiClient.getAccount(account.id);
    expect(updatedAccount.balance).toBe(95000); // 100000 - 5000
    expect(updatedAccount.assets).toHaveLength(1);
    expect(updatedAccount.assets[0].symbol).toBe('BTC');
  });

  it('handles concurrent trades correctly', async () => {
    const user = await createTestUser();
    const account = await createTestAccount(user.id, { balance: 100000 });

    const trades = Array(5).fill(null).map((_, i) => ({
      coinId: 'bitcoin',
      coinName: 'Bitcoin',
      coinSymbol: 'BTC',
      type: 'buy',
      amount: 0.01,
      price: 50000,
      totalValue: 500,
      currency: 'AUD'
    }));

    // Execute trades concurrently
    const results = await Promise.all(
      trades.map(trade => tradingApiClient.executeTrade(account.id, trade))
    );

    expect(results).toHaveLength(5);
    results.forEach(result => {
      expect(result.id).toBeDefined();
    });

    const finalAccount = await tradingApiClient.getAccount(account.id);
    expect(finalAccount.balance).toBe(97500); // 100000 - (5 * 500)
  });
});
```

### Database Integration Tests
```typescript
// tests/integration/database/portfolio.test.ts
import { supabase } from '@/lib/supabase';
import { setupTestDatabase, cleanupTestDatabase } from '../helpers/database';

describe('Portfolio Database Integration', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  it('stores and retrieves portfolio data', async () => {
    const { data: user } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'password123'
    });

    const portfolioData = {
      user_id: user.user?.id,
      name: 'Test Portfolio',
      balance: 100000,
      currency: 'AUD',
      assets: [
        {
          symbol: 'BTC',
          amount: 0.5,
          value: 25000
        }
      ]
    };

    const { data: portfolio, error } = await supabase
      .from('portfolios')
      .insert(portfolioData)
      .select()
      .single();

    expect(error).toBeNull();
    expect(portfolio.name).toBe('Test Portfolio');
    expect(portfolio.assets).toHaveLength(1);
  });

  it('handles portfolio constraints correctly', async () => {
    const { data: user } = await supabase.auth.signUp({
      email: 'test2@example.com',
      password: 'password123'
    });

    // Try to create portfolio with negative balance
    const { error } = await supabase
      .from('portfolios')
      .insert({
        user_id: user.user?.id,
        name: 'Invalid Portfolio',
        balance: -1000,
        currency: 'AUD'
      });

    expect(error).not.toBeNull();
    expect(error?.message).toContain('balance');
  });
});
```

## End-to-End Testing

### Playwright Configuration
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    }
  ],
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI
  }
});
```

### E2E Test Examples
```typescript
// tests/e2e/trading/paper-trading.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Paper Trading Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Login as demo user
    await page.click('[data-testid="demo-login"]');
    await page.waitForSelector('[data-testid="dashboard"]');
  });

  test('complete buy trade flow', async ({ page }) => {
    // Navigate to trading page
    await page.click('[data-testid="nav-trading"]');
    await expect(page).toHaveURL('/trading');

    // Select Bitcoin
    await page.click('[data-testid="coin-select"]');
    await page.click('[data-testid="coin-option-bitcoin"]');

    // Enter trade amount
    await page.fill('[data-testid="amount-input"]', '0.1');

    // Verify total calculation
    await expect(page.locator('[data-testid="total-value"]')).toContainText('$5,000.00');

    // Submit trade
    await page.click('[data-testid="submit-trade"]');

    // Wait for success message
    await expect(page.locator('[data-testid="trade-success"]')).toBeVisible();

    // Verify trade appears in history
    await page.click('[data-testid="trade-history-tab"]');
    await expect(page.locator('[data-testid="trade-row"]').first()).toContainText('Bitcoin');
    await expect(page.locator('[data-testid="trade-row"]').first()).toContainText('Buy');
    await expect(page.locator('[data-testid="trade-row"]').first()).toContainText('0.1');
  });

  test('portfolio updates after trade', async ({ page }) => {
    // Execute a trade first
    await page.goto('/trading');
    await page.click('[data-testid="coin-select"]');
    await page.click('[data-testid="coin-option-ethereum"]');
    await page.fill('[data-testid="amount-input"]', '1');
    await page.click('[data-testid="submit-trade"]');
    await page.waitForSelector('[data-testid="trade-success"]');

    // Check portfolio update
    await page.goto('/portfolio');
    await expect(page.locator('[data-testid="portfolio-asset"]')).toContainText('Ethereum');
    await expect(page.locator('[data-testid="portfolio-balance"]')).not.toContainText('$100,000.00');
  });

  test('AI bot creation and monitoring', async ({ page }) => {
    await page.goto('/ai-trading');
    
    // Create new bot
    await page.click('[data-testid="create-bot-button"]');
    await page.fill('[data-testid="bot-name"]', 'Test Bot');
    await page.selectOption('[data-testid="strategy-select"]', 'trend-following');
    await page.selectOption('[data-testid="risk-level"]', 'medium');
    await page.fill('[data-testid="max-trade-amount"]', '1000');
    
    await page.click('[data-testid="create-bot-submit"]');
    
    // Verify bot appears in list
    await expect(page.locator('[data-testid="bot-card"]')).toContainText('Test Bot');
    await expect(page.locator('[data-testid="bot-status"]')).toContainText('Active');
    
    // Test bot controls
    await page.click('[data-testid="bot-pause"]');
    await expect(page.locator('[data-testid="bot-status"]')).toContainText('Paused');
  });
});
```

### Mobile E2E Tests
```typescript
// tests/e2e/mobile/responsive.spec.ts
import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 13'] });

test.describe('Mobile Responsiveness', () => {
  test('navigation works on mobile', async ({ page }) => {
    await page.goto('/');
    
    // Test mobile menu
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    
    // Navigate to trading
    await page.click('[data-testid="mobile-nav-trading"]');
    await expect(page).toHaveURL('/trading');
    
    // Test mobile trading form
    await expect(page.locator('[data-testid="trading-form"]')).toBeVisible();
    await expect(page.locator('[data-testid="coin-select"]')).toBeVisible();
  });

  test('charts render correctly on mobile', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check chart containers
    await expect(page.locator('[data-testid="price-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="portfolio-chart"]')).toBeVisible();
    
    // Test chart interactions
    await page.tap('[data-testid="chart-timeframe-1d"]');
    await page.waitForTimeout(1000); // Wait for chart update
    
    // Verify chart updated
    await expect(page.locator('[data-testid="chart-timeframe-1d"]')).toHaveClass(/active/);
  });
});
```

## Performance Testing

### Lighthouse CI Configuration
```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:5173/',
        'http://localhost:5173/trading',
        'http://localhost:5173/dashboard',
        'http://localhost:5173/portfolio'
      ],
      startServerCommand: 'npm run preview',
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.8 }]
      }
    },
    upload: {
      target: 'filesystem',
      outputDir: './lighthouse-results'
    }
  }
};
```

### Load Testing
```typescript
// tests/performance/load.test.ts
import { test, expect } from '@playwright/test';

test.describe('Load Testing', () => {
  test('handles multiple concurrent users', async ({ browser }) => {
    const contexts = await Promise.all(
      Array(10).fill(null).map(() => browser.newContext())
    );

    const pages = await Promise.all(
      contexts.map(context => context.newPage())
    );

    const startTime = Date.now();

    // Simulate concurrent user actions
    await Promise.all(
      pages.map(async (page, index) => {
        await page.goto('/');
        await page.click('[data-testid="demo-login"]');
        await page.goto('/trading');
        await page.click('[data-testid="coin-select"]');
        await page.click('[data-testid="coin-option-bitcoin"]');
        await page.fill('[data-testid="amount-input"]', '0.01');
        await page.click('[data-testid="submit-trade"]');
      })
    );

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Should complete within reasonable time
    expect(duration).toBeLessThan(30000); // 30 seconds

    // Cleanup
    await Promise.all(contexts.map(context => context.close()));
  });

  test('API response times under load', async ({ page }) => {
    const responses: number[] = [];

    page.on('response', response => {
      if (response.url().includes('/api/')) {
        const timing = response.timing();
        responses.push(timing.responseEnd - timing.requestStart);
      }
    });

    // Generate load
    for (let i = 0; i < 20; i++) {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
    }

    // Analyze response times
    const avgResponseTime = responses.reduce((a, b) => a + b, 0) / responses.length;
    const maxResponseTime = Math.max(...responses);

    expect(avgResponseTime).toBeLessThan(1000); // 1 second average
    expect(maxResponseTime).toBeLessThan(5000); // 5 seconds max
  });
});
```

## Security Testing

### Security Test Suite
```typescript
// tests/security/security.test.ts
import { test, expect } from '@playwright/test';

test.describe('Security Tests', () => {
  test('prevents XSS attacks', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="demo-login"]');
    
    // Try to inject script via form input
    const maliciousScript = '<script>window.xssTest = true;</script>';
    
    await page.goto('/trading');
    await page.fill('[data-testid="amount-input"]', maliciousScript);
    await page.click('[data-testid="submit-trade"]');
    
    // Verify script was not executed
    const xssResult = await page.evaluate(() => window.xssTest);
    expect(xssResult).toBeUndefined();
    
    // Verify input was sanitized
    const displayedValue = await page.inputValue('[data-testid="amount-input"]');
    expect(displayedValue).not.toContain('<script>');
  });

  test('validates API authentication', async ({ page, request }) => {
    // Try to access protected endpoint without auth
    const response = await request.get('/api/accounts');
    expect(response.status()).toBe(401);
    
    // Try with invalid token
    const invalidResponse = await request.get('/api/accounts', {
      headers: { 'Authorization': 'Bearer invalid-token' }
    });
    expect(invalidResponse.status()).toBe(401);
  });

  test('prevents CSRF attacks', async ({ page, request }) => {
    await page.goto('/');
    await page.click('[data-testid="demo-login"]');
    
    // Get CSRF token
    const csrfToken = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="csrf-token"]');
      return meta?.getAttribute('content');
    });
    
    // Try request without CSRF token
    const response = await request.post('/api/trades', {
      data: {
        coinId: 'bitcoin',
        amount: 0.1,
        type: 'buy'
      }
    });
    
    if (csrfToken) {
      expect(response.status()).toBe(403);
    }
  });

  test('enforces rate limiting', async ({ request }) => {
    const requests = Array(20).fill(null).map(() => 
      request.get('/api/market-data')
    );
    
    const responses = await Promise.all(requests);
    const rateLimitedResponses = responses.filter(r => r.status() === 429);
    
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
  });
});
```

## Accessibility Testing

### A11y Test Configuration
```typescript
// tests/accessibility/a11y.test.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('homepage is accessible', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('trading page is accessible', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="demo-login"]');
    await page.goto('/trading');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
    
    // Navigate through main elements
    const tabbableElements = [
      '[data-testid="demo-login"]',
      '[data-testid="nav-dashboard"]',
      '[data-testid="nav-trading"]',
      '[data-testid="nav-portfolio"]'
    ];
    
    for (const selector of tabbableElements) {
      await page.keyboard.press('Tab');
      await expect(page.locator(selector)).toBeFocused();
    }
  });

  test('screen reader compatibility', async ({ page }) => {
    await page.goto('/');
    
    // Check for proper ARIA labels
    const navElements = page.locator('[role="navigation"]');
    await expect(navElements).toHaveCount(1);
    
    // Check button accessibility
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const hasLabel = await button.getAttribute('aria-label') !== null;
      const hasText = (await button.textContent())?.trim() !== '';
      
      expect(hasLabel || hasText).toBeTruthy();
    }
  });
});
```

## Test Data Management

### Mock Service Worker Setup
```typescript
// tests/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

### API Mock Handlers
```typescript
// tests/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Market data
  http.get('https://api.coingecko.com/api/v3/coins/markets', () => {
    return HttpResponse.json([
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        current_price: 50000,
        market_cap: 1000000000,
        price_change_percentage_24h: 2.5,
        total_volume: 25000000000
      },
      {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        current_price: 3000,
        market_cap: 400000000,
        price_change_percentage_24h: -1.2,
        total_volume: 15000000000
      }
    ]);
  }),

  // Trading API
  http.post('/api/trades', async ({ request }) => {
    const trade = await request.json();
    return HttpResponse.json({
      id: 'trade-123',
      ...trade,
      timestamp: new Date().toISOString(),
      status: 'completed'
    });
  }),

  // AI API
  http.post('https://openrouter.ai/api/v1/chat/completions', () => {
    return HttpResponse.json({
      choices: [{
        message: {
          content: JSON.stringify({
            signal: 'buy',
            confidence: 0.75,
            reasoning: 'Technical indicators suggest upward trend'
          })
        }
      }]
    });
  })
];
```

### Test Fixtures
```typescript
// tests/helpers/fixtures.ts
import { faker } from '@faker-js/faker';
import type { TradingAccount, Trade, AIBot } from '@/types/trading';

export const createTestUser = () => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  createdAt: new Date().toISOString()
});

export const createTestAccount = (userId: string, overrides?: Partial<TradingAccount>): TradingAccount => ({
  id: faker.string.uuid(),
  name: faker.company.name() + ' Account',
  type: 'paper',
  balance: 100000,
  currency: 'AUD',
  assets: [],
  trades: [],
  createdAt: new Date().toISOString(),
  ...overrides
});

export const createTestTrade = (overrides?: Partial<Trade>): Trade => ({
  id: faker.string.uuid(),
  coinId: 'bitcoin',
  coinName: 'Bitcoin',
  coinSymbol: 'BTC',
  type: faker.helpers.arrayElement(['buy', 'sell']),
  amount: faker.number.float({ min: 0.001, max: 1 }),
  price: faker.number.float({ min: 30000, max: 70000 }),
  totalValue: 0, // Will be calculated
  timestamp: new Date().toISOString(),
  currency: 'AUD',
  ...overrides
});

export const createTestBot = (overrides?: Partial<AIBot>): AIBot => ({
  id: faker.string.uuid(),
  name: faker.company.name() + ' Bot',
  description: faker.lorem.sentence(),
  strategy: {
    id: faker.string.uuid(),
    name: 'Trend Following',
    description: 'Follows market trends',
    type: 'trend-following',
    timeframe: '1h',
    parameters: {}
  },
  status: 'active',
  balance: faker.number.float({ min: 1000, max: 50000 }),
  performance: {
    totalReturn: faker.number.float({ min: -20, max: 50 }),
    winRate: faker.number.float({ min: 0.3, max: 0.8 }),
    totalTrades: faker.number.int({ min: 10, max: 1000 })
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  auditLog: [],
  ...overrides
});
```

## Test Automation Scripts

### Test Runner Scripts
```bash
#!/bin/bash
# scripts/test.sh

set -e

echo "🧪 Running Crypto Beacon Test Suite"
echo "=================================="

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Environment setup
export NODE_ENV=test
export VITE_USE_MOCK_DATA=true

echo "📋 Running linting..."
npm run lint

echo "🔍 Running type checking..."
npm run type-check

echo "🧪 Running unit tests..."
npm run test:unit

echo "🔗 Running integration tests..."
npm run test:integration

echo "🎭 Running E2E tests..."
npm run test:e2e

echo "🚀 Running performance tests..."
npm run test:performance

echo "🔒 Running security tests..."
npm run test:security

echo "♿ Running accessibility tests..."
npm run test:a11y

echo "📊 Generating coverage report..."
npm run test:coverage

echo "✅ All tests completed successfully!"
```

### Windows Test Script
```batch
@echo off
REM scripts/test.bat

echo 🧪 Running Crypto Beacon Test Suite
echo ==================================

REM Check if dependencies are installed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

REM Environment setup
set NODE_ENV=test
set VITE_USE_MOCK_DATA=true

echo 📋 Running linting...
npm run lint
if %errorlevel% neq 0 exit /b %errorlevel%

echo 🔍 Running type checking...
npm run type-check
if %errorlevel% neq 0 exit /b %errorlevel%

echo 🧪 Running unit tests...
npm run test:unit
if %errorlevel% neq 0 exit /b %errorlevel%

echo 🔗 Running integration tests...
npm run test:integration
if %errorlevel% neq 0 exit /b %errorlevel%

echo 🎭 Running E2E tests...
npm run test:e2e
if %errorlevel% neq 0 exit /b %errorlevel%

echo ✅ All tests completed successfully!
```

### Package.json Test Scripts
```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run --reporter=verbose tests/unit",
    "test:integration": "vitest run --reporter=verbose tests/integration",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:performance": "lighthouse-ci autorun",
    "test:security": "npm audit && vitest run tests/security",
    "test:a11y": "playwright test tests/accessibility",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest",
    "test:all": "./scripts/test.sh"
  }
}
```

## CI/CD Testing Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run type checking
      run: npm run type-check
    
    - name: Run unit tests
      run: npm run test:unit
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info

  integration-tests:
    runs-on: ubuntu-latest
    needs: unit-tests
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run integration tests
      run: npm run test:integration
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db

  e2e-tests:
    runs-on: ubuntu-latest
    needs: unit-tests
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright browsers
      run: npx playwright install --with-deps
    
    - name: Run E2E tests
      run: npm run test:e2e
    
    - name: Upload Playwright report
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/

  performance-tests:
    runs-on: ubuntu-latest
    needs: unit-tests
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
    
    - name: Run Lighthouse CI
      run: npm run test:performance
    
    - name: Upload Lighthouse report
      uses: actions/upload-artifact@v3
      with:
        name: lighthouse-report
        path: lighthouse-results/

  security-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run security audit
      run: npm audit --audit-level moderate
    
    - name: Run security tests
      run: npm run test:security
```

## Test Monitoring & Reporting

### Test Coverage Reporting
```typescript
// tests/coverage/coverage-report.ts
import fs from 'fs';
import path from 'path';

interface CoverageReport {
  lines: { total: number; covered: number; percentage: number };
  statements: { total: number; covered: number; percentage: number };
  functions: { total: number; covered: number; percentage: number };
  branches: { total: number; covered: number; percentage: number };
}

export const generateCoverageReport = async (): Promise<CoverageReport> => {
  const coveragePath = path.join(process.cwd(), 'coverage', 'coverage-summary.json');
  const coverageData = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
  
  const total = coverageData.total;
  
  return {
    lines: {
      total: total.lines.total,
      covered: total.lines.covered,
      percentage: total.lines.pct
    },
    statements: {
      total: total.statements.total,
      covered: total.statements.covered,
      percentage: total.statements.pct
    },
    functions: {
      total: total.functions.total,
      covered: total.functions.covered,
      percentage: total.functions.pct
    },
    branches: {
      total: total.branches.total,
      covered: total.branches.covered,
      percentage: total.branches.pct
    }
  };
};
```

### Test Result Dashboard
```typescript
// tests/dashboard/test-dashboard.ts
import express from 'express';
import { generateCoverageReport } from '../coverage/coverage-report';

const app = express();
const port = 3001;

app.get('/api/coverage', async (req, res) => {
  try {
    const coverage = await generateCoverageReport();
    res.json(coverage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate coverage report' });
  }
});

app.get('/api/test-results', (req, res) => {
  // Return latest test results
  res.json({
    unit: { passed: 150, failed: 2, total: 152 },
    integration: { passed: 45, failed: 0, total: 45 },
    e2e: { passed: 25, failed: 1, total: 26 },
    performance: { score: 85, status: 'passing' },
    security: { vulnerabilities: 0, status: 'passing' }
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Test dashboard running at http://localhost:${port}`);
  });
}
```

## Best Practices & Guidelines

### Test Writing Guidelines
1. **Test Structure**: Follow AAA pattern (Arrange, Act, Assert)
2. **Test Names**: Use descriptive names that explain what is being tested
3. **Test Isolation**: Each test should be independent and not rely on other tests
4. **Mock External Dependencies**: Use MSW for API calls, mock third-party services
5. **Test Edge Cases**: Include boundary conditions and error scenarios
6. **Keep Tests Simple**: One concept per test, clear and focused assertions

### Performance Guidelines
1. **Parallel Execution**: Run tests in parallel where possible
2. **Test Data**: Use factories and fixtures for consistent test data
3. **Cleanup**: Always clean up resources after tests
4. **Selective Testing**: Use test filtering for faster development cycles
5. **CI Optimization**: Cache dependencies and optimize CI pipeline

### Maintenance Guidelines
1. **Regular Updates**: Keep testing dependencies up to date
2. **Flaky Test Management**: Identify and fix unreliable tests promptly
3. **Test Coverage Goals**: Maintain high coverage but focus on quality over quantity
4. **Documentation**: Keep test documentation current with code changes
5. **Review Process**: Include tests in code review process

---

**Testing Support**
- 📖 [Setup Guide](./setup.md)
- 🚀 [Deployment Guide](./deployment.md)
- 🔧 [Configuration Guide](./config.md)
- 🐛 [Issue Tracker](https://github.com/crypto-beacon/issues)
