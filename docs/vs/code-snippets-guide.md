
# VS Code Code Snippets Guide

## Overview
Code snippets in VS Code help you quickly insert common code patterns, reducing repetitive typing and potential errors.

## Creating Custom Snippets

1. **Access Snippets Configuration**
   - Press `Ctrl+Shift+P` to open Command Palette
   - Type "Configure User Snippets" and select it
   - Choose a language-specific file or create a global snippets file

2. **Snippet Structure**
   ```json
   {
     "React Functional Component": {
       "prefix": "rfc",
       "body": [
         "import React from 'react';",
         "",
         "const ${1:ComponentName} = () => {",
         "  return (",
         "    <div>",
         "      $0",
         "    </div>",
         "  );",
         "};",
         "",
         "export default ${1:ComponentName};"
       ],
       "description": "Create a React functional component"
     }
   }
   ```

3. **Snippet Placeholders**
   - `$1`, `$2`, etc.: Tab stops
   - `${1:label}`: Tab stop with default value
   - `$0`: Final cursor position
   - `$TM_FILENAME_BASE`: Current filename without extension

## Useful Snippet Variables

- `$TM_SELECTED_TEXT`: Currently selected text
- `$TM_CURRENT_LINE`: Current line text
- `$TM_CURRENT_WORD`: Word under cursor
- `$TM_FILENAME`: Current filename
- `$TM_DIRECTORY`: Current file's directory
- `$CURRENT_YEAR`, `$CURRENT_MONTH`, `$CURRENT_DATE`: Date variables
- `$RANDOM`: Random number
- `$UUID`: Generated UUID

## Project-Specific Snippets

1. **Create .vscode folder** in your project root
2. **Add snippets.code-snippets** file with your project snippets
3. **Define snippets** using the JSON format shown above

## Example Snippets for React Development

```json
{
  "React State Hook": {
    "prefix": "useState",
    "body": [
      "const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState(${2:initialState});"
    ],
    "description": "React useState hook"
  },
  "React Effect Hook": {
    "prefix": "useEffect",
    "body": [
      "useEffect(() => {",
      "  ${1:// effect code}",
      "  return () => {",
      "    ${2:// cleanup code}",
      "  };",
      "}, [${3:dependencies}]);"
    ],
    "description": "React useEffect hook"
  },
  "React Query Hook": {
    "prefix": "useQuery",
    "body": [
      "const { data, isLoading, error } = useQuery({",
      "  queryKey: ['${1:queryKey}'],",
      "  queryFn: ${2:fetchFunction},",
      "});"
    ],
    "description": "React Query hook"
  }
}
```

## Best Practices

- Create snippets for code you write frequently
- Use meaningful prefixes for easy recall
- Include descriptive documentation
- Share snippets with your team
- Regularly update snippets as coding patterns evolve
