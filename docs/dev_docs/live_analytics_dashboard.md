
# Live Analytics Dashboard - Developer Documentation

## Overview

The Live Analytics Dashboard is a real-time analytics component that provides traders with up-to-the-second market data, technical indicators, and trading signals. The dashboard features a detachable/pop-out functionality, allowing users to place it on a separate monitor for enhanced trading workflow.

## Architecture

The Live Analytics Dashboard is built as a standalone React component that can be embedded within other components or used independently. It follows a modular design pattern with the following structure:

```
src/components/analytics/
  ├── LiveAnalyticsDashboard.tsx    # Main component with detachable UI
  ├── LivePriceMetrics.tsx          # Price and market metrics display
  ├── LiveMarketDepth.tsx           # Order book and market depth visualization
  ├── LiveActivityFeed.tsx          # Recent trades activity feed
  ├── LiveTechnicalIndicators.tsx   # Technical indicators panel
  └── LiveTradingSignals.tsx        # Trading signals and alerts
```

## Key Features

### Real-time Market Data
- Live price updates with change indicators
- Market depth visualization
- Recent trades activity feed
- Volume and market cap metrics

### Technical Analysis
- Multiple indicators (RSI, MACD, Moving Averages, etc.)
- Signal summary with buy/sell recommendations
- Multi-timeframe analysis

### Trading Signals
- AI-generated entry and exit points
- Pattern recognition alerts
- Confidence scoring for signals
- Timeframe-specific recommendations

### Detachable UI
- Pop-out functionality for multi-monitor setups
- Compact embedded view for dashboard integration
- State persistence between detached and embedded views

## Integration Points

The Live Analytics Dashboard can be integrated into various parts of the trading platform:

1. **Trading Dashboard**: Primary integration point as a tab in the main dashboard
2. **Trading Interface**: Can be linked from the trading interface for quick reference
3. **Alerts System**: Connected to the platform's alert system for notifications

## Data Flow

1. **Real-time Data Sources**: The dashboard connects to multiple data sources through WebSockets and REST APIs.
2. **Data Refreshing**: Data is automatically refreshed at configurable intervals (default: 15 seconds).
3. **State Management**: Component maintains internal state for UI and combines it with external data.
4. **Event Handling**: Responds to user interactions for filtering, asset selection, and customization.

## Usage Example

```tsx
// Basic usage
<LiveAnalyticsDashboard />

// With custom configuration
<LiveAnalyticsDashboard
  initialCoinId="ethereum"
  refreshInterval={5000}
  showDetailedView={true}
  onAlertTriggered={(alert) => console.log("Alert triggered:", alert)}
/>
```

## Configuration Options

The LiveAnalyticsDashboard component accepts the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialCoinId` | string | "bitcoin" | Initial cryptocurrency to display |
| `refreshInterval` | number | 15000 | Data refresh interval in milliseconds |
| `showDetailedView` | boolean | false | Whether to show expanded metrics |
| `onAlertTriggered` | function | undefined | Callback when alert is triggered |
| `darkMode` | boolean | undefined | Override theme setting |

## Performance Optimization

The Live Analytics Dashboard implements several performance optimizations:

1. **Memoization**: Heavy calculations and component rendering are memoized using `React.memo` and `useMemo`.
2. **Throttling**: Data updates are throttled to prevent excessive re-renders.
3. **Suspense**: Lazy loading is used for non-critical components.

## Detachable UI Implementation

The detachable functionality is implemented using React's Dialog component:

```tsx
// When detached mode is active
return (
  <Dialog open={isDetached} onOpenChange={setIsDetached} modal={false}>
    <DialogContent className="max-w-5xl h-[90vh] p-4 overflow-auto">
      {/* Dashboard content */}
    </DialogContent>
  </Dialog>
);
```

This creates a floating window that users can position anywhere on their screen or drag to a secondary monitor.

## Future Improvements

1. **Custom Metrics**: Allow users to define custom metrics and calculations.
2. **Advanced Filters**: Implement more sophisticated filtering capabilities.
3. **Correlation Analysis**: Add cross-asset correlation visualization.
4. **Export Functionality**: Enable exporting of analytics data and charts.
5. **Alert Creation**: Add UI for creating new alerts directly from the dashboard.

## Dependencies

- `@tanstack/react-query`: Data fetching and caching
- `recharts`: Data visualization
- `shadcn/ui`: UI components
- `lucide-react`: Icons
- `tailwindcss`: Styling
