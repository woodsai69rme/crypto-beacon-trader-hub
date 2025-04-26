
# Developer Technical Guide

## Architecture Overview
The Crypto Dashboard is built using the following technologies:
- **React**: Component library for UI
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built UI components
- **React Query**: Data fetching and state management
- **React Router**: Navigation
- **Recharts**: Chart visualization
- **Lucide React**: Icon library

## Component Structure Updates
The application includes these components:

### Trading Components
- **TradingForm**: Execute buy/sell trades with multi-currency support (USD/AUD)
- **TradingHoldings**: View portfolio holdings with real-time valuations
- **TradeHistory**: Track trade history and performance
- **MarketDepthChart**: Order book visualization
- **TradingPairComparison**: Compare trading pairs

### Portfolio Components
- **PortfolioAnalytics**: Portfolio performance metrics
- **TransactionHistory**: Trade history tracking
- **RiskAssessment**: Portfolio risk analysis

### Analysis Components
- **AiInsightsCategorized**: Categorized AI-powered market insights with trends, signals, alerts, and predictions
- **TechnicalIndicators**: Advanced technical analysis tools including RSI, MACD, Moving Averages, and Bollinger Bands
- **MarketCorrelations**: Asset correlation analysis with visualizations and portfolio diversification recommendations
- **SentimentAnalysis**: Market sentiment tracking

## Multi-Currency Support
The application supports multiple currencies:

### Currency Features
- **Toggle between USD and AUD**: Users can switch their preferred currency
- **Real-time Exchange Rates**: Integration with Exchange Rate API
- **Currency Conversion**: Automatic conversion of crypto prices and portfolio values
- **Persistent Preference**: User's currency choice is saved in local storage

### Currency Implementation
- **CurrencyApi Service**: Fetches latest exchange rates
- **Trading Components**: All trading interfaces adapted for multi-currency
- **Formatters**: Currency formatting utilities supporting multiple currencies
- **Type Definitions**: Updated to include currency information

## State Management
The application uses multiple strategies for state management:

### Server State
- **React Query**: For all API data fetching, caching, and synchronization
  ```typescript
  const { data, isLoading, error } = useQuery({
    queryKey: ['coins', coinId],
    queryFn: () => fetchCoinData(coinId),
    staleTime: 60000, // 1 minute
  });
  ```

### Global UI State
- **React Context**: For application-wide state like theme and authentication
  ```typescript
  // Access theme context
  const { theme, setTheme } = useTheme();
  
  // Access auth context
  const { user, login, logout } = useAuth();
  ```

### Component-specific State
- **React useState/useReducer**: For local component state
  ```typescript
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M'>('1D');
  ```

### Persistent State
- **LocalStorage**: For persisting user preferences between sessions
  ```typescript
  const [savedCoins, setSavedCoins] = useLocalStorage<string[]>('watchlist', []);
  ```

## Data Flow
1. **API Layer**: Services in `/services` handle all API communication
2. **Data Fetching**: Components use React Query hooks to request data
3. **Component Rendering**: Components render based on the data and loading states
4. **User Interaction**: Event handlers update state accordingly
5. **State Updates**: Components re-render based on state changes

## External APIs Integration
The application integrates with several free APIs:

### Cryptocurrency Data
- **CoinGecko API**: For cryptocurrency market data
  - Endpoints: `/coins/markets`, `/coins/{id}`, `/search`, `/coins/{id}/market_chart`
  - Features: Top coins, search, historical data, market info

### Exchange Rate Data
- **Exchange Rate API**: For currency conversion
  - Endpoint: `/latest`
  - Features: USD to AUD conversion rates

### Future API Integrations
- **CryptoCompare API**: For additional market data and social stats
- **Alternative.me Fear & Greed Index**: For market sentiment data
- **Messari API**: For cryptocurrency fundamentals

## Market Correlations Implementation
The correlation analysis system offers:
- **Correlation Matrix**: Visual heatmap of correlations between assets
- **Correlation Strength Classification**: Strong to weak, positive and negative correlations
- **Time Period Selection**: Adjustable time periods (7D, 30D, 90D) for correlation calculation
- **Detailed Analysis**: In-depth correlation insights for selected assets
- **Educational Content**: Help documentation explaining correlation concepts
- **Custom Heatmap**: Implementation of heatmap visualization using Recharts primitives

