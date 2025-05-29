
# Developer Guide

## 🎯 Project Overview

Crypto Beacon Trader Hub is a React-based cryptocurrency trading platform built with TypeScript, Vite, and modern web technologies. The platform features AI-powered trading bots, real-time market data, and comprehensive automation workflows.

## 🏗️ Architecture & Tech Stack

### Core Technologies
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Shadcn/UI
- **State Management**: React Context API
- **Icons**: Lucide React
- **Charts**: Recharts
- **HTTP Client**: Native Fetch API

### Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (Shadcn)
│   ├── trading/         # Trading-specific components
│   ├── navigation/      # Navigation components
│   └── settings/        # Settings and configuration
├── contexts/            # React context providers
│   ├── CurrencyContext.tsx
│   ├── TradingContext.tsx
│   └── AiTradingContext.tsx
├── services/            # Business logic and API integrations
│   ├── ai/              # AI trading bot services
│   ├── api/             # External API integrations
│   ├── automation/      # N8N and workflow services
│   └── trading/         # Trading engine services
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── utils/               # Helper functions and utilities
└── App.tsx              # Main application component
```

## 🚀 Getting Started

### Development Environment Setup

1. **Prerequisites**
   ```bash
   node --version  # Requires Node.js 18+
   npm --version   # or yarn
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open Browser**
   Navigate to `http://localhost:5173`

### Build Commands
```bash
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # ESLint checking
npm run type-check # TypeScript checking
```

## 📝 Coding Standards

### TypeScript Guidelines
- **Strict Mode**: All TypeScript strict checks enabled
- **Type Definitions**: Use `src/types/` for shared interfaces
- **Component Props**: Always define prop interfaces
- **API Responses**: Type all external API responses

Example:
```typescript
interface TradingBotProps {
  bot: AITradingBot;
  onActivate: (botId: string) => void;
  onDeactivate: (botId: string) => void;
}

const TradingBotCard: React.FC<TradingBotProps> = ({ bot, onActivate, onDeactivate }) => {
  // Component implementation
};
```

### Component Guidelines

#### File Naming
- **Components**: PascalCase (`TradingDashboard.tsx`)
- **Hooks**: camelCase with 'use' prefix (`useTradingData.ts`)
- **Services**: camelCase (`tradingService.ts`)
- **Types**: camelCase (`trading.d.ts`)

#### Component Structure
```typescript
import React, { useState, useEffect } from 'react';
import { ComponentProps } from '@/types';
import { useCustomHook } from '@/hooks';

interface ComponentNameProps {
  // Props interface
}

const ComponentName: React.FC<ComponentNameProps> = ({ ...props }) => {
  // Hooks
  // State
  // Effects
  // Event handlers
  // Render
};

export default ComponentName;
```

#### Component Organization
- **Keep components focused**: Single responsibility principle
- **Extract custom hooks**: Reusable logic goes into hooks
- **Use compound patterns**: For complex components with multiple parts
- **Prefer composition**: Over inheritance

### State Management

#### Context Usage
```typescript
// Creating a context
interface ContextType {
  data: DataType;
  actions: {
    updateData: (data: DataType) => void;
  };
}

const Context = createContext<ContextType | undefined>(undefined);

// Custom hook for context
export const useContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useContext must be used within Provider');
  }
  return context;
};
```

#### Local State Guidelines
- Use `useState` for component-local state
- Use `useReducer` for complex state logic
- Lift state up when multiple components need it
- Use refs for DOM access and mutable values

### Styling Guidelines

#### Tailwind CSS
- **Responsive First**: Always consider mobile-first design
- **Consistent Spacing**: Use Tailwind's spacing scale
- **Color System**: Use semantic color names from theme
- **Dark Mode**: Support both light and dark themes

Example:
```typescript
<div className="p-4 bg-background border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow">
  <h2 className="text-lg font-semibold text-foreground mb-2">Title</h2>
  <p className="text-sm text-muted-foreground">Description</p>
</div>
```

#### Component Styling
- Use Shadcn/UI components as base
- Extend with Tailwind utilities
- Create custom components for repeated patterns
- Avoid inline styles

### Error Handling

#### API Errors
```typescript
try {
  const data = await apiCall();
  return data;
} catch (error) {
  console.error('API Error:', error);
  toast({
    title: "Error",
    description: "Failed to load data. Please try again.",
    variant: "destructive"
  });
  throw error;
}
```

#### Component Error Boundaries
```typescript
const ComponentWithErrorBoundary = () => (
  <ErrorBoundary fallback={<ErrorFallback />}>
    <MainComponent />
  </ErrorBoundary>
);
```

## 🔌 API Integration

