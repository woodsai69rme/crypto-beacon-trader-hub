
# VS Code Debugging Guide

## Debug Configuration

1. **Launch Configuration**
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "type": "chrome",
         "request": "launch",
         "name": "Debug React App",
         "url": "http://localhost:5173",
         "webRoot": "${workspaceFolder}"
       }
     ]
   }
   ```

2. **Breakpoints**
   - Line breakpoints (F9)
   - Conditional breakpoints
   - Logpoints
   - Data breakpoints

3. **Debug Console**
   - Evaluating expressions
   - Viewing call stack
   - Inspecting variables

## Best Practices
- Use source maps
- Configure proper launch settings
- Utilize watch expressions
- Learn keyboard shortcuts
