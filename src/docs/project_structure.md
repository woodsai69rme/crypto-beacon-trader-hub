
# Crypto Beacon Trader Hub - Project Structure

## Overview

This document provides a comprehensive overview of the project structure, helping developers navigate and understand the codebase organization.

```
crypto-beacon-trader-hub/
├── src/
│   ├── components/
│   │   ├── analytics/              # Analytics-related components
│   │   │   ├── DetachedAiTradingDashboard.tsx
│   │   │   ├── LiveAnalyticsDashboard.tsx
│   │   │   └── LivePriceMetrics.tsx
│   │   │
│   │   ├── api/                    # API-related components
│   │   │   ├── ApiManagementDashboard.tsx
│   │   │   ├── ApiUsageMetrics.tsx
│   │   │   ├── MobileOptimizedApiProvider.tsx
│   │   │   └── RealTimeApiUsage.tsx
│   │   │
│   │   ├── dashboard/              # Main dashboard components
│   │   │   ├── DashboardTools.tsx
│   │   │   └── DashboardTrading.tsx
│   │   │
│   │   ├── MarketCorrelations/     # Market correlation analysis
│   │   │   ├── CorrelationAnalysis.tsx
│   │   │   ├── CorrelationMatrix.tsx
│   │   │   ├── MarketCorrelations.tsx
│   │   │   ├── PriceCorrelationChart.tsx
│   │   │   └── mockData.ts
│   │   │
│   │   ├── settings/               # User settings components
│   │   │   ├── AppearanceSettings.tsx
│   │   │   ├── DataPrivacySettings.tsx
│   │   │   ├── GeneralSettings.tsx
│   │   │   ├── NotificationSettings.tsx
│   │   │   ├── PrivacySettings.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── ThemeSwitcher.tsx
│   │   │   ├── TradingSettings.tsx
│   │   │   └── types.ts
│   │   │
│   │   ├── sidebar/                # Sidebar navigation
│   │   │   └── SidebarPanel.tsx
│   │   │
│   │   ├── tickers/                # Price and news tickers
│   │   │   ├── NewsTicker.tsx
│   │   │   └── PriceTicker.tsx
│   │   │
│   │   ├── trading/                # Trading components
│   │   │   ├── AdvancedAiTradingDashboard.tsx
│   │   │   ├── AiTradingDashboard.tsx
│   │   │   ├── DetachedAiTradingDashboard.tsx
│   │   │   ├── EnhancedFakeTrading.tsx
│   │   │   ├── FakeTradingForm.tsx
│   │   │   ├── LocalAiModels.tsx
│   │   │   ├── OrderBook.tsx
│   │   │   ├── TradingChart.tsx
│   │   │   ├── TradingHoldings.tsx
│   │   │   ├── TradingHoldingsTable.tsx
│   │   │   ├── TradingStats.tsx
│   │   │   └── types.ts
│   │   │
│   │   ├── ui/                     # Shadcn UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   │
│   │   ├── widgets/                # Reusable widgets
│   │   │   └── AlertComponents/
│   │   │       └── AlertTypes.ts
│   │   │
│   │   ├── AnalysisDashboard.tsx
│   │   ├── CryptoSearch.tsx
│   │   ├── Dashboard.tsx
│   │   ├── MarketOverview.tsx
│   │   ├── PortfolioDashboard.tsx
│   │   ├── TaxCalculator.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── TradingDashboard.tsx
│   │   └── UtilityDashboard.tsx
│   │
│   ├── contexts/                   # React context providers
│   │   ├── AiTradingContext.tsx
│   │   ├── AuthContext.tsx
│   │   ├── CurrencyContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── UIContext.tsx
│   │
│   ├── docs/                       # Documentation
│   │   ├── dev_docs/               # Developer documentation
│   │   │   └── live_analytics.md
│   │   │
│   │   ├── user_guides/            # User guides
│   │   │   └── live_analytics.md
│   │   │
│   │   ├── valuation_summaries/    # Feature valuation
│   │   │   └── live_analytics.md
│   │   │
│   │   ├── api_map.md
│   │   ├── AuditReport.md
│   │   ├── FeatureChecklist.md
│   │   ├── FixesLog.md
│   │   └── prd.md
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── use-alerts.ts
│   │   ├── use-local-storage.ts
│   │   ├── use-mobile.ts
│   │   ├── use-toast.ts
│   │   └── use-trading-accounts.ts
│   │
│   ├── lib/                        # Utility libraries
│   │   └── utils.ts
│   │
│   ├── pages/                      # Page components
│   │   └── Index.tsx
│   │
│   ├── services/                   # API services
│   │   ├── coinGeckoService.ts
│   │   ├── cryptoCompareService.ts
│   │   └── enhancedCryptoApi.ts
│   │
│   ├── types/                      # TypeScript definitions
│   │   ├── alerts.ts
│   │   └── trading.ts
│   │
│   ├── utils/                      # Utility functions
│   │   └── errorHandling.ts
│   │
│   ├── App.css
│   ├── App.tsx                     # Main application component
│   ├── index.css
│   └── main.tsx                    # Entry point
│
├── public/
│   ├── assets/
│   │   └── images/
│   └── index.html
│
├── FEATURES.md                     # Features list
├── README.md                       # Project overview
├── index.html                      # HTML entry point
├── package.json                    # Dependencies and scripts
├── tailwind.config.js              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── vite.config.ts                  # Vite build configuration
```