## Technical Indicators Implementation
The technical analysis tools include:
- **Multiple Indicator Support**: RSI, MACD, Moving Averages, Bollinger Bands
- **Interactive Charts**: Users can hover for detailed values
- **Timeframe Selection**: Multiple timeframe options (1D to 1Y)
- **Coin Selection**: Analysis available for all supported cryptocurrencies
- **Visual Indicators**: Clear visual representation of indicator values

## AI Market Insights Implementation
The AI-powered market insights system uses:
- **Categorization**: Insights are categorized as trends, signals, alerts, or predictions
- **Confidence Scoring**: Each insight includes a confidence score (0-100%)
- **Impact Assessment**: Insights are tagged with impact levels (high/medium/low)
- **Tag System**: Insights can be filtered by tags
- **Coin Association**: Insights are associated with specific cryptocurrencies
- **Refresh Mechanism**: Users can trigger refreshes for the latest analysis

## Responsive Design Approach
The application uses Tailwind's responsive classes with these breakpoints:
- Mobile: < 640px (`sm:`)
- Tablet: 640px - 1023px (`md:`, `lg:`)
- Desktop: 1024px+ (`lg:`, `xl:`, `2xl:`)

Example responsive component:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content adapts to screen size */}
</div>
```

## Custom Hooks
The application includes several custom hooks to abstract common functionality:

### useMediaQuery
Detects if a media query matches:
```typescript
const isMobile = useMediaQuery('(max-width: 640px)');
```

### useLocalStorage
Persists state in localStorage:
```typescript
const [theme, setTheme] = useLocalStorage('theme', 'dark');
```

### useCurrencyConverter
Handles currency conversion throughout the app:
```typescript
const { convert, formatValue } = useCurrencyConverter('USD');
```

## Error Handling Strategy
1. **API Error Handling**: React Query's error states
   ```typescript
   const { error, isError } = useQuery({...});
   
   if (isError) {
     return <ErrorMessage error={error} />;
   }
   ```

2. **Global Error Boundary**: For catching unexpected errors
   ```jsx
   <ErrorBoundary fallback={<ErrorPage />}>
     <App />
   </ErrorBoundary>
   ```

3. **Fallback Data**: Using mock data when APIs fail
   ```typescript
   // Return mock data as fallback
   return getMockCryptoData(limit);
   ```

## Performance Optimization Techniques
- **Code Splitting**: Using React.lazy for component-level code splitting
- **Memoization**: Using React.memo, useMemo, and useCallback for expensive computations
- **Virtualization**: For rendering large lists efficiently
- **Image Optimization**: Proper sizing, lazy loading, and modern formats
- **Bundle Optimization**: Tree shaking and chunk optimization

## Future Development Recommendations

### Social Trading Features
- **Copy Trading**: Allow users to follow and copy successful traders
- **Trading Leaderboards**: Showcase top-performing traders
- **Trading Signals**: Implement a system for sharing trading signals

### Advanced Data Analytics
- **Machine Learning Predictions**: Implement ML models for price prediction
- **Pattern Recognition**: Automatic chart pattern detection
- **Anomaly Detection**: Alert users to unusual market movements

### Mobile App Development
- **React Native Implementation**: Develop a mobile version using React Native
- **Push Notifications**: Real-time alerts for price movements
- **Biometric Authentication**: Secure login with fingerprint/face ID

### Additional Exchange Integrations
- **API Connectors**: Connect to major exchanges like Binance, Coinbase
- **Real Trading**: Allow users to execute real trades via exchange APIs
- **Order Book Visualization**: Live order book data from exchanges

## Building New Features
When adding new features:
1. **Plan Component Structure**: Determine where in the component hierarchy it belongs
2. **Design Data Flow**: How will data move through the application
3. **Implement UI Components**: Create necessary UI components
4. **Connect Data Sources**: Integrate with APIs or state
5. **Add Tests**: Ensure feature reliability
6. **Document**: Update relevant documentation

## Best Practices
- Keep components small and focused
- Use TypeScript for type safety
- Implement responsive design for all features
- Follow accessibility guidelines
- Use React Query for data fetching and caching
- Prefer functional components with hooks over class components
- Extract reusable logic to custom hooks
- Optimize rendering performance with memoization
