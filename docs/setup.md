
# 🛠️ Setup Guide - Crypto Beacon Trading Platform

## System Requirements

### Minimum Requirements
- **OS**: Windows 10+, macOS 10.15+, Ubuntu 18.04+
- **Node.js**: v18.0.0 or higher
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 5GB free space for dependencies
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Recommended Development Tools
- **IDE**: Visual Studio Code with extensions:
  - ES7+ React/Redux/React-Native snippets
  - TypeScript Importer
  - Prettier - Code formatter
  - ESLint
  - Tailwind CSS IntelliSense
  - Auto Import - ES6, TS, JSX, TSX
- **Git**: Latest version
- **Docker**: For containerized development (optional)

## Installation Methods

### Method 1: Automated Setup (Recommended)

#### Windows
```cmd
# Run automated setup script
.\scripts\setup.bat

# Or manually:
git clone https://github.com/crypto-beacon/platform.git
cd crypto-beacon
npm install
copy .env.example .env.local
npm run dev
```

#### macOS/Linux
```bash
# Run automated setup script
./scripts/setup.sh

# Or manually:
git clone https://github.com/crypto-beacon/platform.git
cd crypto-beacon
npm install
cp .env.example .env.local
npm run dev
```

### Method 2: Manual Installation

#### Step 1: Clone Repository
```bash
git clone https://github.com/crypto-beacon/platform.git
cd crypto-beacon
```

#### Step 2: Install Dependencies
```bash
# Using npm (recommended)
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

#### Step 3: Environment Configuration
```bash
# Copy environment template
cp .env.example .env.local

# Edit configuration
nano .env.local  # Linux/macOS
notepad .env.local  # Windows
```

#### Step 4: Database Setup

##### Option A: Supabase (Recommended)
1. Visit [Supabase Dashboard](https://supabase.com/dashboard)
2. Create new project
3. Copy URL and anon key to `.env.local`
4. Run database migrations: `npm run db:migrate`

##### Option B: Local PostgreSQL
```bash
# Install PostgreSQL locally
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS with Homebrew
brew install postgresql

# Windows - Download from postgresql.org

# Create database
createdb crypto_beacon

# Update .env.local with connection string
DATABASE_URL=postgresql://user:password@localhost:5432/crypto_beacon
```

##### Option C: SQLite (Offline Mode)
```bash
# For offline development
DATABASE_TYPE=sqlite
DATABASE_PATH=./data/crypto_beacon.db
```

## Environment Configuration

### Required Variables
```env
# Application
VITE_APP_NAME=Crypto Beacon Trading Platform
VITE_APP_VERSION=2.0.0
VITE_ENVIRONMENT=development

# Database (choose one option)
# Option 1: Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Option 2: PostgreSQL
DATABASE_URL=postgresql://user:pass@host:port/database

# Option 3: SQLite (offline)
DATABASE_TYPE=sqlite
DATABASE_PATH=./data/crypto_beacon.db

# API Services
VITE_OPENROUTER_API_KEY=your_openrouter_key
VITE_COINGECKO_API_KEY=your_coingecko_key
VITE_CRYPTOCOMPARE_API_KEY=your_cryptocompare_key

# Blockchain Integration
VITE_ALGORAND_API_TOKEN=98D9CE80660AD243893D56D9F125CD2D
VITE_ALGORAND_API_URL=https://mainnet-api.4160.nodely.io
VITE_ALGORAND_INDEXER_URL=https://mainnet-idx.4160.nodely.io

# Feature Flags
VITE_ENABLE_LIVE_TRADING=false
VITE_ENABLE_AI_BOTS=true
VITE_ENABLE_WEB3=true
VITE_ENABLE_SOCIAL_TRADING=true
```

### Optional Variables (Enhanced Features)
```env
# Exchange APIs (for live trading)
VITE_BINANCE_API_KEY=your_binance_key
VITE_BINANCE_SECRET=your_binance_secret
VITE_COINBASE_API_KEY=your_coinbase_key
VITE_COINBASE_SECRET=your_coinbase_secret
VITE_KRAKEN_API_KEY=your_kraken_key
VITE_KRAKEN_SECRET=your_kraken_secret

# News APIs
VITE_NEWSAPI_KEY=your_newsapi_key
VITE_CRYPTOPANIC_KEY=your_cryptopanic_key

# Analytics
VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
VITE_SENTRY_DSN=your_sentry_dsn

# Email Services
VITE_RESEND_API_KEY=your_resend_key
VITE_SENDGRID_API_KEY=your_sendgrid_key

# Social Features
VITE_DISCORD_WEBHOOK=your_discord_webhook
VITE_TELEGRAM_BOT_TOKEN=your_telegram_token
```

## Development Server

### Start Development
```bash
# Start development server
npm run dev

# With specific port
npm run dev -- --port 3000

# With host binding
npm run dev -- --host 0.0.0.0

