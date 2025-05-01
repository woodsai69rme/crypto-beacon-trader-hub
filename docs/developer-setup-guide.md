
# Developer Setup Guide

## Introduction

This guide will help you set up the Crypto Trading Platform development environment on your local machine. The platform is built with React, TypeScript, and Tailwind CSS, with the shadcn/ui component library.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v16.x or later)
- **npm** (v8.x or later) or **yarn** (v1.22.x or later)
- **Git**
- A code editor (we recommend Visual Studio Code)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/crypto-trading-platform.git
cd crypto-trading-platform
```

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Using yarn:

```bash
yarn install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```
VITE_API_BASE_URL=https://api.coingecko.com/api/v3
```

For development with mock data (no API rate limits):

```
VITE_USE_MOCK_DATA=true
```

### 4. Start Development Server

Using npm:

```bash
npm run dev
```

Using yarn:

```bash
yarn dev
```

This will start the development server on `http://localhost:5173`.

## Project Structure

```
crypto-trading-platform/
├── docs/                     # Documentation
├── public/                   # Public assets
├── src/
│   ├── components/           # UI components
│   │   ├── dashboard/        # Dashboard components
│   │   ├── trading/          # Trading components
│   │   ├── market/           # Market data components
│   │   ├── tax/              # Tax tools
│   │   ├── ui/               # shadcn/ui components
│   │   └── ...
│   ├── contexts/             # React Context providers
│   ├── hooks/                # Custom React hooks
│   ├── services/             # API and service functions
│   ├── styles/               # Global styles and themes
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions
│   ├── App.tsx               # Main App component
│   └── main.tsx              # Application entry point
├── .eslintrc.json            # ESLint configuration
├── .gitignore                # Git ignore file
├── index.html                # HTML entry point
├── package.json              # Project dependencies
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite configuration
```

## Key Technologies

- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Component library
- **React Query**: Data fetching and caching
- **Recharts**: Chart visualization
- **Lucide React**: Icon library

## Development Workflow

### Component Development

1. Create new components in the appropriate directory
2. Use the shadcn/ui component library where possible
3. Follow the existing style patterns
4. Use TypeScript interfaces for component props

### State Management

The application uses React Context for global state management:

- `ThemeContext`: Theme and color scheme management
- `CurrencyContext`: Currency selection and conversion
- `AiTradingContext`: AI trading features

### API Integration

API services are located in the `src/services` directory:

- Use the provided API utilities for making requests
- Implement error handling and loading states
- Use React Query for data fetching and caching

### Theme Development

The platform supports multiple themes:

1. Base themes (dark/light)
2. Color schemes (Midnight Tech, Cyber Pulse, Matrix Code)
3. CSS variables for consistent styling

### Testing

Run tests using:

```bash
npm run test
```

We use:
- Jest for unit testing
- React Testing Library for component testing
- Cypress for end-to-end testing

### Linting and Formatting

Lint the code using:

```bash
npm run lint
```

Format the code using:

```bash
npm run format
```

## Build and Deployment

### Production Build

Create a production build:

```bash
npm run build
```

This will generate optimized files in the `dist` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Deployment Platforms

The application can be deployed to:

- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

## Common Issues and Solutions

### API Rate Limiting

If you encounter API rate limiting issues:
- Use `VITE_USE_MOCK_DATA=true` in your `.env` file
- Implement request caching using React Query
- Use fallback data when API requests fail

### Type Errors

If you encounter TypeScript errors:
- Check the type definitions in `src/types`
- Ensure component props match their interfaces
- Use proper type assertions when necessary

### Theme Issues

If theme switching isn't working:
- Check browser localStorage for theme preferences
- Ensure CSS variables are properly defined
- Verify theme classes are correctly applied to the HTML root

## Contributing

1. Create a new branch for your feature or fix
2. Follow the coding style guidelines
3. Write tests for new features
4. Submit a pull request with a clear description

## Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Vite Documentation](https://vitejs.dev/guide/)

## Support

For questions or support, contact the development team at [dev-support@cryptotradingplatform.com](mailto:dev-support@cryptotradingplatform.com)