## Key Directories

### `/src/components`

Contains all React components organized by feature or functionality. Components are grouped in subdirectories based on their purpose:

- `analytics`: Components for data visualization and analytics dashboards
- `api`: Components related to API management and monitoring
- `dashboard`: Main dashboard views and layouts
- `MarketCorrelations`: Market correlation visualization components
- `settings`: User settings and preferences components
- `trading`: Trading interface and related tools
- `ui`: Shadcn UI components with Tailwind styling

### `/src/contexts`

React context providers for global state management:

- `ThemeContext`: Manages application theme (dark/light mode)
- `UIContext`: Controls UI state like sidebar visibility
- `CurrencyContext`: Handles currency conversion and formatting
- `AuthContext`: Manages user authentication
- `AiTradingContext`: Provides AI trading functionality

### `/src/hooks`

Custom React hooks for reusable logic:

- `use-alerts.ts`: Alert management functions
- `use-trading-accounts.ts`: Trading account state and operations
- `use-local-storage.ts`: Persistent storage wrapper
- `use-mobile.ts`: Responsive design helper

### `/src/services`

API integration services that handle data fetching:

- `enhancedCryptoApi.ts`: Main API service for cryptocurrency data
- `coinGeckoService.ts`: Integration with CoinGecko API
- `cryptoCompareService.ts`: Integration with CryptoCompare API

### `/src/types`

TypeScript type definitions:

- `trading.ts`: Core type definitions for the trading platform
- `alerts.ts`: Type definitions for alerts and notifications

### `/src/docs`

Project documentation:

- `dev_docs/`: Technical documentation for developers
- `user_guides/`: User guides and tutorials
- `valuation_summaries/`: Feature valuation reports
- `FeatureChecklist.md`: Comprehensive feature list with status
- `api_map.md`: API architecture documentation
- `prd.md`: Product requirements document

## Key Files

- `src/App.tsx`: Main application component
- `src/components/Dashboard.tsx`: Main dashboard component
- `src/components/analytics/LiveAnalyticsDashboard.tsx`: Live analytics dashboard implementation
- `src/components/analytics/DetachedAiTradingDashboard.tsx`: Detachable dashboard container
- `src/types/trading.ts`: Core type definitions

## Development Guidelines

1. **Component Creation**:
   - Create new components in the appropriate subdirectory
   - Use PascalCase for component file names
   - Keep components focused on a single responsibility

2. **Styling**:
   - Use Tailwind CSS classes for styling
   - Follow the design system for consistency
   - Use Shadcn UI components where possible

3. **Type Safety**:
   - Define interfaces and types in appropriate `.ts` files
   - Use TypeScript generics for reusable components
   - Ensure proper typing for all props and state

4. **State Management**:
   - Use React context for global state
   - Use local state for component-specific state
   - Extract reusable logic to custom hooks

5. **Documentation**:
   - Update documentation when adding or changing features
   - Include JSDoc comments for functions and components
   - Keep the feature checklist updated

This project structure is designed to be modular, maintainable, and scalable. Following these guidelines ensures a consistent and high-quality codebase.
