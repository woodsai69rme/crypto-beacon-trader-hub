
#!/bin/bash

# Crypto Beacon Trading Platform - Interactive Launch Menu
# This script provides an interactive menu for common development tasks

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Print colored output
print_header() {
    echo -e "${CYAN}$1${NC}"
}

print_option() {
    echo -e "${GREEN}$1${NC}"
}

print_info() {
    echo -e "${BLUE}$1${NC}"
}

print_warning() {
    echo -e "${YELLOW}$1${NC}"
}

print_error() {
    echo -e "${RED}$1${NC}"
}

# Check if we're in the right directory
check_environment() {
    if [ ! -f "package.json" ]; then
        print_error "❌ package.json not found. Please run this script from the project root directory."
        exit 1
    fi
    
    if [ ! -d "node_modules" ]; then
        print_warning "⚠️  node_modules not found. Run 'npm install' first."
        read -p "Install dependencies now? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            npm install
        else
            exit 1
        fi
    fi
}

# Development server
start_dev_server() {
    print_info "🚀 Starting development server..."
    npm run dev
}

# Build for production
build_production() {
    print_info "🏗️  Building for production..."
    npm run build
    if [ $? -eq 0 ]; then
        echo "✅ Build completed successfully!"
        echo "📁 Files are in the 'dist' directory"
        
        read -p "Preview the production build? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            npm run preview
        fi
    else
        print_error "❌ Build failed!"
    fi
}

# Run tests
run_tests() {
    echo "🧪 Test Suite Options:"
    echo "1. Run all tests"
    echo "2. Unit tests only" 
    echo "3. Integration tests only"
    echo "4. E2E tests only"
    echo "5. Tests with coverage"
    echo "6. Watch mode"
    echo "0. Back to main menu"
    echo
    
    read -p "Select option (0-6): " -n 1 -r
    echo
    
    case $REPLY in
        1)
            print_info "🧪 Running all tests..."
            npm run test
            ;;
        2)
            print_info "🧪 Running unit tests..."
            npm run test:unit
            ;;
        3)
            print_info "🧪 Running integration tests..."
            npm run test:integration
            ;;
        4)
            print_info "🧪 Running E2E tests..."
            npm run test:e2e
            ;;
        5)
            print_info "🧪 Running tests with coverage..."
            npm run test:coverage
            ;;
        6)
            print_info "🧪 Starting tests in watch mode..."
            npm run test:watch
            ;;
        0)
            return
            ;;
        *)
            print_error "Invalid option"
            ;;
    esac
}

# Code quality checks
check_code_quality() {
    echo "🔍 Code Quality Options:"
    echo "1. Run linting"
    echo "2. Fix linting issues"
    echo "3. Type checking"
    echo "4. Format code"
    echo "5. Full quality check"
    echo "0. Back to main menu"
    echo
    
    read -p "Select option (0-5): " -n 1 -r
    echo
    
    case $REPLY in
        1)
            print_info "🔍 Running linting..."
            npm run lint
            ;;
        2)
            print_info "🔧 Fixing linting issues..."
            npm run lint:fix
            ;;
        3)
            print_info "📝 Checking TypeScript..."
            npm run type-check
            ;;
        4)
            print_info "💅 Formatting code..."
            npm run format
            ;;
        5)
            print_info "🔍 Running full quality check..."
            npm run lint && npm run type-check && npm run test:unit
            ;;
        0)
            return
            ;;
        *)
            print_error "Invalid option"
            ;;
    esac
}

