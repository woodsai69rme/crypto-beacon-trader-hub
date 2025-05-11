
# Developer Guide for Lovable Trading Platform

## Architecture Overview

The Lovable Trading Platform is built using a modern front-end stack with a component-based architecture designed for scalability, maintainability, and performance.

### Technology Stack

- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks and context
- **Data Fetching**: Tanstack Query (React Query)
- **Charting**: Recharts for data visualization
- **Icons**: Lucide React

### Project Structure

```
src/
├── components/     # UI components
│   ├── api/        # API-related components
│   ├── analytics/  # Analytics components
│   ├── dashboard/  # Dashboard components
│   ├── trading/    # Trading components
│   ├── ui/         # Shadcn UI components
│   └── ...
├── contexts/       # React context providers
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
├── services/       # API services
├── types/          # TypeScript type definitions
└── docs/           # Documentation
```

## Component Design Philosophy

The platform follows these key principles:

1. **Component Reusability**: Components are designed to be reusable across different parts of the application
2. **Separation of Concerns**: Each component has a single responsibility
3. **Composition over Inheritance**: Complex UIs are built by composing smaller components
4. **Type Safety**: TypeScript is used throughout for type checking and better developer experience

## Key Components

### Dashboard Components

The dashboard is built using a widget-based system with these key components:

- `Dashboard`: Main container component that manages the layout
- `WidgetGrid`: Manages the grid layout of widgets
- `Widget`: Base widget component that renders different widget types
- `CustomizableDashboard`: Allows users to add, remove, and position widgets

### Trading Components

Trading functionality is implemented through:

- `RealTimeTrader`: Main trading interface
- `TradingChart`: Interactive price chart with indicators
- `OrderBook`: Displays market depth
- `WalletConnection`: Handles wallet integration
- `TradingForm`: Form for executing trades

### API Integration Components

API management is handled by:

- `ApiProviderManagement`: Manages API provider configuration
- `ApiUsageMetrics`: Displays API usage statistics
- `RealTimeApiUsage`: Real-time monitoring of API calls

### Analytics Components

Advanced analytics are provided through:

- `LiveAnalyticsDashboard`: Real-time analytics dashboard
- `DetachableDashboard`: Detachable version for multi-monitor setups
- `MarketCorrelations`: Market correlation visualization
- `AiTradingDashboard`: AI-powered trading interface

## Working with APIs

### Adding a New API Provider

To add support for a new API provider:

1. Extend the `ApiProvider` interface in `types/trading.ts`
2. Create service functions in a dedicated file under `services/`
3. Update `ApiProviderManagement` component to include the new provider
4. Add required authentication and endpoint configuration
5. Implement rate limiting and usage tracking

Example service implementation:

```typescript
import { ApiProvider } from '@/types/trading';

export const fetchDataFromNewProvider = async (endpoint: string, params: any) => {
  const apiKey = getApiKey('new-provider');
  const url = buildUrl('new-provider', endpoint, params);
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
};
```

### API Usage Tracking

API calls are tracked using:

- Request counting per endpoint
- Rate limit monitoring
- Usage metrics visualization

## State Management

The application uses a combination of:

- React Context for global state
- React Query for server state
- React useState and useReducer for component state
- Custom hooks for shared logic

### Core Context Providers

- `ThemeContext`: Manages theme settings
- `UIContext`: Manages UI state
- `CryptoDataContext`: Provides cryptocurrency data
- `WalletContext`: Manages wallet connections

## Adding New Features

### Creating a New Widget

To add a new widget type:

1. Add the new widget type to the `WidgetType` enum in `types/trading.ts`
2. Create a new component for the widget content
3. Update `WidgetComponent` to render the new widget type
4. Add the widget to the available options in `AddWidgetDialog`

### Implementing a New Chart Type

To add a new visualization:

1. Create a new component using Recharts
2. Define the data structure and props interface
3. Implement data transformation logic
4. Add to the appropriate parent component

## Testing

### Component Testing

Components should be tested using:

- Unit tests for business logic
- Component tests with React Testing Library
- Snapshot tests for UI stability

### Performance Testing

Monitor and optimize performance:

- Use React DevTools Profiler
- Watch for unnecessary re-renders
- Implement memoization where beneficial
- Virtualize long lists

## Best Practices

### Code Style

- Use functional components with hooks
- Prefer named exports
- Group related files in feature folders
- Use explicit return types for functions
- Document complex logic with comments

### Performance Optimization

- Memoize expensive calculations
- Use virtualization for long lists
- Implement lazy loading for components
- Optimize re-renders with React.memo and useMemo
- Use windowing techniques for large datasets

### Accessibility

- Ensure all interactive elements are keyboard accessible
- Use semantic HTML elements
- Include proper ARIA attributes
- Maintain sufficient color contrast
- Test with screen readers

### Error Handling

- Implement error boundaries for component failures
- Use try/catch for API calls
- Display user-friendly error messages
- Log errors for debugging
- Gracefully degrade functionality when services are unavailable

## Deployment

The platform can be deployed using:

- Static hosting (Netlify, Vercel)
- Docker containers
- Traditional web servers

Refer to the Deployment Guide for detailed instructions.

## Contributing

When contributing to the codebase:

1. Follow the established code style
2. Write tests for new functionality
3. Update documentation
4. Ensure accessibility requirements are met
5. Test across different browsers and devices

This developer guide provides a high-level overview of the platform's architecture and development practices. For more detailed information, refer to specific component documentation and code comments.
