
# ⚙️ Configuration Guide - Crypto Beacon Trading Platform

## Overview

This guide covers all configuration options for the Crypto Beacon Trading Platform, including environment variables, API configurations, feature flags, and deployment-specific settings.

## Environment Variables

### Core Application Settings

```env
# Application Identity
VITE_APP_NAME=Crypto Beacon Trading Platform
VITE_APP_VERSION=2.0.0
VITE_ENVIRONMENT=development|staging|production
VITE_DEBUG_MODE=true|false
VITE_LOG_LEVEL=debug|info|warn|error

# Base URLs
VITE_APP_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:5173/api
VITE_CDN_URL=https://cdn.your-domain.com
```

### Database Configuration

#### Option 1: Supabase (Recommended)
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
VITE_SUPABASE_JWT_SECRET=your-jwt-secret

# Supabase Features
VITE_SUPABASE_REALTIME=true
VITE_SUPABASE_AUTH=true
VITE_SUPABASE_STORAGE=true
```

#### Option 2: PostgreSQL
```env
# PostgreSQL Configuration
DATABASE_URL=postgresql://user:password@host:port/database
DATABASE_SSL=true|false
DATABASE_POOL_SIZE=10
DATABASE_TIMEOUT=30000
```

#### Option 3: SQLite (Offline Mode)
```env
# SQLite Configuration
DATABASE_TYPE=sqlite
DATABASE_PATH=./data/crypto_beacon.db
SQLITE_FOREIGN_KEYS=true
SQLITE_WAL_MODE=true
```

### API Service Configuration

#### Cryptocurrency Data APIs
```env
# CoinGecko API
VITE_COINGECKO_API_KEY=your-coingecko-api-key
VITE_COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
VITE_COINGECKO_RATE_LIMIT=100
VITE_COINGECKO_TIMEOUT=10000

# CryptoCompare API
VITE_CRYPTOCOMPARE_API_KEY=your-cryptocompare-api-key
VITE_CRYPTOCOMPARE_BASE_URL=https://min-api.cryptocompare.com/data
VITE_CRYPTOCOMPARE_RATE_LIMIT=2000
VITE_CRYPTOCOMPARE_TIMEOUT=10000

# CoinMarketCap API
VITE_COINMARKETCAP_API_KEY=your-coinmarketcap-api-key
VITE_COINMARKETCAP_BASE_URL=https://api.coinmarketcap.com/v1
VITE_COINMARKETCAP_RATE_LIMIT=333
```

#### AI Services
```env
# OpenRouter API (AI Trading)
VITE_OPENROUTER_API_KEY=your-openrouter-api-key
VITE_OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
VITE_OPENROUTER_DEFAULT_MODEL=anthropic/claude-3-sonnet
VITE_OPENROUTER_RATE_LIMIT=60
VITE_OPENROUTER_TIMEOUT=30000

# Alternative AI APIs
VITE_OPENAI_API_KEY=your-openai-api-key
VITE_ANTHROPIC_API_KEY=your-anthropic-api-key
VITE_GOOGLE_AI_API_KEY=your-google-ai-api-key
```

#### Blockchain Integration
```env
# Algorand Integration
VITE_ALGORAND_API_TOKEN=98D9CE80660AD243893D56D9F125CD2D
VITE_ALGORAND_API_URL=https://mainnet-api.4160.nodely.io
VITE_ALGORAND_INDEXER_URL=https://mainnet-idx.4160.nodely.io
VITE_ALGORAND_NETWORK=mainnet|testnet

# Ethereum/Web3
VITE_ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your-project-id
VITE_POLYGON_RPC_URL=https://polygon-rpc.com
VITE_BSC_RPC_URL=https://bsc-dataseed.binance.org
VITE_AVALANCHE_RPC_URL=https://api.avax.network/ext/bc/C/rpc

