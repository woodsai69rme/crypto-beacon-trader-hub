# Trading System Documentation

## Overview

This document provides a comprehensive guide to the trading system components, APIs, and usage examples.
The trading system enables users to perform virtual trading with cryptocurrencies, view real-time price data,
analyze trading strategies, and utilize AI-assisted trading features.

## Table of Contents

1. [Core Components](#core-components)
2. [Data Types](#data-types)
3. [API Reference](#api-reference)
4. [Usage Examples](#usage-examples)
5. [Error Handling](#error-handling)
6. [Testing](#testing)
7. [Best Practices](#best-practices)

## Core Components

### Trading Form

The `TradingForm` component allows users to buy and sell cryptocurrencies with a user-friendly interface.

**Features:**
- Asset selection dropdown
- Buy/Sell option toggle
- Price and quantity inputs
- Total value calculation
- Balance validation
- Multiple currency support

### Fake Trading

The `FakeTradingForm` and `EnhancedFakeTrading` components enable simulated trading without real money.

**Features:**
- Simulated portfolio management
- Trade history tracking
- Performance metrics
- Customizable starting balance

### AI Trading

AI-assisted trading components leverage machine learning models to suggest trades and analyze market conditions.

**Components:**
- `AiTradingBots`: Manages automated trading strategies
- `ModelList`: Displays available AI models
- `ModelConfiguration`: Configures AI model parameters

## Data Types

### Core Types

```typescript
// Trade represents a buy or sell transaction
interface Trade {
  id: string;
  coinId: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: number | string;
  total: number;
  // Additional properties...
}

// TradingAccount represents a user's trading portfolio
interface TradingAccount {
  id: string;
  name: string;
  balance?: number;
  initialBalance?: number;
  trades?: Trade[];
  // Additional properties...
}

// TradingStrategy defines parameters for automated trading
interface TradingStrategy {
  id: string;
  name: string;
  description: string;
  timeframe: string;
  indicators: string[];
  parameters: Record<string, any>;
  // Additional properties...
}
```

### AI Trading Types

```typescript
// AITradingStrategy extends TradingStrategy with AI-specific parameters
interface AITradingStrategy extends TradingStrategy {
  aiModel: string;
  confidenceThreshold: number;
  riskLevel: 'low' | 'medium' | 'high';
  maxDrawdown: number;
}

// LocalModel represents an AI model for trading analysis
interface LocalModel {
  id: string;
  name: string;
  endpoint: string;
  type: "prediction" | "sentiment" | "trading" | "analysis";
  isConnected: boolean;
  // Additional properties...
}
```

## API Reference

### Trading Accounts Hook

The `useTradingAccounts` hook provides methods to manage trading accounts:

```typescript
const {
  accounts,              // Array of user's trading accounts
  activeAccountId,       // Currently selected account ID
  createAccount,         // Function to create a new account
  deleteAccount,         // Function to delete an account
  setActiveAccountId,    // Function to change the active account
  addTradeToAccount,     // Function to add a trade to an account
  getActiveAccount,      // Function to get the currently active account
  updateAccount          // Function to update account properties
} = useTradingAccounts();
```

### Price Monitoring Service

```typescript
// Start monitoring prices for specified coins
const stopMonitoring = startPriceMonitoring(
  coinIds,               // Array of coin IDs to monitor
  handlePriceUpdate,     // Callback when prices update
  refreshInterval        // Update frequency in milliseconds
);

// Get current price for a specific coin
const bitcoinPrice = getCoinPrice('bitcoin');

// Get all currently cached coin prices
const allPrices = getAllCoinPrices();
```

### Enhanced API Hook

```typescript
const {
  data,                  // The fetched data
  error,                 // Error object if request failed
  isLoading,             // Loading state
  fetchData,             // Function to fetch data
  refetch                // Alias for fetchData
} = useEnhancedApi(apiFunction, {
  initialData,           // Initial data while loading
  cacheKey,              // Key for caching responses
  cacheDuration,         // How long to cache (ms)
  retries,               // Number of retry attempts
  retryDelay,            // Delay between retries (ms)
  onSuccess,             // Success callback
  onError,               // Error callback
  onSettled,             // Called after success or error
  retryIf,               // Function to determine if retry should happen
  errorContext           // Context for error messages
});
```

## Usage Examples

### Basic Trading

```tsx
import { TradingForm } from '@/components/trading/TradingForm';
import { useTradingAccounts } from '@/hooks/use-trading-accounts';

const TradingExample = () => {
  const { 
    accounts, 
    activeAccountId, 
    addTradeToAccount, 
    getActiveAccount 
  } = useTradingAccounts();
  
  const activeAccount = getActiveAccount();
  
  const handleTrade = (coinId, type, amount, price) => {
    if (!activeAccountId) return;
    
    const trade = {
      id: `trade-${Date.now()}`,
      coinId,
      type,
      amount,
      price,
      total: amount * price,
      timestamp: new Date().toISOString()
    };
    
    addTradeToAccount(activeAccountId, trade);
  };
  
  const getOwnedCoinAmount = (coinId) => {
    if (!activeAccount?.trades) return 0;
    
    return activeAccount.trades
      .filter(t => t.coinId === coinId)
      .reduce((total, t) => {
        if (t.type === 'buy') return total + t.amount;
        if (t.type === 'sell') return total - t.amount;
        return total;
      }, 0);
  };
  
  return (
    <TradingForm
      balance={activeAccount?.balance || 0}
      availableCoins={availableCoins}
      onTrade={handleTrade}
      getOwnedCoinAmount={getOwnedCoinAmount}
      activeCurrency="USD"
      conversionRate={1}
    />
  );
};
```

### AI-Assisted Trading

```tsx
import { ModelList } from '@/components/trading/model-trading/ModelList';
import { useState } from 'react';
import { LocalModel } from '@/types/trading';

const AITradingExample = () => {
  const [models, setModels] = useState<LocalModel[]>([
    {
      id: 'trend-model',
      name: 'Trend Following Model',
      endpoint: '/api/models/trend',
      type: 'prediction',
      isConnected: false
    },
    {
      id: 'sentiment-model',
      name: 'Market Sentiment Analyzer',
      endpoint: '/api/models/sentiment',
      type: 'sentiment',
      isConnected: false
    }
  ]);
  const [selectedModel, setSelectedModel] = useState<LocalModel | null>(null);
  
  const handleConnect = (model: LocalModel) => {
    // Connect to the model's API
    setModels(prevModels => 
      prevModels.map(m => 
        m.id === model.id ? { ...m, isConnected: true } : m
      )
    );
  };
  
  const handleDisconnect = (modelId: string) => {
    // Disconnect from the model's API
    setModels(prevModels => 
      prevModels.map(m => 
        m.id === modelId ? { ...m, isConnected: false } : m
      )
    );
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">AI Trading Models</h2>
      
      <ModelList
        models={models}
        onSelect={setSelectedModel}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />
      
      {selectedModel && (
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium">{selectedModel.name}</h3>
          <p>Status: {selectedModel.isConnected ? 'Connected' : 'Disconnected'}</p>
          <p>Type: {selectedModel.type}</p>
        </div>
      )}
    </div>
  );
};
```

## Error Handling

The trading system includes comprehensive error handling utilities:

```typescript
// Handle errors with context and options
handleError(error, {
  level: "error",              // "error", "warning", or "info"
  context: "Trading Service",  // Optional context for the error
  retry: true,                 // Whether to show retry option
  retryFn: () => retry(),      // Function to call on retry
  details: { orderId: 123 },   // Additional details
  showToast: true,             // Whether to show a toast notification
  logToConsole: true           // Whether to log to console
});

// Try-catch wrapper with error handling
const result = await tryCatch(
  async () => await executeTransaction(),
  { context: "Transaction Processing" }
);

// Validate required fields
const validation = validateRequiredFields(
  formData,
  ['amount', 'price', 'coinId']
);

if (handleValidationError(validation, "Trading Form")) {
  return; // Stop if validation failed
}
```

## Testing

The trading system components include comprehensive unit tests:

- **Component Tests**: Verify UI rendering and interactions
- **Hook Tests**: Validate custom hooks behavior
- **Utility Tests**: Ensure helper functions work correctly
- **Integration Tests**: Test component interaction

Example test:

```typescript
describe('FakeTradingForm', () => {
  it('submits a valid trade', async () => {
    const onAddTrade = jest.fn();
    render(<FakeTradingForm onAddTrade={onAddTrade} />);
    
    // Fill out form...
    
    // Verify trade was added
    expect(onAddTrade).toHaveBeenCalledWith({
      id: expect.any(String),
      coinId: 'BTC',
      type: 'buy',
      amount: 1,
      // ...other fields
    });
  });
});
```

## Best Practices

1. **Error Handling**: Always use the provided error handling utilities to ensure consistent error reporting.

2. **Type Safety**: Use TypeScript interfaces for all data structures to catch errors at compile time.

3. **Data Validation**: Validate user inputs before processing trades to prevent invalid transactions.

4. **State Management**: Keep trading state in dedicated hooks like `useTradingAccounts` for consistent access.

5. **Testing**: Write tests for all trading components and utilities to ensure reliability.

6. **Performance**: Use caching for API requests and optimize rendering of frequently updated components.

7. **Security**: Never store API keys in client code; use secure storage mechanisms.