# Database management
manage_database() {
    echo "🗄️  Database Management Options:"
    echo "1. View database status"
    echo "2. Run migrations"
    echo "3. Reset database"
    echo "4. Seed test data"
    echo "5. Backup database"
    echo "6. Generate types"
    echo "0. Back to main menu"
    echo
    
    read -p "Select option (0-6): " -n 1 -r
    echo
    
    case $REPLY in
        1)
            print_info "📊 Checking database status..."
            if command -v supabase >/dev/null 2>&1; then
                supabase status
            else
                print_warning "Supabase CLI not installed"
            fi
            ;;
        2)
            print_info "🔄 Running database migrations..."
            if command -v supabase >/dev/null 2>&1; then
                supabase db push
            else
                npm run db:migrate 2>/dev/null || print_warning "Migration command not available"
            fi
            ;;
        3)
            print_warning "⚠️  This will reset all database data!"
            read -p "Are you sure? (y/N): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                if command -v supabase >/dev/null 2>&1; then
                    supabase db reset
                else
                    npm run db:reset 2>/dev/null || print_warning "Reset command not available"
                fi
            fi
            ;;
        4)
            print_info "🌱 Seeding test data..."
            npm run db:seed 2>/dev/null || print_warning "Seed command not available"
            ;;
        5)
            print_info "💾 Creating database backup..."
            npm run db:backup 2>/dev/null || print_warning "Backup command not available"
            ;;
        6)
            print_info "⚡ Generating TypeScript types..."
            if command -v supabase >/dev/null 2>&1; then
                supabase gen types typescript --local > src/types/supabase.ts
                echo "✅ Types generated in src/types/supabase.ts"
            else
                print_warning "Supabase CLI not installed"
            fi
            ;;
        0)
            return
            ;;
        *)
            print_error "Invalid option"
            ;;
    esac
}

# Deployment options
deploy_application() {
    echo "🚀 Deployment Options:"
    echo "1. Deploy to Vercel"
    echo "2. Deploy to Netlify"
    echo "3. Build Docker image"
    echo "4. Deploy with Docker"
    echo "5. Generate static build"
    echo "6. Preview deployment"
    echo "0. Back to main menu"
    echo
    
    read -p "Select option (0-6): " -n 1 -r
    echo
    
    case $REPLY in
        1)
            print_info "🚀 Deploying to Vercel..."
            if command -v vercel >/dev/null 2>&1; then
                vercel --prod
            else
                print_warning "Vercel CLI not installed. Install with: npm i -g vercel"
            fi
            ;;
        2)
            print_info "🚀 Deploying to Netlify..."
            if command -v netlify >/dev/null 2>&1; then
                npm run build && netlify deploy --prod --dir=dist
            else
                print_warning "Netlify CLI not installed. Install with: npm i -g netlify-cli"
            fi
            ;;
        3)
            print_info "🐳 Building Docker image..."
            if command -v docker >/dev/null 2>&1; then
                docker build -t crypto-beacon .
                echo "✅ Docker image built: crypto-beacon"
            else
                print_warning "Docker not installed"
            fi
            ;;
        4)
            print_info "🐳 Deploying with Docker..."
            if command -v docker >/dev/null 2>&1; then
                docker build -t crypto-beacon . && docker run -p 3000:3000 crypto-beacon
            else
                print_warning "Docker not installed"
            fi
            ;;
        5)
            print_info "📦 Generating static build..."
            npm run build
            echo "✅ Static build generated in 'dist' directory"
            ;;
        6)
            print_info "👀 Previewing deployment..."
            npm run build && npm run preview
            ;;
        0)
            return
            ;;
        *)
            print_error "Invalid option"
            ;;
    esac
}

