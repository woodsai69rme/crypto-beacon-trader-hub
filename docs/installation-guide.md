
# Installation Guide

## Prerequisites
Before installing the Crypto Dashboard application, ensure you have the following prerequisites:

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher (or equivalent package manager like yarn, pnpm, or bun)
- **Modern web browser**: Latest version of Chrome, Firefox, Safari, or Edge

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
```

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
You can deploy the contents of the `dist` directory to your preferred hosting service:

#### Using Vercel
```bash
npm install -g vercel
vercel
```

#### Using Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

## Docker Deployment

### 1. Build the Docker Image
```bash
docker build -t crypto-dashboard .
```

### 2. Run the Docker Container
```bash
docker run -p 8080:80 crypto-dashboard
```

The application will be available at `http://localhost:8080`.

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

