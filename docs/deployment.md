
# 🚀 Deployment Guide - Crypto Beacon Trading Platform

## Overview

This guide covers deploying the Crypto Beacon Trading Platform to various environments, from local development to production cloud platforms. The platform is designed to be portable and can run on any modern hosting environment.

## Deployment Targets

### ✅ Supported Platforms
- **Local Development**: Windows, macOS, Linux
- **Docker**: Containerized deployment
- **Vercel**: Serverless React deployment
- **Netlify**: Static site with serverless functions
- **Render**: Full-stack application deployment
- **Railway**: Container-based deployment
- **Fly.io**: Global application deployment
- **GitHub Pages**: Static site deployment
- **Self-Hosted VPS**: Ubuntu/CentOS/Debian servers
- **Heroku**: Platform-as-a-Service deployment

## Pre-Deployment Checklist

### 1. Code Preparation
```bash
# Run all tests
npm run test

# Type checking
npm run type-check

# Linting
npm run lint

# Build verification
npm run build

# Bundle analysis
npm run analyze
```

### 2. Environment Variables
Ensure all required environment variables are configured:
```env
# Required for all deployments
VITE_APP_NAME=Crypto Beacon Trading Platform
VITE_APP_VERSION=2.0.0
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# Optional but recommended
VITE_OPENROUTER_API_KEY=your_openrouter_key
VITE_COINGECKO_API_KEY=your_coingecko_key
VITE_SENTRY_DSN=your_sentry_dsn
```

### 3. Database Setup
- Supabase project configured
- Database migrations applied
- Row Level Security (RLS) policies enabled

## Local Development Deployment

### Docker Deployment
```bash
# Build Docker image
docker build -t crypto-beacon .

# Run with environment variables
docker run -p 3000:3000 --env-file .env.local crypto-beacon

# Or use Docker Compose
docker-compose up -d
```

### Docker Compose Configuration
```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
    volumes:
      - ./data:/app/data
  
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: crypto_beacon
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

## Cloud Platform Deployments

### 1. Vercel Deployment

#### Automatic Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel

# Production deployment
vercel --prod
```

#### Configuration Files
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_SUPABASE_URL": "@supabase-url",
    "VITE_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

#### GitHub Integration
1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Auto-deploy on git push to main branch

### 2. Netlify Deployment

#### CLI Deployment
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

#### Configuration Files
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

#### GitHub Integration
1. Connect repository to Netlify
2. Configure build settings
3. Set environment variables
4. Enable auto-deploy

### 3. Render Deployment

#### render.yaml Configuration
```yaml
services:
  - type: web
    name: crypto-beacon
    env: node
    plan: starter
    buildCommand: npm install && npm run build
    startCommand: npm run preview
    envVars:
      - key: NODE_VERSION
        value: 18
      - key: VITE_SUPABASE_URL
        fromDatabase:
          name: supabase-url
          property: connectionString
```

#### Manual Deployment
1. Create new Web Service on Render
2. Connect GitHub repository
3. Configure build and start commands
4. Set environment variables
5. Deploy

### 4. Railway Deployment

#### Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

#### Configuration
```json
// railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run preview",
    "healthcheckPath": "/api/health"
  }
}
```

### 5. Fly.io Deployment

#### Fly.io Configuration
```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Launch app
flyctl launch

# Deploy
flyctl deploy
```

#### fly.toml Configuration
```toml
app = "crypto-beacon"

[build]
  builder = "heroku/nodejs"

[[services]]
  internal_port = 3000
  protocol = "tcp"

  [[services.ports]]
    handlers = ["http"]
    port = "80"

  [[services.ports]]
    handlers = ["tls", "http"]
    port = "443"

[env]
  NODE_ENV = "production"
  PORT = "3000"
```

### 6. GitHub Pages Deployment

#### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run test
    
    - name: Build
      run: npm run build
      env:
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## Self-Hosted VPS Deployment

### Ubuntu/Debian Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone https://github.com/crypto-beacon/platform.git
cd platform

# Install dependencies
npm install

# Build application
npm run build

# Create PM2 ecosystem file
```

#### PM2 Ecosystem Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'crypto-beacon',
    script: './node_modules/.bin/vite',
    args: 'preview --host 0.0.0.0 --port 3000',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY
    }
  }]
};
```

#### Nginx Configuration
```nginx
# /etc/nginx/sites-available/crypto-beacon
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### SSL with Let's Encrypt
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Database Deployment Options

### 1. Supabase (Recommended)
- Managed PostgreSQL with automatic backups
- Built-in authentication and real-time features
- Global CDN and edge functions
- Generous free tier

### 2. Self-Hosted PostgreSQL
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres createdb crypto_beacon
sudo -u postgres createuser --interactive crypto_user

# Configure connection
DATABASE_URL=postgresql://crypto_user:password@localhost:5432/crypto_beacon
```

### 3. SQLite (Offline Mode)
```bash
# For lightweight deployments
DATABASE_TYPE=sqlite
DATABASE_PATH=/app/data/crypto_beacon.db

# Ensure data directory exists
mkdir -p /app/data
```

## Environment-Specific Configurations

