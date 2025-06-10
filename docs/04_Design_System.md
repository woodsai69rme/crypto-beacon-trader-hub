
# Design System

## 1. Design Principles

### 1.1 Core Principles
- **Clarity**: Information should be clear and easy to understand
- **Consistency**: Consistent patterns across all interfaces
- **Efficiency**: Minimize cognitive load and maximize productivity
- **Accessibility**: Inclusive design for all users
- **Trust**: Professional appearance that builds confidence

### 1.2 Visual Hierarchy
- **Primary**: Most important actions and information
- **Secondary**: Supporting actions and context
- **Tertiary**: Additional details and metadata

### 1.3 User Experience Guidelines
- **Progressive Disclosure**: Show information as needed
- **Feedback**: Immediate response to user actions
- **Error Prevention**: Design to prevent mistakes
- **Recognition**: Use familiar patterns and conventions

## 2. Color Palette

### 2.1 Primary Colors
```css
/* Primary Brand Colors */
--primary: 222.2 84% 4.9%;           /* Deep Blue-Black */
--primary-foreground: 210 40% 98%;   /* Light Text */

/* Secondary Colors */
--secondary: 210 40% 96%;            /* Light Gray */
--secondary-foreground: 222.2 84% 4.9%; /* Dark Text */

/* Accent Colors */
--accent: 210 40% 96%;               /* Subtle Accent */
--accent-foreground: 222.2 84% 4.9%; /* Accent Text */
```

### 2.2 Semantic Colors
```css
/* Success (Gains) */
--success: 142 76% 36%;              /* Green */
--success-foreground: 355 100% 97%; /* Light Text */

/* Destructive (Losses) */
--destructive: 0 84% 60%;            /* Red */
--destructive-foreground: 210 40% 98%; /* Light Text */

/* Warning */
--warning: 38 92% 50%;               /* Orange */
--warning-foreground: 222.2 84% 4.9%; /* Dark Text */

/* Info */
--info: 199 89% 48%;                 /* Blue */
--info-foreground: 210 40% 98%;     /* Light Text */
```

### 2.3 Neutral Colors
```css
/* Background Colors */
--background: 0 0% 100%;             /* White */
--foreground: 222.2 84% 4.9%;       /* Dark Text */

/* Card and Surface Colors */
--card: 0 0% 100%;                   /* White Cards */
--card-foreground: 222.2 84% 4.9%;  /* Card Text */

/* Popover Colors */
--popover: 0 0% 100%;                /* White Popover */
--popover-foreground: 222.2 84% 4.9%; /* Popover Text */

/* Muted Colors */
--muted: 210 40% 96%;                /* Light Gray */
--muted-foreground: 215.4 16.3% 46.9%; /* Muted Text */

/* Border Colors */
--border: 214.3 31.8% 91.4%;        /* Light Border */
--input: 214.3 31.8% 91.4%;         /* Input Border */
```

### 2.4 Dark Mode Colors
```css
/* Dark Mode Overrides */
.dark {
  --background: 222.2 84% 4.9%;      /* Dark Background */
  --foreground: 210 40% 98%;         /* Light Text */
  
  --card: 222.2 84% 4.9%;            /* Dark Cards */
  --card-foreground: 210 40% 98%;    /* Light Card Text */
  
  --popover: 222.2 84% 4.9%;         /* Dark Popover */
  --popover-foreground: 210 40% 98%; /* Light Popover Text */
  
  --primary: 210 40% 98%;            /* Light Primary */
  --primary-foreground: 222.2 84% 4.9%; /* Dark Primary Text */
  
  --secondary: 217.2 32.6% 17.5%;    /* Dark Secondary */
  --secondary-foreground: 210 40% 98%; /* Light Secondary Text */
  
  --muted: 217.2 32.6% 17.5%;        /* Dark Muted */
  --muted-foreground: 215 20.2% 65.1%; /* Muted Text */
  
  --accent: 217.2 32.6% 17.5%;       /* Dark Accent */
  --accent-foreground: 210 40% 98%;  /* Light Accent Text */
  
  --border: 217.2 32.6% 17.5%;       /* Dark Border */
  --input: 217.2 32.6% 17.5%;        /* Dark Input */
}
```

