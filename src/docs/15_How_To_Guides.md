
# How-To Guides

## Overview

This document provides step-by-step instructions for common tasks and features within the Crypto Beacon Trader Hub. These guides are designed to help users quickly accomplish specific goals and make the most of the platform's capabilities.

## Table of Contents

1. [Portfolio Management](#portfolio-management)
2. [Trading Features](#trading-features)
3. [AI Strategy Management](#ai-strategy-management)
4. [Market Analysis](#market-analysis)
5. [Alerts & Notifications](#alerts--notifications)
6. [Data Management](#data-management)
7. [Account Settings](#account-settings)
8. [Mobile Usage](#mobile-usage)

## Portfolio Management

### How to Add a New Cryptocurrency to Your Portfolio

1. Navigate to the "Portfolio" section from the main sidebar
2. Click on the "Add Asset" button in the top right corner
3. Search for and select your cryptocurrency from the dropdown list
4. Enter the amount you own
5. Add purchase information (optional but recommended):
   - Purchase date
   - Purchase price
   - Exchange or source
6. Click "Save" to add the asset to your portfolio

**Pro Tip**: For more accurate tracking, add each purchase as a separate entry rather than combining them.

### How to Import Your Trading History

1. Go to "Portfolio" > "Import/Export" from the main menu
2. Select "Import Trading History"
3. Choose your exchange from the dropdown list
4. You can import in two ways:
   - **API Method**: Follow the instructions to connect your exchange API
   - **CSV Method**: Download our CSV template, fill in your trades, and upload
5. Review the imported trades for accuracy
6. Click "Confirm Import" to add the trades to your history

**Note**: Historical imports may take a few minutes to process for large trading histories.

### How to View Portfolio Performance

1. Go to the "Portfolio" section
2. Navigate to the "Performance" tab
3. Select your desired time period (24h, 7d, 30d, 1y, All)
4. View your key metrics:
   - Total value
   - Absolute gain/loss
   - Percentage gain/loss
   - Comparison to market benchmarks
5. Scroll down for detailed charts and breakdowns

**Customization**: Click "Edit View" to customize which metrics and charts are displayed.

### How to Rebalance Your Portfolio

1. Navigate to "Portfolio" > "Rebalance"
2. Review your current portfolio allocation
3. Set target allocations:
   - Drag sliders to adjust percentages
   - Or enter exact percentages manually
   - Or select a preset allocation strategy
4. Click "Calculate Rebalance" to see required trades
5. Review the suggested trades
6. Choose "Execute Trades" (Premium) or "Save as Report"

**Best Practice**: Consider rebalancing your portfolio monthly or quarterly.

## Trading Features

### How to Set Up the Trading Simulator

1. Go to "Trading" > "Simulator" in the main navigation
2. Choose your initial simulation settings:
   - Starting capital
   - Base currency
   - Fee structure
3. Click "Create New Simulation"
4. Your simulator is now ready with virtual funds
5. Use the trading interface to practice trades without real money
6. Track your simulation performance in the dashboard

**Reset Option**: You can reset your simulation at any time by clicking "Reset Simulator" in settings.

### How to Execute a Trade in the Simulator

1. Navigate to "Trading" > "Simulator"
2. Select the trading pair (e.g., BTC/USD) from the dropdown
3. Choose the order type (Market, Limit, Stop, etc.)
4. Enter your order details:
   - Buy/Sell direction
   - Quantity or value
   - Price (for limit orders)
5. Review the order summary
6. Click "Place Order" to execute the simulated trade
7. View your open orders and trade history below the chart

**Practice Scenario**: Try setting both stop-loss and take-profit orders to manage risk.

### How to Connect to a Real Exchange (Premium)

1. Go to "Settings" > "Exchange Connections"
2. Click "Add New Connection"
3. Select your exchange from the list
4. Follow the exchange-specific instructions:
   - Create API keys on the exchange website
   - Set permissions (read-only or trading)
   - Enter API key and secret
5. Set optional connection settings:
   - Connection name
   - Trading permissions
   - IP restrictions
6. Click "Verify Connection" to test
7. Save the verified connection

**Security Note**: Always limit API permissions to the minimum necessary and enable IP restrictions when possible.

### How to Track Trade Performance

1. Navigate to "Trading" > "Trade History"
2. View your complete trade history across all exchanges
3. Use filters to find specific trades:
   - Date range
   - Trading pair
   - Exchange
   - Profit/Loss
4. Click on any trade to see detailed information
5. Use the "Analysis" tab to see aggregated performance metrics
6. Export your trade history by clicking "Export"

**Insight Tip**: Look for patterns in your successful and unsuccessful trades to refine your strategy.

## AI Strategy Management

### How to Create a New Trading Strategy

1. Navigate to "AI Trading" > "Strategy Builder"
2. Click "Create New Strategy"
3. Choose a strategy type:
   - Trend Following
   - Mean Reversion
   - Breakout
   - Custom
4. Name your strategy and add a description
5. Configure base parameters:
   - Timeframe (1h, 4h, 1d, etc.)
   - Assets to trade
   - Risk level
6. Set up technical indicators and parameters
7. Configure entry and exit conditions
8. Save your strategy

**Recommendation**: Start with a simple strategy and add complexity as you gain experience.

### How to Backtest a Strategy

1. Go to "AI Trading" > "My Strategies"
2. Select the strategy you want to test
3. Click "Backtest" button
4. Configure backtest parameters:
   - Date range (start and end dates)
   - Initial capital
   - Assets to test against
   - Trading fees
5. Click "Run Backtest"
6. Once complete, review results:
   - Total return
   - Win/loss ratio
   - Maximum drawdown
   - Sharpe ratio
   - Trade list
7. Analyze the equity curve and drawdown chart
8. Export or save results for comparison

**Comparison Tip**: Run multiple backtests with different parameters to find optimal settings.

### How to Optimize Strategy Parameters

1. Navigate to "AI Trading" > "My Strategies"
2. Select your strategy
3. Click "Optimize" button
4. Choose parameters to optimize:
   - Select parameters to include
   - Set min/max values and step size
5. Set optimization goals:
   - Maximize return
   - Maximize Sharpe ratio
   - Minimize drawdown
   - Custom combination
6. Choose optimization method:
   - Grid search
   - Genetic algorithm
   - Monte Carlo
7. Start optimization process
8. Review optimization results
9. Apply optimal parameters to your strategy

**Note**: Parameter optimization can take several minutes depending on complexity.

### How to Monitor Strategy Performance

1. Go to "AI Trading" > "Dashboard"
2. View all active strategies and their performance
3. Select a specific strategy to see detailed metrics:
   - Recent trades
   - Current open positions
   - Performance vs. benchmark
   - Key risk metrics
4. Use the calendar view to analyze performance by time period
5. Set up automated reports by clicking "Reports" > "Schedule"

**Alert Option**: Set performance alerts to notify you when strategies deviate from expected performance.

## Market Analysis

### How to Perform Technical Analysis

1. Navigate to "Analysis" > "Charts"
2. Select your cryptocurrency
3. Choose your preferred chart type:
   - Candlestick
   - Line
   - OHLC
   - Heikin-Ashi
4. Select your timeframe (1m, 5m, 15m, 1h, 4h, 1d, etc.)
5. Add indicators using the "Indicators" menu:
   - Moving Averages
   - RSI, MACD, Stochastic
   - Bollinger Bands
   - Volume indicators
6. Use drawing tools for:
   - Trend lines
   - Support/Resistance levels
   - Fibonacci retracements
   - Patterns and shapes
7. Save your chart setup for future use

**Shortcut**: Press "S" to quickly add indicators to your chart.

### How to Use the Correlation Explorer

1. Go to "Analysis" > "Correlation Explorer"
2. Select a base asset (e.g., Bitcoin)
3. Choose comparison assets:
   - Select individual assets
   - Or choose "Top 20 by Market Cap"
4. Set the time period for analysis
5. View the correlation matrix showing relationships
6. Explore the heatmap visualization
7. Click on any pair to see detailed correlation trends
8. Sort by strongest positive or negative correlations
9. Export correlation data by clicking "Export"

**Portfolio Insight**: Look for assets with negative correlations to diversify your portfolio.

### How to Analyze Market Sentiment

1. Navigate to "Analysis" > "Sentiment"
2. View the global market sentiment dashboard
3. Select a specific cryptocurrency for detailed analysis
4. Explore different data sources:
   - Social media metrics
   - News sentiment
   - Trading data sentiment
   - On-chain analysis
5. Adjust the time period to see sentiment trends
6. Compare sentiment against price action
7. View word clouds of trending topics
8. Check the "Unusual Activity" section for outliers

**Pro Tip**: Major sentiment-price divergences can identify potential trading opportunities.

### How to Generate a Market Report

1. Go to "Analysis" > "Reports"
2. Click "New Report"
3. Select report type:
   - Market Overview
   - Single Asset Analysis
   - Portfolio Analysis
   - Correlation Study
4. Choose assets to include
5. Select metrics and data points to include
6. Set time period for the report
7. Click "Generate Report"
8. View, download, or share the report
9. Optionally schedule recurring reports

**Customization**: Use "Edit Template" to customize the layout and content of your reports.

## Alerts & Notifications

### How to Set Up Price Alerts

1. Navigate to "Alerts" > "Create Alert"
2. Select "Price Alert" as the alert type
3. Choose your cryptocurrency
4. Set your price condition:
   - Above a price
   - Below a price
   - Percentage change (1h, 24h, 7d)
   - Price crossing a moving average
5. Set notification methods:
   - In-app notification
   - Email
   - SMS (Premium)
   - Push notification (Mobile app)
6. Set expiration (optional)
7. Click "Create Alert"

**Multiple Conditions**: Create complex alerts by adding multiple conditions using "Add Condition".

### How to Create Technical Indicator Alerts

1. Go to "Alerts" > "Create Alert"
2. Select "Technical Indicator" as the alert type
3. Choose your cryptocurrency
4. Select an indicator:
   - RSI
   - MACD
   - Bollinger Bands
   - And others
5. Set condition parameters:
   - RSI above/below level
   - MACD crossover
   - Price crossing Bollinger Band
6. Configure notification preferences
7. Set alert duration
8. Save your alert

**Example**: Create an RSI alert to notify you when RSI drops below 30 (potential oversold condition).

### How to Manage Alert Notifications

1. Navigate to "Settings" > "Notifications"
2. Configure global notification settings:
   - Notification methods priority
   - Quiet hours
   - Digest options (receive batched alerts)
3. Set up device-specific settings:
   - Mobile push notifications
   - Desktop notifications
   - Email frequency
4. Manage notification categories
5. View notification history
6. Test notifications system

**Quiet Mode**: Set up quiet hours to prevent alerts during specific times.

## Data Management

### How to Export Your Data

1. Navigate to "Settings" > "Data Management"
2. Select "Export Data"
3. Choose what to export:
   - Portfolio holdings
   - Trade history
   - Performance data
   - Custom strategies
   - Alerts and watchlists
4. Select export format:
   - CSV
   - JSON
   - PDF (for reports)
   - Excel (Premium)
5. Click "Generate Export"
6. Download the file when processing is complete

**Scheduling**: Premium users can schedule regular data exports.

### How to Import Data from External Sources

1. Go to "Settings" > "Data Management"
2. Select "Import Data"
3. Choose import type:
   - Portfolio holdings
   - Trade history
   - Watchlists
4. Select file format:
   - CSV
   - JSON
   - Excel
5. Upload file or provide API connection
6. Map data fields to platform fields
7. Preview the import
8. Confirm and complete the import

**Templates**: Download import templates for each data type for easier formatting.

### How to Generate Tax Reports

1. Navigate to "Tools" > "Tax Reporting"
2. Select tax year
3. Choose your jurisdiction
4. Verify all exchange data is imported
5. Select report types:
   - Capital gains
   - Income and mining
   - Complete tax package
6. Choose calculation method:
   - FIFO (First In, First Out)
   - LIFO (Last In, First Out)
   - HIFO (Highest In, First Out)
   - ACB (Average Cost Basis)
7. Generate and download your report

**Professional Export**: Export in formats compatible with popular tax software.

## Account Settings

### How to Secure Your Account

1. Go to "Settings" > "Security"
2. Review your current security status
3. Enhance security with these steps:
   - Change to a stronger password
   - Enable Two-Factor Authentication (2FA)
   - Add backup email and phone
   - Review and limit API connections
   - Enable login notifications
4. Complete the security checklist
5. Review recent account activity

**Recommendation**: Enable 2FA using an authenticator app rather than SMS for better security.

### How to Customize Your Dashboard

1. Navigate to your Dashboard
2. Click "Customize" in the top right corner
3. Enter dashboard editing mode:
   - Drag widgets to reposition
   - Resize widgets by dragging corners
   - Add widgets with the "+" button
   - Remove widgets with the "X" button
4. Configure individual widgets by clicking the gear icon
5. Select from different layout templates
6. Create multiple dashboard tabs for different focuses
7. Click "Save Layout" when finished

**Layout Tip**: Create separate dashboard layouts for different trading strategies or market conditions.

### How to Manage API Connections

1. Go to "Settings" > "API Management"
2. View all connected APIs and services
3. For each connection, you can:
   - View usage statistics
   - Edit permissions
   - Rotate API keys
   - Delete the connection
4. Add new API connection by clicking "Connect New API"
5. Monitor rate limits and usage
6. Set up alerts for API limit warnings

**Security Practice**: Review and audit your API connections monthly.

## Mobile Usage

### How to Set Up the Mobile App

1. Download the Crypto Beacon mobile app from the App Store or Google Play
2. Open the app and log in with your existing account
3. Complete the biometric authentication setup
4. Choose mobile-specific settings:
   - Default view mode
   - Data usage settings
   - Notification preferences
5. Complete the mobile tour to learn key features
6. Sync your watchlists and alerts

**Offline Mode**: Configure "Offline Mode" to access key information without an internet connection.

### How to Use Quick Actions

1. From the mobile app home screen, swipe right to access Quick Actions
2. Customize your Quick Actions menu:
   - Add frequent actions
   - Rearrange actions
   - Remove unused actions
3. Access your most common tasks with a single tap:
   - Check portfolio
   - View specific assets
   - Execute pre-set trades
   - Run saved analyses
4. Use 3D Touch or long-press for preview actions

**Widget Option**: Add the Crypto Beacon widget to your phone's home screen for even quicker access.

### How to Sync Desktop and Mobile

1. Ensure you're logged into the same account on both devices
2. Go to "Settings" > "Devices & Sync"
3. Enable cross-device synchronization for:
   - Watchlists
   - Alerts
   - Trading templates
   - Chart layouts
4. Choose sync frequency and data usage limits
5. Use "Force Sync" to manually trigger synchronization
6. View sync history and resolve conflicts

**Sync Tip**: Use the "Push to Mobile" feature from desktop to send specific charts or analysis to your mobile device.

---

This document will be regularly updated with new how-to guides as features are added or enhanced. If you need help with a task not covered here, please visit our complete knowledge base or contact support.
