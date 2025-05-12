
# Implementation Guide

This guide is intended for developers who want to extend or modify the application. It provides an overview of the codebase structure, key design patterns, and implementation details.

## Project Structure

```
/src
  /components        # React components
    /ui              # UI components (shadcn/ui)
    /trading         # Trading-related components
    /settings        # Settings components
    /analytics       # Analytics components
    /tickers         # Ticker components
    /sidebar         # Sidebar components
  /contexts          # React contexts
  /hooks             # Custom React hooks
  /lib               # Utility libraries
  /services          # API and service functions
  /types             # TypeScript type definitions
  /docs              # Documentation
  App.tsx            # Main application component
  main.tsx           # Application entry point
```

## Component Architecture

The application follows a component-based architecture with the following patterns:

### Component Organization

Components are organized by feature and follow these guidelines:
- Each component should have a single responsibility
- Components should be small and focused
- Related components are grouped in directories

### State Management

React contexts are used for global state management:
- `ThemeContext` - Manages theme and color scheme
- `UIContext` - Manages UI settings like ticker and sidebar
- Additional contexts for specific features

### Component Props

Components are strongly typed with TypeScript interfaces:
- Props interfaces are defined in related `.d.ts` files
- Common types are centralized in `/types` directory

## Key Design Patterns

### Provider Pattern

Used for global state and services:

```jsx
// Example from ThemeContext
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Provider implementation
  return (
    <ThemeContext.Provider value={{ theme, setTheme, colorScheme, setColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### Custom Hooks

Custom hooks encapsulate reusable logic:

```jsx
// Example usage
const { theme, setTheme } = useTheme();
const { toast } = useToast();
```

### Compound Components

Used for complex UI components:

```jsx
// Example from Trading component
<Tabs>
  <TabsList>
    <TabsTrigger value="market">Market</TabsTrigger>
    <TabsTrigger value="trading">Trading</TabsTrigger>
  </TabsList>
  <TabsContent value="market">Market content</TabsContent>
  <TabsContent value="trading">Trading content</TabsContent>
</Tabs>
```

## Adding New Features

### Creating a New Component

1. Create a new file in the appropriate directory
2. Define the component interface
3. Implement the component
4. Export the component
5. Import and use it where needed

Example:

```tsx
// src/components/NewFeature.tsx
import React from 'react';

interface NewFeatureProps {
  title: string;
  onAction: () => void;
}

const NewFeature: React.FC<NewFeatureProps> = ({ title, onAction }) => {
  return (
    <div>
      <h2>{title}</h2>
      <button onClick={onAction}>Action</button>
    </div>
  );
};

export default NewFeature;
```

### Adding a New API Service

1. Create a new service file in `/services` directory
2. Define the service functions
3. Export the functions
4. Import and use them in components

Example:

```tsx
// src/services/newService.ts
import { toast } from '@/hooks/use-toast';

export async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    toast({
      title: "Error",
      description: "Failed to fetch data",
      variant: "destructive"
    });
    throw error;
  }
}
```

### Extending the Theme System

1. Add new theme variables to `App.css`
2. Update `ThemeContext.tsx` to include new theme options
3. Update theme switching UI components

### Adding New Settings

1. Add new setting fields to the appropriate settings component
2. Update the settings form interface
3. Implement handlers for the new settings
4. Update the relevant context to use the new settings

## Testing Guidelines

### Unit Testing

Use React Testing Library for component tests:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Component from './Component';

test('renders component', () => {
  render(<Component />);
  expect(screen.getByText('Component Title')).toBeInTheDocument();
});
```

### Integration Testing

Test component interactions:

```tsx
test('interacts correctly', () => {
  render(<ParentComponent />);
  fireEvent.click(screen.getByRole('button', { name: 'Action' }));
  expect(screen.getByText('Result')).toBeInTheDocument();
});
```

## Performance Optimization

### React Optimization Patterns

- Use `React.memo` for preventing unnecessary renders
- Use `useCallback` for function references
- Use `useMemo` for expensive calculations
- Virtualize long lists with `react-window`

### Code Splitting

Implement code splitting for large components:

```jsx
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </React.Suspense>
  );
}
```

## Styling Guidelines

### Using Tailwind CSS

Follow these principles:
- Use utility classes for styling
- Create consistent spacing with Tailwind's spacing scale
- Use Tailwind's color system for consistency
- Leverage responsive utility classes

Example:
```jsx
<div className="p-4 bg-background rounded-md shadow-sm hover:shadow-md transition-shadow">
  <h2 className="text-lg font-semibold mb-2">Title</h2>
  <p className="text-muted-foreground">Content</p>
</div>
```

### Custom Styles

When Tailwind isn't enough, use CSS modules or CSS-in-JS:

```jsx
// Using CSS modules
import styles from './Component.module.css';

<div className={styles.container}>...</div>
```

## API Integration Guidelines

1. Create a service file for the API
2. Implement authentication if needed
3. Create typed functions for API calls
4. Handle errors consistently
5. Implement caching where appropriate

## Accessibility Guidelines

- Use semantic HTML elements
- Include ARIA attributes where needed
- Ensure keyboard navigation works
- Test with screen readers
- Maintain sufficient color contrast
