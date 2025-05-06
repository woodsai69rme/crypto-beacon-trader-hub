
# Design System

## Crypto Beacon Trader Hub

**Version:** 1.0.0  
**Last Updated:** 2025-05-06

This document outlines the design system for the Crypto Beacon Trader Hub platform, providing guidelines for consistent visual language, component usage, and user experience patterns.

## 1. Design Principles

### 1.1 Core Principles

- **Clarity**: Information hierarchy should prioritize what matters most to traders
- **Efficiency**: Minimize clicks and cognitive load for common trading actions
- **Adaptability**: Design must work across various devices and screen sizes
- **Consistency**: Maintain uniform patterns and behaviors throughout the platform
- **Precision**: Present data with appropriate level of detail for trading decisions

### 1.2 Design Philosophy

The Crypto Beacon Trader Hub design emphasizes data density and analytical clarity while maintaining a modern, professional aesthetic. The interface prioritizes information hierarchy for trading contexts, with careful consideration given to color usage for financial data. The design allows for personalization through theming while maintaining consistency in information presentation.

## 2. Color System

### 2.1 Core Color Palette

#### Base Colors
| Name | Light Mode | Dark Mode | Usage |
|------|------------|-----------|-------|
| Background | `#FFFFFF` | `#0D121F` | Primary background color |
| Foreground | `#0F172A` | `#F8FAFC` | Primary text color |
| Card | `#FFFFFF` | `#0F172A` | Card and container backgrounds |
| Border | `#E2E8F0` | `#1E293B` | Borders and dividers |

#### Brand Colors
| Name | Value | Usage |
|------|-------|-------|
| Primary | `#8B5CF6` | Primary actions and emphasis |
| Primary Hover | `#7C3AED` | Hover state for primary elements |
| Secondary | `#64748B` | Secondary actions and information |
| Secondary Hover | `#475569` | Hover state for secondary elements |

### 2.2 Semantic Colors

| Name | Light Mode | Dark Mode | Usage |
|------|------------|-----------|-------|
| Profit | `#10B981` | `#34D399` | Positive values, buy, uptrend |
| Loss | `#EF4444` | `#F87171` | Negative values, sell, downtrend |
| Warning | `#F59E0B` | `#FBBF24` | Cautionary information, alerts |
| Info | `#3B82F6` | `#60A5FA` | Informational content, notifications |

### 2.3 Chart Colors

| Name | Light Value | Dark Value | Usage |
|------|------------|-----------|-------|
| Chart Line | `#6366F1` | `#818CF8` | Primary chart lines |
| Chart Grid | `#E2E8F0` | `#334155` | Chart grid lines |
| Chart Up | `#10B981` | `#34D399` | Upward movement on charts |
| Chart Down | `#EF4444` | `#F87171` | Downward movement on charts |
| Volume | `#64748B` | `#94A3B8` | Volume bars on charts |

### 2.4 Theme Variations

#### Default Theme
Standard light/dark mode with neutral color scheme

#### Midnight Tech
Dark blue-based theme with electric blue accents

#### Cyber Pulse
Dark purple-based theme with neon purple and pink accents

#### Matrix Code
Dark green-based theme with bright green data visualization

## 3. Typography

### 3.1 Font Family

- **Primary Font**: Inter, system-ui, sans-serif
- **Monospace Font**: JetBrains Mono, monospace (for code and numeric data)

### 3.2 Type Scale

| Name | Size | Line Height | Weight | Usage |
|------|------|-------------|--------|-------|
| Display | 36px | 1.1 | 700 | Hero sections, major headings |
| Heading 1 | 24px | 1.2 | 700 | Page titles, section headers |
| Heading 2 | 20px | 1.25 | 600 | Card headers, section titles |
| Heading 3 | 16px | 1.3 | 600 | Sub-sections, important labels |
| Body | 14px | 1.5 | 400 | Primary content text |
| Small | 12px | 1.5 | 400 | Secondary information, captions |
| Tiny | 10px | 1.4 | 400 | Labels, badges, metadata |

### 3.3 Numerical Typography

Financial and numeric data uses monospace font for better readability and alignment:

| Case | Example | Style |
|------|---------|-------|
| Price | $42,567.89 | 14px, monospace, medium weight |
| Percentage | +2.41% | 14px, monospace, color-coded |
| Trading Volume | 1.25M | 12px, monospace, condensed |

## 4. Component Library

### 4.1 Core Components

#### Buttons

| Variant | Usage | States |
|---------|-------|--------|
| Primary | Main actions, confirmations | Default, Hover, Focus, Disabled |
| Secondary | Alternative actions | Default, Hover, Focus, Disabled |
| Outline | Subtle actions | Default, Hover, Focus, Disabled |
| Ghost | Low-emphasis actions | Default, Hover, Focus, Disabled |
| Destructive | Irreversible actions | Default, Hover, Focus, Disabled |

#### Form Elements

| Component | Variants | States |
|-----------|----------|--------|
| Input | Text, Number, Password | Default, Focus, Error, Disabled |
| Select | Standard, SearchSelect | Default, Open, Focus, Disabled |
| Checkbox | Standard, Toggle | Checked, Unchecked, Indeterminate, Disabled |
| Radio | Standard | Selected, Unselected, Disabled |
| Switch | Standard | On, Off, Disabled |

#### Cards and Containers

| Component | Variants | Usage |
|-----------|----------|-------|
| Card | Standard, Interactive | Data containers, sections |
| Panel | Standard, Collapsible | Grouped content areas |
| Table | Standard, Compact, Data | Structured data presentation |
| List | Standard, Interactive | Vertical stacked content |

### 4.2 Trading-Specific Components

