
# Crypto Trading Platform

## Overview
The Crypto Trading Platform is a comprehensive web application that provides traders with powerful tools for cryptocurrency analysis, portfolio management, and AI-powered trading insights. It features a modern responsive UI with multiple theme options and extensive customization capabilities.

## Features
- Real-time cryptocurrency price tracking and analysis
- Customizable dashboard with draggable widgets
- Advanced technical analysis tools
- Portfolio tracking and performance metrics
- AI trading signals and strategies
- Market correlation analysis
- Multiple dark theme options (Default, Midnight Tech, Cyber Pulse, Matrix Code)
- Watchlist with customizable alerts
- API management and integration

## Screenshots
![Dashboard](screenshot-dashboard.png)
![Market Analysis](screenshot-analysis.png)
![Portfolio View](screenshot-portfolio.png)

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS
- **UI Components**: Shadcn UI
- **State Management**: React Context API
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js (v16.x or higher)
- npm (v7.x or higher)

### Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/crypto-trading-platform.git
cd crypto-trading-platform
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production
```bash
npm run build
```

The built application will be in the `dist` directory.

## Configuration

### Environment Variables
No environment variables are required for basic operation. API keys for external services are managed through the API Key Management interface within the application.

### Theme Customization
The platform includes four theme options:
1. **Default Dark** - Standard dark theme with balanced contrast
2. **Midnight Tech** - Deep blue tech-inspired theme
3. **Cyber Pulse** - Vibrant purple cyberpunk style 
4. **Matrix Code** - Green-tinted hacker aesthetic

Users can change themes through the theme switcher in the top navigation bar.

## Documentation
Additional documentation is available in the `docs` directory:
- [User Guide](docs/USER_GUIDE.md) - End-user documentation
- [Developer Guide](docs/DEV_GUIDE.md) - Technical documentation for developers
- [API Documentation](docs/API_DOCS.md) - API reference and integration guides
- [Theme System](docs/THEME_SYSTEM.md) - Documentation for the theming system

## Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements
- [Shadcn UI](https://ui.shadcn.com/) for the UI component library
- [Recharts](https://recharts.org/) for charting capabilities
- [Lucide React](https://lucide.dev/) for the icon set
