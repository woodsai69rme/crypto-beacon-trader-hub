
# Design System Documentation
# ZeroOne AI-Powered Workspace Platform

## Document Information
- **Version**: 1.0
- **Last Updated**: June 2025
- **Owner**: Design Team
- **Status**: Active

## 1. Design Philosophy

### 1.1 Core Principles

#### AI-First Experience
Every interface element is designed to seamlessly integrate AI capabilities, making artificial intelligence feel natural and accessible rather than overwhelming or complex.

#### Cyberpunk Aesthetics with Professional Functionality
The design balances futuristic cyberpunk visual elements with professional usability, creating an environment that feels cutting-edge while remaining productive and focused.

#### Progressive Disclosure
Complex functionality is revealed progressively, allowing users to access advanced features without cluttering the primary interface.

#### Contextual Intelligence
The interface adapts based on user behavior, current tasks, and AI insights to provide relevant tools and information at the right time.

### 1.2 Design Values

- **Clarity**: Information hierarchy that guides user attention
- **Efficiency**: Minimal cognitive load for maximum productivity
- **Flexibility**: Adaptable to various workflows and preferences
- **Innovation**: Forward-thinking design that embraces new technologies
- **Accessibility**: Inclusive design for all users and abilities

## 2. Visual Identity

### 2.1 Brand Colors

#### Primary Palette
```css
/* Primary Green - AI/Tech Focus */
--primary: hsl(142, 76%, 36%);           /* #16a34a */
--primary-foreground: hsl(355, 7%, 97%); /* #fafafa */

/* Secondary Blue - Trust/Professional */
--secondary: hsl(215, 28%, 17%);         /* #1e293b */
--secondary-foreground: hsl(210, 40%, 98%); /* #f8fafc */

/* Accent Cyan - Highlights/Actions */
--accent: hsl(180, 100%, 50%);           /* #00ffff */
--accent-foreground: hsl(222, 84%, 5%);  /* #0a0a0a */
```

#### Status Colors
```css
/* Success States */
--success: hsl(142, 76%, 36%);           /* #16a34a */
--success-foreground: hsl(0, 0%, 100%);  /* #ffffff */

/* Warning States */
--warning: hsl(38, 92%, 50%);            /* #f59e0b */
--warning-foreground: hsl(222, 84%, 5%); /* #0a0a0a */

/* Error States */
--error: hsl(0, 84%, 60%);               /* #ef4444 */
--error-foreground: hsl(0, 0%, 100%);    /* #ffffff */

/* Info States */
--info: hsl(221, 83%, 53%);              /* #3b82f6 */
--info-foreground: hsl(0, 0%, 100%);     /* #ffffff */
```

#### Background System
```css
/* Dark Theme (Primary) */
--background: hsl(222, 84%, 5%);         /* #0a0a0a */
--foreground: hsl(210, 40%, 98%);        /* #f8fafc */

--card: hsl(222, 84%, 8%);               /* #0f172a */
--card-foreground: hsl(210, 40%, 98%);   /* #f8fafc */

--muted: hsl(215, 28%, 17%);             /* #1e293b */
--muted-foreground: hsl(215, 20%, 65%);  /* #94a3b8 */

--border: hsl(215, 28%, 17%);            /* #1e293b */
--input: hsl(215, 28%, 17%);             /* #1e293b */
--ring: hsl(142, 76%, 36%);              /* #16a34a */
```

### 2.2 Typography

#### Font Families
```css
/* Primary Font - Interface */
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;

/* Monospace Font - Code */
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;

/* Display Font - Headlines */
--font-heading: 'Inter', system-ui, -apple-system, sans-serif;
```

#### Type Scale
```css
/* Headings */
--text-6xl: 3.75rem;    /* 60px - Hero headings */
--text-5xl: 3rem;       /* 48px - Page titles */
--text-4xl: 2.25rem;    /* 36px - Section headers */
--text-3xl: 1.875rem;   /* 30px - Card titles */
--text-2xl: 1.5rem;     /* 24px - Subsection headers */
--text-xl: 1.25rem;     /* 20px - Large text */

/* Body Text */
--text-lg: 1.125rem;    /* 18px - Large body text */
--text-base: 1rem;      /* 16px - Default body text */
--text-sm: 0.875rem;    /* 14px - Small text */
--text-xs: 0.75rem;     /* 12px - Captions, labels */
```

#### Font Weights
```css
--font-thin: 100;
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
--font-black: 900;
```

### 2.3 Spacing System

#### Base Unit
```css
--spacing-unit: 0.25rem; /* 4px base unit */
```

#### Spacing Scale
```css
--space-0: 0;           /* 0px */
--space-1: 0.25rem;     /* 4px */
--space-2: 0.5rem;      /* 8px */
--space-3: 0.75rem;     /* 12px */
--space-4: 1rem;        /* 16px */
--space-5: 1.25rem;     /* 20px */
--space-6: 1.5rem;      /* 24px */
--space-8: 2rem;        /* 32px */
--space-10: 2.5rem;     /* 40px */
--space-12: 3rem;       /* 48px */
--space-16: 4rem;       /* 64px */
--space-20: 5rem;       /* 80px */
--space-24: 6rem;       /* 96px */
--space-32: 8rem;       /* 128px */
```