#### Price Display

| Component | Usage | Format |
|-----------|-------|--------|
| PriceTag | Current asset price | `$42,567.89` |
| PriceChange | Price movement | `+$1,045.20 (+2.41%)` |
| OrderPrice | Order form prices | `$42,567.89` |

#### Chart Components

| Component | Variants | Usage |
|-----------|----------|-------|
| PriceChart | Candle, Line, OHLC | Asset price visualization |
| VolumeChart | Bar, Profile | Trading volume display |
| IndicatorDisplay | Overlay, Separate | Technical indicator visualization |
| TimeframeSelector | Pills, Dropdown | Chart timeframe selection |

#### Trading Interface

| Component | Usage | Features |
|-----------|-------|----------|
| OrderForm | Create buy/sell orders | Order types, quantity, price |
| OrderBook | View buy/sell orders | Price levels, depth visualization |
| TradeHistory | Recent trades | Time, price, volume display |
| PositionCard | Current position details | Size, entry, current PnL |

### 4.3 Data Visualization

| Component | Usage | Variants |
|-----------|-------|----------|
| LineChart | Trend visualization | Single, Multi-line, Area |
| BarChart | Comparison data | Vertical, Horizontal, Grouped |
| HeatMap | Density visualization | Standard, Gradient |
| PieChart | Distribution | Standard, Donut |
| Gauge | Single metric | Standard, Semi-circle |

## 5. Layout System

### 5.1 Grid System

- Base grid of 12 columns
- Responsive breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 1023px
  - Desktop: 1024px - 1439px
  - Large Desktop: ≥ 1440px

### 5.2 Spacing Scale

| Size | Value | Usage |
|------|-------|-------|
| 4xs | 2px | Minimum separator |
| 3xs | 4px | Tight spacing |
| 2xs | 8px | Form element spacing |
| xs | 12px | Compact component spacing |
| sm | 16px | Standard spacing |
| md | 20px | Component groups |
| lg | 24px | Section spacing |
| xl | 32px | Major section divisions |
| 2xl | 40px | Page-level spacing |
| 3xl | 48px | Large layout divisions |

### 5.3 Common Layouts

| Layout | Usage | Description |
|--------|-------|-------------|
| Dashboard | Main view | Customizable grid of widgets |
| Trading | Trading interface | Chart, order form, order book |
| Analysis | Technical analysis | Multiple charts and indicators |
| Portfolio | Asset overview | Holdings, allocation, performance |
| Settings | Configuration | Form-based settings pages |

## 6. Motion and Animation

### 6.1 Animation Principles

- **Purpose**: Animations should serve a functional purpose
- **Subtlety**: Subtle animations for financial data to avoid distraction
- **Consistency**: Similar elements should animate in similar ways
- **Performance**: Animations must not impact critical trading functionality

### 6.2 Animation Types

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Fade | 200ms | ease-in-out | Content transitions |
| Slide | 250ms | ease-out | Panel and drawer movements |
| Scale | 150ms | ease-out | Focus elements, hover states |
| Pulse | 1000ms | ease-in-out | Notifications, alerts |

### 6.3 Motion Reduction

All animations respect user motion preferences via `prefers-reduced-motion` media query.

## 7. Iconography

### 7.1 Icon Library

The platform uses Lucide React for consistent iconography across the application.

### 7.2 Icon Sizes

| Size | Usage |
|------|-------|
| 16px | Inline with text, small buttons |
| 20px | Standard UI elements |
| 24px | Feature icons, emphasized elements |
| 32px | Feature highlights |

### 7.3 Icon Colors

Icons inherit text color by default but can use semantic colors for specific meanings:
- Green icons for positive actions/states
- Red icons for negative actions/states
- Amber for warnings
- Blue for information

## 8. Accessibility Guidelines

### 8.1 Color Contrast

- Text meets WCAG 2.1 AA standards (4.5:1 for normal text, 3:1 for large text)
- Interactive elements have sufficient contrast against backgrounds
- Color is not the sole indicator of meaning or state

### 8.2 Focus States

All interactive elements have visible focus states for keyboard navigation.

### 8.3 Screen Readers

- Semantic HTML structure for screen reader compatibility
- ARIA attributes where appropriate
- Alt text for all informational images and charts

### 8.4 Keyboard Navigation

- All interactive elements accessible via keyboard
- Logical tab order throughout interface
- Keyboard shortcuts for common actions

## 9. Theme Implementation

### 9.1 CSS Variables

The design system is implemented using CSS variables for theming:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 262.1 83.3% 57.8%;
  --primary-foreground: 210 20% 98%;
  /* Additional variables... */
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  /* Dark mode overrides... */
}
```

### 9.2 Theme Switching

Theme preferences are stored in local storage and include:
- Light/dark mode preference
- Color scheme selection
- Custom theme adjustments

## 10. Component Usage Guidelines

### 10.1 Data Visualization Best Practices

- Use appropriate chart types for data relationships
- Apply consistent color coding for financial data
- Provide sufficient context and labeling
- Enable different levels of data granularity
- Support interactive exploration where appropriate

### 10.2 Form Design Guidelines

- Group related fields logically
- Show validation feedback immediately
- Use appropriate input types for data
- Provide clear success/error states
- Save user progress when appropriate

### 10.3 Navigation Patterns

- Consistent primary navigation across the platform
- Secondary navigation for related sections
- Breadcrumbs for deep hierarchy
- Clear indicators of current location
- Quick access to frequently used features

This design system document serves as a reference for maintaining consistent visual language and interaction patterns throughout the Crypto Beacon Trader Hub platform. It should be regularly updated as the design evolves.
