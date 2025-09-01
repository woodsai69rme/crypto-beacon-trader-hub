
#!/bin/bash

# Crypto Beacon Trading Platform - Setup Script
# This script sets up the development environment for the trading platform

set -e

echo "🚀 Crypto Beacon Trading Platform Setup"
echo "======================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check system requirements
check_requirements() {
    print_info "Checking system requirements..."
    
    # Check Node.js version
    if command_exists node; then
        NODE_VERSION=$(node --version | sed 's/v//')
        REQUIRED_NODE="18.0.0"
        if [ "$(printf '%s\n' "$REQUIRED_NODE" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_NODE" ]; then
            print_status "Node.js $NODE_VERSION (✓ >= $REQUIRED_NODE)"
        else
            print_error "Node.js $NODE_VERSION is too old. Please install Node.js >= $REQUIRED_NODE"
            exit 1
        fi
    else
        print_error "Node.js is not installed. Please install Node.js >= 18.0.0"
        exit 1
    fi
    
    # Check npm version
    if command_exists npm; then
        NPM_VERSION=$(npm --version)
        print_status "npm $NPM_VERSION"
    else
        print_error "npm is not installed"
        exit 1
    fi
    
    # Check git
    if command_exists git; then
        GIT_VERSION=$(git --version | awk '{print $3}')
        print_status "Git $GIT_VERSION"
    else
        print_error "Git is not installed"
        exit 1
    fi
    
    # Check available disk space (minimum 5GB)
    AVAILABLE_SPACE=$(df . | tail -1 | awk '{print $4}')
    if [ "$AVAILABLE_SPACE" -lt 5242880 ]; then
        print_warning "Low disk space. At least 5GB recommended for development"
    fi
    
    # Check memory (minimum 8GB recommended)
    if command_exists free; then
        TOTAL_MEM=$(free -g | awk '/^Mem:/{print $2}')
        if [ "$TOTAL_MEM" -lt 8 ]; then
            print_warning "Less than 8GB RAM detected. 8GB+ recommended for optimal performance"
        fi
    fi
}

# Install dependencies
install_dependencies() {
    print_info "Installing project dependencies..."
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    print_status "Dependencies installed successfully"
}

