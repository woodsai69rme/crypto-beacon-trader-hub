
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
The application now includes these additional components:

### Trading Components
- **FakeTrading**: Practice trading system with virtual balance
- **MarketDepthChart**: Order book visualization
- **TradingPairComparison**: Compare trading pairs
- **EnhancedCryptoChart**: Advanced charting capabilities

### Portfolio Components
- **PortfolioAnalytics**: Portfolio performance metrics
- **TransactionHistory**: Trade history tracking
- **RiskAssessment**: Portfolio risk analysis

### Analysis Components
- **AiInsightsCategorized**: Categorized AI-powered market insights with trends, signals, alerts, and predictions
- **TechnicalIndicators**: Advanced technical analysis tools including RSI, MACD, Moving Averages, and Bollinger Bands
- **MarketCorrelations**: Asset correlation analysis
- **SentimentAnalysis**: Market sentiment tracking

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

## Component Architecture
The application follows a modular component architecture:

### Dashboard Framework
- **Dashboard**: Main container component that manages navigation and layout
- **DashboardTabList**: Navigation tabs for different dashboard sections
- **DashboardHeader**: Top bar with user info, notifications, and global actions

### Dashboard Section Components
Each dashboard section is encapsulated in its own component:
- **DashboardOverview**
- **DashboardPortfolio**
- **DashboardWatchlist**
- **DashboardTrading**
- **DashboardAnalysis**
- **DashboardTools**

### Feature Components
Feature-specific components that are used within dashboard sections:
- **AiInsightsCategorized**: AI-powered market analysis categorized by type
- **TechnicalIndicators**: Technical analysis charts and indicators
- **MarketCorrelations**: Asset correlation visualization
- **FakeTrading**: Practice trading system
- **RiskAssessment**: Portfolio risk analysis tools

### UI Components
Reusable UI components from shadcn and custom implementations:
- **Card**: Container for grouped content
- **Button**: Interactive triggers for actions
- **Tabs**: Organize content into tabbed interfaces
- **Select**: Dropdown selection menus
- **Charts**: Various chart types using Recharts

## AI Market Insights Implementation
The AI-powered market insights system uses:
- **Categorization**: Insights are categorized as trends, signals, alerts, or predictions
- **Confidence Scoring**: Each insight includes a confidence score (0-100%)
- **Impact Assessment**: Insights are tagged with impact levels (high/medium/low)
- **Tag System**: Insights can be filtered by tags
- **Coin Association**: Insights are associated with specific cryptocurrencies
- **Refresh Mechanism**: Users can trigger refreshes for the latest analysis

## Technical Indicators Implementation
The technical analysis tools include:
- **Multiple Indicator Support**: RSI, MACD, Moving Averages, Bollinger Bands
- **Interactive Charts**: Users can hover for detailed values
- **Timeframe Selection**: Multiple timeframe options (1D to 1Y)
- **Coin Selection**: Analysis available for all supported cryptocurrencies
- **Visual Indicators**: Clear visual representation of indicator values

## Market Correlations Features
The correlation analysis system offers:
- **Correlation Matrix**: Visual heatmap of correlations between assets
- **Correlation Strength Classification**: Strong to weak, positive and negative
- **Time Period Selection**: Adjustable time periods for correlation calculation
- **Interactive Data**: Detailed information on hover
- **Educational Content**: Help tooltips explaining correlation concepts

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

### useToast
Shows toast notifications:
```typescript
const { toast } = useToast();
toast({
  title: "Success",
  description: "Your settings have been saved."
});
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

3. **Form Validation**: Using Zod schemas with React Hook Form
   ```typescript
   const schema = z.object({
     email: z.string().email(),
     password: z.string().min(8)
   });
   ```

## Authentication Flow
1. User submits login credentials
2. API validates credentials and returns JWT token
3. Token is stored in secure, HttpOnly cookies
4. AuthContext updates with user information
5. Protected routes become accessible
6. Token refresh happens automatically before expiration

## Performance Optimization Techniques
- **Code Splitting**: Using React.lazy for component-level code splitting
- **Memoization**: Using React.memo, useMemo, and useCallback for expensive computations
- **Virtualization**: For rendering large lists efficiently
- **Image Optimization**: Proper sizing, lazy loading, and modern formats
- **Bundle Optimization**: Tree shaking and chunk optimization

## Advanced Features Implementation

### AI Market Insights
The AI-powered market insights system is implemented with:
- **Categorization Logic**: Algorithm to classify insights into trends, signals, alerts, and predictions
- **Confidence Calculation**: Statistical model for determining insight confidence
- **Impact Assessment**: Heuristic evaluation for high/medium/low impact
- **Data Sources**: Integration with multiple data providers for comprehensive analysis
- **Update Mechanism**: Periodic background updates with manual refresh option

### Technical Indicators
The technical analysis tools are implemented using:
- **Calculation Functions**: Pure functions for computing indicator values
- **Data Processing**: Functions to transform raw price data into indicator data
- **Visualization Components**: Chart components using Recharts library
- **Interactive Elements**: Tooltips and hover states for detailed information
- **Timeframe Management**: Logic for adjusting calculations based on selected timeframe

### Market Correlations
The correlation analysis system is built with:
- **Correlation Algorithm**: Pearson correlation coefficient calculation
- **Heatmap Visualization**: Custom styling for correlation matrix display
- **Interpretation Logic**: Functions to classify and explain correlation values
- **Period Selection**: Logic for adjusting the time window for correlation calculation
- **Educational Elements**: Context-sensitive help for understanding correlation concepts

## Building New Features
When adding new features:
1. **Plan Component Structure**: Determine where in the component hierarchy it belongs
2. **Design Data Flow**: How will data move through the application
3. **Implement UI Components**: Create necessary UI components
4. **Connect Data Sources**: Integrate with APIs or state
5. **Add Tests**: Ensure feature reliability
6. **Document**: Update relevant documentation

## Debugging Tips
- Use React DevTools for component inspection
- Use the Network tab to debug API requests
- Add strategic `console.log` statements (remove before production)
- Use React Query DevTools for data fetching insights
- Use the Elements panel to debug layout issues

## Common Pitfalls
- **Prop Drilling**: Use Context or composition for deeply nested props
- **Memory Leaks**: Properly clean up effects and subscriptions
- **Unnecessary Re-renders**: Use memoization and proper dependency arrays
- **API Race Conditions**: Use React Query's built-in request deduplication
- **Layout Shifts**: Set explicit dimensions for async-loaded content

## Code Style and Conventions
- **File Naming**: PascalCase for components, camelCase for utilities
- **Component Structure**: Props interface, then component function, then exports
- **Imports Order**: React, external libraries, internal modules, styles
- **CSS Approach**: Tailwind CSS utility classes, minimal custom CSS

## Best Practices
- Keep components small and focused
- Use TypeScript for type safety
- Implement responsive design for all features
- Follow accessibility guidelines
- Use React Query for data fetching and caching
- Prefer functional components with hooks over class components
- Extract reusable logic to custom hooks
- Optimize rendering performance with memoization
