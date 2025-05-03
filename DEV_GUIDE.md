
# Crypto Trading Platform Developer Guide

## Project Overview

The Crypto Trading Platform is a comprehensive web application for cryptocurrency trading analysis, portfolio management, and market insights. It's built with React, TypeScript, and Tailwind CSS, with a component-based architecture for maintainability and scalability.

## Getting Started

### Prerequisites

- Node.js (v16.x or higher)
- npm (v7.x or higher)
- Git

### Setting Up Development Environment

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/crypto-trading-platform.git
   cd crypto-trading-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Run tests**
   ```bash
   npm test
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
/
├── docs/               # Project documentation
├── public/             # Static assets
├── src/                # Source code
│   ├── components/     # React components
│   │   ├── api/        # API-related components
│   │   ├── charts/     # Chart components
│   │   ├── dashboard/  # Dashboard components
│   │   ├── trading/    # Trading components
│   │   ├── ui/         # UI components (shadcn/ui)
│   │   └── widgets/    # Widget components
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   ├── services/       # Service modules
│   │   ├── api/        # API service modules
│   │   └── trading/    # Trading service modules
│   ├── styles/         # Stylesheets
│   │   └── themes.css  # Theme definitions
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main App component
│   └── main.tsx        # Application entry point
└── tailwind.config.js  # Tailwind CSS configuration
```

## Core Technologies

### Frontend

- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/UI**: Component library
- **Recharts**: Chart library
- **Lucide Icons**: Icon library

### State Management

- **React Context API**: Application state management
- **Custom Hooks**: Encapsulated logic
- **localStorage**: Persistent storage

## Key Concepts

### Theme System

The application features a sophisticated theme system with multiple visual styles:

1. **Default**: Standard dark theme with balanced contrast
2. **Midnight Tech**: Deep blue tech-inspired theme with blue accents
3. **Cyber Pulse**: Vibrant purple cyberpunk style with neon highlights
4. **Matrix Code**: Green-tinted hacker aesthetic with terminal-inspired design

The theme system is implemented using CSS variables and Tailwind CSS. See `src/styles/themes.css` for the implementation details.

### Dashboard Widgets

The platform uses a widget-based dashboard system allowing users to customize their interface. Widgets are implemented as React components that can be added, removed, and rearranged on the dashboard.

Core widget files:
- `src/components/dashboard/WidgetGrid.tsx`: Grid layout for widgets
- `src/components/dashboard/WidgetList.tsx`: List view for available widgets
- `src/types/trading.ts`: Widget type definitions

### API Integration

The platform is designed to connect with multiple cryptocurrency APIs. The API management system allows users to add and configure API keys and endpoints.

Key API integration files:
- `src/components/api/ApiManagementDashboard.tsx`: Main API management UI
- `src/components/api/ApiProviderManagement.tsx`: API provider configuration
- `src/components/api/ApiUsageMetrics.tsx`: API usage monitoring

## Development Guidelines

### Coding Standards

- Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use TypeScript for type safety
- Write functional components with hooks
- Keep components small and focused
- Use named exports for better tree-shaking

### Component Guidelines

1. **File Structure**: One component per file
2. **Naming**: Use PascalCase for component names
3. **Props**: Define props using TypeScript interfaces
4. **State**: Use useState for component state, useContext for global state
5. **Side Effects**: Handle side effects with useEffect
6. **Styling**: Use Tailwind CSS classes for styling

Example component structure:

```tsx
import React, { useState, useEffect } from 'react';
import { SomeType } from '@/types';

interface MyComponentProps {
  title: string;
  data: SomeType[];
  onAction?: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({
  title,
  data,
  onAction
}) => {
  const [state, setState] = useState<string>('');
  
  useEffect(() => {
    // Side effects here
  }, [dependencies]);
  
  return (
    <div className="p-4 bg-card text-card-foreground">
      <h2>{title}</h2>
      {/* Component content */}
    </div>
  );
};

export default MyComponent;
```

### TypeScript Guidelines

1. Define types for all props, state, and function parameters
2. Use interfaces for object shapes
3. Use type aliases for unions and complex types
4. Avoid `any` type when possible
5. Use type assertions only when necessary

### State Management

1. Use React Context for global state
2. Create separate contexts for different domains
3. Implement custom hooks to access context state
4. Use localStorage for persistent storage

### Styling Guidelines

1. Use Tailwind CSS for all styling
2. Follow the project's color system defined in `tailwind.config.js`
3. Use CSS variables for theme-specific colors
4. Keep component styling self-contained
5. Use responsive design for all components

## Testing

### Unit Testing

Use Jest and React Testing Library for unit tests.

```bash
npm test
```

### End-to-End Testing

Use Cypress for end-to-end tests.

```bash
npm run test:e2e
```

## Build and Deployment

### Building for Production

```bash
npm run build
```

This will create a production build in the `dist` directory.

### Deployment

The application can be deployed to any static hosting service:

1. **Vercel** (recommended):
   ```bash
   vercel --prod
   ```

2. **Netlify**:
   ```bash
   netlify deploy --prod
   ```

3. **GitHub Pages**:
   ```bash
   npm run deploy
   ```

## Commit Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/) format:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

## Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com/docs)
- [Recharts Documentation](https://recharts.org/en-US/)

## Troubleshooting

### Common Issues

1. **Build Errors**:
   - Check for TypeScript errors
   - Verify all dependencies are installed
   - Check for circular dependencies

2. **Performance Issues**:
   - Use React.memo for expensive components
   - Check for unnecessary re-renders
   - Use the React DevTools profiler

3. **API Integration Issues**:
   - Check API key configuration
   - Verify API endpoint URLs
   - Check for CORS issues

## Contact

For questions or support, please contact the development team at dev@cryptotradingplatform.com.
