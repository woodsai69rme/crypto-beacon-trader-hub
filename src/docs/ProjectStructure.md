
# Project Structure

This document outlines the structure and organization of the Crypto Trading Platform codebase.

## Directory Structure

```
src/
├── components/           # React components
│   ├── api/              # API-related components
│   │   ├── ApiUsageMetrics.tsx
│   │   ├── RealTimeApiUsage.tsx
│   │   └── ApiManagementDashboard.tsx
│   │
│   ├── analytics/        # Analytics components
│   │   ├── LiveAnalyticsDashboard.tsx
│   │   ├── LivePriceMetrics.tsx
│   │   └── DetachedAiTradingDashboard.tsx
│   │
│   ├── dashboard/        # Dashboard components
│   │   ├── DashboardTab.tsx
│   │   ├── DashboardOverview.tsx
│   │   ├── DashboardPortfolio.tsx
│   │   ├── DashboardTrading.tsx
│   │   ├── DashboardAnalysis.tsx
│   │   ├── DashboardTools.tsx
│   │   └── DashboardWatchlist.tsx
│   │
│   ├── settings/         # Settings components
│   │   ├── Settings.tsx
│   │   ├── NotificationSettings.tsx
│   │   ├── AppearanceSettings.tsx
│   │   ├── PrivacySettings.tsx
│   │   └── TradingSettings.tsx
│   │
│   ├── trading/          # Trading components
│   │   ├── RealTimeTrading.tsx
│   │   ├── RealTimePriceChart.tsx
│   │   ├── RealTimePrices.tsx
│   │   ├── RealTimeTrader.tsx
│   │   ├── RealTimePortfolioPerformance.tsx
│   │   ├── AiTradingBots.tsx
│   │   ├── AiTradingDashboard.tsx
│   │   └── AiTradingMcp.tsx
│   │
│   ├── wallets/          # Wallet components
│   │   ├── WalletConnector.tsx
│   │   └── WalletDetails.tsx
│   │
│   ├── ui/               # UI components (shadcn)
│   │
│   ├── AnalysisDashboard.tsx
│   ├── PortfolioDashboard.tsx
│   ├── TradingDashboard.tsx
│   └── UtilityDashboard.tsx
│
├── docs/                 # Documentation
│   ├── FeatureChecklist.md
│   ├── UserGuide.md
│   ├── DeveloperGuide.md
│   ├── APIDocumentation.md
│   └── ProjectStructure.md
│
├── hooks/                # Custom React hooks
│   ├── use-mobile.ts
│   └── use-theme.ts
│
├── pages/                # Page components
│   ├── Index.tsx
│   └── Auth.tsx
│
├── services/             # API services
│   ├── cryptoService.ts
│   └── priceMonitoring.ts
│
└── types/                # TypeScript type definitions
    ├── trading.ts
    └── settings.ts
```

## Component Organization

The codebase follows a modular component structure:

### Core Components

- **Dashboard Components**: Main dashboard views for different functionality areas
- **Trading Components**: Real-time trading interfaces and cryptocurrency data
- **Analytics Components**: Data visualization and analysis tools
- **Settings Components**: User preferences and configuration interfaces
- **Wallet Components**: Cryptocurrency wallet connection and management

### UI Components

All UI components are built using the shadcn/ui library, which provides a consistent design system based on Radix UI and Tailwind CSS.

### Custom Hooks

- **useIsMobile**: Detects and responds to mobile screen sizes
- **useTheme**: Manages theme state (light/dark mode)

## State Management

The application uses a combination of:

1. **Local Component State**: Using React's `useState` hook for component-specific state
2. **Custom Hooks**: For shared state logic
3. **Context API**: For global state that needs to be accessed across multiple components
4. **URL State**: For persisting selected views and filters in the URL

## Naming Conventions

The codebase follows these naming conventions:

- **Files & Components**: PascalCase for component names (e.g., `RealTimeTrading.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useMobile.ts`)
- **Services**: camelCase (e.g., `priceMonitoring.ts`)
- **Types**: PascalCase for interfaces and types (e.g., `WalletProvider`)

## Code Organization Principles

1. **Component Composition**: Complex UI elements are composed from smaller, reusable components
2. **Single Responsibility**: Each component has a focused purpose
3. **Type Safety**: Comprehensive TypeScript types for all components and functions
4. **Error Handling**: Centralized error handling with meaningful user feedback
5. **Responsive Design**: All components adapt to different screen sizes

## Optimization Techniques

1. **Code Splitting**: Components are organized for easy code splitting
2. **Memoization**: React.memo and useMemo for expensive calculations
3. **Virtualization**: For rendering large data sets efficiently
4. **Lazy Loading**: For non-critical components
5. **Debouncing**: For search inputs and other frequent user interactions

This structure allows for maintainable, scalable development while keeping the codebase organized and easy to navigate.
