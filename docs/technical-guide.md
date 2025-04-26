
# Developer Technical Guide

## Architecture Overview
The Crypto Dashboard is built using modern frontend technologies:
- React with TypeScript
- Tailwind CSS for styling
- Shadcn/UI for components
- React Query for data management
- Recharts for visualizations

## Component Structure Updates

### Dashboard Organization
- **CustomizableDashboard**: User-configurable widget system
  - WidgetGrid: Responsive grid layout for widgets
  - WidgetList: Widget management interface
  - Individual widget components

### Trading Components
- **TradingForm**: Execute trades with multi-currency support
- **TradingHoldings**: Portfolio holdings with real-time valuation
- **MultiExchangeTrading**: Cross-exchange trading capabilities
- **ApiKeyManagement**: Exchange API key management
- **PortfolioHistoryChart**: Historical performance visualization
- **EnhancedAlertSystem**: Advanced price, volume and technical alerts
- **SocialTradingFeatures**: Strategy sharing and community engagement

### AI Components
- **AiTradingBots**: Automated trading strategies
- **AiMarketAnalysis**: Market insights and predictions
- **MarketCorrelations**: Asset correlation analysis
- **LocalModelTrading**: Integration with locally run AI models
- **BacktestingPanel**: Historical strategy testing

### Community Features
- **CommunityHub**: Social interaction platform
- **TradingEducation**: Educational resources
- **SignalSharing**: Trading signal distribution
- **SocialTradingFeatures**: Strategy sharing and collaboration

## AI Trading Bot Implementation
The application implements AI trading strategies with:

### Strategy Management
- **Predefined Strategies**: Collection of AI-powered trading strategies
- **Strategy Customization**: Users can modify parameters of existing strategies
- **Custom Strategy Builder**: Create completely custom trading strategies
- **Backtesting**: Test strategies against historical data
- **Strategy Optimization**: Fine-tune parameters for optimal performance
- **Performance Metrics**: Detailed statistics on strategy performance

### Bot Configuration
- **Risk Level Selection**: Low/medium/high risk profiles
- **Timeframe Options**: Multiple trading intervals (5m to 1w)
- **Parameter Customization**: Fine-tune strategy parameters
- **Trade Automation**: Set and forget trading with predefined rules

### Local AI Model Integration
- **Model Connection**: Connect to local LLMs and inference engines
- **Strategy Generation**: Generate strategies using local models
- **Privacy-Focused**: Keep trading data on your own device
- **Custom Model Support**: Support for various model architectures

## Enhanced Alert System
The application includes a comprehensive alert management system:

### Alert Types
- **Price Alerts**: Get notified when prices cross specified thresholds
- **Volume Alerts**: Monitor for volume spikes across different timeframes
- **Technical Indicator Alerts**: Be alerted when technical indicators reach specific levels

### Alert Management
- **Tabbed Interface**: Easily switch between different alert types
- **Alert Filtering**: Filter alerts by type or status
- **Recurring Alerts**: Set alerts that can trigger repeatedly
- **Notification Channels**: Configure app, email, or push notification delivery
- **Global Toggle**: Enable/disable all alerts with a single switch

## Backtesting System
The application implements a comprehensive backtesting system for strategy validation:

### Backtesting Features
- **Historical Data**: Test strategies against actual market data
- **Multiple Timeframes**: Validate strategies across different time intervals
- **Performance Metrics**: Calculate key metrics like win rate, profit factor, and drawdown
- **Capital Simulation**: Simulate starting with different capital amounts
- **Visual Progress**: Track backtesting progress with visual indicators

### Results Analysis
- **Detailed Metrics**: View comprehensive performance statistics
- **Card-Based Interface**: Easily digest key performance indicators
- **Performance Classification**: Automatic rating of strategy effectiveness
- **Historical Comparison**: Compare to benchmark market performance

## Strategy Optimization
The application includes an advanced strategy optimization engine:

### Optimization Features
- **Parameter Tuning**: Automatically fine-tune strategy parameters
- **Multi-Timeframe Testing**: Test across various market timeframes
- **Risk Adjustment**: Optimize risk-reward parameters
- **Visual Comparison**: Compare original vs. optimized parameters
- **Performance Impact**: Measure improvements in key metrics