# Web3 Wallet Configuration
VITE_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id
VITE_ENABLE_WALLET_CONNECT=true
VITE_ENABLE_METAMASK=true
VITE_ENABLE_COINBASE_WALLET=true
```

### Exchange APIs (Live Trading)

```env
# Binance
VITE_BINANCE_API_KEY=your-binance-api-key
VITE_BINANCE_SECRET=your-binance-secret
VITE_BINANCE_SANDBOX=true|false
VITE_BINANCE_RATE_LIMIT=1200

# Coinbase Pro
VITE_COINBASE_API_KEY=your-coinbase-api-key
VITE_COINBASE_SECRET=your-coinbase-secret
VITE_COINBASE_PASSPHRASE=your-coinbase-passphrase
VITE_COINBASE_SANDBOX=true|false

# Kraken
VITE_KRAKEN_API_KEY=your-kraken-api-key
VITE_KRAKEN_SECRET=your-kraken-secret
VITE_KRAKEN_RATE_LIMIT=15

# OKX
VITE_OKX_API_KEY=your-okx-api-key
VITE_OKX_SECRET=your-okx-secret
VITE_OKX_PASSPHRASE=your-okx-passphrase

# Bybit
VITE_BYBIT_API_KEY=your-bybit-api-key
VITE_BYBIT_SECRET=your-bybit-secret
VITE_BYBIT_TESTNET=true|false

# KuCoin
VITE_KUCOIN_API_KEY=your-kucoin-api-key
VITE_KUCOIN_SECRET=your-kucoin-secret
VITE_KUCOIN_PASSPHRASE=your-kucoin-passphrase
```

### News & Social APIs

```env
# News APIs
VITE_NEWSAPI_KEY=your-newsapi-key
VITE_CRYPTOPANIC_KEY=your-cryptopanic-key
VITE_COINDESK_API_KEY=your-coindesk-key
VITE_COINTELEGRAPH_API_KEY=your-cointelegraph-key

# Social Media APIs
VITE_TWITTER_BEARER_TOKEN=your-twitter-bearer-token
VITE_REDDIT_CLIENT_ID=your-reddit-client-id
VITE_REDDIT_CLIENT_SECRET=your-reddit-client-secret
VITE_DISCORD_WEBHOOK=your-discord-webhook-url
VITE_TELEGRAM_BOT_TOKEN=your-telegram-bot-token
```

### Analytics & Monitoring

```env
# Google Analytics
VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
VITE_GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX

# Error Tracking
VITE_SENTRY_DSN=your-sentry-dsn
VITE_SENTRY_ENVIRONMENT=development|staging|production
VITE_SENTRY_RELEASE=2.0.0

# Performance Monitoring
VITE_DATADOG_CLIENT_TOKEN=your-datadog-token
VITE_MIXPANEL_TOKEN=your-mixpanel-token
VITE_HOTJAR_ID=your-hotjar-id
```

### Email Services

```env
# Resend (Recommended)
VITE_RESEND_API_KEY=your-resend-api-key
VITE_RESEND_FROM_EMAIL=noreply@your-domain.com

# SendGrid
VITE_SENDGRID_API_KEY=your-sendgrid-api-key
VITE_SENDGRID_FROM_EMAIL=noreply@your-domain.com

# Mailgun
VITE_MAILGUN_API_KEY=your-mailgun-api-key
VITE_MAILGUN_DOMAIN=your-mailgun-domain
```

## Feature Flags

### Core Features
```env
# Trading Features
VITE_ENABLE_PAPER_TRADING=true
VITE_ENABLE_LIVE_TRADING=false
VITE_ENABLE_COPY_TRADING=true
VITE_ENABLE_SOCIAL_TRADING=true

# AI Features
VITE_ENABLE_AI_BOTS=true
VITE_ENABLE_AI_ANALYSIS=true
VITE_ENABLE_AI_NEWS_ANALYSIS=true
VITE_ENABLE_LOCAL_AI_MODELS=false

