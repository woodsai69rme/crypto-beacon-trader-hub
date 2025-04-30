# Theme System Developer Documentation

## Architecture Overview

The theming system is built on a combination of React Context, CSS variables, and Tailwind CSS. It provides a flexible way to switch between different themes (dark/light) and color schemes (default, blue, purple, green, amber, red, slate).

## Core Components

### ThemeContext

The `ThemeContext` is the central state management for the theme system. It provides:

- Current theme state (dark/light)
- Current color scheme state (default, blue, purple, green, amber, red, slate)
- Functions to change theme and color scheme
- Persistence of user preferences via localStorage

```typescript
interface ThemeContextType {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  colorScheme: "default" | "blue" | "purple" | "green" | "amber" | "red" | "slate";
  setColorScheme: (colorScheme: "default" | "blue" | "purple" | "green" | "amber" | "red" | "slate") => void;
}
```

### ThemeProvider

The `ThemeProvider` wraps the application and provides the theme context to all child components. It handles:

- Initial theme detection from localStorage
- Theme persistence to localStorage
- CSS class application to the document root
- Default theme is dark if no preference is found

### ThemeSwitcher

The `ThemeSwitcher` component provides the UI for users to change theme and color scheme. It includes:

- Dropdown menu for theme selection (light/dark)
- Dropdown menu for color scheme selection
- Visual indicators for current selections
- Toast notifications for changes

## CSS Implementation

### CSS Variables

The theme system uses CSS variables defined at the `:root` level and modified by theme classes:

```css
:root {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  /* Other dark theme variables */
}

.light {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  /* Other light theme variables */
}

/* Color scheme classes */
.blue {
  --primary: 221 83% 53%;
  /* Other blue scheme variables */
}
```

### Application of Themes

Themes are applied by adding classes to the document root element:

```typescript
useEffect(() => {
  // Apply theme to document root element
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  localStorage.setItem("theme", theme);
}, [theme]);

useEffect(() => {
  // Apply color scheme to document root element
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
      <select 
        value={colorScheme} 
        onChange={(e) => setColorScheme(e.target.value as "default" | "blue" | "purple" | "green" | "amber" | "red" | "slate")}
      >
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

1. Add the new color scheme to the `ColorScheme` type in `ThemeContext.tsx`:

```typescript
type ColorScheme = "default" | "blue" | "purple" | "green" | "amber" | "red" | "slate" | "newScheme";
```

2. Update the validation check in the `useState` initialization:

```typescript
const [colorScheme, setColorSchemeState] = useState<ColorScheme>(() => {
  // Check localStorage first, default to 'default'
  const savedColorScheme = localStorage.getItem("colorScheme");
  return (savedColorScheme === "default" || 
          // Add your new scheme here
          savedColorScheme === "newScheme") ? savedColorScheme as ColorScheme : "default";
});
```

3. Update the class removal list in `useEffect`:

```typescript
root.classList.remove("default", "blue", "purple", /* Add new scheme here */);
```

4. Add CSS variables for the new scheme in `themes.css`:

```css
.newScheme {
  --primary: 200 100% 50%;
  --primary-foreground: 0 0% 100%;
  --ring: 200 100% 50%;
}

.bg-newScheme-500 {
  background-color: hsl(200, 100%, 50%);
}

.text-newScheme-500 {
  color: hsl(200, 100%, 50%);
}
```

5. Add the new option to the `ThemeSwitcher` component's `colorSchemeOptions`:

```typescript
const colorSchemeOptions: ThemeOption[] = [
  // Existing options
  { value: "newScheme", label: "New Scheme", description: "Description of new scheme" },
];
```

## Best Practices

- Use CSS variables for theme-sensitive styles
- Use Tailwind's theme-aware classes (text-primary, bg-background, etc.)
- Test all new components in both light and dark themes
- Ensure sufficient contrast in all color schemes
- Consider users with color vision deficiencies when designing new schemes
- Be consistent with color usage across the application

## Theme Persistence

The theme system persists user preferences using localStorage:

- `localStorage.getItem("theme")` - Retrieves the current theme
- `localStorage.setItem("theme", theme)` - Stores the current theme
- `localStorage.getItem("colorScheme")` - Retrieves the current color scheme
- `localStorage.setItem("colorScheme", colorScheme)` - Stores the current color scheme

These values are loaded on initial application load and applied to the document root.

## Future Improvements

- User-customizable themes
- Theme presets library
- Component-level theme overrides
- Theme transition animations
- Time-based automatic theme switching
