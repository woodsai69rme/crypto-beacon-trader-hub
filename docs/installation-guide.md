
# Installation & Deployment Guide

## Prerequisites
Before installing the Crypto Dashboard application, ensure you have the following prerequisites:

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher (or equivalent package manager like yarn, pnpm, or bun)
- **Modern web browser**: Latest version of Chrome, Firefox, Safari, or Edge
- **Git**: For version control and deployment

## Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/crypto-dashboard.git
cd crypto-dashboard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory with the following variables:
```
VITE_API_URL=https://api.example.com/v1
VITE_API_KEY=your_api_key_here
VITE_EXCHANGE_RATE_API_KEY=your_exchange_rate_api_key
```

> **Note**: For the Exchange Rate API, we recommend using [ExchangeRate-API](https://www.exchangerate-api.com/) or [Open Exchange Rates](https://openexchangerates.org/). You'll need to sign up for a free account to get an API key.

### 4. Start the Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Production Deployment

### 1. Build the Application
```bash
npm run build
```

This will create a `dist` directory containing the optimized production build.

### 2. Deploy the Build

#### Using Vercel
Vercel is recommended for the simplest deployment experience:

```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts to complete deployment. For production deployment with a custom domain:

```bash
vercel --prod
```

#### Using Netlify
Netlify offers an easy deployment process with continuous integration:

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

#### Using AWS Amplify
For enterprises requiring AWS infrastructure:

1. Install AWS Amplify CLI:
```bash
npm install -g @aws-amplify/cli
amplify configure
```

2. Initialize Amplify in your project:
```bash
amplify init
```

3. Add hosting:
```bash
amplify add hosting
```

4. Deploy:
```bash
amplify publish
```

### 3. Configure Environment Variables on Deployment Platform

After deploying, ensure you set the following environment variables in your deployment platform:
- `VITE_API_URL`
- `VITE_API_KEY`
- `VITE_EXCHANGE_RATE_API_KEY`

## Docker Deployment

### 1. Create a Dockerfile in the Project Root
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Create nginx.conf
```
server {
  listen 80;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  # Cache static assets
  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 30d;
    add_header Cache-Control "public, no-transform";
  }
}
```

### 3. Build and Run the Docker Container
```bash
docker build -t crypto-dashboard .
docker run -p 8080:80 -e VITE_API_URL=https://api.example.com/v1 -e VITE_API_KEY=your_api_key crypto-dashboard
```

The application will be available at `http://localhost:8080`.

## Production Optimization Checklist

Before deploying to production, ensure you've completed the following:

1. **Performance Optimization**
   - Run Lighthouse audits and address performance issues
   - Enable code splitting and lazy loading for routes
   - Optimize image sizes and use WebP format
   - Implement resource preloading for critical assets

2. **Security**
   - Ensure all API keys are properly secured as environment variables
   - Set up proper CORS headers for API endpoints
   - Implement Content Security Policy (CSP)
   - Enable HTTPS for all connections

3. **SEO & Accessibility**
   - Add proper meta tags for SEO
   - Ensure all images have alt text
   - Verify keyboard navigation works correctly
   - Test with screen readers for accessibility compliance

4. **Analytics & Monitoring**
   - Set up error tracking (e.g., Sentry)
   - Configure analytics (e.g., Google Analytics, Plausible)
   - Implement logging for critical operations
   - Set up uptime monitoring

5. **Backup & Recovery**
   - Implement automated backups for user data
   - Document disaster recovery procedures
   - Test restore processes

## Scaling Considerations

As your user base grows, consider these scaling strategies:

1. **Frontend Scaling**
   - Use a CDN for static assets
   - Implement client-side caching
   - Consider server-side rendering for improved performance

2. **Backend Scaling**
   - Implement load balancing
   - Use database sharding for large datasets
   - Consider microservices architecture for high-traffic components

## Troubleshooting

### Common Issues

#### API Connection Problems
- Verify that your API key is correctly set in the environment variables
- Check network connectivity and firewall settings
- Validate that the API service is operational

#### Build Fails
- Clear the cache: `npm run clean`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Update dependencies: `npm update`

#### Performance Issues
- Check for memory leaks using browser developer tools
- Verify that API calls are properly cached
- Ensure images are optimized and properly sized

## Updating

To update to the latest version:

```bash
git pull
npm install
npm run build
```

## Support
For additional support, please contact:
- Technical Support: support@cryptodashboard.com
- Documentation Issues: docs@cryptodashboard.com
- Feature Requests: feedback@cryptodashboard.com