### Service Layer Pattern
```typescript
class TradingService {
  private baseUrl = 'https://api.example.com';
  
  async getTradingData(): Promise<TradingData> {
    const response = await fetch(`${this.baseUrl}/trading`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }
}

export const tradingService = new TradingService();
```

### API Key Management
- Store sensitive keys in environment variables
- Use secure storage for user-provided keys
- Implement key rotation for production

## 🤖 AI Integration

### OpenRouter Service
```typescript
import { openRouterService } from '@/services/openRouterService';

// Generate trading signal
const signal = await openRouterService.generateTradingSignal(
  marketData,
  'trend-following',
  'deepseek/deepseek-r1'
);
```

### Bot Development
- All bots must support paper trading mode
- Implement comprehensive audit logging
- Use standardized strategy interfaces
- Include performance metrics calculation

## 🧪 Testing Strategy

### Unit Testing
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { TradingButton } from './TradingButton';

test('trading button executes trade on click', () => {
  const mockExecute = jest.fn();
  render(<TradingButton onExecute={mockExecute} />);
  
  fireEvent.click(screen.getByText('Execute Trade'));
  expect(mockExecute).toHaveBeenCalled();
});
```

### Integration Testing
- Test complete user workflows
- Mock external API calls
- Test responsive behavior
- Validate accessibility compliance

### End-to-End Testing
```typescript
// Cypress example
cy.visit('/');
cy.get('[data-testid="create-bot-button"]').click();
cy.get('[data-testid="bot-name-input"]').type('Test Bot');
cy.get('[data-testid="submit-button"]').click();
cy.contains('Bot created successfully');
```

## 🔧 Configuration

### Environment Variables
```bash
# Optional - for premium features
VITE_OPENROUTER_API_KEY=your_key_here
VITE_N8N_WEBHOOK_URL=your_n8n_instance
```

### Build Configuration
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
  },
});
```

## 📦 Deployment

### Production Checklist
- [ ] All TypeScript errors resolved
- [ ] Build completes without warnings
- [ ] Environment variables configured
- [ ] API endpoints updated for production
- [ ] Performance optimization applied
- [ ] Security headers configured
- [ ] Analytics and monitoring setup

### Vercel Deployment
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ]
}
```

## 🐛 Debugging

### Development Tools
- **React DevTools**: Component debugging
- **TypeScript**: Compile-time error catching
- **ESLint**: Code quality checking
- **Browser DevTools**: Runtime debugging

### Common Issues
- **CORS Errors**: Check API endpoint configuration
- **TypeScript Errors**: Verify type definitions
- **Build Failures**: Check import paths and dependencies
- **State Updates**: Verify context providers are properly wrapped

### Logging Strategy
```typescript
// Development logging
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}

// Production error logging
console.error('Production error:', error);
```

## 🔄 Git Workflow

### Branch Naming
- `feature/feature-name` - New features
- `bugfix/issue-description` - Bug fixes
- `hotfix/critical-issue` - Critical production fixes
- `chore/maintenance-task` - Maintenance tasks

### Commit Messages
```
feat: add AI trading bot creation interface
fix: resolve currency conversion calculation bug
docs: update API integration guide
style: improve responsive design for mobile
refactor: extract trading logic into service layer
test: add unit tests for portfolio calculations
```

### Pull Request Process
1. Create feature branch from `main`
2. Implement changes with tests
3. Update documentation if needed
4. Submit PR with detailed description
5. Address review feedback
6. Squash merge when approved

## 📊 Performance Guidelines

### Optimization Strategies
- **Code Splitting**: Lazy load route components
- **Memoization**: Use React.memo for expensive components
- **Bundle Analysis**: Regular bundle size monitoring
- **Image Optimization**: Use appropriate formats and sizes

### Performance Monitoring
```typescript
// Performance measurement
const startTime = performance.now();
await expensiveOperation();
const endTime = performance.now();
console.log(`Operation took ${endTime - startTime} milliseconds`);
```

## 🔐 Security Considerations

### Best Practices
- **Input Validation**: Validate all user inputs
- **XSS Prevention**: Sanitize dynamic content
- **API Security**: Use HTTPS and secure headers
- **Dependency Security**: Regular security audits

### Secure Coding
```typescript
// Input sanitization
const sanitizeInput = (input: string): string => {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

// Secure API calls
const headers = {
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  // Add security headers
};
```

## 📚 Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/UI](https://ui.shadcn.com/)

### Development Tools
- [VS Code Extensions](https://marketplace.visualstudio.com/vscode)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [TypeScript Playground](https://www.typescriptlang.org/play)

### Community
- [React Community](https://react.dev/community)
- [TypeScript Community](https://www.typescriptlang.org/community)
- [Project Discord](https://discord.gg/crypto-beacon)

---

This guide will be updated as the project evolves. Always refer to the latest version in the repository.
