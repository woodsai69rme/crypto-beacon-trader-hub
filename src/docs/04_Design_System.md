
# Design System

## Overview

The Crypto Beacon Trader Hub design system provides a consistent, cohesive visual language and component library that ensures a professional, user-friendly experience across the platform. This document outlines the core design principles, visual elements, and component specifications that form our design system.

## Design Principles

### 1. Clarity
- Information hierarchy that guides users through complex data
- Clean layouts that reduce cognitive load
- Clear visual distinction between interactive and static elements

### 2. Precision
- Accurate data visualization with appropriate detail
- Consistent spacing and alignment
- Pixel-perfect implementation of designs

### 3. Efficiency
- Streamlined workflows for common tasks
- Keyboard shortcuts for power users
- Batch operations where appropriate

### 4. Adaptability
- Responsive design across all screen sizes
- Customizable layouts and preferences
- Appropriate information density for different contexts

### 5. Trust
- Visual stability and predictability
- Consistent feedback for user actions
- Security-focused visual cues

## Color System

### Primary Colors
- **Primary**: `#3b82f6` - Used for primary actions, key UI elements
- **Primary-Light**: `#60a5fa` - Hover states, secondary elements
- **Primary-Dark**: `#2563eb` - Active states, emphasis

### Secondary Colors
- **Secondary**: `#10b981` - Success states, positive trends
- **Secondary-Light**: `#34d399` - Subtle success indicators
- **Secondary-Dark**: `#059669` - Strong success emphasis

### Accent Colors
- **Accent-1**: `#f97316` - Warning states, alerts
- **Accent-2**: `#ef4444` - Error states, negative trends
- **Accent-3**: `#8b5cf6` - Special features, premium content

### Neutrals
- **White**: `#ffffff` - Background (light mode)
- **Black**: `#000000` - Foreground text (light mode)
- **Gray-50**: `#f9fafb` - Subtle backgrounds
- **Gray-100**: `#f3f4f6` - Light backgrounds, hover states
- **Gray-200**: `#e5e7eb` - Borders, dividers
- **Gray-300**: `#d1d5db` - Disabled states
- **Gray-400**: `#9ca3af` - Secondary text
- **Gray-500**: `#6b7280` - Placeholder text
- **Gray-600**: `#4b5563` - Subtle text
- **Gray-700**: `#374151` - High-contrast text (dark mode)
- **Gray-800**: `#1f2937` - Background elements (dark mode)
- **Gray-900**: `#111827` - Background (dark mode)

### Semantic Colors
- **Profit**: `#10b981` - Positive price movements, gains
- **Loss**: `#ef4444` - Negative price movements, losses
- **Warning**: `#f97316` - Warning states, caution indicators
- **Info**: `#3b82f6` - Informational elements
- **Neutral**: `#6b7280` - Neutral or unchanged states

## Typography

### Font Family
- **Primary**: Inter (sans-serif)
- **Monospace**: JetBrains Mono (for code, numbers, data)

### Font Sizes
- **xs**: 0.75rem (12px)
- **sm**: 0.875rem (14px)
- **base**: 1rem (16px)
- **lg**: 1.125rem (18px)
- **xl**: 1.25rem (20px)
- **2xl**: 1.5rem (24px)
- **3xl**: 1.875rem (30px)
- **4xl**: 2.25rem (36px)

### Font Weights
- **Light**: 300
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

### Line Heights
- **Tight**: 1.25
- **Base**: 1.5
- **Relaxed**: 1.75

## Spacing System

Our spacing system follows a 4px grid to ensure consistency across the platform.

- **0**: 0px
- **px**: 1px
- **0.5**: 0.125rem (2px)
- **1**: 0.25rem (4px)
- **2**: 0.5rem (8px)
- **3**: 0.75rem (12px)
- **4**: 1rem (16px)
- **5**: 1.25rem (20px)
- **6**: 1.5rem (24px)
- **8**: 2rem (32px)
- **10**: 2.5rem (40px)
- **12**: 3rem (48px)
- **16**: 4rem (64px)

## Border Radius
- **None**: 0px
- **Sm**: 0.125rem (2px)
- **Default**: 0.25rem (4px)
- **Md**: 0.375rem (6px)
- **Lg**: 0.5rem (8px)
- **Xl**: 0.75rem (12px)
- **2xl**: 1rem (16px)
- **Full**: 9999px (fully rounded)

