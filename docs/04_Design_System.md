# Design System

## Advanced Crypto Trading Platform Design System

### Document Information
- **Version**: 1.0
- **Last Updated**: 2025-01-25
- **Maintained by**: Design Team

---

## 1. Design Principles

### 1.1 Core Principles
- **Clarity**: Information should be clear and easy to understand
- **Efficiency**: Minimize cognitive load and clicks to complete tasks
- **Trust**: Build confidence through professional and secure design
- **Accessibility**: Ensure usability for all users regardless of abilities
- **Consistency**: Maintain uniformity across all platform experiences

### 1.2 Australian Market Focus
- **Currency Display**: Default to AUD with clear currency indicators
- **Localization**: Australian English spelling and terminology
- **Cultural Sensitivity**: Respect for Australian financial culture and practices
- **Regulatory Compliance**: Visual compliance with Australian financial regulations

---

## 2. Visual Identity

### 2.1 Logo and Branding
- **Primary Logo**: Modern, tech-forward design with crypto elements
- **Logo Variations**: Light, dark, monochrome, and simplified versions
- **Brand Mark**: Standalone symbol for app icons and favicons
- **Usage Guidelines**: Clear spacing, minimum sizes, and don'ts

### 2.2 Brand Voice
- **Professional**: Expert-level knowledge with accessible communication
- **Trustworthy**: Reliable, secure, and transparent
- **Innovative**: Cutting-edge technology with proven results
- **Australian**: Friendly, direct, and practical approach

---

## 3. Color System

### 3.1 Primary Colors
```css
:root {
  /* Primary Brand Colors */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-500: #3b82f6;  /* Main brand color */
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-900: #1e3a8a;
  
  /* Secondary Colors */
  --secondary-50: #f8fafc;
  --secondary-100: #f1f5f9;
  --secondary-500: #64748b;
  --secondary-600: #475569;
  --secondary-900: #0f172a;
}
```

### 3.2 Semantic Colors
```css
:root {
  /* Success (Gains/Profits) */
  --success-50: #f0fdf4;
  --success-500: #22c55e;
  --success-600: #16a34a;
  --success-700: #15803d;
  
  /* Danger (Losses/Alerts) */
  --danger-50: #fef2f2;
  --danger-500: #ef4444;
  --danger-600: #dc2626;
  --danger-700: #b91c1c;
  
  /* Warning (Caution) */
  --warning-50: #fffbeb;
  --warning-500: #f59e0b;
  --warning-600: #d97706;
  
  /* Info (Neutral information) */
  --info-50: #f0f9ff;
  --info-500: #06b6d4;
  --info-600: #0891b2;
}
```

### 3.3 Theme Support
**Light Theme**:
- Background: `--secondary-50`
- Surface: `#ffffff`
- Text Primary: `--secondary-900`
- Text Secondary: `--secondary-600`

**Dark Theme**:
- Background: `#0a0a0a`
- Surface: `#1a1a1a`
- Text Primary: `#ffffff`
- Text Secondary: `--secondary-400`

**High Contrast Mode**:
- Enhanced contrast ratios for accessibility compliance
- Bold borders and clear visual separations

---

## 4. Typography

### 4.1 Font Family
```css
:root {
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --font-numeric: 'Inter', tabular-nums, sans-serif;
}
```

### 4.2 Type Scale
```css
:root {
  /* Headings */
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */
  
  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
}
```

### 4.3 Financial Data Typography
- **Price Display**: Use tabular figures for consistent alignment
- **Currency Symbols**: Consistent positioning and sizing
- **Percentage Changes**: Color-coded with +/- indicators
- **Large Numbers**: Comma separation for thousands

---

## 5. Spacing System

### 5.1 Base Spacing Unit
```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
}
```

### 5.2 Component Spacing
- **Card Padding**: `--space-6` (24px)
- **Button Padding**: `--space-3 --space-4` (12px 16px)
- **Form Element Spacing**: `--space-4` (16px)
- **Section Spacing**: `--space-12` (48px)

---

## 6. Component Library

### 6.1 Buttons
```tsx
// Primary Button
<Button variant="primary" size="md">
  Execute Trade
</Button>

// Variants: primary, secondary, outline, ghost, destructive
// Sizes: xs, sm, md, lg, xl
```

**Button Specifications**:
- Minimum height: 40px for touch targets
- Border radius: 6px
- Focus states with visible outlines
- Loading states with spinners
- Disabled states with reduced opacity

### 6.2 Cards
```tsx
// Trading Card
<Card className="trading-card">
  <CardHeader>
    <CardTitle>Portfolio Overview</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Card content */}
  </CardContent>
</Card>
```

**Card Specifications**:
- Border radius: 8px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Border: 1px solid border color
- Hover states with elevated shadows

### 6.3 Form Elements
```tsx
// Input Field
<Input
  type="number"
  placeholder="0.00"
  className="currency-input"
  icon={<DollarSign />}
/>
```

