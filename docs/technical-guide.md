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
- **SentimentAnalysis**: Market sentiment tracking
- **TechnicalIndicators**: Advanced technical analysis
- **MarketCorrelations**: Asset correlation analysis

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

## Testing Approach
- **Unit Tests**: For individual functions and components
- **Integration Tests**: For component interactions
- **E2E Tests**: For critical user flows
- **Testing Library**: React Testing Library for component tests
- **Mock Service Worker**: For API mocking

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
