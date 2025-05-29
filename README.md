
# Crypto Beacon Trader Hub

![Crypto Trading Platform](https://img.shields.io/badge/Platform-Crypto%20Trading-blue) ![Currency](https://img.shields.io/badge/Base%20Currency-AUD-green) ![AI Powered](https://img.shields.io/badge/AI-Powered-purple) ![License](https://img.shields.io/badge/License-MIT-yellow)

A comprehensive cryptocurrency trading platform with advanced AI-powered trading bots, real-time market data, automation workflows, and portfolio management - designed specifically for Australian traders using AUD as the base currency.

## 🚀 Key Features

### 🤖 AI Trading Bots
- **Multi-Model AI Integration**: OpenRouter integration with DeepSeek R1, Gemini 2.0, GPT-4, Claude 3
- **Advanced Strategies**: Trend following, momentum, mean reversion, breakout, scalping
- **Paper Trading**: Safe testing environment with virtual AUD funds
- **Real-time Audit Logs**: Complete transparency of bot decisions and actions
- **Risk Management**: Configurable risk levels and stop-loss/take-profit settings

### 📊 Trading & Portfolio
- **AUD Base Currency**: All prices, calculations, and displays in Australian Dollars
- **Real-time Data**: Live market feeds from multiple crypto APIs
- **Multi-Exchange Support**: Binance, Coinbase, Kraken integration ready
- **Portfolio Tracking**: Comprehensive asset allocation and performance metrics
- **Advanced Charts**: TradingView-style charting with technical indicators

### 🔄 Automation & Workflows
- **N8N Integration**: Visual workflow automation for trading signals
- **Webhook Support**: Real-time notifications to Discord, Telegram, Slack
- **Alert System**: Price alerts, volume spikes, pattern recognition
- **Social Trading**: Copy successful traders and share strategies

### 🔐 Security & Compliance
- **Paper Trading Default**: Safe environment for learning and testing
- **Secure API Management**: Encrypted storage of exchange API keys
- **Audit Logging**: Complete transaction and bot activity history
- **Risk Controls**: Built-in safeguards and position limits

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-org/crypto-beacon-trader-hub.git
cd crypto-beacon-trader-hub
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open in browser**
Navigate to `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## 🎯 Getting Started Guide

### 1. First Launch
- Platform defaults to AUD currency for Australian traders
- Paper trading mode is enabled by default for safety
- No API keys required to start - uses free market data

### 2. Create Your First AI Bot
1. Navigate to **AI Trading** → **Create Bot**
2. Choose a strategy (recommend "Trend Following" for beginners)
3. Select a free AI model (DeepSeek R1 recommended)
4. Set risk level to "Low" initially
5. Activate your bot and watch it trade with virtual AUD

### 3. Monitor Performance
- Check the **Audit Log** tab to see AI decision-making process
- Monitor bot performance metrics in real-time
- View trade history and portfolio changes

### 4. Advanced Features
- Set up N8N workflows for automation
- Configure alerts and notifications
- Explore social trading features
- Connect real exchange APIs when ready

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for responsive, mobile-first design
- **Shadcn/UI** for consistent, accessible components

### AI & Trading
- **OpenRouter Integration** for multiple AI models
- **Real-time Market Data** from CoinGecko, Binance APIs
- **N8N Workflow Engine** for automation
- **Local Storage** for bot configurations and history

### Key Components
```
src/
├── components/          # Reusable UI components
├── services/           # Business logic and API integrations
├── contexts/           # React context for state management
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── utils/              # Helper functions and utilities
```

## 🔧 Configuration

### Environment Setup
No environment file needed for basic operation. Optional configurations:

- **OpenRouter API Key**: For premium AI models (GPT-4, Claude)
- **Exchange API Keys**: For live trading (advanced users)
- **N8N Instance**: For advanced automation workflows

### Currency Settings
The platform defaults to AUD but supports:
- USD, EUR, GBP, CAD, JPY, CNY
- Real-time exchange rate conversion
- Persistent user preference storage

## 📚 Usage Examples

### Creating an AI Trading Bot
```javascript
// Example bot configuration
const botConfig = {
  name: "Conservative AUD Bot",
  strategy: "trend-following",
  aiModel: "deepseek/deepseek-r1",
  riskLevel: "low",
  maxTradeAmount: 1000, // AUD
  targetAssets: ["bitcoin", "ethereum"]
};
```

### Setting Up Alerts
```javascript
// Price alert configuration
const alert = {
  type: "price",
  asset: "bitcoin",
  condition: "above",
  value: 45000, // AUD
  notifications: ["app", "email"]
};
```

## 🧪 Testing

### Running Tests
```bash
npm test          # Run unit tests
npm run test:e2e  # Run end-to-end tests
npm run lint      # Check code quality
```

### Manual Testing Checklist
- [ ] AI bots create and activate successfully
- [ ] Paper trading executes trades correctly
- [ ] AUD currency displays properly across all components
- [ ] Responsive design works on mobile/tablet
- [ ] Audit logs show bot decision reasoning
- [ ] Portfolio balances update in real-time

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel via Git or CLI
```

### Docker
```bash
docker build -t crypto-trading-platform .
docker run -p 3000:3000 crypto-trading-platform
```

### Static Hosting
```bash
npm run build
# Upload dist/ folder to any static hosting service
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [User Guide](USER_GUIDE.md) - Complete user documentation
- [Developer Guide](DEV_GUIDE.md) - Development and contribution guide
- [Features List](FEATURES.md) - Detailed feature documentation

### Community
- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: General questions and community support

### Professional Support
For enterprise customers and advanced integrations, contact: support@crypto-beacon.com

## 🔗 Links

- **Live Demo**: [https://crypto-beacon-trader-hub.vercel.app](https://crypto-beacon-trader-hub.vercel.app)
- **Documentation**: [docs.crypto-beacon.com](https://docs.crypto-beacon.com)
- **Status Page**: [status.crypto-beacon.com](https://status.crypto-beacon.com)

## 📊 Project Status

- **Version**: 2.0.0
- **Status**: Production Ready
- **Last Updated**: January 2025
- **Compatibility**: Node.js 18+, Modern Browsers

---

**Built with ❤️ for the Australian crypto trading community**

*Disclaimer: This platform is for educational and paper trading purposes. Always conduct your own research before making financial decisions. Cryptocurrency trading carries significant risk.*
