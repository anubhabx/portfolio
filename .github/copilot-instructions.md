# Windows 11 Portfolio - AI Coding Agent Instructions

## Project Overview
A personal portfolio website styled as a Windows 11 desktop interface built with Next.js 15, React, TypeScript, and Turborepo monorepo architecture. The project simulates a full Windows 11 desktop experience with draggable/resizable windows, taskbar, start menu, and file explorer.

## Architecture & Structure

### Monorepo Organization (pnpm + Turborepo)
- **`apps/win11/`**: Main Next.js app (the portfolio site)
- **`packages/ui/`**: Shared shadcn/ui components (imported as `@workspace/ui`)
- **`packages/eslint-config/`**: Shared ESLint configs
- **`packages/typescript-config/`**: Shared TypeScript configs

**Key Convention**: All UI components from `packages/ui` are imported using the `@workspace/ui/*` alias, never relative paths from `apps/win11`.

### Core Application Flow
1. **Entry Point**: `apps/win11/app/layout.tsx` wraps the entire app in nested context providers:
   ```tsx
   <Providers> // Theme provider
     <DesktopProvider> // Desktop icons state
       <TaskbarProvider> // Taskbar apps state
         <WindowManagerProvider> // Window system
   ```

2. **Window System**: Windows are managed centrally in `WindowManagerProvider` (components/WindowManager.tsx):
   - Call `openWindow()` to launch apps
   - Window types are registered in `lib/app-registry.tsx` (single source of truth)
   - All window components receive standard props: `isOpen`, `onClose`, `onMinimize`, `onFocus`, `windowId`, `zIndex`, `isFocused`
   - Available windows: File Explorer, Resume, Projects, Contact, Settings, Terminal
   - **Window Snapping**: Drag windows to screen edges to snap (left/right half, corners for quarters, top edge for maximize)

3. **State Persistence**: Desktop icons, taskbar pins, and window positions auto-save to `localStorage`:
   - `desktop-items` - Desktop icon positions
   - `taskbar-pinned` - Pinned taskbar apps
   - `window-state-{windowId}` - Individual window positions/sizes

### Type System (`types/index.d.ts`)
- **`WindowType`**: Union type for all window components (`"file-explorer" | "my-projects" | "resume" | "contact" | ...`)
- **`DesktopItem`**: Desktop icon representation (id, name, type, position, windowType)
- **`TaskbarApp`**: Taskbar app representation (similar to DesktopItem but no position)
- **`OpenWindow`**: Active window state (type, id, props, isMinimized)

**Critical Pattern**: The old `Application` interface is deprecated. Use `DesktopItem`, `TaskbarApp`, or `FileSystemItem` instead.

## Adding New Features

### Adding a New Window/App
1. Create window component in `components/` (e.g., `ContactWindow.tsx`)
2. Add window type to `WindowType` union in `types/index.d.ts`
3. Register in `APP_REGISTRY` in `lib/app-registry.tsx`:
   ```tsx
   contact: {
     id: "contact",
     name: "Contact",
     icon: <MailIcon />,
     windowType: "contact",
     description: "Get in touch"
   }
   ```
4. Add case to switch statement in `components/WindowManager.tsx`:
   ```tsx
   case "contact":
     return <ContactWindow key={window.id} {...commonProps} />;
   ```
5. Standard window component signature:
   ```tsx
   export function ContactWindow({
     isOpen, onClose, onMinimize, onFocus,
     windowId, zIndex, isFocused
   }: WindowProps) {
     return <Window title="Contact" icon={<MailIcon />} {...allProps}>
       {/* Content */}
     </Window>
   }
   ```

### Working with GitHub Integration
- **Server Module**: `lib/github-api.ts` - Octokit wrapper for fetching repos (server-side only, no "use server" directive)
- **Utilities**: `lib/github-utils.ts` - Pure utility functions for processing project data
- **API Route**: `app/api/github/projects/route.ts` - Next.js route handler with 5min cache
- **Hook**: `hooks/use-github.ts` - Client-side data fetcher with auto-refresh
- **Pattern**: Repos must have `portfolio-project` topic to appear. Use `featured` topic for highlighting.
- Add `GITHUB_TOKEN` to `.env.local` for higher rate limits (optional)
- **Important**: API routes in Next.js App Router MUST be named `route.ts`, not custom names

