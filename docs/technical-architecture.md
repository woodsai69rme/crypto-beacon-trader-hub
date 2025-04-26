
# Technical Architecture

## Project Overview

This trading platform is built using React, TypeScript, and Tailwind CSS with the shadcn/ui component library. It provides a comprehensive set of features for cryptocurrency trading, portfolio management, and AI-powered analysis.

## Core Components

### Trading Components

- **AlertsSystem**: Manages cryptocurrency price alerts
- **AiTradingMcp**: Connects to local AI servers for algorithmic trading
- **LocalAiModels**: Manages configuration for locally-running AI models
- **TradingControls**: Interface for controlling trading operations
- **MultiExchangeTrading**: Support for trading across multiple exchanges

### Utilities

- **errorHandling.ts**: Central error handling system
- **alertUtils.ts**: Utilities for creating and managing alerts
- **formatters.ts**: Text and number formatting utilities
- **currencyApi.ts**: Currency conversion API integration

### Hooks

- **use-alerts.ts**: Hook for managing price and volume alerts
- **use-trading-portfolio.ts**: Hook for tracking trading portfolio
- **use-currency-converter.ts**: Hook for currency conversion
- **use-local-storage.ts**: Hook for persistent storage

## State Management

The application uses a combination of:

- React Context API for global state
- Local component state for UI elements
- Local storage for persistent data
- Custom hooks for reusable logic

## Data Flow

1. User interacts with UI components
2. Components call hook methods
3. Hooks update local state and persistence
4. UI reflects changes and displays notifications

## Error Handling Architecture

The application implements a centralized error handling approach:

1. Components/hooks wrap operations in try/catch
2. Errors are passed to the `handleError` utility
3. Errors are logged and displayed to the user via toast notifications
4. Components handle error states appropriately

## Extension Points

The system is designed to be extended through:

1. Adding new alert types in the alerts system
2. Connecting additional MCP servers and AI models
3. Supporting new exchanges in the multi-exchange trading component
4. Adding new portfolio analysis metrics

## Performance Considerations

- React's memo, useCallback, and useMemo are used for expensive operations
- Data fetching is optimized with caching and throttling
- Large component trees are lazy-loaded where appropriate
- Heavy calculations are moved to web workers when necessary