# Web3 Features
VITE_ENABLE_WEB3=true
VITE_ENABLE_DEFI_INTEGRATION=true
VITE_ENABLE_NFT_TRACKING=false
VITE_ENABLE_DAO_FEATURES=true

# Analytics Features
VITE_ENABLE_ADVANCED_CHARTS=true
VITE_ENABLE_TECHNICAL_INDICATORS=true
VITE_ENABLE_PORTFOLIO_ANALYTICS=true
VITE_ENABLE_TAX_CALCULATIONS=true
```

### UI/UX Features
```env
# Interface Features
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_CUSTOM_THEMES=true
VITE_ENABLE_RESPONSIVE_DESIGN=true
VITE_ENABLE_PWA=true

# Accessibility
VITE_ENABLE_ACCESSIBILITY_MODE=true
VITE_ENABLE_HIGH_CONTRAST=true
VITE_ENABLE_SCREEN_READER=true
```

### Experimental Features
```env
# Beta Features
VITE_ENABLE_BETA_FEATURES=false
VITE_ENABLE_EXPERIMENTAL_UI=false
VITE_ENABLE_ADVANCED_AI=false
VITE_ENABLE_QUANTUM_RESISTANCE=false
```

## Regional & Localization Settings

### Currency & Locale
```env
# Default Currency
VITE_DEFAULT_CURRENCY=AUD
VITE_SUPPORTED_CURRENCIES=AUD,USD,EUR,GBP,JPY,CAD,CHF

# Localization
VITE_DEFAULT_LOCALE=en-AU
VITE_SUPPORTED_LOCALES=en-AU,en-US,en-GB,fr-FR,de-DE,ja-JP,zh-CN

# Regional Settings
VITE_DEFAULT_TIMEZONE=Australia/Sydney
VITE_DATE_FORMAT=DD/MM/YYYY
VITE_TIME_FORMAT=24h|12h
VITE_NUMBER_FORMAT=australian|us|european
```

### Tax Configuration
```env
# Australian Tax Settings (ATO)
VITE_TAX_JURISDICTION=AU
VITE_ENABLE_CGT_CALCULATIONS=true
VITE_TAX_YEAR_START=07-01
VITE_TAX_YEAR_END=06-30

# Other Jurisdictions
VITE_US_TAX_SUPPORT=false
VITE_UK_TAX_SUPPORT=false
VITE_EU_TAX_SUPPORT=false
```

## Security Configuration

### Authentication & Authorization
```env
# Authentication Settings
VITE_AUTH_TIMEOUT=3600000
VITE_REQUIRE_2FA=false
VITE_ENABLE_BIOMETRIC_AUTH=false
VITE_PASSWORD_MIN_LENGTH=8
VITE_PASSWORD_REQUIRE_SPECIAL=true

# Session Management
VITE_SESSION_TIMEOUT=1800000
VITE_REMEMBER_ME_DURATION=2592000000
VITE_CONCURRENT_SESSIONS=3
```

### Security Features
```env
# Security Headers
VITE_ENABLE_CSP=true
VITE_ENABLE_HSTS=true
VITE_ENABLE_XSS_PROTECTION=true
VITE_ENABLE_FRAME_OPTIONS=true

# API Security
VITE_ENABLE_RATE_LIMITING=true
VITE_RATE_LIMIT_REQUESTS=100
VITE_RATE_LIMIT_WINDOW=900000
VITE_ENABLE_API_CORS=true
VITE_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com

# Data Protection
VITE_ENABLE_DATA_ENCRYPTION=true
VITE_ENCRYPTION_ALGORITHM=AES-256-GCM
VITE_ENABLE_GDPR_COMPLIANCE=true
```

## Performance Configuration

### Caching Settings
```env
# Browser Caching
VITE_CACHE_STATIC_ASSETS=true
VITE_CACHE_DURATION=31536000
VITE_ENABLE_SERVICE_WORKER=true
VITE_ENABLE_OFFLINE_MODE=false