## 3. Typography

### 3.1 Font Stack
```css
/* Primary Font */
font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

/* Monospace Font */
font-family: "JetBrains Mono", "Fira Code", "Consolas", monospace;
```

### 3.2 Font Sizes
```css
/* Heading Sizes */
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }    /* 36px */
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }  /* 30px */
.text-2xl { font-size: 1.5rem; line-height: 2rem; }       /* 24px */
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }    /* 20px */
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }   /* 18px */

/* Body Sizes */
.text-base { font-size: 1rem; line-height: 1.5rem; }      /* 16px */
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }   /* 14px */
.text-xs { font-size: 0.75rem; line-height: 1rem; }       /* 12px */
```

### 3.3 Font Weights
```css
.font-thin { font-weight: 100; }
.font-light { font-weight: 300; }
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
.font-extrabold { font-weight: 800; }
.font-black { font-weight: 900; }
```

## 4. Spacing and Layout

### 4.1 Spacing Scale
```css
/* Tailwind Spacing Scale */
.space-1 { margin: 0.25rem; }    /* 4px */
.space-2 { margin: 0.5rem; }     /* 8px */
.space-3 { margin: 0.75rem; }    /* 12px */
.space-4 { margin: 1rem; }       /* 16px */
.space-5 { margin: 1.25rem; }    /* 20px */
.space-6 { margin: 1.5rem; }     /* 24px */
.space-8 { margin: 2rem; }       /* 32px */
.space-10 { margin: 2.5rem; }    /* 40px */
.space-12 { margin: 3rem; }      /* 48px */
.space-16 { margin: 4rem; }      /* 64px */
```

### 4.2 Grid System
```css
/* 12-Column Grid */
.grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }

/* Common Grid Layouts */
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.grid-cols-6 { grid-template-columns: repeat(6, minmax(0, 1fr)); }
```

### 4.3 Container Sizes
```css
/* Container Widths */
.container { 
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Responsive Containers */
@media (min-width: 640px) {  /* sm */
  .container { max-width: 640px; }
}
@media (min-width: 768px) {  /* md */
  .container { max-width: 768px; }
}
@media (min-width: 1024px) { /* lg */
  .container { max-width: 1024px; }
}
@media (min-width: 1280px) { /* xl */
  .container { max-width: 1280px; }
}
```

## 5. Components

### 5.1 Buttons

#### Primary Button
```tsx
<Button variant="default" size="default">
  Primary Action
</Button>
```
- Background: Primary color
- Text: Primary foreground
- Hover: Darker primary
- Active: Even darker primary

#### Secondary Button
```tsx
<Button variant="secondary" size="default">
  Secondary Action
</Button>
```
- Background: Secondary color
- Text: Secondary foreground
- Border: Subtle border
- Hover: Slightly darker

#### Destructive Button
```tsx
<Button variant="destructive" size="default">
  Delete
</Button>
```
- Background: Destructive color
- Text: Destructive foreground
- Hover: Darker destructive

#### Button Sizes
```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">🎯</Button>
```

### 5.2 Cards

#### Basic Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
  <CardFooter>
    Card footer
  </CardFooter>
</Card>
```

#### Trading Card
```tsx
<Card className="trading-card">
  <CardHeader className="pb-3">
    <div className="flex items-center justify-between">
      <CardTitle className="text-lg">BTC/AUD</CardTitle>
      <Badge variant={trend > 0 ? "success" : "destructive"}>
        {trend > 0 ? "+" : ""}{trend}%
      </Badge>
    </div>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">
      ${price.toLocaleString()}
    </div>
  </CardContent>
</Card>
```

### 5.3 Forms

#### Input Field
```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input 
    id="email" 
    type="email" 
    placeholder="Enter your email"
  />
