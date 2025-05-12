
# Design System Documentation

This document describes the design system used throughout the application, including theming, component usage, and style guidelines.

## Theming

The application supports multiple themes and color schemes:

### Base Themes
- **Light**: Light backgrounds with dark text
- **Dark**: Dark backgrounds with light text

### Color Schemes
- **Default**: Standard elegant theme with balanced contrast
- **Midnight Tech**: Deep blue tech-inspired theme with glowing accents
- **Cyber Pulse**: Vibrant purple cyberpunk style with neon highlights
- **Matrix Code**: Green-tinted hacker aesthetic inspired by The Matrix
- **Neon Future**: Futuristic bright neon look with blue and cyan accents
- **Sunset Gradient**: Warm gradient from orange to purple

### Theme Implementation

Themes are implemented using CSS variables and Tailwind CSS. The base colors are defined in the `tailwind.config.js` file and can be overridden using CSS variables in the `App.css` file.

```css
.themed-app.midnight-tech {
  --background: 224 71% 4%;
  --foreground: 213 31% 91%;
  --primary: 210 100% 50%;
  /* other variables */
}
```

### Theme Context

A React context is provided for managing themes:

```typescript
import { useTheme } from '@/contexts/ThemeContext';

// Usage
const { theme, setTheme, colorScheme, setColorScheme } = useTheme();
```

## Components

The application uses shadcn/ui components. Here are guidelines for using key components:

### Layout Components

- **Card**: Use for containing related content
- **Sheet**: For slide-in panels and drawers
- **Tabs**: For organizing content in the same view
- **ResizablePanel**: For adjustable panel layouts

### Form Elements

- **Button**: Primary interaction element
- **Input**: Text inputs with consistent styling
- **Select**: Dropdown selection fields
- **Switch**: Toggle controls for binary options
- **Checkbox**: Multiple selection options
- **RadioGroup**: Single selection from multiple options

### Data Display

- **Table**: For tabular data display
- **Badge**: For status and category indicators
- **Progress**: For showing completion or loading status
- **Avatar**: For user profile pictures

## Typography

Typography is based on the default system font stack:

```css
font-family: ui-sans-serif, system-ui, sans-serif;
```

### Text Sizes

- **xs**: 0.75rem - Very small text, used for labels
- **sm**: 0.875rem - Small text, used for secondary information
- **base**: 1rem - Default text size for content
- **lg**: 1.125rem - Large text, used for section headings
- **xl**: 1.25rem - Extra large text, used for main headings
- **2xl**: 1.5rem - Headline text

## Spacing System

The spacing system follows Tailwind CSS conventions:

- **px**: 1px
- **0.5**: 0.125rem (2px)
- **1**: 0.25rem (4px)
- **2**: 0.5rem (8px)
- **4**: 1rem (16px)
- **6**: 1.5rem (24px)
- **8**: 2rem (32px)
- **12**: 3rem (48px)
- **16**: 4rem (64px)

## Responsive Design

The application is designed to be fully responsive using Tailwind's breakpoint system:

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

Example usage:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

## Accessibility Guidelines

- All interactive elements must have appropriate ARIA attributes
- Color contrast should meet WCAG AA standards
- All forms must have proper labels
- Focus states should be clearly visible
- Keyboard navigation must be supported

## Icons

The application uses Lucide React for icons. Example usage:

```jsx
import { Settings, User, Home } from 'lucide-react';

<Button>
  <Settings className="h-4 w-4 mr-2" />
  Settings
</Button>
```

## Animation Guidelines

Animations should be subtle and enhance the user experience:

- Use transitions for state changes (hover, focus)
- Keep animations short (150-300ms)
- Avoid animations that might cause motion sickness
- Respect user preferences via `prefers-reduced-motion`

## Best Practices

- Use semantic HTML elements
- Keep component structure flat when possible
- Use composition for complex components
- Follow consistent naming conventions
- Use Tailwind classes for styling
- Avoid inline styles
