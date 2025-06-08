
# 🛠️ Developer Setup Guide

**Version**: 2.0  
**Last Updated**: January 25, 2025  
**Estimated Setup Time**: 30-60 minutes  

---

## 🎯 Prerequisites

### Required Software
```bash
Node.js 18.x or higher
npm 9.x or higher (or yarn 3.x)
Git 2.x or higher
VS Code (recommended) or preferred IDE
```

### Development Tools (Recommended)
```bash
# Essential Extensions for VS Code
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense
- Auto Import - ES6, TS, JSX, TSX
```

### System Requirements
- **RAM**: Minimum 8GB (16GB recommended)
- **Storage**: 5GB free space for dependencies
- **OS**: Windows 10+, macOS 10.15+, or Linux

---

## 🚀 Quick Start (5 Minutes)

### 1. Clone Repository
```bash
git clone <repository-url>
cd crypto-trading-platform
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Start Development Server
```bash
npm run dev
# or
yarn dev
```

### 4. Open Application
```
http://localhost:5173
```

**🎉 You should now see the trading platform running locally!**

---

## 🔧 Detailed Setup

### Environment Configuration

#### Create Environment File
```bash
# Copy example environment file
cp .env.example .env.local

# Edit with your settings
nano .env.local
```

#### Environment Variables
```env
# Basic Configuration
VITE_APP_NAME="Crypto Trading Platform"
VITE_APP_VERSION="2.0.0"
VITE_ENVIRONMENT="development"

# API Configuration
VITE_API_BASE_URL="http://localhost:5173"
VITE_WEBSOCKET_URL="ws://localhost:5173"

# External APIs (Optional for development)
VITE_COINGECKO_API_KEY=""
VITE_OPENROUTER_API_KEY=""
VITE_ALGORAND_API_TOKEN="98D9CE80660AD243893D56D9F125CD2D"

# Feature Flags
VITE_ENABLE_LIVE_TRADING="false"
VITE_ENABLE_AI_BOTS="true"
VITE_ENABLE_ANALYTICS="true"
```

---

## 🔌 Supabase Integration Setup

### Option 1: Use Demo Mode (Recommended for Quick Start)
The platform includes demo data and mock authentication that works out of the box.

### Option 2: Connect to Supabase (Full Features)
1. **Click the green Supabase button** in the top-right of Lovable interface
2. **Connect to Supabase** - this enables:
   - Real user authentication
   - Persistent data storage
   - Backend API functionality
   - Real-time features

For more details, see: [Supabase Integration Guide](https://docs.lovable.dev/integrations/supabase/)

---

## 📦 Project Structure Walkthrough

### Core Directories
```
src/
├── components/           # React components
│   ├── ui/              # Base UI components (shadcn/ui)
│   ├── trading/         # Trading-specific components
│   ├── analytics/       # Analytics & charts
│   └── ...              # Feature-specific folders
├── contexts/            # React Context providers
├── hooks/               # Custom React hooks
├── services/            # Business logic & API calls
├── types/               # TypeScript type definitions
├── utils/               # Helper functions
└── docs/                # Documentation
```

### Key Files
```
src/
├── main.tsx             # Application entry point
├── App.tsx              # Main app component
├── index.css            # Global styles & theme
└── vite.config.ts       # Vite configuration
```

---

## 🛠️ Development Workflow

### Available Scripts
```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking

# Testing
npm run test            # Run unit tests
npm run test:e2e        # Run end-to-end tests
npm run test:coverage   # Test coverage report

# Utilities
npm run clean           # Clean build artifacts
npm run analyze         # Bundle size analysis
```

### Development Server Features
- **Hot Module Replacement**: Instant updates without losing state
- **TypeScript Checking**: Real-time type error reporting
- **Auto Import**: Automatic import suggestions
- **Fast Refresh**: React Fast Refresh for component updates

---

## 🎨 UI Development

### Theme System
The platform uses a comprehensive theme system built with CSS variables:

```css
/* Located in src/index.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... more theme variables */
}
```

### Component Development
```typescript
// Example component structure
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MyComponentProps {
  title: string;
  data: any[];
}

