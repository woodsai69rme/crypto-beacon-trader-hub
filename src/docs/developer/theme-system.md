# Theme System Developer Documentation

## Architecture Overview

The theming system is built on a combination of React Context, CSS variables, and Tailwind CSS. It provides a flexible way to switch between different themes (dark/light) and color schemes.

## Core Components

### ThemeContext

The `ThemeContext` is the central state management for the theme system. It provides:

- Current theme state (dark/light)
- Current color scheme state (default, blue, purple, etc.)
- Functions to change theme and color scheme
- Persistence of user preferences via localStorage

```typescript
interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  colorScheme: string;
  setColorScheme: (colorScheme: string) => void;
}
```

### ThemeProvider

The `ThemeProvider` wraps the application and provides the theme context to all child components. It handles:

- Initial theme detection
- Theme persistence
- CSS class application to the document root

### ThemeSwitcher

The `ThemeSwitcher` component provides the UI for users to change theme and color scheme. It includes:

- Dropdown menu for theme selection
- Dropdown menu for color scheme selection
- Visual indicators for current selections

## CSS Implementation

### CSS Variables

The theme system uses CSS variables defined at the `:root` level and modified by theme classes:

```css
:root {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  /* Other variables */
}

.light {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  /* Other light-theme variables */
}

/* Color scheme classes */
.blue {
  --primary: 221 83% 53%;
  /* Other blue-scheme variables */
}

.purple {
  --primary: 270 76% 54%;
  /* Other purple-scheme variables */
}

/* Additional color schemes */
```

### Application of Themes

Themes are applied by adding classes to the document root element:

```typescript
useEffect(() => {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  localStorage.setItem("theme", theme);
}, [theme]);

useEffect(() => {
  const root = document.documentElement;
  root.classList.remove("default", "blue", "purple", "green", "amber", "red", "slate");
  if (colorScheme !== "default") {
    root.classList.add(colorScheme);
  }
  localStorage.setItem("colorScheme", colorScheme);
}, [colorScheme]);
```

## Usage in Components

Components can access and modify the theme using the `useTheme` hook:

```typescript
import { useTheme } from '@/contexts/ThemeContext';

const MyComponent = () => {
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme();
  
  return (
    <div>
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        Toggle Theme
      </button>
      <select value={colorScheme} onChange={(e) => setColorScheme(e.target.value)}>
        <option value="default">Default</option>
        <option value="blue">Blue</option>
        {/* Other options */}
      </select>
    </div>
  );
};
```

## Adding New Color Schemes

To add a new color scheme:

1. Define the CSS variables for the new scheme in the global CSS
2. Add the new scheme option to the `colorSchemeOptions` in the `ThemeSwitcher`
3. Update the class removal list in the `ThemeProvider`

## Best Practices

- Use CSS variables for theme-sensitive styles
- Use Tailwind's theme-aware classes (text-primary, bg-background, etc.)
- Test all new components in both light and dark themes
- Ensure sufficient contrast in all color schemes
- Consider users with color vision deficiencies when designing new schemes

## Future Improvements

- User-customizable themes
- Theme presets library
- Component-level theme overrides
- Theme transition animations
- Time-based automatic theme switching
