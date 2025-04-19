
# Contributing to Crypto Dashboard

Thank you for considering contributing to the Crypto Dashboard project! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct
By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and considerate of others when contributing.

## How Can I Contribute?

### Reporting Bugs
Bug reports help us improve the quality of our application. When reporting bugs, please:

1. **Check existing issues** to avoid duplicates
2. **Use a clear and descriptive title**
3. **Provide detailed reproduction steps**
4. **Include screenshots** if applicable
5. **Share your environment details** (browser, OS, etc.)

### Suggesting Enhancements
We welcome suggestions for new features or improvements. When suggesting enhancements:

1. **Use a clear and descriptive title**
2. **Provide a detailed description** of the proposed functionality
3. **Explain why this enhancement would be useful**
4. **Include mockups or examples** if possible

### Pull Requests
We actively welcome your pull requests:

1. **Fork the repo** and create your branch from `main`
2. **Follow the coding style** used throughout the project
3. **Add tests** for new features or bug fixes
4. **Ensure all tests pass**
5. **Update documentation** as needed
6. **Submit a pull request** with a clear description of your changes

## Development Guidelines

### Project Structure
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
└── utils/                 # Utility functions
```

### Coding Standards
- **Use TypeScript** for all new code
- **Follow ESLint rules** configured in the project
- **Write concise components** with clear, single responsibilities
- **Use functional components** with React hooks
- **Add proper TypeScript types/interfaces** for all new code
- **Write meaningful comments** for complex logic
- **Use Tailwind CSS** for styling

### Commit Messages
Please follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for your commit messages:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types include:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: Code changes that neither fix a bug nor add a feature
- `perf`: Code changes that improve performance
- `test`: Adding missing or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Testing
- **Write tests** for new functionality
- **Make sure all tests pass** before submitting
- **Add both unit tests and integration tests** where appropriate

## Getting Started
1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Make your changes
5. Run tests with `npm test`
6. Submit a pull request

## License
By contributing to this project, you agree that your contributions will be licensed under the project's license.

## Questions?
If you have any questions about contributing, please open an issue or contact the maintainers directly.

Thank you for contributing to Crypto Dashboard!
