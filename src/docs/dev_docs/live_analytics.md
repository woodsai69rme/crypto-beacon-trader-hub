
# Live Analytics Dashboard - Developer Documentation

## Overview

The Live Analytics Dashboard is a feature-rich component that provides real-time market data and trading metrics. It includes a detachable mode that allows users to open the dashboard in a larger view, making it ideal for professional traders who need to monitor multiple metrics simultaneously.

## Architecture

The Live Analytics Dashboard is built using a modular approach with the following key components:

1. **DetachedAiTradingDashboard**: Main container component that manages the detached state
2. **LivePriceMetrics**: Displays real-time price information for the selected cryptocurrency
3. **ApiUsageMetrics**: Shows API usage statistics and limits
4. **RealTimeApiUsage**: Provides detailed API usage analytics
5. **MarketCorrelations**: Visualizes correlations between different cryptocurrencies

## Component Hierarchy

```
DetachedAiTradingDashboard
├── LivePriceMetrics
├── ApiUsageMetrics
├── RealTimeApiUsage
└── MarketCorrelations
    ├── CorrelationAnalysis
    ├── CorrelationMatrix
    └── PriceCorrelationChart
```

## Key Files

- `src/components/analytics/DetachedAiTradingDashboard.tsx`: Main dashboard container
- `src/components/analytics/LivePriceMetrics.tsx`: Real-time price metrics component
- `src/components/api/ApiUsageMetrics.tsx`: API usage metrics component
- `src/components/api/RealTimeApiUsage.tsx`: Detailed API usage monitoring
- `src/components/MarketCorrelations/MarketCorrelations.tsx`: Market correlations visualization

## Data Flow

1. Market data is fetched from API endpoints (currently using mock data)
2. Updates are processed and displayed in real-time
3. User interactions (like changing timeframes) trigger data refreshes
4. The detached state is managed through React state and dialog components

## State Management

The dashboard uses React state for managing:
- Detached mode state
- Selected cryptocurrency
- Timeframe selection
- API usage metrics

## Key Props and Interfaces

### DetachableDashboardProps
```typescript
export interface DetachableDashboardProps {
  isDetached: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
```

### LivePriceMetricsProps
```typescript
interface LivePriceMetricsProps {
  coin: CoinOption;
  lastUpdated: Date;
}
```

### ApiUsageMetricsProps
```typescript
interface ApiUsageMetricsProps {
  data: ApiUsageStats[];
  onRefresh: () => void;
}
```

## Usage Example

```tsx
import React, { useState } from 'react';
import DetachedAiTradingDashboard from '@/components/analytics/DetachedAiTradingDashboard';
import LivePriceMetrics from '@/components/analytics/LivePriceMetrics';
import ApiUsageMetrics from '@/components/api/ApiUsageMetrics';

const TradingPage = () => {
  const [isDetached, setIsDetached] = useState(false);
  
  return (
    <div>
      <button onClick={() => setIsDetached(true)}>
        Open Analytics Dashboard
      </button>
      
      <DetachedAiTradingDashboard 
        isDetached={isDetached}
        onClose={() => setIsDetached(false)}
      >
        <LivePriceMetrics 
          coin={selectedCoin}
          lastUpdated={new Date()}
        />
        
        <ApiUsageMetrics
          data={apiUsageData}
          onRefresh={handleRefresh}
        />
      </DetachedAiTradingDashboard>
    </div>
  );
};
```

## Event Handling

The dashboard handles the following events:

1. **Detach/Attach**: Toggle between embedded and detached modes
2. **Refresh Data**: Update API usage and price metrics
3. **Timeframe Selection**: Change the data timeframe for analysis
4. **Close**: Close the detached dashboard and return to normal view

## API Integration

The Live Analytics Dashboard integrates with the following APIs:

1. **Price Data API**: Fetches current and historical price data
2. **Volume Data API**: Gets trading volume information
3. **API Usage Metrics**: Monitors API rate limits and usage
4. **Market Correlation Data**: Computes and retrieves market correlations

## Performance Considerations

To ensure optimal performance:

1. Data updates are throttled to avoid excessive API calls
2. Lazy loading is used for heavy components when in detached mode
3. Memoization is applied to expensive calculations
4. Charts use efficient rendering techniques

## Styling

The dashboard uses Tailwind CSS for styling with the following key considerations:

1. Responsive design with grid and flex layouts
2. Dark/light mode compatibility
3. Consistent color scheme for data visualization
4. Accessible contrast ratios for all text elements

## Testing

For testing the Live Analytics Dashboard:

1. Unit tests for individual metric components
2. Integration tests for data flow between components
3. UI tests for responsiveness and interactions
4. Mock data providers for consistent test scenarios

## Future Improvements

Planned enhancements for the Live Analytics Dashboard:

1. More chart visualization options
2. Advanced filtering capabilities
3. Custom dashboard layouts that persist between sessions
4. Real-time alerts based on analytics thresholds
5. Export functionality for analytics data

## Troubleshooting

Common issues and solutions:

1. **Dashboard doesn't update**: Check that real-time data fetching is enabled
2. **Charts not rendering**: Verify that the container has a valid size
3. **Detached mode not working**: Ensure Dialog components are properly configured
4. **API metrics showing errors**: Confirm API keys and rate limits are correctly set