### Working with Resume Data
- **Data Source**: `data/resume.json` - Structured JSON file with resume content
- **Type Definitions**: `types/resume.d.ts` - TypeScript interfaces for resume data structure
- **API Route**: `app/api/resume/route.ts` - Serves resume JSON data with caching
- **Hook**: `hooks/use-resume.ts` - Fetches and caches resume data client-side
- **Component**: `components/ResumeWindow.tsx` - Displays structured resume with professional layout
- **Pattern**: JSON-based content for better structure, type safety, and maintainability
- **PDF Parsing**: Legacy `app/api/resume/parse/route.ts` available but JSON is preferred method

### Working with Terminal Window
- **Component**: `components/TerminalWindow.tsx` - Interactive terminal with portfolio commands
- **Command Pattern**: Unix-style commands (e.g., `contact`, `skills`, `projects`, not PowerShell-style)
- **Data Integration**: Hooks into `useResume()` and `useGitHubProjects()` for live data
- **Available Commands**: `help`, `about`, `contact`, `socials`, `skills`, `projects`, `experience`, `education`, `resume`, `clear`
- **Styling**: Black terminal background with green/blue text for authentic terminal feel
- **UX**: Auto-scroll, auto-focus input, real-time data loading states

## Development Commands

```bash
# Root commands (run from /portfolio)
pnpm dev          # Start all apps in dev mode with Turbopack
pnpm build        # Build all apps and packages
pnpm lint         # Lint all workspaces
pnpm format       # Format with Prettier

# App-specific (from /apps/win11)
pnpm dev          # Dev server with Turbopack (port 3000)
pnpm typecheck    # TypeScript check without emitting
pnpm lint:fix     # Auto-fix linting issues
```

**Important**: This project uses **pnpm** (v10.18.0+) and **Node.js 20+**. Do NOT use npm or yarn.

## Project-Specific Conventions

### Component Patterns
- **"use client" directive**: Required for all interactive components (contexts, hooks, animations)
- **Framer Motion**: Used for window animations and transitions
- **shadcn/ui**: Import from `@workspace/ui/components/{component}`, utilities from `@workspace/ui/lib/utils`
- **Icons**: Custom Windows icons in `components/Icons.tsx`, Lucide icons for UI elements

### Path Aliases
- `@/*` → `apps/win11/*` (local imports)
- `@workspace/ui/*` → `packages/ui/src/*` (shared components)

### Styling
- Tailwind CSS with Windows 11 color scheme (slate/neutral grays)
- Custom CSS variables for theming in `packages/ui/src/styles/globals.css`
- Use `cn()` utility from `@workspace/ui/lib/utils` for conditional classes

### State Management
- **No global state library** - React Context + hooks only
- Each context has a dedicated provider in `contexts/`
- Custom hooks exposed via `use{Context}()` pattern (e.g., `useDesktop()`, `useTaskbar()`)

## Feature Status & TODOs
See `apps/win11/FEATURES.MD` for current completion status (~90%). All critical portfolio features are complete:
- ✅ Contact form with email/social links
- ✅ PDF resume download functionality
- ✅ Project filtering by tech stack
- ✅ Window snap-to-edges (including top-edge maximize)
- ✅ Interactive terminal with portfolio commands

## Common Gotchas
1. **Window persistence**: Always pass `windowId` prop to Window component for position saving
2. **App registry**: Add apps to `APP_REGISTRY` first, then use `getAppMetadata()` elsewhere
3. **Next.js config**: `transpilePackages: ["@workspace/ui"]` is required for monorepo
4. **Next.js API routes**: API route files MUST be named `route.ts` in App Router (e.g., `app/api/github/projects/route.ts`)
5. **Server Actions**: Files with `"use server"` can only export async functions - move sync utilities to separate files
6. **Type imports**: Use `import type` for type-only imports to avoid bundling issues
7. **localStorage**: All contexts auto-hydrate on mount - don't initialize with hardcoded data

## Testing
No testing framework currently configured. When adding tests, consider:
- Window drag/resize behavior
- State persistence across page reloads
- GitHub API error handling
