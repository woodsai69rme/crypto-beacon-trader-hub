
# Developer Setup

This guide provides instructions for setting up the Crypto Trading Platform development environment.

## Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or later)
- **npm** (v8 or later) or **yarn** (v1.22 or later)
- **Git** for version control
- A code editor (VS Code recommended)

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/your-organization/crypto-trading-platform.git
cd crypto-trading-platform
```

### Install Dependencies

Using npm:

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

### Environment Configuration

1. Create a `.env.local` file in the project root:

```
# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# Cryptocurrency APIs
VITE_COINGECKO_API_KEY=your_coingecko_api_key
VITE_CRYPTOCOMPARE_API_KEY=your_cryptocompare_api_key

# AI Services
VITE_OPENROUTER_API_KEY=your_openrouter_api_key

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. Replace the placeholder values with your actual API keys

### Development Server

Start the development server:

```bash
npm run dev
```

Or with yarn:

```bash
yarn dev
```

The application will be available at `http://localhost:5173` by default.

## Project Structure

```
crypto-trading-platform/
├── public/                   # Static assets
├── src/
│   ├── components/           # React components
│   │   ├── ui/               # UI components (shadcn)
│   │   ├── charts/           # Chart components
│   │   ├── dashboard/        # Dashboard components
│   │   ├── settings/         # Settings components
│   │   └── widgets/          # Widget components
│   ├── contexts/             # React context providers
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   ├── pages/                # Page components
│   ├── services/             # API and service functions
│   │   ├── api/              # API clients
│   │   └── ai/               # AI service integrations
│   ├── types/                # TypeScript type definitions
│   ├── App.tsx               # Main application component
│   └── main.tsx              # Entry point
├── docs/                     # Documentation
├── scripts/                  # Utility scripts
├── .env.example              # Example environment variables
├── index.html                # HTML entry point
├── package.json              # Project dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite configuration
└── README.md                 # Project overview
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
- `npm run lint:fix`: Fix linting issues
- `npm run test`: Run tests
- `npm run typecheck`: Run TypeScript type checking

## Environment Variables

| Variable | Purpose | Required? |
|----------|---------|-----------|
| `VITE_API_BASE_URL` | Base URL for API requests | Yes |
| `VITE_COINGECKO_API_KEY` | CoinGecko API key | For production |
| `VITE_CRYPTOCOMPARE_API_KEY` | CryptoCompare API key | For production |
| `VITE_OPENROUTER_API_KEY` | OpenRouter API key | For AI features |
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |

## External Services Setup

### Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Set up authentication providers
3. Create database tables (refer to Database Schema documentation)
4. Configure Row-Level Security policies
5. Obtain URL and anon key for environment variables

### OpenRouter

1. Sign up at [openrouter.ai](https://openrouter.ai)
2. Create an API key
3. Add the key to your environment variables

### CoinGecko and CryptoCompare

1. Sign up for developer accounts
2. Generate API keys
3. Add keys to environment variables

## Development Guidelines

### Code Style

The project follows a consistent code style enforced by ESLint and Prettier:

- Use TypeScript for type safety
- Follow React functional component patterns
- Maintain consistent file structure and naming conventions
- Use ES6+ features appropriately
- Document complex functions and components

### Component Development

When creating new components:

1. Place them in the appropriate subdirectory
2. Use TypeScript interfaces for props
3. Implement responsive design
4. Consider accessibility (ARIA attributes, keyboard navigation)
5. Add appropriate tests

### State Management

- Use React Context for global state
- Use hooks for component state
- Follow unidirectional data flow principles
- Minimize prop drilling

### API Integration

- Use service functions for API calls
- Implement proper error handling
- Add appropriate loading states
- Consider caching strategies
- Follow API rate limit guidelines

## Troubleshooting

### Common Issues

**Network errors when fetching API data:**
- Verify API keys in environment variables
- Check API rate limits
- Ensure network connectivity

**Build errors:**
- Run `npm run lint` to identify issues
- Check for TypeScript errors with `npm run typecheck`
- Verify import paths and component usage

**State management issues:**
- Check context provider hierarchy
- Verify state updates are properly handled
- Use React DevTools to inspect component state

### Getting Help

- Check the project documentation
- Review existing GitHub issues
- Join the developer Discord channel
- Contact the core development team

## Contribution Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request
6. Address review feedback

## Additional Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Shadcn UI Documentation](https://ui.shadcn.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)

This setup guide should help you get started with the Crypto Trading Platform development. For additional questions or issues, please refer to the project documentation or contact the development team.
