# Portfolio Changelog

## [Unreleased] - 2025-10-05

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