**Form Specifications**:
- Height: 40px minimum
- Border radius: 6px
- Focus states with colored borders
- Error states with red borders and error messages
- Helper text for additional context

### 6.4 Data Display
```tsx
// Price Display
<PriceDisplay
  value={58350.50}
  currency="AUD"
  change={2.34}
  changePercent={4.2}
/>
```

**Data Display Specifications**:
- Consistent number formatting
- Color coding for gains/losses
- Responsive sizing based on viewport
- Tabular number alignment

---

## 7. Layout System

### 7.1 Grid System
```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(12, 1fr);
}
```

### 7.2 Responsive Breakpoints
```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

### 7.3 Layout Patterns
- **Dashboard Layout**: Sidebar + main content area
- **Trading Layout**: Multi-panel layout with resizable sections
- **Mobile Layout**: Single column with collapsible navigation
- **Modal Layout**: Centered overlays with backdrop

---

## 8. Iconography

### 8.1 Icon Library
Primary icon library: **Lucide React**
- Consistent 24x24px default size
- Stroke width: 2px
- Scalable for different sizes (16px, 20px, 24px, 32px)

### 8.2 Financial Icons
```tsx
// Trading Icons
<TrendingUp />    // Gains/Bullish
<TrendingDown />  // Losses/Bearish
<DollarSign />    // Currency
<BarChart />      // Analytics
<Shield />        // Security/Risk
<Bot />           // AI/Automation
```

### 8.3 Custom Icons
- **Cryptocurrency Icons**: Custom SVG icons for major cryptocurrencies
- **Exchange Icons**: Branded icons for supported exchanges
- **Feature Icons**: Custom icons for platform-specific features

---

## 9. Accessibility

### 9.1 Color Contrast
- **AA Compliance**: Minimum 4.5:1 contrast ratio for normal text
- **AAA Compliance**: 7:1 contrast ratio for enhanced accessibility
- **Color Independence**: Information not conveyed by color alone

### 9.2 Keyboard Navigation
- **Tab Order**: Logical tab sequence through interface
- **Focus Indicators**: Visible focus states for all interactive elements
- **Keyboard Shortcuts**: Common shortcuts for power users
- **Screen Reader Support**: ARIA labels and semantic markup

### 9.3 Responsive Design
- **Touch Targets**: Minimum 44px for mobile interfaces
- **Zoom Support**: Usable at 200% zoom level
- **Mobile Optimization**: Optimized for one-handed use

---

## 10. Animation and Motion

### 10.1 Animation Principles
- **Purposeful**: Animations serve a functional purpose
- **Subtle**: Non-distracting and professional
- **Fast**: Quick transitions (<300ms for most interactions)
- **Respectful**: Respect user's motion preferences

### 10.2 Common Animations
```css
/* Fade In */
.fade-in {
  animation: fadeIn 200ms ease-out;
}

/* Slide In */
.slide-in {
  animation: slideIn 300ms ease-out;
}

/* Loading Spinner */
.spinner {
  animation: spin 1s linear infinite;
}
```

### 10.3 Performance Considerations
- Use `transform` and `opacity` for smooth animations
- Avoid animating layout properties
- Implement `prefers-reduced-motion` support
- Optimize for 60fps performance

---

## 11. Data Visualization

### 11.1 Chart Design
- **Color Palette**: Consistent colors for different data types
- **Grid Lines**: Subtle grid lines for better readability
- **Tooltips**: Informative hover states
- **Responsive**: Adaptive sizing for different screen sizes

### 11.2 Financial Chart Conventions
- **Candlestick Charts**: Green for gains, red for losses (following international conventions)
- **Volume Bars**: Coordinated colors with price movement
- **Technical Indicators**: Distinct colors for different indicators
- **Time Axis**: Clear time labels with appropriate granularity

---

## 12. Implementation Guidelines

### 12.1 CSS Architecture
```scss
// BEM Methodology
.trading-card {
  &__header {
    // Header styles
  }
  
  &__content {
    // Content styles
  }
  
  &--compact {
    // Compact variant
  }
}
```

### 12.2 Component Development
- Use TypeScript for all components
- Implement proper prop types and defaults
- Include Storybook stories for each component
- Write comprehensive unit tests
- Document component APIs

### 12.3 Design Tokens
```typescript
// Design tokens exported as TypeScript constants
export const colors = {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    900: '#1e3a8a',
  },
  // ... other colors
} as const;
```

---

## 13. Quality Assurance

### 13.1 Design Review Process
1. **Design Review**: Design team reviews for brand consistency
2. **Accessibility Review**: Check for WCAG 2.1 compliance
3. **Code Review**: Development team reviews implementation
4. **User Testing**: Validate with real users
5. **Performance Review**: Check for performance impact

### 13.2 Maintenance
- **Regular Audits**: Quarterly design system audits
- **Version Control**: Semantic versioning for design system updates
- **Documentation**: Keep documentation up-to-date with changes
- **Training**: Regular training for team members on design system usage