# API Caching
VITE_ENABLE_API_CACHE=true
VITE_API_CACHE_DURATION=300000
VITE_CACHE_STRATEGY=stale-while-revalidate
```

### Performance Optimization
```env
# Bundle Optimization
VITE_ENABLE_CODE_SPLITTING=true
VITE_ENABLE_LAZY_LOADING=true
VITE_ENABLE_PRELOADING=true
VITE_CHUNK_SIZE_WARNING_LIMIT=500

# Resource Optimization
VITE_ENABLE_IMAGE_OPTIMIZATION=true
VITE_IMAGE_QUALITY=80
VITE_ENABLE_GZIP_COMPRESSION=true
VITE_ENABLE_BROTLI_COMPRESSION=true
```

## Development Configuration

### Development Features
```env
# Development Tools
VITE_ENABLE_DEVTOOLS=true
VITE_ENABLE_HOT_RELOAD=true
VITE_ENABLE_ERROR_OVERLAY=true
VITE_ENABLE_SOURCE_MAPS=true

# Testing & Debugging
VITE_ENABLE_TESTING_MODE=false
VITE_USE_MOCK_DATA=false
VITE_ENABLE_CONSOLE_LOGS=true
VITE_LOG_API_CALLS=false
```

### Mock Data Settings
```env
# Mock Data Configuration
VITE_MOCK_TRADING_DATA=false
VITE_MOCK_PRICE_DATA=false
VITE_MOCK_NEWS_DATA=false
VITE_MOCK_USER_DATA=false
VITE_MOCK_AI_RESPONSES=false
```

## Database Configuration

### Connection Settings
```env
# Connection Pool
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
DATABASE_POOL_IDLE_TIMEOUT=30000
DATABASE_POOL_ACQUIRE_TIMEOUT=30000

# Query Settings
DATABASE_QUERY_TIMEOUT=10000
DATABASE_STATEMENT_TIMEOUT=30000
DATABASE_IDLE_IN_TRANSACTION_SESSION_TIMEOUT=60000
```

### Backup Settings
```env
# Automated Backups
ENABLE_AUTO_BACKUP=true
BACKUP_SCHEDULE=0 2 * * *
BACKUP_RETENTION_DAYS=30
BACKUP_S3_BUCKET=your-backup-bucket
BACKUP_ENCRYPTION=true
```

## API Rate Limiting

### Provider-Specific Limits
```env
# CoinGecko Rate Limits
COINGECKO_REQUESTS_PER_MINUTE=50
COINGECKO_BURST_LIMIT=10

# OpenRouter Rate Limits
OPENROUTER_REQUESTS_PER_MINUTE=60
OPENROUTER_CONCURRENT_REQUESTS=5

# Exchange Rate Limits
BINANCE_REQUESTS_PER_SECOND=10
COINBASE_REQUESTS_PER_SECOND=5
KRAKEN_REQUESTS_PER_SECOND=1
```

## Environment-Specific Configurations

### Development Environment
```env
# development.env
VITE_ENVIRONMENT=development
VITE_DEBUG_MODE=true
VITE_USE_MOCK_DATA=true
VITE_ENABLE_DEVTOOLS=true
VITE_LOG_LEVEL=debug
VITE_HOT_RELOAD=true
```

### Staging Environment
```env
# staging.env
VITE_ENVIRONMENT=staging
VITE_DEBUG_MODE=false
VITE_USE_MOCK_DATA=false
VITE_ENABLE_DEVTOOLS=false
VITE_LOG_LEVEL=info
VITE_SENTRY_ENVIRONMENT=staging
```

### Production Environment
```env
# production.env
VITE_ENVIRONMENT=production
VITE_DEBUG_MODE=false
VITE_USE_MOCK_DATA=false
VITE_ENABLE_DEVTOOLS=false
VITE_LOG_LEVEL=warn
VITE_SENTRY_ENVIRONMENT=production
VITE_ENABLE_RATE_LIMITING=true
VITE_ENABLE_DATA_ENCRYPTION=true
```

## Docker Configuration

### Docker Environment Variables
```env
# Docker-specific settings
DOCKER_ENV=production
CONTAINER_PORT=3000
HEALTH_CHECK_INTERVAL=30s
HEALTH_CHECK_TIMEOUT=10s
HEALTH_CHECK_RETRIES=3
```

### Docker Compose Environment
```yaml
# docker-compose.yml environment section
environment:
  - NODE_ENV=production
  - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
  - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
  - VITE_OPENROUTER_API_KEY=${VITE_OPENROUTER_API_KEY}
