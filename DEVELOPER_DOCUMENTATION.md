
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
- **Charts**: Recharts
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
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── pages/            # Page components
├── services/         # API services
├── styles/           # Global styles
└── types/            # TypeScript type definitions
```

## Core Components

### Dashboard Components

- `DashboardOverview`: Main dashboard view with market data and portfolio summary
- `DashboardHeader`: Header with navigation, search, and user controls
- `DashboardAnalysis`: Analysis dashboard with technical indicators and charts

### Trading Components

- `RealTimeTrading`: Live trading interface with price charts and order entry
- `AiTradingBots`: AI trading bot configuration and monitoring
- `LocalModelTrading`: Integration with local AI models for predictions
- `TradingPairComparison`: Compare trading pairs side by side

### Market Analysis

- `MarketCorrelations`: Analyze correlations between cryptocurrencies
- `TechnicalIndicators`: Display and configure technical indicators
- `SentimentAnalysis`: Track market sentiment from news and social media
- `QuantitativeAnalysis`: Advanced quantitative metrics

## State Management

The application uses React Context API for state management across different domains:

- `AiTradingContext`: Manages AI trading bots and strategies
- `AuthContext`: Handles user authentication and permissions
- `CurrencyContext`: Manages currency conversion and selection
- `ThemeContext`: Controls dark/light theme switching

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

The application uses TypeScript for type safety. Key type definitions can be found in `src/types/trading.d.ts` and include:

- `CryptoData`: Cryptocurrency market data
- `Trade`: Trading transaction
- `AITradingStrategy`: AI trading strategy configuration
- `LocalModel`: Local AI model definition

## UI Components

The application uses Shadcn UI components with Tailwind CSS for styling. Custom components build on this foundation to create domain-specific UI elements.

### Example Component Pattern

```typescript
interface ComponentProps {
  // Props definition
}

const ExampleComponent: React.FC<ComponentProps> = (props) => {
  // Component implementation
  
  return (
    <div className="tailwind-classes">
      {/* JSX */}
    </div>
  );
};

export default ExampleComponent;
```

## Adding New Features

### Creating a New Component

1. Create a new file in the appropriate directory
2. Define the component interface
3. Implement the component
4. Export the component
5. Import and use it where needed

### Adding a New API Integration

1. Add the endpoint to the appropriate service file
2. Create any necessary TypeScript interfaces
3. Implement the service method
4. Use the service in components

### Adding New Pages

1. Create a new page component
2. Add a route in the router configuration
3. Add navigation links to the new page

## Build and Deployment

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

## Common Patterns and Best Practices

### Data Fetching

Use TanStack Query for data fetching and caching:

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['coins', coinId],
  queryFn: () => cryptoApi.getCoinData(coinId),
});
```

### Form Handling

Use React Hook Form for form management:

```typescript
const form = useForm<FormValues>({
  defaultValues: {
    // Default values
  },
});

const onSubmit = (data: FormValues) => {
  // Handle form submission
};

return (
  <form onSubmit={form.handleSubmit(onSubmit)}>
    {/* Form fields */}
  </form>
);
```

### Responsive Design

Use Tailwind CSS responsive modifiers for adaptive layouts:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>
```

### Error Boundaries

Implement error boundaries around critical components:

```jsx
<ErrorBoundary fallback={<ErrorFallback />}>
  <CriticalComponent />
</ErrorBoundary>
```

## Performance Considerations

- Use React.memo for components that don't need frequent re-renders
- Implement virtualization for long lists
- Use code splitting for larger components
- Optimize images and assets
- Implement caching strategies for API calls

## Testing

### Component Testing

Use Jest and React Testing Library for component tests:

```typescript
test('renders component', () => {
  render(<Component />);
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});
```

### Integration Testing

Test component interactions using user-event:

```typescript
test('handles user interaction', async () => {
  render(<Component />);
  await userEvent.click(screen.getByText('Click Me'));
  expect(screen.getByText('Result')).toBeInTheDocument();
});
```

## Troubleshooting Common Issues

- **Type errors**: Ensure types are properly defined and imported
- **API errors**: Check network tab for response details
- **Rendering issues**: Verify component props and state
- **Performance issues**: Look for unnecessary re-renders

## Contributing Guidelines

1. Fork the repository
2. Create a feature branch
3. Make changes following the coding standards
4. Write tests
5. Submit a pull request

## API Documentation

Refer to the API documentation for detailed endpoint information.

## License

[License information would go here]
