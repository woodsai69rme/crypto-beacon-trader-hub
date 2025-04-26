
# VS Code Terminal Integration

## Overview
VS Code's integrated terminal provides a convenient way to run commands without leaving your coding environment.

## Basic Terminal Operations

1. **Opening the Terminal**
   - Keyboard shortcut: ``Ctrl+` ``
   - Menu: View > Terminal
   - Command Palette: "Terminal: Create New Terminal"

2. **Terminal Navigation**
   - Switch between multiple terminals using the dropdown
   - Split terminal: Use the "Split" button in the terminal toolbar
   - Kill terminal: Trash can icon or type `exit`

3. **Terminal Customization**
   - Change default shell: Settings > Terminal > Integrated > Shell (platform specific)
   - Font settings: Settings > Terminal > Integrated > Font
   - Color scheme: Settings > Terminal > Integrated > Color Scheme

## Advanced Terminal Features

1. **Task Integration**
   - Run predefined tasks with `Terminal > Run Task`
   - Configure tasks in `tasks.json`
   - Bind tasks to keyboard shortcuts

2. **Multi-Root Terminal**
   - Each workspace folder can have its own terminal
   - Terminal automatically opens in the folder of the active file

3. **Environment Customization**
   ```json
   // settings.json
   "terminal.integrated.env.windows": {
     "PATH": "${env:PATH}:/custom/path"
   }
   ```

## Terminal Profiles

1. **Creating Profiles**
   ```json
   // settings.json
   "terminal.integrated.profiles.windows": {
     "PowerShell": {
       "source": "PowerShell",
       "icon": "terminal-powershell"
     },
     "Command Prompt": {
       "path": "C:\\Windows\\System32\\cmd.exe",
       "args": []
     },
     "Git Bash": {
       "source": "Git Bash"
     }
   }
   ```

2. **Setting Default Profile**
   ```json
   "terminal.integrated.defaultProfile.windows": "PowerShell"
   ```

## Running Multiple Commands

1. **Command Chaining**
   - Use `&&` to run commands sequentially (if previous succeeds)
   - Use `||` to run second command only if first fails
   - Use `;` to run commands sequentially regardless of success

2. **Creating Shell Scripts**
   - Save common command sequences as .sh or .bat files
   - Run with `./script-name.sh` or `script-name.bat`

## Git Integration in Terminal

1. **Git Bash**
   - Configure Git Bash as a terminal option
   - Access Git commands directly

2. **Git Aliases**
   - Set up aliases for common Git commands
   - Add to your .gitconfig file

## Best Practices

- Learn terminal shortcuts for faster navigation
- Use tab completion to save typing
- Create aliases for common commands
- Use scripts for complex command sequences
- Consider using a terminal multiplexer like tmux for advanced workflows