# Performance analysis
analyze_performance() {
    echo "📊 Performance Analysis Options:"
    echo "1. Bundle size analysis"
    echo "2. Lighthouse audit"
    echo "3. Performance profiling"
    echo "4. Memory usage analysis"
    echo "5. Load testing"
    echo "0. Back to main menu"
    echo
    
    read -p "Select option (0-5): " -n 1 -r
    echo
    
    case $REPLY in
        1)
            print_info "📦 Analyzing bundle size..."
            npm run analyze 2>/dev/null || npm run build -- --analyze 2>/dev/null || print_warning "Bundle analyzer not configured"
            ;;
        2)
            print_info "🏠 Running Lighthouse audit..."
            if command -v lighthouse >/dev/null 2>&1; then
                npm run build && npm run preview &
                SERVER_PID=$!
                sleep 5
                lighthouse http://localhost:4173 --output html --output-path ./lighthouse-report.html
                kill $SERVER_PID
                echo "✅ Lighthouse report generated: lighthouse-report.html"
            else
                print_warning "Lighthouse not installed. Install with: npm i -g lighthouse"
            fi
            ;;
        3)
            print_info "⚡ Running performance profiling..."
            npm run test:performance 2>/dev/null || print_warning "Performance tests not configured"
            ;;
        4)
            print_info "💾 Analyzing memory usage..."
            npm run dev -- --profile 2>/dev/null || print_warning "Memory profiling not configured"
            ;;
        5)
            print_info "🔄 Running load tests..."
            npm run test:load 2>/dev/null || print_warning "Load testing not configured"
            ;;
        0)
            return
            ;;
        *)
            print_error "Invalid option"
            ;;
    esac
}

# Security audit
security_audit() {
    echo "🔒 Security Audit Options:"
    echo "1. Dependency vulnerability scan"
    echo "2. Security linting"
    echo "3. OWASP ZAP scan"
    echo "4. Secrets detection"
    echo "5. Full security audit"
    echo "0. Back to main menu"
    echo
    
    read -p "Select option (0-5): " -n 1 -r
    echo
    
    case $REPLY in
        1)
            print_info "🔍 Scanning dependencies for vulnerabilities..."
            npm audit
            ;;
        2)
            print_info "🔒 Running security linting..."
            npm run lint:security 2>/dev/null || print_warning "Security linting not configured"
            ;;
        3)
            print_info "🕷️  Running OWASP ZAP scan..."
            print_warning "This requires ZAP to be installed and the application to be running"
            ;;
        4)
            print_info "🔐 Detecting secrets in code..."
            if command -v git-secrets >/dev/null 2>&1; then
                git-secrets --scan
            else
                print_warning "git-secrets not installed"
            fi
            ;;
        5)
            print_info "🔒 Running full security audit..."
            npm audit && npm run test:security 2>/dev/null
            ;;
        0)
            return
            ;;
        *)
            print_error "Invalid option"
            ;;
    esac
}

# Documentation
manage_documentation() {
    echo "📚 Documentation Options:"
    echo "1. Generate API docs"
    echo "2. Build component docs"
    echo "3. Create deployment guide"
    echo "4. Generate PDF docs"
    echo "5. Serve docs locally"
    echo "0. Back to main menu"
    echo
    
    read -p "Select option (0-5): " -n 1 -r
    echo
    
    case $REPLY in
        1)
            print_info "📖 Generating API documentation..."
            npm run docs:api 2>/dev/null || print_warning "API docs generation not configured"
            ;;
        2)
            print_info "🧩 Building component documentation..."
            npm run storybook:build 2>/dev/null || print_warning "Storybook not configured"
            ;;
        3)
            print_info "🚀 Creating deployment guide..."
            echo "✅ Deployment guides are available in docs/deployment.md"
            ;;
        4)
            print_info "📄 Generating PDF documentation..."
            npm run docs:pdf 2>/dev/null || print_warning "PDF generation not configured"
            ;;
        5)
            print_info "🌐 Serving documentation locally..."
            npm run docs:serve 2>/dev/null || (cd docs && python3 -m http.server 8080) 2>/dev/null || print_warning "Local server not available"
            ;;
        0)
            return
            ;;
        *)
            print_error "Invalid option"
            ;;
    esac
}

