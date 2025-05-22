
# Developer Setup

## Crypto Beacon Trader Hub

**Version:** 1.0.0  
**Last Updated:** 2025-05-06

This document provides instructions for setting up the development environment for the Crypto Beacon Trader Hub platform.

## 1. Prerequisites

### 1.1 Required Software

- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher (included with Node.js)
- **Git**: Latest version recommended

### 1.2 Recommended Tools

- **Visual Studio Code**: With extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript Hero
  - Error Lens
- **Chrome/Firefox**: With React Developer Tools extension
- **Postman/Insomnia**: For API testing

## 2. Setting Up the Development Environment

### 2.1 Cloning the Repository

```bash
# Clone the repository
git clone https://github.com/your-username/crypto-beacon-trader-hub.git

# Navigate to the project directory
cd crypto-beacon-trader-hub
```

### 2.2 Installing Dependencies

```bash
# Install project dependencies
npm install
```

### 2.3 Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```
# API Keys (Optional - for full functionality)
VITE_COINGECKO_API_KEY=your_coingecko_api_key
VITE_COINMARKETCAP_API_KEY=your_coinmarketcap_api_key

# Feature Flags
VITE_ENABLE_LOCAL_MODELS=true
VITE_ENABLE_ADVANCED_CHARTS=true

# Development Settings
VITE_API_MOCKING=true
```

Note: The application can run without API keys, but some features will use mocked data instead of live data.

## 3. Running the Application

### 3.1 Development Server

```bash
# Start the development server
npm run dev
```

This will start the application on `http://localhost:5173` (or the next available port).

### 3.2 Build for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### 3.3 Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## 4. Development Workflow

### 4.1 Branch Structure

- `main`: Production-ready code
- `develop`: Primary development branch
- `feature/*`: Feature branches
- `bugfix/*`: Bug fix branches
- `release/*`: Release preparation branches

### 4.2 Commit Guidelines

We follow Conventional Commits specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Examples:
- `feat: add local model connection interface`
- `fix: resolve websocket reconnection issue`
- `docs: update API documentation`
- `style: format code with prettier`

### 4.3 Pull Request Process

1. Create a feature/bugfix branch from `develop`
2. Make your changes
3. Ensure all tests pass
4. Submit a PR to the `develop` branch
5. Address review comments
6. Once approved, merge to `develop`

## 5. Local MCP Integration

To test the local AI model integration features, you need to run a local MCP server:

### 5.1 MCP Server Setup

1. Clone the MCP server repository:
   ```bash
   git clone https://github.com/example/mcp-server.git
   cd mcp-server
   ```

2. Install dependencies and start the server:
   ```bash
   npm install
   npm start
   ```

3. The MCP server will be available at `http://localhost:5000`

### 5.2 Configuring the Application for Local Models

In your `.env.local` file, ensure you have:

```
VITE_ENABLE_LOCAL_MODELS=true
VITE_MCP_SERVER_URL=http://localhost:5000
```

## 6. Code Structure

### 6.1 Directory Structure

```
crypto-beacon-trader-hub/
├── public/              # Static assets
├── src/                 # Source code
│   ├── components/      # React components
│   │   ├── ui/          # UI components
│   │   ├── charts/      # Chart components
│   │   ├── trading/     # Trading-related components
│   │   └── settings/    # Settings components
│   ├── hooks/           # Custom React hooks
│   ├── contexts/        # React context providers
│   ├── services/        # API services and data fetching
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript type definitions
│   ├── styles/          # Global styles
│   ├── pages/           # Page components
│   ├── assets/          # Images and other assets
│   └── App.tsx          # Application entry point
├── docs/                # Documentation
├── tests/               # Test files
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── package.json         # npm package configuration
└── README.md            # Project README
```

### 6.2 Coding Standards

- Follow the TypeScript style guide
- Use functional components with hooks
- Implement proper error handling
- Write unit tests for critical functionality
- Document complex logic with comments
- Use absolute imports with path aliases

## 7. API Integration

### 7.1 Available Data Sources

| API | Purpose | Documentation |
|-----|---------|---------------|
| CoinGecko | Cryptocurrency data | [CoinGecko API Docs](https://www.coingecko.com/api/documentation) |
| Binance | Real-time market data | [Binance API Docs](https://binance-docs.github.io/apidocs/) |
| CoinMarketCap | Market data and metadata | [CMC API Docs](https://coinmarketcap.com/api/documentation/v1/) |

### 7.2 API Services

API services are located in `src/services/` and implement a consistent interface for data fetching, caching, and error handling.

### 7.3 API Mocking

For development without API keys, enable API mocking:

```
VITE_API_MOCKING=true
```

Mock data is located in `src/mocks/` and closely resembles the structure of real API responses.

## 8. Troubleshooting

### 8.1 Common Issues

#### WebSocket Connection Errors
- Check if the API key has WebSocket permissions
- Ensure you're not hitting rate limits
- Verify firewall/network settings

#### MCP Server Connection Issues
- Ensure the MCP server is running
- Check CORS settings
- Verify the MCP URL in `.env.local`

#### Build Errors
- Clear the `node_modules` and reinstall:
  ```bash
  rm -rf node_modules
  npm install
  ```
- Check for TypeScript errors:
  ```bash
  npm run type-check
  ```

### 8.2 Getting Help

- Check the [GitHub Issues](https://github.com/your-username/crypto-beacon-trader-hub/issues)
- Join our [Discord community](https://discord.gg/example)
- Contact support at support@example.com

## 9. Additional Resources

- [Project Documentation](https://docs.example.com)
- [API Documentation](https://api-docs.example.com)
- [Component Storybook](https://storybook.example.com)
- [Design System](https://design.example.com)

## 10. Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for more information.

---

This setup guide should help you get started with developing for the Crypto Beacon Trader Hub platform. If you encounter any issues not covered here, please reach out to the development team.