### 2.4 Border Radius

```css
--radius-none: 0;
--radius-sm: 0.125rem;   /* 2px */
--radius: 0.375rem;      /* 6px - Default */
--radius-md: 0.5rem;     /* 8px */
--radius-lg: 0.75rem;    /* 12px */
--radius-xl: 1rem;       /* 16px */
--radius-2xl: 1.5rem;    /* 24px */
--radius-full: 9999px;   /* Pill shape */
```

### 2.5 Shadows

```css
/* Box Shadows */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

/* Cyberpunk Glow Effects */
--glow-green: 0 0 20px hsl(142, 76%, 36%);
--glow-cyan: 0 0 20px hsl(180, 100%, 50%);
--glow-blue: 0 0 20px hsl(221, 83%, 53%);
```

## 3. Component System

### 3.1 Component Categories

#### Foundational Components
- **Button**: Primary actions and interactions
- **Input**: Text input and form fields
- **Card**: Content containers and layout
- **Badge**: Status indicators and labels
- **Avatar**: User representation

#### Navigation Components
- **Sidebar**: Primary navigation
- **Tabs**: Section navigation
- **Breadcrumbs**: Hierarchical navigation
- **Pagination**: Content pagination

#### Data Display Components
- **Table**: Structured data display
- **Chart**: Data visualization
- **Progress**: Progress indicators
- **Skeleton**: Loading states

#### Feedback Components
- **Alert**: System messages
- **Toast**: Temporary notifications
- **Modal**: Overlay content
- **Tooltip**: Contextual information

### 3.2 Button System

#### Button Variants
```typescript
type ButtonVariant = 
  | 'default'    // Primary action button
  | 'destructive' // Dangerous actions
  | 'outline'    // Secondary actions
  | 'secondary'  // Tertiary actions
  | 'ghost'      // Minimal actions
  | 'link';      // Text links
```

#### Button Sizes
```typescript
type ButtonSize = 
  | 'default'    // Standard size (h-10, px-4, py-2)
  | 'sm'         // Small size (h-9, px-3)
  | 'lg'         // Large size (h-11, px-8)
  | 'icon';      // Icon only (h-10, w-10)
```

#### Implementation Example
```tsx
<Button variant="default" size="lg" className="glow-on-hover">
  <Zap className="mr-2 h-4 w-4" />
  Start AI Agent
</Button>
```

### 3.3 Input System

#### Input Variants
- **Text Input**: Standard text entry
- **Password Input**: Password with visibility toggle
- **Search Input**: Search with icon and clear button
- **Textarea**: Multi-line text input
- **Select**: Dropdown selection
- **Combobox**: Searchable select

#### Input States
```css
/* Default State */
.input-default {
  border: 1px solid var(--border);
  background: var(--input);
}

/* Focus State */
.input-focus {
  border-color: var(--ring);
  box-shadow: 0 0 0 2px var(--ring);
}

/* Error State */
.input-error {
  border-color: var(--error);
  box-shadow: 0 0 0 2px var(--error);
}

/* Disabled State */
.input-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### 3.4 Card System

#### Card Anatomy
```tsx
<Card className="cyber-border">
  <CardHeader>
    <CardTitle>AI Agent Performance</CardTitle>
    <CardDescription>Real-time metrics and insights</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Card content */}
  </CardContent>
  <CardFooter>
    {/* Action buttons */}
  </CardFooter>
</Card>
```

#### Card Variants
- **Default**: Standard content card
- **Interactive**: Hoverable cards with actions
- **Stat**: Metric display cards
- **Feature**: Product feature cards

## 4. Layout System

### 4.1 Grid System

#### Responsive Breakpoints
```css
--screen-sm: 640px;   /* Small devices */
--screen-md: 768px;   /* Medium devices */
--screen-lg: 1024px;  /* Large devices */
--screen-xl: 1280px;  /* Extra large devices */
--screen-2xl: 1536px; /* 2X large devices */
```

#### Grid Classes
```css
/* Container */
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Grid System */
.grid {
  display: grid;
  gap: 1.5rem;
}

.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
```

### 4.2 Sidebar Layout

#### Sidebar Specifications
```css
.sidebar {
  width: 256px;           /* Expanded width */
  min-width: 64px;        /* Collapsed width */
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: var(--card);
  border-right: 1px solid var(--border);
  transition: width 0.3s ease;
}

.sidebar-collapsed {
  width: 64px;
}
```

#### Main Content Layout
```css
.main-content {
  margin-left: 256px;     /* When sidebar expanded */
  padding: 1.5rem;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
}

.main-content-collapsed {
  margin-left: 64px;      /* When sidebar collapsed */
}
```

### 4.3 Dashboard Layout

#### Dashboard Grid
```css
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
}

.widget {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
}

.widget-large {
  grid-column: span 2;
}

