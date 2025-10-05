# Portfolio Changelog

## [Unreleased] - 2025-10-05 (Latest Update)

### Added - Phase 2 Enhancements

- **Terminal Command History** 
  - Navigate previous commands with ↑/↓ arrow keys
  - Full command history saved during session
  - Intelligent history navigation (up to go back, down to go forward)

- **Terminal Autocomplete**
  - Press `Tab` to autocomplete commands
  - Shows available matching commands when multiple matches exist
  - Smart partial matching on command prefixes

- **Dark/Light Mode Toggle**
  - Theme switcher in Settings window
  - Three modes: Dark, Light, System (follows OS preference)
  - Persists to localStorage
  - Real-time theme switching without page reload
  - System theme detection with automatic updates

- **Enhanced Window Animations**
  - Smoother entry/exit animations with custom easing
  - Hover effects on focused windows
  - Layout transitions for resize/maximize operations
  - Reduced motion support

- **Enhanced Wallpaper Picker**
  - 4 distinct wallpaper options (Windows Dark, Midnight Blue, Azure Sky, Purple Dream)
  - Live preview in Settings window
  - Improved gradient designs
  - Active wallpaper indicator

### Technical Implementation
- **ThemeContext** - New context provider for theme management (`contexts/ThemeContext.tsx`)
- **Framer Motion enhancements** - Advanced animation configurations in Window component
- **Terminal improvements** - Command history state management and autocomplete logic
- **Settings UI** - Tabbed interface for Wallpaper and Theme settings

---

## [Previous Update] - 2025-10-05

### Added
- **Window Maximize on Top-Edge Drag**: Dragging a window to the top edge of the screen now maximizes it, matching Windows 11 behavior
  - Complements existing left/right snap (half-screen) and corner snap (quarter-screen)
  - Files modified: `components/Window.tsx`, `types/index.d.ts`

- **Terminal Window with Portfolio Commands**: Interactive terminal for exploring portfolio data
  - Unix-style commands for user-friendliness
  - Real-time data integration with resume and GitHub APIs
  - Available commands:
    - `help` - Show all available commands
    - `about` - Display bio and summary
    - `contact` - Show contact information
    - `socials` - Display social media links
    - `skills` - List technical skills by category
    - `projects` - Show portfolio projects from GitHub
    - `experience` - Display work history
    - `education` - Show academic background
    - `resume` - Guide to resume commands
    - `clear`/`cls` - Clear terminal output
  - Terminal features:
    - Auto-scroll to latest output
    - Auto-focus input when window is focused
    - Loading states for async data
    - Authentic terminal styling (black bg, green/blue text)
  - Files added: `components/TerminalWindow.tsx`
  - Files modified: `types/index.d.ts`, `lib/app-registry.tsx`, `components/WindowManager.tsx`

### Updated
- `.github/copilot-instructions.md` - Added terminal documentation and updated window snapping info
- Feature completion status: ~85% → ~90% (all core features complete)

### Technical Notes
- Terminal uses `useResume()` and `useGitHubProjects()` hooks for live data
- Window snap zones now include "maximize" type
- All TypeScript types properly defined for resume data structure
- Terminal component follows established window component pattern

---

## Previous Releases
See `apps/win11/FEATURES.MD` for historical feature status.
