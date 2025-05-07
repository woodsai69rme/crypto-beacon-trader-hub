
# Live Analytics Dashboard - Developer Documentation

## Overview

The Live Analytics Dashboard is a real-time analytics component that provides traders with up-to-the-second market data, technical indicators, and trading signals. The component features a detachable/pop-out functionality, allowing users to place it on a separate monitor for enhanced trading workflow.

## Architecture

The Live Analytics Dashboard is built as a standalone React component that can be embedded within other components or used independently. It follows a modular design pattern with the following structure:

```
src/
  components/
    analytics/
      LiveAnalyticsDashboard.tsx      # Main component with detachable UI
      LiveAnalyticsContent.tsx        # Core analytics content (extracted for reuse)
      MetricCard.tsx                  # Individual metric display component
      AnalyticsChart.tsx              # Chart visualization component
      AlertsList.tsx                  # Trading alerts component
```

## Key Components

### LiveAnalyticsDashboard

The primary container component that manages:
- Detachable/pop-out functionality
- Data refresh cycles
- Layout and general state

### LiveAnalyticsContent

Reusable content component that displays:
- Asset selection
- Price and volume charts
- Market metrics
- Alert systems

## Data Flow

1. **Real-time Data Sources**: The dashboard connects to multiple data sources through WebSockets and REST APIs.
2. **Data Refreshing**: Data is automatically refreshed at configurable intervals (default: 15 seconds).
3. **State Management**: Component maintains internal state for UI and combines it with external data.
4. **Event Handling**: Responds to user interactions for filtering, asset selection, and customization.

## WebSocket Integration

The dashboard integrates with the platform's WebSocket service for real-time updates:

```typescript
// Example WebSocket subscription
useEffect(() => {
  const unsubscribe = webSocketService.subscribe(
    'binance',
    'ticker',
    selectedCoin,
    (data) => {
      updatePriceData(data);
    }
  );
  
  return () => unsubscribe();
}, [selectedCoin]);
```

## Performance Optimization

The Live Analytics Dashboard implements several performance optimizations:

1. **Memoization**: Heavy calculations and component rendering are memoized using `React.memo` and `useMemo`.
2. **Throttling**: Data updates are throttled to prevent excessive re-renders.
3. **Virtualization**: Large data lists use virtualization for efficient rendering.
4. **Suspense**: Lazy loading is used for non-critical components.

## Detachable UI Implementation

The detachable functionality is implemented using React's Portal API and Dialog component:

```typescript
// When detached mode is active
return (
  <Dialog open={isDetached} onOpenChange={setIsDetached} modal={false}>
    <DialogContent className="max-w-5xl h-[90vh] p-0">
      {/* Dashboard content */}
    </DialogContent>
  </Dialog>
);
```

This creates a floating window that users can position anywhere on their screen or drag to a secondary monitor.

## API Integration

### Required Endpoints

The dashboard consumes the following API endpoints:

1. `/api/market/price/{symbol}` - Real-time price data
2. `/api/market/metrics` - Market-wide metrics
3. `/api/alerts/active` - User-configured price alerts
4. `/api/signals/{symbol}` - Trading signals for selected asset

### Response Formats

Example price data response:
```json
{
  "symbol": "BTC",
  "price": 65432.10,
  "changePercent": 2.3,
  "volume": 28000000000,
  "timestamp": "2023-04-18T12:34:56Z"
}
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

## Usage Example

```tsx
import LiveAnalyticsDashboard from "@/components/analytics/LiveAnalyticsDashboard";

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

## Testing

The Live Analytics Dashboard has comprehensive test coverage:

1. **Unit Tests**: Testing individual component rendering and logic
2. **Integration Tests**: Testing component interaction and data flow
3. **Performance Tests**: Ensuring efficient rendering with large datasets
4. **Mock Services**: WebSocket and API services are mocked for reliable testing

## Known Limitations

1. **Browser Compatibility**: The detachable UI works best in modern browsers with Portal support.
2. **Performance**: High frequency updates may cause performance issues on less powerful devices.
3. **Multiple Instances**: Only one detached instance is supported at a time.

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

## Troubleshooting

### Common Issues

1. **Data Not Updating**: Check WebSocket connection status and subscription configuration.
2. **High CPU Usage**: Consider increasing refresh interval or reducing visible metrics.
3. **Detached Window Not Appearing**: Check browser permissions for popups and portals.

## Deployment Considerations

1. **API Rate Limits**: Be aware of data provider rate limits in production.
2. **WebSocket Connections**: Ensure proper connection management to avoid resource leaks.
3. **Browser Compatibility**: Test detachable functionality across target browsers.
