
# 🚀 Crypto Beacon Trading Platform

## Overview

Crypto Beacon is a comprehensive, full-stack cryptocurrency trading platform built with React 18, TypeScript, and modern web technologies. It provides AI-powered trading bots, real-time market data, exchange integrations, DeFi protocols, social trading features, and advanced analytics tools.

### 🎯 Key Features

- **AI Trading Bots**: 13+ trading strategies with OpenRouter integration
- **Multi-Exchange Support**: Binance, Coinbase, Kraken, OKX, Bybit, KuCoin
- **Paper & Live Trading**: Risk-free practice and real trading modes
- **Real-Time Data**: WebSocket connections for live market updates
- **DeFi Integration**: Aave, Uniswap, Compound, Yearn Finance protocols
- **Web3 Wallet Support**: MetaMask, WalletConnect, Phantom integration
- **News & Sentiment**: AI-powered fake news detection and sentiment analysis
- **Social Trading**: Copy trading, leaderboards, signal sharing
- **Advanced Analytics**: Portfolio optimization, risk assessment, tax calculations
- **Multi-Currency**: AUD-focused with USD, EUR, GBP support

### 🏗️ Architecture

```
Frontend: React 18 + TypeScript + Vite
Styling: Tailwind CSS + Shadcn/UI
State: React Context + TanStack Query
Backend: Supabase (PostgreSQL) + Edge Functions
APIs: CoinGecko, OpenRouter, Algorand, Exchange APIs
Charts: Recharts + TradingView integration
Testing: Vitest + React Testing Library
CI/CD: GitHub Actions
Deployment: Docker + Multi-platform support
```

### 🚀 Quick Start

```bash
# Clone repository
git clone <repository-url>
cd crypto-beacon

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
http://localhost:5173
```

### 📚 Documentation

- [Setup Guide](./setup.md) - Installation and configuration
- [Deployment Guide](./deployment.md) - Deploy anywhere
- [Configuration](./config.md) - Environment variables and settings
- [Testing Guide](./testing.md) - Testing strategies and automation
- [Audit Report](./audit_report.md) - Security and code quality analysis
- [Changelog](./changelog.md) - Version history and updates

### 🛠️ Development

```bash
# Development commands
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview build
npm run test         # Run tests
npm run lint         # Code linting
npm run type-check   # TypeScript checking

# Automation scripts
./scripts/setup.sh   # Auto-setup environment
./scripts/test.sh    # Run all tests
./scripts/deploy.sh  # Deploy to production
```

### 🌐 Deployment Targets

- **Local Development**: Windows, macOS, Linux
- **Docker**: Containerized deployment
- **Cloud Platforms**: Vercel, Netlify, Render, Railway, Fly.io
- **Static Hosting**: GitHub Pages (static build)
- **Self-Hosted**: VPS with PostgreSQL or SQLite

### 🔧 Environment Setup

Required environment variables:

```env
# Database (choose one)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
# OR
DATABASE_URL=postgresql://user:pass@host:port/db
# OR for offline mode
DATABASE_TYPE=sqlite

# AI Services
OPENROUTER_API_KEY=your_openrouter_key

# Exchange APIs (optional for live trading)
BINANCE_API_KEY=your_binance_key
BINANCE_SECRET=your_binance_secret

# Market Data
COINGECKO_API_KEY=your_coingecko_key
CRYPTOCOMPARE_API_KEY=your_cryptocompare_key
```

### 📊 Features Status

- ✅ Paper Trading System
- ✅ AI Trading Bots (13 strategies)
- ✅ Real-time Market Data
- ✅ Portfolio Management
- ✅ News & Sentiment Analysis
- ✅ DeFi Protocol Integration
- ✅ Web3 Wallet Connection
- ✅ Tax Calculation Tools
- ✅ Social Trading Features
- ✅ Advanced Analytics
- ✅ Multi-Currency Support
- ✅ Responsive Design
- ✅ Comprehensive Testing
- ✅ CI/CD Pipeline
- ✅ Multi-platform Deployment

### 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

### 🆘 Support

- 📖 [Documentation](./setup.md)
- 🐛 [Issue Tracker](https://github.com/crypto-beacon/issues)
- 💬 [Discord Community](https://discord.gg/crypto-beacon)
- 📧 [Email Support](mailto:support@crypto-beacon.com)

---

**Built with ❤️ by the Crypto Beacon team**