const MyComponent: React.FC<MyComponentProps> = ({ title, data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Component content */}
      </CardContent>
    </Card>
  );
};

export default MyComponent;
```

---

## 📊 Working with Data

### API Integration
```typescript
// Example service function
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export const fetchPortfolio = async (userId: string) => {
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('user_id', userId);
    
  if (error) throw error;
  return data;
};
```

### Real-time Data
```typescript
// Example real-time hook
import { useEffect, useState } from 'react';
import { useRealTimeData } from '@/hooks/useRealTimeData';

const PriceDisplay = ({ symbol }: { symbol: string }) => {
  const { price, isConnected } = useRealTimeData(symbol);
  
  return (
    <div>
      <span>{symbol}: ${price}</span>
      <span className={isConnected ? 'text-green-500' : 'text-red-500'}>
        {isConnected ? '🟢' : '🔴'}
      </span>
    </div>
  );
};
```

---

## 🧪 Testing Strategy

### Unit Testing
```bash
# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Testing Example
```typescript
// Example test file
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PriceDisplay from '@/components/PriceDisplay';

describe('PriceDisplay', () => {
  it('renders price correctly', () => {
    render(<PriceDisplay symbol="BTC" price={50000} />);
    expect(screen.getByText(/BTC: \$50,000/)).toBeInTheDocument();
  });
});
```

---

## 🔍 Debugging

### Development Tools
```typescript
// React Developer Tools
- Component inspection
- Props and state debugging
- Performance profiling

// Browser DevTools
- Network tab for API calls
- Console for errors and logs
- Performance tab for optimization
```

### Common Issues & Solutions

#### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check
```

#### Port Conflicts
```bash
# Change default port
npm run dev -- --port 3001
```

#### Import Errors
```typescript
// Use absolute imports
import { Component } from '@/components/Component';

// Instead of relative imports
import { Component } from '../../../components/Component';
```

---

## 🚀 Production Build

### Build Process
```bash
# Create production build
npm run build

# Preview production build locally
npm run preview

# Analyze bundle size
npm run analyze
```

### Build Optimization
- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Dead code elimination
- **Minification**: JavaScript and CSS minification
- **Compression**: Gzip/Brotli compression ready

---

## 📚 Learning Resources

### Essential Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Shadcn/UI Components](https://ui.shadcn.com/)
- [Vite Guide](https://vitejs.dev/guide/)

### Platform-Specific Guides
- [AI Trading Bot Development](./AI_BOT_DEVELOPMENT.md)
- [Component Creation Guide](./COMPONENT_GUIDE.md)
- [API Integration Guide](./API_INTEGRATION.md)
- [Deployment Guide](./DEPLOYMENT.md)

---

## 🎯 Next Steps

### For New Developers
1. **Explore the codebase** - Start with `src/App.tsx`
2. **Run the application** - Familiarize with core features
3. **Make small changes** - Try modifying a component
4. **Read the documentation** - Understand the architecture
5. **Join the team** - Participate in code reviews

### Advanced Setup
1. **Configure IDE** - Set up debugging and extensions
2. **Setup Supabase** - Connect to backend services
3. **API Keys** - Configure external API integrations
4. **Testing** - Set up test environment
5. **Deployment** - Learn deployment process

---

## 🆘 Getting Help

### Internal Resources
- **Technical Documentation**: Check `/docs` folder
- **Code Comments**: Inline documentation in complex functions
- **Type Definitions**: Reference `src/types/` for interfaces

### External Support
- **GitHub Issues**: Report bugs and request features
- **Discord Community**: Real-time help and discussion
- **Stack Overflow**: General React/TypeScript questions

---

**🎉 You're ready to start developing! Welcome to the team!**