### Optimization Interface
- **Settings Configuration**: Set optimization constraints and goals
- **Progress Tracking**: Visual progress indicator during optimization
- **Results Visualization**: Easy-to-understand performance improvements
- **Parameter Comparison**: Side-by-side view of original vs. optimized parameters
- **Apply Changes**: Seamlessly update strategies with optimized parameters

## Social Trading Features
The application includes comprehensive social trading capabilities:

### Strategy Sharing
- **Community Strategies**: Browse strategies shared by other traders
- **Strategy Details**: View detailed information about shared strategies
- **Performance Metrics**: See actual performance of shared strategies
- **Comments & Discussion**: Engage in discussions about strategies
- **Strategy Copying**: Copy strategies from other traders to your account

### Trading Signals
- **Community Signals**: Access trading signals from other traders and AI
- **Signal Details**: View comprehensive information about each signal
- **Confidence Metrics**: See the confidence level of each signal
- **Signal Filtering**: Filter signals by asset, timeframe, or source
- **Signal Discussion**: Discuss signal validity with community members

### Social Engagement
- **Top Traders**: Discover and follow successful traders
- **User Profiles**: View trader performance and shared content
- **Following System**: Follow traders to see their activity
- **Community Discussion**: Engage in various trading discussions
- **Portfolio Sharing**: Share your portfolio performance with the community

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

## Multi-Exchange Trading
The application supports trading across multiple exchanges:

### Exchange Features
- **Exchange Connection**: Securely connect to multiple exchanges
- **API Key Management**: Add, edit and remove exchange API keys
- **Cross-Exchange Trading**: Trade on different exchanges from one interface
- **Exchange Comparison**: Compare prices and liquidity across exchanges
- **Arbitrage Detection**: Find arbitrage opportunities between exchanges

### Exchange Implementation
- **API Integration**: Secure integration with exchange APIs
- **Key Storage**: Encrypted storage of API credentials
- **Trading Execution**: Unified interface for all connected exchanges
- **Balance Management**: View balances across all exchanges
- **Order Management**: Monitor orders across all exchanges

## Custom Strategy Builder
The application includes a comprehensive strategy building interface:

### Builder Features
- **Visual Builder**: Create strategies without coding
- **Parameter Configuration**: Fine-tune all strategy parameters
- **Indicator Selection**: Choose from common technical indicators
- **Risk Management**: Set stop-loss and take-profit levels
- **Strategy Testing**: Test custom strategies before deployment

### Strategy Templates
- **Predefined Templates**: Start with proven strategy templates
- **AI Generation**: Generate strategies using AI models
- **Template Customization**: Modify templates to your needs
- **Strategy Saving**: Save and manage multiple custom strategies
-  **Strategy Sharing**: Share successful strategies with the community

## Mobile Responsive Design
The application is fully responsive across all device sizes:

### Responsive Features
- **Adaptive Layout**: Layout adjusts based on screen size
- **Touch-Friendly Controls**: Larger touch targets on mobile devices
- **Simplified Navigation**: Streamlined navigation on smaller screens
- **Optimized Charts**: Charts optimized for touch interaction
- **Tab Condensation**: Intelligent tab management on small screens

### Responsive Implementation
- **Tailwind Breakpoints**: Uses Tailwind's responsive classes
- **Mobile-First Approach**: Designed mobile-first, then enhanced for larger screens
- **Conditional Rendering**: Different components rendered based on screen size
- **Touch Events**: Support for touch events on mobile devices
- **Performance Optimization**: Optimized for mobile performance

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
- **Technical Alerts**: Set alerts based on indicator values and conditions

## AI Market Insights Implementation
The AI-powered market insights system uses:
- **Categorization**: Insights are categorized as trends, signals, alerts, or predictions
- **Confidence Scoring**: Each insight includes a confidence score (0-100%)
- **Impact Assessment**: Insights are tagged with impact levels (high/medium/low)
- **Tag System**: Insights can be filtered by tags
- **Coin Association**: Insights are associated with specific cryptocurrencies
- **Refresh Mechanism**: Users can trigger refreshes for the latest analysis
- **Local AI Integration**: Option to use locally running AI models for analysis

