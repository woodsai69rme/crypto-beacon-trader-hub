
# Lovable Trading Platform Project Structure

This document provides an overview of the project structure and organization of the Lovable Trading Platform codebase.

## Directory Structure

```
src/
├── components/           # UI components organized by feature
│   ├── analytics/        # Analytics-related components
│   ├── api/              # API management components
│   ├── dashboard/        # Dashboard and widget components
│   │   └── widgets/      # Individual widget implementations
│   ├── MarketCorrelations/ # Market correlation visualization
│   ├── settings/         # Settings and configuration components
│   ├── tickers/          # Price and news ticker components
│   ├── trading/          # Trading interface components
│   │   └── model-trading/ # Local model trading components
│   └── ui/               # Shadcn UI components
├── contexts/             # React Context providers
│   ├── ThemeContext.tsx  # Theme management
│   └── UIContext.tsx     # UI state management
├── docs/                 # Documentation files
│   ├── ApiDocumentation.md
│   ├── DEPLOYMENT.md
│   ├── DeveloperGuide.md
│   ├── FeatureChecklist.md
│   ├── UserGuide.md
│   └── features/         # Feature-specific documentation
├── hooks/                # Custom React hooks
│   ├── use-crypto-data.ts
│   ├── use-mobile.ts
│   └── use-trading-portfolio.ts
├── lib/                  # Utility functions and libraries
│   └── utils.ts          # Common utilities
├── services/             # API service functions
│   ├── api.ts            # Core API functions
│   └── enhancedCryptoApi.ts # Cryptocurrency data API
├── types/                # TypeScript type definitions
│   └── trading.ts        # Trading-related types
├── App.tsx               # Main application component
└── index.tsx             # Application entry point
```

## Key Components Overview

### Dashboard Components
- `Dashboard.tsx`: Main dashboard container with tab navigation
- `CustomizableDashboard.tsx`: Dashboard with customizable widgets
- `WidgetGrid.tsx`: Grid layout for dashboard widgets
- `WidgetList.tsx`: List layout for dashboard widgets on mobile

### Trading Components
- `RealTrading.tsx`: Real trading interface
- `EnhancedFakeTrading.tsx`: Simulated trading interface
- `TradingChart.tsx`: Interactive price charts
- `OrderBook.tsx`: Market depth visualization
- `WalletConnection.tsx`: Wallet integration component

### Analytics Components
- `LiveAnalyticsDashboard.tsx`: Real-time analytics
- `DetachedAiTradingDashboard.tsx`: Detachable AI dashboard
- `ApiUsageMetrics.tsx`: API usage monitoring
- `MarketCorrelations.tsx`: Market correlation analysis

### API-related Components
- `ApiProviderManagement.tsx`: Manage API providers
- `RealTimeApiUsage.tsx`: Monitor API usage in real time
- `MobileOptimizedApiProvider.tsx`: Mobile view for API providers

### Settings Components
- `ThemeSwitcher.tsx`: Theme toggle component
- `SettingsForm.tsx`: User settings form

### Model Trading Components
- `LocalModelTrading.tsx`: Local AI model trading
- `ModelConnectionTab.tsx`: Connect to local models
- `ModelRunningTab.tsx`: Run and monitor models
- `ModelGenerationTab.tsx`: Generate new models

## Type Definitions

### Core Types
- `CoinOption`: Cryptocurrency data type
- `Trade`: Trading transaction details
- `ApiProvider`: API provider configuration
- `WalletProvider`: Wallet provider details

### Component Props Types
- `RealTimePriceChartProps`: Props for price chart
- `WalletConnectionProps`: Props for wallet connection
- `DetachableDashboardProps`: Props for detachable dashboards

### Widget System Types
- `Widget`: Widget configuration type
- `WidgetType`: Available widget types
- `WidgetSize`: Size options for widgets

## Context Providers

### ThemeContext
Manages application theme (light/dark mode)

### UIContext
Manages global UI state:
- Ticker settings
- Sidebar configuration
- Notification preferences

## Custom Hooks

### useCryptoData
Fetches and manages cryptocurrency data with:
- Configurable refresh intervals
- Filtering options
- Error handling

### useIsMobile
Detects mobile devices for responsive layouts

### useTradingPortfolio
Manages portfolio state with:
- Holdings calculation
- Performance metrics
- Allocation percentages

## Services

### enhancedCryptoApi
Provides cryptocurrency data:
- Price information
- Historical data
- Market statistics

### api
Core API functionality:
- API request handling
- Error processing
- Response transformation

## Development Workflow

### Adding New Features
1. Define types in `types/trading.ts`
2. Create service functions if API integration is needed
3. Implement React components
4. Add to relevant parent components or navigation

### Component Development Pattern
Components generally follow this pattern:
- Define TypeScript interface for props
- Implement the component as a functional component
- Export as default

Example:
```tsx
import React from 'react';
import { SomeProps } from '@/types/trading';

const SomeComponent: React.FC<SomeProps> = ({ prop1, prop2 }) => {
  // Implementation
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};

export default SomeComponent;
```

## Build and Deployment

The project uses:
- React with TypeScript
- Tailwind CSS for styling
- Shadcn/UI component library
- Recharts for data visualization

See `DEPLOYMENT.md` for detailed deployment instructions.

## Documentation

- `UserGuide.md`: End-user documentation
- `DeveloperGuide.md`: Developer reference
- `ApiDocumentation.md`: API integration details
- `DEPLOYMENT.md`: Deployment instructions
- `FeatureChecklist.md`: Feature implementation status