</div>
```

#### Select Field
```tsx
<div className="space-y-2">
  <Label htmlFor="strategy">Trading Strategy</Label>
  <Select>
    <SelectTrigger>
      <SelectValue placeholder="Select strategy" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="trend">Trend Following</SelectItem>
      <SelectItem value="mean">Mean Reversion</SelectItem>
    </SelectContent>
  </Select>
</div>
```

### 5.4 Navigation

#### Main Navigation
```tsx
<nav className="border-b">
  <div className="container flex items-center justify-between h-16">
    <div className="flex items-center space-x-8">
      <Logo />
      <NavigationMenu>
        <NavigationMenuItem>
          <NavigationMenuLink href="/dashboard">
            Dashboard
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenu>
    </div>
    <UserMenu />
  </div>
</nav>
```

#### Sidebar Navigation
```tsx
<aside className="w-64 border-r bg-muted/40">
  <div className="p-6">
    <nav className="space-y-2">
      <Link 
        href="/dashboard" 
        className="flex items-center space-x-3 rounded-lg px-3 py-2 hover:bg-accent"
      >
        <Home className="h-4 w-4" />
        <span>Dashboard</span>
      </Link>
    </nav>
  </div>
</aside>
```

## 6. Icons

### 6.1 Icon Library
Using Lucide React for consistent iconography:

```tsx
import { 
  Home,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Bot,
  Settings,
  User,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';
```

### 6.2 Icon Sizes
```tsx
<Icon className="h-4 w-4" />  {/* 16px - Small */}
<Icon className="h-5 w-5" />  {/* 20px - Default */}
<Icon className="h-6 w-6" />  {/* 24px - Medium */}
<Icon className="h-8 w-8" />  {/* 32px - Large */}
```

### 6.3 Icon Usage Guidelines
- Use consistent sizes within components
- Align icons with text baseline
- Use semantic colors (green for gains, red for losses)
- Provide accessible labels for screen readers

## 7. Charts and Data Visualization

### 7.1 Chart Colors
```css
/* Trend Colors */
--chart-positive: hsl(142 76% 36%);  /* Green */
--chart-negative: hsl(0 84% 60%);    /* Red */
--chart-neutral: hsl(215 20% 65%);   /* Gray */

/* Chart Series Colors */
--chart-1: hsl(199 89% 48%);   /* Blue */
--chart-2: hsl(142 76% 36%);   /* Green */
--chart-3: hsl(0 84% 60%);     /* Red */
--chart-4: hsl(38 92% 50%);    /* Orange */
--chart-5: hsl(271 81% 56%);   /* Purple */
```

### 7.2 Chart Components
```tsx
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Line 
      type="monotone" 
      dataKey="value" 
      stroke="var(--chart-1)" 
      strokeWidth={2} 
    />
  </LineChart>
</ResponsiveContainer>
```

## 8. Responsive Design

### 8.1 Breakpoints
```css
/* Tailwind Breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### 8.2 Mobile-First Approach
```tsx
<div className="
  grid 
  grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-3 
  gap-4
">
  {/* Responsive grid */}
</div>
```

### 8.3 Mobile Navigation
```tsx
<div className="md:hidden">
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="ghost" size="sm">
        <Menu className="h-5 w-5" />
      </Button>
    </SheetTrigger>
    <SheetContent side="left">
      <MobileNavigation />
    </SheetContent>
  </Sheet>
</div>
```

## 9. Accessibility

### 9.1 Color Contrast
- Maintain WCAG AA compliance (4.5:1 ratio)
- Use semantic colors consistently
- Provide alternative indicators beyond color

### 9.2 Focus States
```css
.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
```

### 9.3 Screen Reader Support
```tsx
<Button aria-label="Close dialog">
  <X className="h-4 w-4" />
  <span className="sr-only">Close</span>
</Button>
```

## 10. Animation and Transitions

### 10.1 Transition Classes
```css
.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
```

### 10.2 Hover Effects
```tsx
<Button className="
  transition-colors 
  hover:bg-primary/90 
  focus:bg-primary/90
">
  Hover Me
</Button>
```

### 10.3 Loading States
```tsx
<Button disabled className="animate-pulse">
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Loading...
</Button>
```