## Shadows
- **Sm**: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- **Default**: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)`
- **Md**: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
- **Lg**: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
- **Xl**: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`
- **2xl**: `0 25px 50px -12px rgba(0, 0, 0, 0.25)`

## Component System

### Core Components

#### Buttons
- **Primary**: Main call-to-action buttons
- **Secondary**: Alternative actions
- **Outline**: Less prominent actions
- **Ghost**: Minimal visual presence
- **Destructive**: Dangerous actions
- **Link**: Text-only button appearance
- **Icon**: Icon only, square aspect ratio

#### Inputs
- **Text Input**: Standard text entry
- **Number Input**: Numerical entry with increment controls
- **Select**: Dropdown selection
- **Combobox**: Searchable dropdown
- **Checkbox**: Binary selection
- **Radio**: Single selection from a group
- **Switch**: Toggle for boolean settings
- **Slider**: Range selection
- **Date Picker**: Date selection
- **File Input**: File upload

#### Data Display
- **Card**: Container for related content
- **Table**: Structured data display
- **List**: Sequential items
- **Badge**: Status indicator
- **Avatar**: User or item representation
- **Tooltip**: Additional information on hover
- **Progress**: Completion indicator
- **Tabs**: Content organization
- **Accordion**: Expandable content sections
- **Alert**: Important messages

#### Navigation
- **Navbar**: Main navigation container
- **Sidebar**: Secondary navigation and tools
- **Breadcrumb**: Navigation hierarchy
- **Pagination**: Multi-page navigation
- **Menu**: Dropdown options
- **Command Menu**: Keyboard-accessible menu
- **Toolbar**: Action grouping

#### Feedback
- **Toast**: Temporary notification
- **Dialog**: Modal interaction
- **Drawer**: Side panel
- **Skeleton**: Loading state
- **Spinner**: Processing indicator

### Data Visualization Components

#### Charts
- **Line Chart**: Time series data
- **Area Chart**: Cumulative values
- **Bar Chart**: Categorical comparisons
- **Candlestick Chart**: OHLC price data
- **Scatter Plot**: Correlation visualization
- **Heatmap**: Intensity visualization
- **Pie/Donut Chart**: Part-to-whole relationships
- **Radar Chart**: Multi-variable comparison

#### Technical Indicators
- **Moving Averages**: Trend visualization
- **RSI**: Relative Strength Index
- **MACD**: Moving Average Convergence Divergence
- **Bollinger Bands**: Volatility channels
- **Volume Indicators**: Trading volume analysis
- **Oscillators**: Momentum visualization

#### Trading Components
- **Order Form**: Trade execution interface
- **Order Book**: Market depth visualization
- **Price Ticker**: Live price updates
- **Trade History**: Recent transactions
- **Position Card**: Current position details
- **Portfolio Summary**: Holdings overview

## Theme Variations

### Dark Theme (Default)
- Dark backgrounds with light text
- Reduced brightness for extended use
- High contrast for data visualization
- Subtle use of color for emphasis

### Light Theme
- Light backgrounds with dark text
- Strong shadows for depth
- Vibrant data visualization
- Clear content boundaries

### Cyberpunk Theme
- Deep blue/purple background
- Neon accent colors (cyan, magenta)
- High contrast elements
- Grid-based backgrounds
- Futuristic typography

### Matrix Theme
- Black background
- Green monochrome color scheme
- Terminal-inspired typography
- Minimal decoration
- Code-like visual elements

## Responsive Breakpoints

- **xs**: 0px (default)
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## Accessibility Standards

- All colors meet WCAG 2.1 AA contrast requirements
- Interactive elements have visible focus states
- Icons include alternative text
- Animations respect reduced-motion preferences
- Components are keyboard navigable
- Form elements include proper labels and instructions
- Error states provide clear feedback

## Implementation Guidelines

### Using the Design System

Our design system is implemented using:
- Tailwind CSS for utility-based styling
- Shadcn UI as component foundation
- CSS Variables for theming
- React component architecture

### Best Practices

1. Always use design tokens rather than hard-coded values
2. Maintain consistency by using established components
3. Follow accessibility guidelines for all new components
4. Consider all states: default, hover, active, disabled, loading, error
5. Ensure responsive behavior across all screen sizes
6. Favor composition over customization for special cases

## Design Assets

The following assets are maintained in the design system:

- Component library in Figma
- Icon set (Lucide React)
- Color palette definitions
- Typography specifications
- Example screens and patterns
- Animation guidelines
