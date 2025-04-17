
# Developer Technical Guide

## Architecture Overview
The Crypto Dashboard is built using the following technologies:
- **React**: Component library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built UI components
- **React Query**: Data fetching and state management
- **React Router**: Navigation
- **Recharts**: Chart visualization
- **Lucide React**: Icon library

## Component Structure
The application follows a structured component hierarchy:

```
src/
├── components/            # Reusable UI components
│   ├── ui/                # Base UI components (shadcn)
│   ├── dashboard/         # Dashboard-specific components
│   └── settings/          # Settings-related components
├── contexts/              # React contexts for global state
├── hooks/                 # Custom React hooks
├── pages/                 # Page components
├── services/              # API and external service integration
├── utils/                 # Utility functions
└── App.tsx                # Main application entry point
```

## State Management
- **React Query**: For server state (API data)
- **React Context**: For global UI state (theme, auth)
- **Local component state**: For component-specific state

## Responsive Design
The application uses Tailwind's responsive classes and custom hooks to ensure a great experience across:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## Adding New Features
When adding new features:
1. Create focused, reusable components
2. Maintain type safety with TypeScript interfaces
3. Follow the existing styling patterns with Tailwind
4. Add appropriate tests
5. Update documentation as needed

## Best Practices
- Keep components small and focused
- Use TypeScript for type safety
- Implement responsive design for all features
- Follow accessibility guidelines
- Use React Query for data fetching and caching
