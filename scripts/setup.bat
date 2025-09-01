
@echo off
REM Crypto Beacon Trading Platform - Windows Setup Script
REM This script sets up the development environment for the trading platform

setlocal EnableDelayedExpansion

echo 🚀 Crypto Beacon Trading Platform Setup
echo =======================================

REM Check if package.json exists
if not exist "package.json" (
    echo ❌ package.json not found. Please run this script from the project root directory.
    exit /b 1
)

echo ℹ️  Checking system requirements...

REM Check Node.js version
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js >= 18.0.0
    exit /b 1
) else (
    for /f "tokens=1" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✅ Node.js !NODE_VERSION!
)

REM Check npm version
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed
    exit /b 1
) else (
    for /f "tokens=1" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo ✅ npm !NPM_VERSION!
)

REM Check git
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed
    exit /b 1
) else (
    echo ✅ Git is installed
)

echo ℹ️  Installing project dependencies...
if exist "package-lock.json" (
    npm ci
) else (
    npm install
)

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)
echo ✅ Dependencies installed successfully

echo ℹ️  Setting up environment configuration...
if not exist ".env.local" (
    if exist ".env.example" (
        copy ".env.example" ".env.local" >nul
        echo ✅ Created .env.local from template
    ) else (
        REM Create basic .env.local file
        (
            echo # Crypto Beacon Trading Platform Environment Configuration
            echo VITE_APP_NAME=Crypto Beacon Trading Platform
            echo VITE_APP_VERSION=2.0.0
            echo VITE_ENVIRONMENT=development
            echo.
            echo # Database Configuration ^(Supabase^)
            echo VITE_SUPABASE_URL=
            echo VITE_SUPABASE_ANON_KEY=
            echo.
            echo # AI Services
            echo VITE_OPENROUTER_API_KEY=
            echo.
            echo # Market Data APIs
            echo VITE_COINGECKO_API_KEY=
            echo VITE_CRYPTOCOMPARE_API_KEY=
            echo.
            echo # Blockchain Integration
            echo VITE_ALGORAND_API_TOKEN=98D9CE80660AD243893D56D9F125CD2D
            echo VITE_ALGORAND_API_URL=https://mainnet-api.4160.nodely.io
            echo VITE_ALGORAND_INDEXER_URL=https://mainnet-idx.4160.nodely.io
            echo.
            echo # Feature Flags
            echo VITE_ENABLE_LIVE_TRADING=false
            echo VITE_ENABLE_AI_BOTS=true
            echo VITE_ENABLE_WEB3=true
            echo VITE_ENABLE_SOCIAL_TRADING=true
            echo VITE_USE_MOCK_DATA=true
            echo.
            echo # Development Settings
            echo VITE_DEBUG_MODE=true
            echo VITE_LOG_LEVEL=debug
        ) > ".env.local"
        echo ✅ Created basic .env.local file
    )
) else (
    echo ⚠️  .env.local already exists, skipping...
)

echo ℹ️  Creating project directories...
mkdir "src\components\ui" 2>nul
mkdir "src\components\trading" 2>nul
mkdir "src\components\analytics" 2>nul
mkdir "src\components\news" 2>nul
mkdir "src\components\web3" 2>nul
mkdir "src\components\social" 2>nul
mkdir "src\components\settings" 2>nul
mkdir "src\components\auth" 2>nul
mkdir "src\contexts" 2>nul
mkdir "src\hooks" 2>nul
mkdir "src\services" 2>nul
mkdir "src\types" 2>nul
mkdir "src\utils" 2>nul
mkdir "src\styles" 2>nul
mkdir "tests\unit" 2>nul
mkdir "tests\integration" 2>nul
mkdir "tests\e2e" 2>nul
mkdir "tests\mocks" 2>nul
mkdir "docs\api" 2>nul
mkdir "docs\guides" 2>nul
mkdir "docs\architecture" 2>nul
mkdir "public\assets" 2>nul
mkdir "scripts" 2>nul
echo ✅ Project directories created

echo ℹ️  Setting up git hooks...
if exist ".git" (
    REM Create pre-commit hook
    (
        echo @echo off
        echo echo Running pre-commit checks...
        echo.
        echo npm run lint:check
        echo if %%errorlevel%% neq 0 ^(
        echo     echo ❌ Linting failed. Please fix the issues before committing.
        echo     exit /b 1
        echo ^)
        echo.
        echo npm run type-check
        echo if %%errorlevel%% neq 0 ^(
        echo     echo ❌ Type checking failed. Please fix the issues before committing.
        echo     exit /b 1
        echo ^)
        echo.
        echo npm run test:unit
        echo if %%errorlevel%% neq 0 ^(
        echo     echo ❌ Unit tests failed. Please fix the issues before committing.
        echo     exit /b 1
        echo ^)
        echo.
        echo echo ✅ All pre-commit checks passed!
    ) > ".git\hooks\pre-commit.bat"
    echo ✅ Git pre-commit hook installed
) else (
    echo ⚠️  Not a git repository, skipping git hooks setup
)

echo ℹ️  Verifying installation...
npm run build >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Build verification successful
) else (
    echo ❌ Build verification failed
)

npm run type-check >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ TypeScript verification successful
) else (
    echo ⚠️  TypeScript verification failed - this might be expected during initial setup
)

echo ℹ️  Checking for optional tools...
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Docker is available
) else (
    echo ℹ️  Docker not found. Install Docker Desktop for containerization features
)

code --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ VS Code is available
    echo ℹ️  You can install recommended extensions manually
) else (
    echo ℹ️  VS Code not found. Consider installing for better development experience
)

echo.
echo 🎉 Setup completed successfully!
echo ===============================
echo.
echo Next steps:
echo 1. Configure your environment variables in .env.local
echo 2. Start the development server: npm run dev
echo 3. Open http://localhost:5173 in your browser
echo.
echo Useful commands:
echo   npm run dev          # Start development server
echo   npm run build        # Build for production
echo   npm run test         # Run tests
echo   npm run lint         # Check code quality
echo   npm run type-check   # Check TypeScript
echo.
echo Documentation:
echo   docs\README.md       # Project overview
echo   docs\setup.md        # Detailed setup guide
echo   docs\deployment.md   # Deployment instructions
echo.
echo Need help? Check the documentation or open an issue on GitHub.

pause
