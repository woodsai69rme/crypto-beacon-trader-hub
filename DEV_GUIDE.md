
# Developer Guide

This guide provides all the necessary information for developers working on the Crypto Beacon Trader Hub project.

## 📂 Project Structure

```
crypto-beacon-trader/
├── public/
│   └── assets/
├── src/
│   ├── components/
│   │   ├── api/             # API-related components
│   │   ├── charts/          # Chart components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── MarketCorrelations/  # Market correlation analysis
│   │   ├── portfolio/       # Portfolio components
│   │   ├── tax/             # Tax calculation components
│   │   ├── trading/         # Trading components
│   │   ├── ui/              # UI components (shadcn)
│   │   └── widgets/         # Dashboard widgets
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions and libraries
│   ├── services/            # API services and data fetching
│   ├── types/               # TypeScript type definitions
│   ├── App.tsx              # Main App component
│   ├── index.tsx            # Entry point
│   └── main.tsx             # Vite entry
└── ...config files
```

## 🧰 Development Tools

- **Code Editor**: VSCode with the following extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript Vue Plugin

## 🪝 Coding Standards

### TypeScript

- Always define proper types for all components, functions, and variables
- Avoid using `any` type unless absolutely necessary
- Use interfaces for objects and type aliases for unions/intersections
- Export types from a centralized location (e.g., `types/trading.ts`)

### React Components

- Use functional components with hooks
- Organize imports in the following order:
  1. React and React hooks
  2. Third-party libraries
  3. Local components
  4. Local utilities, helpers, and types
  5. Styles
- Use named exports for components
- Break large components into smaller, reusable pieces

### Naming Conventions

- **Files & Folders**: PascalCase for components, camelCase for utilities
- **Components**: PascalCase (e.g., `DashboardOverview.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useMediaQuery.ts`)
- **Interfaces**: PascalCase with descriptive names (e.g., `ApiProviderProps`)
- **Type Aliases**: PascalCase (e.g., `DashboardTab`)
- **Constants**: UPPER_SNAKE_CASE for truly constant values

### Component Architecture

- Use the Atomic Design methodology where possible:
  - **Atoms**: Basic UI elements (buttons, inputs)
  - **Molecules**: Simple combinations of atoms (form fields)
  - **Organisms**: Complex UI sections (header, sidebar)
  - **Templates**: Page layouts
  - **Pages**: Specific instances of templates

## 🔄 Git Workflow

### Branch Naming

- `feature/feature-name`: For new features
- `bugfix/issue-description`: For bug fixes
- `refactor/component-name`: For code refactoring
- `docs/documentation-update`: For documentation updates
- `release/vX.X.X`: For release preparation

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, semicolons)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or modifying tests
- **chore**: Changes to the build process or auxiliary tools

### Pull Request Process

1. Create a new branch from `main`
2. Implement your changes
3. Ensure code passes linting and tests
4. Create a pull request with a clear description
5. Request code review from teammates
6. Address any feedback
7. Merge after approval

## 🧪 Testing

- Write unit tests for utility functions
- Write component tests for key UI components
- Use integration tests for complex workflows

## 📝 Documentation

- Document all exported functions, types, and components
- Use JSDoc comments for detailed documentation
- Keep the README.md updated with new features and changes
- Update this DEV_GUIDE.md when development processes change

## 🏃‍♂️ Common Tasks

### Adding a New Component

1. Create a new file in the appropriate directory
2. Import necessary dependencies
3. Define the component's props interface
4. Implement the component
5. Export the component
6. Use the component where needed

### Adding a New API Service

1. Create a new file in `src/services/`
2. Define the API endpoints and response types
3. Implement the service functions
4. Export the functions
5. Use the service in components

### Adding a New Page

1. Create a new component in the appropriate directory
2. Add a new route in the router configuration
3. Update the navigation components to include the new page

## 🚀 Deployment

The project is deployed using:

1. Build the application:
```bash
npm run build
```

2. Test the production build locally:
```bash
npm run preview
```

3. Deploy to production:
```bash
npm run deploy
```

## 📚 Resources

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Recharts Documentation](https://recharts.org/en-US)
- [Vite Documentation](https://vitejs.dev/guide)
