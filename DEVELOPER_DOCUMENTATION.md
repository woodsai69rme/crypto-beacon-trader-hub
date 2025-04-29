# CryptoTrader Developer Documentation

## Architecture Overview

CryptoTrader is built on a modern React/TypeScript stack with a focus on component reusability, type safety, and responsive design. The application uses a client-side architecture with RESTful API integrations for market data and trading functionality.

### Tech Stack

- **Framework**: React with TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **State Management**: React Context API
- **Data Fetching**: TanStack Query
- **Charts**: Recharts, Nivo
- **Icons**: Lucide React
- **Build/Deploy**: Not specified (recommend GitHub Actions)

## Project Structure

```
src/
├── components/       # UI components
│   ├── api/          # API-related components
│   ├── dashboard/    # Dashboard components
│   ├── portfolio/    # Portfolio components
│   ├── settings/     # Settings components
│   ├── trading/      # Trading components
│   └── ui/           # Shadcn UI components
├── contexts/         # React contexts for state management
├── docs/             # Documentation
│   ├── developer/    # Developer documentation
│   ├── features/     # Feature documentation
│   └── user/         # User documentation
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── pages/            # Page components
├── services/         # API services
├── styles/           # Global styles
└── types/            # TypeScript type definitions
```

## Core Components

### Dashboard Components

- `Dashboard`: Main dashboard container with tab navigation
- `DashboardOverview`: Market overview with key metrics
- `DashboardPortfolio`: Portfolio management and performance tracking
- `DashboardTrading`: Trading interface with AI integration
- `DashboardAnalysis`: Technical and fundamental analysis tools
- `DashboardTools`: Utility tools for traders

### Trading Components

- `FakeTrading`: Simulated trading system for practice
- `RealTimeTrading`: Live trading interface with market data
- `AiTradingBots`: AI-powered trading bots with strategy selection
- `AiTradingDashboard`: Comprehensive AI trading dashboard
- `DetachedAiTradingDashboard`: Floating, resizable AI dashboard

### Theme System

- `ThemeProvider`: Context provider for theme state
- `ThemeSwitcher`: UI component for changing theme and color scheme
- Support for dark/light modes and multiple color schemes

## State Management

The application uses React Context API for state management across different domains:

- `AiTradingContext`: Manages AI trading bots and strategies
- `AuthContext`: Handles user authentication and permissions
- `CurrencyContext`: Manages currency conversion and selection
- `ThemeContext`: Controls dark/light theme switching and color schemes

## API Integration

### Service Pattern

API integrations use a service pattern with the following structure:

```typescript
// Example service
export const cryptoApi = {
  getMarketOverview: () => fetchApi<MarketOverviewData>("/market/overview"),
  getCoinData: (coinId: string) => fetchApi<CoinData>(`/coins/${coinId}`),
  // ... additional methods
};
```

### Error Handling

API errors are handled using a centralized error handler and displayed using toast notifications:

```typescript
try {
  const data = await cryptoApi.getCoinData(coinId);
  // Handle success
} catch (error) {
  console.error("API Error:", error);
  toast({
    title: "Error",
    description: "Failed to fetch coin data",
    variant: "destructive",
  });
}
```

## Type System

The application uses TypeScript for type safety. Key type definitions include:

- `CryptoData`: Cryptocurrency market data
- `Trade`: Trading transaction
- `AITradingStrategy`: AI trading strategy configuration
- `CoinOption`: Cryptocurrency option for selection
- `ApiProvider`: API provider configuration

## Theming System

### Theme Context

```typescript
interface ThemeContextType {
  theme: string;         // 'light' or 'dark'
  setTheme: (t: string) => void;
  colorScheme: string;   // 'default', 'blue', 'purple', etc.
  setColorScheme: (c: string) => void;
}
```

### CSS Implementation

Themes use CSS variables and Tailwind classes:

```css
:root {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  /* Other variables */
}

.light {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  /* Light theme overrides */
}

/* Color schemes */
.blue {
  --primary: 221 83% 53%;
}
```

## AI Trading System

### AI Bot Types

- **Trend Analyzer**: Follows market trends and momentum
- **Pattern Recognition**: Identifies chart patterns and formations
- **Sentiment Analyzer**: Analyzes news and social media sentiment
- **Quantum AI**: Advanced ML with multi-timeframe analysis

### Strategy Configuration

```typescript
type AITradingStrategy = {
  id: string;
  name: string;
  description: string;
  type: 'trend-following' | 'mean-reversion' | /* other types */;
  timeframe: string;
  parameters: any;
  performance?: {
    winRate?: number;
    profitFactor?: number;
    // Other metrics
  };
};
```

## Adding New Features

### Creating a New Component

1. Create a new file in the appropriate directory
2. Define the component interface
3. Implement the component
4. Export the component
5. Import and use it where needed

### Adding a New Theme or Color Scheme

1. Add CSS variables to the theme system
2. Update the `ThemeSwitcher` component options
3. Add the new theme class to the `ThemeContext` class handling

### Implementing a New AI Strategy

1. Define the strategy in the `AITradingStrategy` type
2. Add implementation to the AI trading service
3. Update the strategy selection UI
4. Implement performance tracking for the new strategy

## Best Practices

### Code Organization

- Keep components focused on a single responsibility
- Use TypeScript interfaces for all props and state
- Extract reusable logic to custom hooks
- Maintain consistent naming conventions

### Performance Optimization

- Use React.memo for pure components
- Implement virtualized lists for long data sets
- Optimize re-renders with useMemo and useCallback
- Lazy load components that aren't immediately needed

### Error Handling

- Implement error boundaries for component errors
- Use try/catch for asynchronous operations
- Display user-friendly error messages
- Log detailed errors for debugging

### Accessibility

- Ensure all interactive elements are keyboard accessible
- Maintain proper heading hierarchy
- Use ARIA attributes where appropriate
- Test with screen readers

## Testing Strategy

### Unit Tests

- Test individual components in isolation
- Mock API calls and context providers
- Verify component behavior with different props

### Integration Tests

- Test interactions between related components
- Verify context providers work correctly with consumers
- Test form submissions and data flow

### End-to-End Tests

- Test critical user flows
- Verify application behavior in realistic scenarios
- Test across different browsers and devices

## Deployment

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Conclusion

This documentation provides a comprehensive overview of the CryptoTrader application architecture, components, and development practices. For more detailed information about specific features, refer to the documentation in the `src/docs` directory.