## Trading Education Features
The trading education system includes:
- **Course Library**: Educational content for traders of all levels
- **Trading Signals**: Expert and AI-generated trading recommendations
- **Confidence Ratings**: Signal reliability indicators
- **Time-based Filters**: Filter signals by time horizon
- **Interactive Learning**: Hands-on learning experiences

## Community Hub Implementation
The community features provide:
- **Discussion Forums**: Topic-based conversation areas
- **Trading Lounge**: Real-time trader chat
- **Social Sharing**: Ability to share portfolio and analysis
- **Expert Analysis**: Community-contributed market insights
- **Signal Sharing**: Trading signal distribution among community
- **Strategy Sharing**: Share and discover trading strategies
- **Performance Metrics**: View performance of shared strategies

## Local Model Integration
The local model integration features include:
- **Model Connection**: Connect to models running on your local machine
- **Model Selection**: Choose from detected local models
- **Strategy Generation**: Generate trading strategies using local models
- **Customization**: Customize generated strategies
- **Local Inference**: Run predictions and analysis locally
- **Privacy Focused**: Keep your trading data private
- **Multi-Model Support**: Connect to multiple local models simultaneously

## Enhanced Alert System
The advanced alert system offers:
- **Price Alerts**: Alert when price crosses threshold
- **Volume Alerts**: Alert on volume spikes
- **Technical Alerts**: Alert on technical indicator conditions
- **Recurring Alerts**: Alerts that can trigger multiple times
- **Multi-Channel Notifications**: App, email, and push notifications
- **Global Toggle**: Enable/disable all alerts at once
- **Alert Management**: Filter and organize alerts

## Customizable Dashboard
The dashboard customization system offers:
- **Widget Selection**: Users can choose which widgets to display
- **Layout Customization**: Drag-and-drop interface for arranging widgets
- **Size Adjustment**: Resize widgets based on importance
- **Layout Persistence**: Save and load custom layouts
- **Responsive Design**: Layouts adjust to screen sizes

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

### useMediaQuery / useIsMobile
Detects if a media query matches:
```typescript
const isMobile = useIsMobile();
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

### useTradingPortfolio
Manages trading functionality:
```typescript
const { 
  trades, 
  balance, 
  handleExecuteTrade 
} = useTradingPortfolio();
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

4. **Toast Notifications**: Informing users about errors
   ```typescript
   toast({
     title: "Error",
     description: "Failed to fetch data. Using cached data instead.",
     variant: "destructive",
   });
   ```

## Performance Optimization Techniques
- **Code Splitting**: Using React.lazy for component-level code splitting
- **Memoization**: Using React.memo, useMemo, and useCallback for expensive computations
- **Virtualization**: For rendering large lists efficiently
- **Image Optimization**: Proper sizing, lazy loading, and modern formats
- **Bundle Optimization**: Tree shaking and chunk optimization
- **Component Architecture**: Breaking large components into smaller, focused ones

## Recent Feature Implementations

### Backtesting System
- Comprehensive backtesting for trading strategies
- Historical data testing with customizable parameters
- Detailed performance metrics and visualizations

### Strategy Optimization
- Automatic parameter optimization for better performance
- Comparative analysis of original vs. optimized parameters
- Visual indicators of performance improvements

### Enhanced Alert System
- Multi-type alerts (price, volume, technical)
- Recurring alert functionality
- Multi-channel notifications

### Social Trading Features
- Strategy sharing and discovery
- Trading signal distribution
- Community discussion and engagement

### Custom Strategy Builder
- Visual strategy building interface
- Parameter customization
- Indicator selection and configuration

### Local Model Integration
- Connection to locally running AI models
- Privacy-focused analysis and predictions
- Custom strategy generation using local models

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
- Use proper error handling and fallback mechanisms
- Maintain consistent coding style and naming conventions