```

## Configuration Validation

### Environment Variable Validation
```typescript
// src/config/validation.ts
const configSchema = {
  VITE_SUPABASE_URL: { required: true, type: 'url' },
  VITE_SUPABASE_ANON_KEY: { required: true, type: 'string', minLength: 32 },
  VITE_OPENROUTER_API_KEY: { required: false, type: 'string' },
  VITE_ENVIRONMENT: { required: true, enum: ['development', 'staging', 'production'] }
};
```

### Configuration Loading Order
1. Default configuration values
2. Environment-specific configuration files
3. Environment variables
4. Command-line arguments
5. Runtime configuration updates

## Troubleshooting Configuration Issues

### Common Configuration Problems

#### Missing Environment Variables
```bash
# Check for missing variables
npm run config:validate

# Output example:
❌ VITE_SUPABASE_URL is required but not set
❌ VITE_SUPABASE_ANON_KEY is required but not set
✅ VITE_OPENROUTER_API_KEY is optional and set
```

#### Invalid Configuration Values
```bash
# Validate configuration format
npm run config:check

# Output example:
❌ VITE_SUPABASE_URL must be a valid URL
❌ VITE_RATE_LIMIT_REQUESTS must be a number
✅ All other configurations are valid
```

#### Configuration Conflicts
```bash
# Check for conflicting settings
npm run config:analyze

# Output example:
⚠️  VITE_USE_MOCK_DATA=true in production environment
⚠️  VITE_ENABLE_LIVE_TRADING=true without exchange API keys
```

### Configuration Debugging

#### Debug Configuration Loading
```typescript
// Enable configuration debugging
VITE_DEBUG_CONFIG=true

// This will log:
// - Configuration loading order
// - Final merged configuration
// - Missing or invalid values
// - Environment-specific overrides
```

#### Configuration Health Check
```bash
# Run configuration health check
npm run config:health

# Checks:
# - Database connectivity
# - API endpoint accessibility
# - Authentication token validity
# - Feature flag consistency
```

## Best Practices

### Security Best Practices
1. **Never commit API keys** to version control
2. **Use environment-specific configurations** for different deployment stages
3. **Rotate API keys regularly** in production
4. **Enable rate limiting** to prevent API abuse
5. **Use HTTPS** for all external API calls
6. **Encrypt sensitive data** at rest and in transit

### Performance Best Practices
1. **Enable caching** for static resources and API responses
2. **Use CDN** for static asset delivery
3. **Optimize bundle size** with code splitting
4. **Configure appropriate timeouts** for external API calls
5. **Monitor resource usage** and adjust limits as needed

### Maintenance Best Practices
1. **Document all configuration changes**
2. **Test configuration changes** in staging before production
3. **Monitor configuration health** with automated checks
4. **Keep backup copies** of working configurations
5. **Review and update** configurations regularly

---

**Configuration Support**
- 📖 [Setup Guide](./setup.md)
- 🚀 [Deployment Guide](./deployment.md)
- 🔧 [Testing Guide](./testing.md)
- 🐛 [Issue Tracker](https://github.com/crypto-beacon/issues)