.widget-tall {
  grid-row: span 2;
}
```

## 5. Iconography

### 5.1 Icon System

#### Icon Library
**Primary**: Lucide React icons for consistency and quality
**Secondary**: Custom SVG icons for specific features

#### Icon Sizes
```css
--icon-xs: 0.75rem;    /* 12px */
--icon-sm: 1rem;       /* 16px */
--icon-md: 1.25rem;    /* 20px */
--icon-lg: 1.5rem;     /* 24px */
--icon-xl: 2rem;       /* 32px */
--icon-2xl: 2.5rem;    /* 40px */
```

#### Icon Usage Guidelines
- Use consistent sizing within contexts
- Maintain adequate contrast with backgrounds
- Apply appropriate semantic meaning
- Include accessible alt text for screen readers

### 5.2 Icon Categories

#### Navigation Icons
```tsx
import { 
  Home, Settings, Search, Menu, 
  ChevronLeft, ChevronRight, ChevronDown 
} from 'lucide-react';
```

#### Action Icons
```tsx
import { 
  Plus, Edit, Trash2, Save, Download, 
  Upload, Copy, Share, Eye, EyeOff 
} from 'lucide-react';
```

#### Status Icons
```tsx
import { 
  CheckCircle, AlertCircle, XCircle, 
  Info, AlertTriangle, Clock 
} from 'lucide-react';
```

#### Feature Icons
```tsx
import { 
  Bot, Zap, Brain, Cpu, Database, 
  MessageSquare, FileText, BarChart3 
} from 'lucide-react';
```

## 6. Animation & Transitions

### 6.1 Animation Principles

#### Duration Guidelines
```css
--duration-fast: 150ms;      /* Micro-interactions */
--duration-normal: 250ms;    /* Standard transitions */
--duration-slow: 350ms;      /* Complex animations */
--duration-slower: 500ms;    /* Page transitions */
```

#### Easing Functions
```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### 6.2 Common Animations

#### Fade Animations
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

.fade-in {
  animation: fadeIn var(--duration-normal) var(--ease-out);
}
```

#### Slide Animations
```css
@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes slideInLeft {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
```

#### Cyberpunk Effects
```css
@keyframes cyberpunkGlow {
  0%, 100% { 
    box-shadow: 0 0 5px var(--primary);
  }
  50% { 
    box-shadow: 0 0 20px var(--primary), 0 0 30px var(--primary);
  }
}

.cyber-glow {
  animation: cyberpunkGlow 2s ease-in-out infinite;
}
```

## 7. Responsive Design

### 7.1 Mobile-First Approach

#### Breakpoint Strategy
1. **Mobile**: Design for mobile first (320px+)
2. **Tablet**: Enhance for tablet (768px+)
3. **Desktop**: Optimize for desktop (1024px+)
4. **Large Desktop**: Scale for large screens (1280px+)

#### Component Responsive Behavior
```tsx
// Example: Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {/* Grid items */}
</div>

// Example: Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  ZeroOne Platform
</h1>
```

### 7.2 Mobile Optimizations

#### Touch Targets
- Minimum 44px touch targets
- Adequate spacing between interactive elements
- Gesture-friendly interactions

#### Performance Considerations
- Optimize images and assets
- Minimize bundle size
- Implement progressive loading

## 8. Accessibility

### 8.1 WCAG 2.1 AA Compliance

#### Color Contrast
- Text: Minimum 4.5:1 contrast ratio
- Large text: Minimum 3:1 contrast ratio
- UI components: Minimum 3:1 contrast ratio

#### Keyboard Navigation
- All interactive elements accessible via keyboard
- Visible focus indicators
- Logical tab order

#### Screen Reader Support
- Semantic HTML elements
- ARIA labels and descriptions
- Alternative text for images

### 8.2 Inclusive Design

#### Motor Accessibility
- Large enough touch targets
- Alternative input methods
- Reduced motion options

#### Cognitive Accessibility
- Clear information hierarchy
- Consistent navigation patterns
- Simple, clear language

#### Visual Accessibility
- High contrast mode support
- Scalable text and UI elements
- Color-blind friendly palette

## 9. Component Documentation

### 9.1 Component API

#### Props Documentation
```typescript
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}
```

#### Usage Examples
```tsx
// Primary action button
<Button variant="default" size="lg">
  Create Project
</Button>

// Secondary action
<Button variant="outline">
  Cancel
</Button>

// Icon button
<Button variant="ghost" size="icon">
  <Settings className="h-4 w-4" />
</Button>
```

### 9.2 Design Tokens

#### CSS Custom Properties
```css
:root {
  /* Colors */
  --primary: hsl(142, 76%, 36%);
  --secondary: hsl(215, 28%, 17%);
  
  /* Typography */
  --font-sans: 'Inter', sans-serif;
  --text-base: 1rem;
  
  /* Spacing */
  --space-4: 1rem;
  --space-6: 1.5rem;
  
  /* Borders */
  --radius: 0.375rem;
  --border-width: 1px;
}
```

This design system provides a comprehensive foundation for creating consistent, accessible, and visually appealing interfaces across the ZeroOne platform while maintaining the cyberpunk aesthetic and professional functionality.
