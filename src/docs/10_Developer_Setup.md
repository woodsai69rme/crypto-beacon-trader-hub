# Developer Setup Guide

## Introduction

This document provides step-by-step instructions for setting up the Crypto Beacon Trader Hub development environment. By following these instructions, you'll have a fully functional local development environment where you can contribute to the project.

## System Requirements

### Minimum Requirements

- **CPU**: 4 cores
- **RAM**: 8 GB
- **Disk Space**: 10 GB available
- **Operating System**: macOS 10.15+, Windows 10+, or Linux (Ubuntu 20.04+ recommended)
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Recommended Specifications

- **CPU**: 8+ cores
- **RAM**: 16+ GB
- **Disk Space**: 20+ GB SSD
- **Operating System**: macOS 12+, Windows 11, or Ubuntu 22.04+
- **Node.js**: v20.0.0 or higher
- **npm**: v10.0.0 or higher

## Initial Setup

### 1. Install Required Tools

#### Node.js and npm

Install Node.js (which includes npm) using one of the following methods:

**Using NVM (recommended):**

```bash
# Install NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
# or with wget
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# Reload your shell configuration
source ~/.bashrc  # or ~/.zshrc for zsh users

# Install and use Node.js v20
nvm install 20
nvm use 20
```

**Direct installation:**

Download and install from the [Node.js website](https://nodejs.org/).

Verify installation:

```bash
node -v  # Should show v18.0.0 or higher
npm -v   # Should show v9.0.0 or higher
```

#### Git

**macOS:**
```bash
brew install git
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install git
```

**Windows:**
Download and install from [Git for Windows](https://gitforwindows.org/).

### 2. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-organization/crypto-beacon-trader-hub.git

# Navigate to the project directory
cd crypto-beacon-trader-hub
```

### 3. Install Dependencies

```bash
npm install
```

## Environment Configuration

### 1. Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your specific configuration:

```ini
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_WEBSOCKET_URL=ws://localhost:5001

# Feature Flags
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_SIMULATED_TRADING=true

# Development Settings
VITE_LOG_LEVEL=debug
```

### 2. Additional Configuration Files

Some features require additional configuration files:

#### API Provider Configuration

Create `api-providers.config.json` in the `config` directory:

```bash
mkdir -p config
cp config/api-providers.example.json config/api-providers.config.json
```

Edit as needed for your development environment.

## Running the Application

### Development Server

Start the development server:

```bash
npm run dev
```

This will launch the application at [http://localhost:5173](http://localhost:5173).

### Building for Production

To create an optimized production build:

```bash
npm run build
```

The output will be in the `dist` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Development Tools

### Code Quality Tools

The project uses several tools to maintain code quality:

#### Linting

```bash
# Run ESLint
npm run lint

# Fix automatic ESLint issues
npm run lint:fix
```

#### Formatting

```bash
# Check formatting with Prettier
npm run format:check

# Fix formatting issues
npm run format
```

#### Type Checking

```bash
# Run TypeScript type checking
npm run type-check
```

### Testing

#### Unit Tests

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

#### End-to-End Tests

```bash
# Run Cypress tests in headless mode
npm run test:e2e

# Open Cypress UI for interactive testing
npm run cypress:open
```

### Storybook

Explore and test UI components in isolation:

```bash
# Start Storybook server
npm run storybook
```

This will launch Storybook at [http://localhost:6006](http://localhost:6006).

## Project Structure

```
crypto-beacon-trader-hub/
├── config/                  # Configuration files
├── public/                  # Static public assets
├── src/                     # Source code
│   ├── components/          # React components
│   │   ├── ui/              # UI components
│   │   ├── charts/          # Chart components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── trading/         # Trading components
│   │   └── widgets/         # Widget components
│   ├── contexts/            # React contexts
│   ├── hooks/               # Custom React hooks
│   ├── services/            # Service modules
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Main App component
│   └── main.tsx             # Application entry point
├── tests/                   # Test files
├── .env.example             # Example environment variables
├── .eslintrc.js             # ESLint configuration
├── .prettierrc              # Prettier configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── package.json             # Project metadata and dependencies
```

## Troubleshooting

### Common Issues

#### Installation Failures

**Issue**: `npm install` fails with dependency errors.

**Solution**: Try the following steps:
1. Delete `node_modules` folder and `package-lock.json`
2. Clear npm cache: `npm cache clean --force`
3. Reinstall with: `npm install`

#### Port Conflicts

**Issue**: Development server fails to start due to port conflicts.

**Solution**: Change the port in `vite.config.ts`:

```typescript
export default defineConfig({
  // ...other config
  server: {
    port: 3000, // Change this to an available port
  },
});
```

#### TypeScript Errors

**Issue**: TypeScript compilation errors.

**Solution**:
1. Update TypeScript: `npm update typescript`
2. Reset TypeScript's cache: `rm -rf .tsbuildinfo`
3. Check for type conflicts: `npx tsc --noEmit`

### Getting Help

If you encounter issues not covered here:

1. Check the project issues on GitHub
2. Join our developer Discord channel
3. Search for similar issues in the documentation
4. Contact the development team via the project's communication channels

## Advanced Configuration

### Custom API Integration

To develop against your own API instance:

1. Update API endpoints in `.env.local`
2. Configure CORS settings on your API server
3. Update API client configuration as needed

### Mock Mode

For development without backend dependencies:

1. Set `VITE_USE_MOCK_DATA=true` in `.env.local`
2. Run the dev server: `npm run dev`

All API calls will use mock data instead of actual API requests.

## Development Workflow

### Branch Strategy

We follow GitHub Flow with the following branches:

- `main`: Production-ready code
- `dev`: Integration branch for active development
- Feature branches: Named as `feature/your-feature-name`
- Bug fixes: Named as `fix/issue-description`

### Commit Guidelines

We follow Conventional Commits for commit messages:

```
type(scope): description

[optional body]

[optional footer]
```

Types include:
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Formatting changes
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Maintenance tasks

### Pull Request Process

1. Create a branch from `dev`
2. Implement your changes
3. Ensure all tests pass
4. Create a pull request to `dev`
5. Await code review and address feedback
6. PR will be merged after approval

## Additional Resources

- [Component Documentation](./component-docs.md)
- [API Integration Guide](./api-integration-guide.md)
- [State Management Guide](./state-management-guide.md)
- [Testing Guide](./testing-guide.md)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