# Setup environment variables
setup_environment() {
    print_info "Setting up environment configuration..."
    
    if [ ! -f ".env.local" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env.local
            print_status "Created .env.local from template"
        else
            # Create basic .env.local file
            cat > .env.local << EOF
# Crypto Beacon Trading Platform Environment Configuration
VITE_APP_NAME=Crypto Beacon Trading Platform
VITE_APP_VERSION=2.0.0
VITE_ENVIRONMENT=development

# Database Configuration (Supabase)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# AI Services
VITE_OPENROUTER_API_KEY=

# Market Data APIs
VITE_COINGECKO_API_KEY=
VITE_CRYPTOCOMPARE_API_KEY=

# Blockchain Integration
VITE_ALGORAND_API_TOKEN=98D9CE80660AD243893D56D9F125CD2D
VITE_ALGORAND_API_URL=https://mainnet-api.4160.nodely.io
VITE_ALGORAND_INDEXER_URL=https://mainnet-idx.4160.nodely.io

# Feature Flags
VITE_ENABLE_LIVE_TRADING=false
VITE_ENABLE_AI_BOTS=true
VITE_ENABLE_WEB3=true
VITE_ENABLE_SOCIAL_TRADING=true
VITE_USE_MOCK_DATA=true

# Development Settings
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
EOF
            print_status "Created basic .env.local file"
        fi
    else
        print_warning ".env.local already exists, skipping..."
    fi
}

# Setup git hooks
setup_git_hooks() {
    print_info "Setting up git hooks..."
    
    if [ -d ".git" ]; then
        # Pre-commit hook
        cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "Running pre-commit checks..."

# Run linting
npm run lint:check
if [ $? -ne 0 ]; then
    echo "❌ Linting failed. Please fix the issues before committing."
    exit 1
fi

# Run type checking
npm run type-check
if [ $? -ne 0 ]; then
    echo "❌ Type checking failed. Please fix the issues before committing."
    exit 1
fi

# Run unit tests
npm run test:unit
if [ $? -ne 0 ]; then
    echo "❌ Unit tests failed. Please fix the issues before committing."
    exit 1
fi

echo "✅ All pre-commit checks passed!"
EOF
        chmod +x .git/hooks/pre-commit
        print_status "Git pre-commit hook installed"
        
        # Pre-push hook
        cat > .git/hooks/pre-push << 'EOF'
#!/bin/bash
echo "Running pre-push checks..."

# Run full test suite
npm run test
if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Please fix the issues before pushing."
    exit 1
fi

echo "✅ All pre-push checks passed!"
EOF
        chmod +x .git/hooks/pre-push
        print_status "Git pre-push hook installed"
    else
        print_warning "Not a git repository, skipping git hooks setup"
    fi
}

# Create necessary directories
create_directories() {
    print_info "Creating project directories..."
    
    directories=(
        "src/components/ui"
        "src/components/trading"
        "src/components/analytics"
        "src/components/news"
        "src/components/web3"
        "src/components/social"
        "src/components/settings"
        "src/components/auth"
        "src/contexts"
        "src/hooks"
        "src/services"
        "src/types"
        "src/utils"
        "src/styles"
        "tests/unit"
        "tests/integration"
        "tests/e2e"
        "tests/mocks"
        "docs/api"
        "docs/guides"
        "docs/architecture"
        "public/assets"
        "scripts"
    )
    
    for dir in "${directories[@]}"; do
        mkdir -p "$dir"
    done
    
    print_status "Project directories created"
}

# Verify installation
verify_installation() {
    print_info "Verifying installation..."
    
    # Check if build works
    if npm run build >/dev/null 2>&1; then
        print_status "Build verification successful"
    else
        print_error "Build verification failed"
        return 1
    fi
    
    # Check if tests can run
    if npm run test:unit >/dev/null 2>&1; then
        print_status "Test verification successful"
    else
        print_warning "Test verification failed - this might be expected if no tests exist yet"
    fi
    
    # Check TypeScript compilation
    if npm run type-check >/dev/null 2>&1; then
        print_status "TypeScript verification successful"
    else
        print_warning "TypeScript verification failed - this might be expected during initial setup"
    fi
}

# Install optional tools
install_optional_tools() {
    print_info "Installing optional development tools..."
    
    # Check if user wants to install optional tools
    read -p "Install optional tools (Docker, VS Code extensions)? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        
        # Docker setup
        if command_exists docker; then
            print_status "Docker is already installed"
        else
            print_info "Docker not found. Please install Docker manually for containerization features"
        fi
        
        # VS Code extensions
        if command_exists code; then
            print_info "Installing VS Code extensions..."
            code --install-extension bradlc.vscode-tailwindcss
            code --install-extension esbenp.prettier-vscode
            code --install-extension dbaeumer.vscode-eslint
            code --install-extension ms-vscode.vscode-typescript-next
            code --install-extension formulahendry.auto-rename-tag
            code --install-extension christian-kohler.path-intellisense
            print_status "VS Code extensions installed"
        else
            print_info "VS Code not found. You can install the recommended extensions manually"
        fi
    fi
}

# Display next steps
show_next_steps() {
    echo
    echo "🎉 Setup completed successfully!"
    echo "==============================="
    echo
    echo "Next steps:"
    echo "1. Configure your environment variables in .env.local"
    echo "2. Start the development server: npm run dev"
    echo "3. Open http://localhost:5173 in your browser"
    echo
    echo "Useful commands:"
    echo "  npm run dev          # Start development server"
    echo "  npm run build        # Build for production"
    echo "  npm run test         # Run tests"
    echo "  npm run lint         # Check code quality"
    echo "  npm run type-check   # Check TypeScript"
    echo
    echo "Documentation:"
    echo "  docs/README.md       # Project overview"
    echo "  docs/setup.md        # Detailed setup guide"
    echo "  docs/deployment.md   # Deployment instructions"
    echo
    echo "Need help? Check the documentation or open an issue on GitHub."
}

# Main setup process
main() {
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the project root directory."
        exit 1
    fi
    
    # Run setup steps
    check_requirements
    install_dependencies
    setup_environment
    create_directories
    setup_git_hooks
    verify_installation
    install_optional_tools
    show_next_steps
}

# Run main function
main "$@"