# System information
show_system_info() {
    print_header "🖥️  System Information"
    echo "=============================="
    
    # Node.js version
    if command -v node >/dev/null 2>&1; then
        echo "Node.js: $(node --version)"
    fi
    
    # npm version  
    if command -v npm >/dev/null 2>&1; then
        echo "npm: $(npm --version)"
    fi
    
    # Git version
    if command -v git >/dev/null 2>&1; then
        echo "Git: $(git --version | awk '{print $3}')"
    fi
    
    # Docker version
    if command -v docker >/dev/null 2>&1; then
        echo "Docker: $(docker --version | awk '{print $3}' | sed 's/,//')"
    fi
    
    # OS information
    echo "OS: $(uname -s) $(uname -r)"
    
    # Memory information
    if command -v free >/dev/null 2>&1; then
        TOTAL_MEM=$(free -h | awk '/^Mem:/{print $2}')
        echo "Memory: $TOTAL_MEM"
    fi
    
    # Disk space
    echo "Disk space: $(df -h . | tail -1 | awk '{print $4}') available"
    
    # Project information
    if [ -f "package.json" ]; then
        PROJECT_NAME=$(node -p "require('./package.json').name" 2>/dev/null || echo "Unknown")
        PROJECT_VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "Unknown")
        echo "Project: $PROJECT_NAME v$PROJECT_VERSION"
    fi
    
    echo
    read -p "Press Enter to continue..."
}

# Main menu
show_main_menu() {
    clear
    print_header "🚀 Crypto Beacon Trading Platform"
    print_header "=================================="
    echo
    print_option "Development:"
    echo "  1. Start development server"
    echo "  2. Build for production"
    echo "  3. Run tests"
    echo "  4. Code quality checks"
    echo
    print_option "Management:"
    echo "  5. Database management"
    echo "  6. Deploy application"
    echo
    print_option "Analysis:"
    echo "  7. Performance analysis"
    echo "  8. Security audit"
    echo "  9. Documentation"
    echo
    print_option "System:"
    echo "  i. System information"
    echo "  h. Help & documentation"
    echo "  q. Quit"
    echo
}

# Help menu
show_help() {
    print_header "📚 Help & Documentation"
    echo "=========================="
    echo
    echo "Quick Start:"
    echo "1. Run './scripts/setup.sh' to set up the development environment"
    echo "2. Configure environment variables in .env.local"
    echo "3. Start development server with option 1"
    echo
    echo "Documentation:"
    echo "• docs/README.md - Project overview"
    echo "• docs/setup.md - Detailed setup guide"
    echo "• docs/deployment.md - Deployment instructions"
    echo "• docs/config.md - Configuration options"
    echo "• docs/testing.md - Testing guide"
    echo
    echo "Common Commands:"
    echo "• npm run dev - Start development server"
    echo "• npm run build - Build for production" 
    echo "• npm run test - Run test suite"
    echo "• npm run lint - Check code quality"
    echo
    echo "Need more help?"
    echo "• GitHub Issues: https://github.com/crypto-beacon/issues"
    echo "• Discord: https://discord.gg/crypto-beacon"
    echo "• Email: support@crypto-beacon.com"
    echo
    read -p "Press Enter to continue..."
}

# Main program loop
main() {
    check_environment
    
    while true; do
        show_main_menu
        read -p "Select option: " -n 1 -r
        echo
        
        case $REPLY in
            1)
                start_dev_server
                ;;
            2)
                build_production
                ;;
            3)
                run_tests
                ;;
            4)
                check_code_quality
                ;;
            5)
                manage_database
                ;;
            6)
                deploy_application
                ;;
            7)
                analyze_performance
                ;;
            8)
                security_audit
                ;;
            9)
                manage_documentation
                ;;
            i|I)
                show_system_info
                ;;
            h|H)
                show_help
                ;;
            q|Q)
                print_info "👋 Goodbye!"
                exit 0
                ;;
            *)
                print_error "Invalid option. Press 'h' for help."
                sleep 1
                ;;
        esac
        
        echo
        read -p "Press Enter to continue..."
    done
}

# Run the main program
main "$@"
