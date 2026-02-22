# CherryOS AI Assistant Guidelines

## Project Overview
CherryOS is a React-based operating system interface built with modern web technologies. It features a modular architecture with self-contained applications, a global state management system, and comprehensive data validation.

## Development Environment

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn package manager
- Git for version control

### Setup Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run linting
npm run lint

# Run with coverage
npm run test:coverage
```

## Project Structure

```
CherryOS-dev/
├── src/
│   ├── apps/           # Modular full-page applications
│   ├── components/     # Reusable UI components
│   ├── context/        # Global state management
│   ├── data/           # Static assets, schemas, constants
│   └── test/           # Unit and integration tests
├── .github/            # CI/CD workflows
└── public/             # Static assets
```

## Code Style Guidelines

### React Components
- Use functional components with hooks
- Follow PascalCase for component names
- Use descriptive variable names
- Keep components focused and single-purpose

### State Management
- Use `useState` for local component state
- Use `useContext` for global state (OSContext)
- Avoid prop drilling when possible
- Use `useCallback` for expensive functions

### Data Handling
- Validate all external data with Zod schemas
- Use async/await for API calls
- Handle loading and error states properly
- Implement proper error boundaries

## Application Development

### Creating New Apps
1. Create component in `src/apps/NewApp.jsx`
2. Register route in `src/App.jsx`
3. Add icon/link to `src/components/Desktop.jsx`
4. Define data schema in `src/data/schemas.js` if needed

### Component Patterns
- Use Tailwind CSS utility classes
- Implement responsive design
- Follow accessibility best practices
- Use semantic HTML elements

## Testing Strategy

### Unit Tests
- Use Vitest for unit testing
- Test component logic and state changes
- Mock external dependencies
- Aim for high code coverage

### Integration Tests
- Use Playwright for E2E testing
- Test user workflows
- Verify cross-browser compatibility
- Test mobile responsiveness

## Security Considerations

### Input Validation
- Always validate user input
- Sanitize data from external sources
- Use Zod schemas for data validation
- Implement proper error handling

### API Security
- Use HTTPS for all API calls
- Implement proper authentication
- Handle CORS appropriately
- Validate all responses

## Performance Guidelines

### Optimization
- Use React.memo for expensive components
- Implement lazy loading for large components
- Optimize bundle size with code splitting
- Use proper caching strategies

### Asset Management
- Optimize images with LazyImage component
- Use appropriate file formats
- Implement proper compression
- Cache static assets effectively

## Deployment

### Build Process
- Use Vite for bundling
- Implement proper environment variables
- Optimize for production builds
- Test builds locally before deployment

### Containerization
- Use multi-stage Docker builds
- Optimize container size
- Implement health checks
- Use proper security practices

## Common Patterns

### Data Fetching
```javascript
const fetchData = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const data = await response.json();
    // Process data
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
}, [url]);
```

### State Management
```javascript
const [state, setState] = useState(initialValue);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

### Component Structure
```javascript
const ComponentName = ({ prop1, prop2 }) => {
  // State
  const [state, setState] = useState();

  // Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);

  // Event handlers
  const handleClick = useCallback(() => {
    // Handle click
  }, [dependencies]);

  return (
    <div className="component-class">
      {/* JSX */}
    </div>
  );
};
```

## Troubleshooting

### Common Issues
- **React Refresh Warnings**: Ensure proper component exports
- **ESLint Errors**: Follow the configured rules
- **Build Failures**: Check console output for specific errors
- **Test Failures**: Review test coverage and mocks

### Debugging
- Use React DevTools for component inspection
- Check browser console for errors
- Use VS Code debugger for Node.js issues
- Review network tab for API calls

## Best Practices

### Code Quality
- Write self-documenting code
- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic

### Documentation
- Update README.md for new features
- Document API endpoints
- Add inline comments for complex algorithms
- Maintain architecture documentation

### Collaboration
- Use descriptive commit messages
- Follow the existing code style
- Review pull requests thoroughly
- Communicate changes clearly

## Tools and Resources

### Development Tools
- VS Code with recommended extensions
- React DevTools
- Browser DevTools
- Terminal with proper shell configuration

### Documentation
- React documentation
- Tailwind CSS documentation
- Vite documentation
- Zod documentation

### Learning Resources
- MDN Web Docs
- Stack Overflow
- GitHub repositories
- Official documentation

## Getting Help

### Internal Resources
- Check existing issues in GitHub
- Review pull requests for similar changes
- Consult with team members
- Review documentation

### External Resources
- Stack Overflow for specific issues
- React community forums
- GitHub discussions
- Official documentation

## Version Control

### Commit Guidelines
- Use conventional commit format
- Write clear and descriptive messages
- Reference issue numbers when applicable
- Keep commits focused and atomic

### Branch Strategy
- Use feature branches for new development
- Keep main branch stable
- Use descriptive branch names
- Regularly merge updates

## Quality Assurance

### Code Review
- Check for code style compliance
- Verify functionality
- Test edge cases
- Ensure proper documentation

### Testing
- Write unit tests for new features
- Update integration tests
- Verify test coverage
- Run tests before commits

## Maintenance

### Regular Tasks
- Update dependencies regularly
- Monitor for security vulnerabilities
- Review and update documentation
- Optimize performance

### Monitoring
- Track application performance
- Monitor error rates
- Review user feedback
- Analyze usage patterns