# Open automatically in browser
npm run dev -- --open
```

### Development URLs
- **Main Application**: http://localhost:5173
- **API Documentation**: http://localhost:5173/api/docs
- **Testing Dashboard**: http://localhost:5173/testing
- **Storybook** (if enabled): http://localhost:6006

## Database Setup

### Supabase Setup
```bash
# Install Supabase CLI
npm install -g @supabase/cli

# Login to Supabase
supabase login

# Initialize project
supabase init

# Link to remote project
supabase link --project-ref your-project-ref

# Push schema changes
supabase db push

# Generate TypeScript types
supabase gen types typescript --local > src/types/supabase.ts
```

### Local PostgreSQL Setup
```sql
-- Create database
CREATE DATABASE crypto_beacon;

-- Create user
CREATE USER crypto_user WITH PASSWORD 'crypto_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE crypto_beacon TO crypto_user;

-- Connect and create schema
\c crypto_beacon;

-- Run migrations
-- (migrations will be auto-generated)
```

### SQLite Setup (Offline Mode)
```bash
# Create data directory
mkdir -p data

# SQLite database will be created automatically
# on first run when DATABASE_TYPE=sqlite
```

## API Keys Setup

### Free APIs (No Registration Required)
- **CoinGecko**: Public API (rate limited)
- **CoinCap**: Public API
- **Algorand**: Provided token included

### Paid/Premium APIs

#### OpenRouter (AI Trading)
1. Visit [OpenRouter](https://openrouter.ai)
2. Create account and get API key
3. Add to `VITE_OPENROUTER_API_KEY`

#### CoinGecko Pro
1. Visit [CoinGecko API](https://www.coingecko.com/api)
2. Subscribe to plan
3. Add key to `VITE_COINGECKO_API_KEY`

#### Exchange APIs
```bash
# Binance
1. Create Binance account
2. Generate API key with trading permissions
3. Add to VITE_BINANCE_API_KEY and VITE_BINANCE_SECRET

# Coinbase Pro
1. Create Coinbase Pro account
2. Generate API credentials
3. Add to respective environment variables

# Kraken
1. Create Kraken account
2. Generate API key pair
3. Configure in environment
```

## Verification Steps

### 1. Installation Verification
```bash
# Check Node.js version
node --version  # Should be 18.0.0+

# Check npm version
npm --version   # Should be 8.0.0+

# Verify dependencies
npm list        # Should show no errors
```

### 2. Application Health Check
```bash
# Start application
npm run dev

# Run health check
curl http://localhost:5173/api/health

# Expected response:
{
  "status": "healthy",
  "version": "2.0.0",
  "database": "connected",
  "apis": {
    "coingecko": "connected",
    "openrouter": "connected"
  }
}
```

### 3. Feature Testing
```bash
# Run automated tests
npm run test

# Run specific test suites
npm run test:unit          # Unit tests
npm run test:integration   # Integration tests
npm run test:e2e          # End-to-end tests

# Run platform audit
npm run audit
```

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 5173
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5173 | xargs kill -9

# Use different port
npm run dev -- --port 3000
```

#### Database Connection Issues
```bash
# Check Supabase connection
npx supabase status

# Test PostgreSQL connection
psql $DATABASE_URL -c "SELECT 1;"

# Reset database (destructive)
npm run db:reset
```

#### API Rate Limits
```bash
# Check API usage
npm run api:status

# Enable caching
VITE_ENABLE_API_CACHE=true

# Use mock data for development
VITE_USE_MOCK_DATA=true
```

#### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check

# Fix linting issues
npm run lint:fix
```

### Development Mode Issues

#### Hot Reload Not Working
```bash
# Check file watchers limit (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Clear Vite cache
rm -rf node_modules/.vite
```

#### Memory Issues
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=8192"

# Or in package.json scripts:
"dev": "NODE_OPTIONS='--max-old-space-size=8192' vite"
```

## Advanced Configuration

### Custom Themes
```bash
# Copy default theme
cp src/styles/themes/default.css src/styles/themes/custom.css

# Edit custom theme
# Update CSS variables for colors, fonts, spacing

# Apply theme in src/App.tsx
import './styles/themes/custom.css';
```

### Plugin Development
```bash
# Create plugin directory
mkdir src/plugins/my-plugin

# Plugin structure
src/plugins/my-plugin/
├── index.ts
├── components/
├── hooks/
└── types.ts
```

### Local AI Models
```bash
# Install Ollama (optional)
curl -fsSL https://ollama.ai/install.sh | sh

# Pull models
ollama pull llama2
ollama pull codellama

# Configure in .env.local
VITE_ENABLE_LOCAL_AI=true
VITE_OLLAMA_URL=http://localhost:11434
```

## Next Steps

1. **Review Configuration**: Verify all environment variables
2. **Run Tests**: Execute full test suite
3. **Explore Features**: Navigate through the application
4. **Read Documentation**: Check out deployment and configuration guides
5. **Join Community**: Connect with other developers

---

**Need Help?**
- 📖 [Documentation](./README.md)
- 🐛 [Report Issues](https://github.com/crypto-beacon/issues)
- 💬 [Discord Community](https://discord.gg/crypto-beacon)
- 📧 [Email Support](mailto:support@crypto-beacon.com)
