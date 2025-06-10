
# 🚀 Advanced Crypto Trading Platform

A comprehensive cryptocurrency trading platform built with React, TypeScript, and modern web technologies. Features AI-powered trading bots, real-time market data, social trading, and Web3 integration.

## ✨ Features

### 🤖 AI Trading System
- **13+ Trading Strategies**: Trend following, mean reversion, scalping, breakout, arbitrage, grid trading, momentum, pattern recognition, sentiment analysis, machine learning, whale tracking, portfolio balancing, and custom strategies
- **Multiple AI Models**: Integration with OpenRouter API supporting GPT-4, Claude, DeepSeek R1, Gemini 2, and other models
- **Paper & Live Trading**: Risk-free testing and real money trading
- **Performance Analytics**: Win rate, Sharpe ratio, drawdown analysis, and comprehensive reporting

### 📊 Market Data & Analytics
- **Real-time Data**: Live price feeds from CoinGecko, CryptoCompare, and CoinCap APIs
- **AUD Currency Support**: All prices displayed in Australian Dollars
- **Advanced Charting**: Interactive charts with technical indicators
- **Portfolio Tracking**: Real-time portfolio valuation and performance metrics
- **Tax Reporting**: Australian Tax Office (ATO) compliant calculations

### 🌐 Web3 & DeFi Integration
- **Algorand Network**: Full Algorand blockchain integration with account lookup and asset tracking
- **Wallet Connections**: MetaMask, WalletConnect, and Coinbase Wallet support
- **DeFi Dashboard**: Track lending, staking, and liquidity positions
- **Cross-chain Support**: Multi-blockchain asset tracking (planned)

### 👥 Social Trading
- **Copy Trading**: Follow and copy successful traders
- **Trading Signals**: Real-time buy/sell signals from top traders
- **Leaderboards**: Trader rankings and performance metrics
- **Community Features**: Social interactions and strategy sharing

### 📰 News & Sentiment
- **Real-time News**: Crypto news aggregation from major sources
- **Sentiment Analysis**: AI-powered sentiment scoring
- **Fake News Detection**: AI-powered authenticity verification
- **Market Impact**: News correlation with price movements

### 🔐 Security & Compliance
- **Supabase Authentication**: Secure user authentication and session management
- **API Key Management**: Secure storage and rotation of exchange API keys
- **Audit Trails**: Complete trading and user activity logging
- **Data Privacy**: GDPR compliant data handling

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/UI** component library
- **React Query** for data fetching and caching
- **React Router** for navigation

### Backend & APIs
- **Supabase** for authentication and database
- **OpenRouter API** for AI model access
- **CoinGecko API** for cryptocurrency data
- **Algorand SDK** for blockchain integration
- **Multiple Exchange APIs** for trading

### Charts & Analytics
- **Recharts** for data visualization
- **Nivo** for advanced charts
- **Custom analytics engine** for performance metrics

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- OpenRouter API key (optional for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/crypto-trading-platform.git
   cd crypto-trading-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Connect to Supabase using the Lovable integration
   - Set up your OpenRouter API key in the settings page (optional)
   - Configure exchange API keys for live trading (optional)

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

## 📱 Pages & Features

### Core Pages
- **Dashboard** (`/`) - Market overview, portfolio summary, and quick actions
- **Trading** (`/trading`) - Complete trading interface with charts and order management
- **AI Bots** (`/ai-bots`) - Create and manage AI trading bots
- **Analytics** (`/analytics`) - Advanced portfolio analytics and performance metrics
- **News** (`/news`) - Crypto news feed with sentiment analysis
- **Web3** (`/web3`) - Wallet connections and DeFi integration
- **Social** (`/social`) - Social trading hub and community features

### Utility Pages
- **Authentication** (`/auth`) - Login and registration
- **Subscription** (`/subscription`) - Pricing plans and billing
- **Testing** (`/testing`) - System testing dashboard
- **Project Status** (`/status`) - Project documentation and status

## 🔧 Configuration

### AI Trading Setup
1. Go to Settings and add your OpenRouter API key
2. Create a new bot using the AI Bot Creator
3. Select strategy, model, and risk parameters
4. Start paper trading to test your bot

### Exchange Integration
1. Generate API keys from your preferred exchange
2. Add keys securely through the platform
3. Configure trading pairs and limits
4. Enable live trading mode

### Web3 Setup
1. Connect your MetaMask or other Web3 wallet
2. View your Algorand assets and transactions
3. Track DeFi positions across protocols
4. Monitor cross-chain assets

## 🏗️ Architecture

### Component Structure
```
src/
├── components/          # Reusable UI components
│   ├── trading/        # Trading-specific components
│   ├── web3/           # Web3 and blockchain components
│   ├── news/           # News and sentiment components
│   └── ui/             # Base UI components
├── pages/              # Route components
├── services/           # API and business logic
│   ├── ai/             # AI trading services
│   ├── algorand/       # Algorand integration
│   └── freeApis/       # Market data services
├── contexts/           # React contexts for state management
├── hooks/              # Custom React hooks
└── types/              # TypeScript type definitions
```

### State Management
- **React Context** for global state (trading, UI, user)
- **React Query** for server state and caching
- **Local Storage** for user preferences and settings
- **Supabase** for persistent data storage

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm run test

# Run specific test category
npm run test:api
npm run test:trading
npm run test:ui
```

Use the built-in testing dashboard at `/testing` to run manual system tests.

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deploy to Lovable
1. Click the "Publish" button in Lovable
2. Your app will be deployed automatically
3. Custom domains available with paid plans

### Environment Variables
All configuration is handled through:
- Supabase secrets (for API keys)
- Local storage (for user preferences)
- No `.env` files needed

## 📊 Performance

### Metrics
- **Build Size**: Optimized bundle splitting
- **Load Time**: < 2 seconds initial load
- **API Response**: < 200ms average
- **Real-time Updates**: 5-second intervals for price data

### Monitoring
- Built-in API health checks
- Connection status indicators
- Performance analytics dashboard
- Error tracking and reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Use semantic component naming
- Keep components small and focused
- Write comprehensive tests
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Documentation](docs/api.md)
- [User Guide](docs/user-guide.md)
- [Developer Guide](docs/developer-guide.md)
- [Deployment Guide](docs/deployment.md)

### Community
- [Discord Community](https://discord.gg/crypto-trading)
- [GitHub Issues](https://github.com/your-username/crypto-trading-platform/issues)
- [Email Support](mailto:support@cryptotrading.com)

### Roadmap
- [ ] Mobile app (React Native)
- [ ] Advanced order types
- [ ] More exchange integrations
- [ ] NFT portfolio tracking
- [ ] Advanced social features
- [ ] Institutional features

---

**Built with ❤️ using Lovable.dev**

*This platform is for educational and research purposes. Cryptocurrency trading involves risk. Always do your own research and never invest more than you can afford to lose.*
