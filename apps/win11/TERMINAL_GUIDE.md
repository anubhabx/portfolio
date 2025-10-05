# Terminal Window - User Guide

## Overview
The Portfolio Terminal is an interactive command-line interface that provides Unix-style access to your portfolio information. It integrates with your resume data and GitHub projects in real-time.

## Opening the Terminal
- Click the Terminal icon on the desktop or taskbar
- Or search for "Terminal" in the Start Menu

## Available Commands

### Getting Started
```bash
help        # Show all available commands
```

### Personal Information
```bash
about       # Display your bio and professional summary
contact     # Show contact information (email, phone, location)
socials     # Display all social media links (GitHub, LinkedIn, etc.)
```

### Professional Details
```bash
resume      # Show guide to resume-related commands
experience  # Display work history with highlights
education   # Show academic background
skills      # List all technical skills by category (Frontend, Backend, Database, DevOps, Tools)
```

### Projects
```bash
projects    # Show your portfolio projects from GitHub
            # Displays up to 5 projects with descriptions and tech stack
```

### Utility
```bash
clear       # Clear the terminal screen
cls         # Alias for clear
```

## Features

### Real-Time Data
- Terminal fetches live data from your resume JSON and GitHub API
- Shows loading states while data is being fetched
- All information is up-to-date with your latest portfolio changes

### User Experience
- **Auto-scroll**: Terminal automatically scrolls to show latest output
- **Auto-focus**: Input field is automatically focused when you click the terminal
- **Case-insensitive**: Commands work in any case (e.g., `HELP`, `Help`, `help`)
- **Error handling**: Unknown commands show helpful error messages

### Terminal Styling
- Authentic terminal look with black background
- Color-coded output:
  - Commands: White text
  - Headers: Blue text
  - Success/Data: Green text
  - Loading states: Yellow text
  - Errors: Red text
  - Regular text: Muted gray
- Monospace font for that classic terminal feel

## Example Session

```bash
$ help
Available Commands:
  help - Show this help message
  about - Display bio and summary
  contact - Show contact information
  ...

$ about
[Your Name]
[Your Title]
[Your professional summary...]

$ skills
Technical Skills:
Frontend:
  React, Next.js, TypeScript, Tailwind CSS...
Backend:
  Node.js, Python, Express...
...

$ projects
Portfolio Projects (5):
  project-name
    Description of the project
    https://github.com/username/project-name
    Tech: react, typescript, nextjs

$ clear
```

## Tips
- Type `help` first to see all available commands
- Commands are designed to be intuitive and self-documenting
- Each command shows formatted, easy-to-read output
- Social links are clickable in the browser

## Technical Details
- Built with React hooks and TypeScript
- Integrates with `useResume()` hook for resume data
- Integrates with `useGitHubProjects()` hook for GitHub data
- Fully typed with TypeScript for type safety
- Follows the same window component pattern as other portfolio windows