### Production Environment Variables
```env
# Application
VITE_APP_NAME=Crypto Beacon Trading Platform
VITE_APP_VERSION=2.0.0
VITE_ENVIRONMENT=production

# Database
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key

# APIs
VITE_OPENROUTER_API_KEY=your-production-openrouter-key
VITE_COINGECKO_API_KEY=your-production-coingecko-key

# Analytics & Monitoring
VITE_SENTRY_DSN=your-sentry-dsn
VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX

# Security
VITE_ENABLE_HTTPS=true
VITE_CSRF_PROTECTION=true
VITE_RATE_LIMITING=true
```

### Staging Environment
```env
# Staging-specific variables
VITE_ENVIRONMENT=staging
VITE_SUPABASE_URL=https://your-staging-project.supabase.co
VITE_DEBUG_MODE=true
VITE_USE_MOCK_DATA=false
```

### Development Environment
```env
# Development-specific variables
VITE_ENVIRONMENT=development
VITE_DEBUG_MODE=true
VITE_USE_MOCK_DATA=true
VITE_HOT_RELOAD=true
```

## CI/CD Pipeline

### GitHub Actions Complete Workflow
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run type checking
      run: npm run type-check
    
    - name: Run unit tests
      run: npm run test:unit
    
    - name: Run integration tests
      run: npm run test:integration
    
    - name: Build application
      run: npm run build
    
    - name: Run E2E tests
      run: npm run test:e2e
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Staging
      run: |
        # Deploy to staging environment
        echo "Deploying to staging..."
        
  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Production
      run: |
        # Deploy to production environment
        echo "Deploying to production..."
```

## Monitoring & Health Checks

### Health Check Endpoint
```typescript
// src/api/health.ts
export const healthCheck = {
  status: 'healthy',
  version: process.env.VITE_APP_VERSION,
  timestamp: new Date().toISOString(),
  database: 'connected',
  apis: {
    supabase: 'connected',
    coingecko: 'connected',
    openrouter: 'connected'
  },
  features: {
    trading: true,
    ai_bots: true,
    web3: true,
    social: true
  }
};
```

### Monitoring Setup
```bash
# Application Performance Monitoring
VITE_SENTRY_DSN=your-sentry-dsn

# Analytics
VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX

# Uptime monitoring
# Configure external services like:
# - UptimeRobot
# - Pingdom
# - StatusCake
```

## Security Considerations

### Production Security Checklist
- ✅ HTTPS enabled with SSL certificate
- ✅ Environment variables secured
- ✅ API keys in secure storage (not in code)
- ✅ CORS properly configured
- ✅ Rate limiting implemented
- ✅ Input validation on all forms
- ✅ SQL injection prevention
- ✅ XSS protection enabled
- ✅ CSRF tokens implemented
- ✅ Security headers configured

### Security Headers Configuration
```javascript
// Security headers for production
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'",
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};
```

## Backup & Recovery

### Database Backups
```bash
# Automated Supabase backups (built-in)
# Manual backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
psql $DATABASE_URL < backup_file.sql
```

### Application Data Backup
```bash
# Backup user data and configurations
tar -czf app_data_backup.tar.gz data/ uploads/ logs/

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf "backup_$DATE.tar.gz" data/ uploads/ logs/
aws s3 cp "backup_$DATE.tar.gz" s3://your-backup-bucket/
```

## Rollback Procedures

### Quick Rollback
```bash
# Revert to previous deployment
vercel rollback  # For Vercel
netlify deploy --alias previous  # For Netlify

# Docker rollback
docker pull crypto-beacon:previous
docker stop crypto-beacon-current
docker run crypto-beacon:previous
```

### Database Rollback
```bash
# Revert database migrations
npm run db:rollback

# Restore from backup
psql $DATABASE_URL < backup_before_deployment.sql
```

## Performance Optimization

### Build Optimization
```javascript
// vite.config.ts optimizations
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
```

### CDN Configuration
```javascript
// Configure CDN for static assets
const cdnConfig = {
  fonts: 'https://fonts.googleapis.com',
  images: 'https://cdn.your-domain.com',
  static: 'https://static.your-domain.com'
};
```

## Troubleshooting Deployment Issues

### Common Issues & Solutions

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules dist .vite
npm install
npm run build

# Check for TypeScript errors
npm run type-check

# Verify environment variables
echo $VITE_SUPABASE_URL
```

#### Runtime Errors
```bash
# Check application logs
# Vercel
vercel logs

# Netlify
netlify logs

# Docker
docker logs crypto-beacon
```

#### Database Connection Issues
```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1;"

# Check Supabase status
curl https://your-project.supabase.co/rest/v1/health
```

#### Performance Issues
```bash
# Monitor application performance
npm run analyze

# Check bundle size
npx bundlephobia analyze

# Lighthouse audit
npx lighthouse http://your-domain.com
```

---

**Deployment Support**
- 📖 [Setup Guide](./setup.md)
- 🔧 [Configuration Guide](./config.md)
- 🐛 [Issue Tracker](https://github.com/crypto-beacon/issues)
- 💬 [Discord Community](https://discord.gg/crypto-beacon)
