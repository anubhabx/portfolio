# Windows 11 Portfolio - AI Coding Instructions

A Windows 11-styled portfolio built with Next.js 15, React, TypeScript, and Turborepo monorepo. Simulates a desktop OS with draggable/resizable windows, taskbar, and file system.

## Monorepo Architecture

**Structure**: Turborepo + pnpm workspaces
- `apps/win11/` - Main Next.js app
- `packages/ui/` - Shared shadcn/ui components  
- `packages/{eslint,typescript}-config/` - Shared configs

**Critical**: Import UI components via `@workspace/ui/*` alias, NEVER relative paths. Next.js requires `transpilePackages: ["@workspace/ui"]` in `next.config.mjs`.

**Package Manager**: pnpm v10.18+ only (see `packageManager` in root `package.json`)

## Provider Hierarchy & State Flow

**Entry**: `apps/win11/app/layout.tsx` - Nested context providers (order matters):
```tsx
<Providers>              // Next.js themes
  <WallpaperProvider>    // Desktop background variants
    <DesktopProvider>    // Desktop icon positions
      <TaskbarProvider>  // Taskbar pinned apps
        <WindowManagerProvider> // Window instances & z-index
```

**State Persistence**: All contexts auto-save to localStorage:
- `desktop-items` - Icon positions (x, y coordinates)
- `taskbar-pinned` - Pinned apps array
- `window-state-{windowId}` - Per-window position/size/maximized state

**Pattern**: Contexts hydrate from localStorage on mount. Don't initialize with hardcoded defaults - they'll override saved state.

## Window System Architecture

**Central Manager**: `components/WindowManager.tsx`
- `openWindow()` - Creates new window instance with unique ID
- `focusWindow()` - Manages z-index stack (focused = 49, others = 40, taskbar = 50)
- `minimizeWindow()` / `restoreWindow()` - Taskbar integration

**Registration Flow** (4 steps to add new window):
1. Add type to `WindowType` union in `types/index.d.ts`
2. Register in `APP_REGISTRY` (`lib/app-registry.tsx`) with icon, name, windowType
3. Add switch case in `WindowManager.tsx` render method
4. Create component with standard signature:
   ```tsx
   export function MyWindow({ isOpen, onClose, onMinimize, onFocus, windowId, zIndex, isFocused }: WindowProps) {
     return <Window title="My Window" windowId={windowId} {...props}>...</Window>
   }
   ```

**Window Snapping**: `components/Window.tsx` handles edge-snap (lines 102-165):
- Top edge → Maximize
- Left/Right edge → Half screen
- Corners → Quarter screen (200px corner detection zones)
- Drag from maximized → Restore at cursor proportional position

**Persistence**: Pass `windowId` prop to `<Window>` component - it auto-saves position/size to `localStorage` key `window-state-{windowId}`.

## Type System Conventions

**Deprecated**: `Application` interface - DO NOT USE
**Use Instead**:
- `DesktopItem` - Desktop icons (has `position: {x, y}`)
- `TaskbarApp` - Taskbar apps (no position)
- `FileSystemItem` - File explorer items
- `WindowType` - Union type for window components ("file-explorer" | "my-projects" | ...)

## Data Integration Patterns

### GitHub Projects
**Flow**: API Route → Hook → Component
- `lib/github-api.ts` - Server-only Octokit wrapper (no "use server" directive)
- `lib/github-utils.ts` - Pure utility functions (filtering, sorting)
- `app/api/github/projects/route.ts` - Next.js route handler (5min cache via Cache-Control header)
- `hooks/use-github.ts` - Client hook with auto-refresh (default 5min interval)

**Filtering**: Repos need `portfolio-project` topic to appear. Add `featured` topic for highlighting.

**Auth**: Optional `GITHUB_TOKEN` in `.env.local` for higher rate limits (not committed).

### Resume Data
**Source of Truth**: `data/resume.json` (structured JSON, not PDF parsing)
- Types in `types/resume.d.ts`
- API route at `app/api/resume/route.ts`
- Hook: `hooks/use-resume.ts`

### Terminal Commands
**Component**: `components/TerminalWindow.tsx`
- Unix-style commands (e.g., `skills`, `projects`), NOT PowerShell
- Available commands array (line 30-41) - add here for autocomplete
- Hooks into `useResume()` and `useGitHubProjects()` for live data
- Features: Command history (↑/↓), Tab autocomplete, auto-scroll

## Styling Conventions

**Theme**: Dark mode ONLY (no light mode toggle)
**Colors**: Windows 11 palette (slate/neutral grays)
**Dynamic Styles**: Wallpaper gradients use inline styles (not Tailwind classes) to prevent JIT purging

**Import Pattern**:
- shadcn/ui: `@workspace/ui/components/{component}`
- Utils: `@workspace/ui/lib/utils` for `cn()` helper
- Icons: Custom Windows icons in `components/Icons.tsx`, Lucide for UI

## Component Patterns

**Client Directives**: Add `"use client"` to ALL:
- Context providers (`contexts/`)
- Custom hooks (`hooks/`)
- Components with animations (Framer Motion)
- Components with event handlers

**Framer Motion**: Used for window animations (see `Window.tsx` AnimatePresence)

## Development Workflow

```bash
# From root (/portfolio)
pnpm dev        # Turbopack dev server (port 3000)
pnpm build      # Build all apps + packages
pnpm lint       # Lint all workspaces
pnpm format     # Prettier formatting

# From apps/win11
pnpm typecheck  # TypeScript validation (no emit)
```

**Turbo Tasks**: Defined in `turbo.json` - `build` has dependencies (`^build`), `dev` is persistent

## Critical Gotchas

1. **API Routes**: MUST be named `route.ts` in App Router (e.g., `app/api/github/projects/route.ts`)
2. **Server Actions**: Files with `"use server"` can ONLY export async functions - move sync utils to separate files
3. **Window Props**: Always pass `windowId` to `<Window>` for persistence to work
4. **Type Imports**: Use `import type` for type-only imports to avoid bundling issues
5. **localStorage Hydration**: Contexts load saved state on mount - don't override with defaults in useState initializer

## Project Status

~95% complete (see `apps/win11/FEATURES.MD` for detailed status)

**Complete**: Window system, desktop, taskbar, GitHub integration, resume window, terminal, wallpaper picker, snap-to-edge, command history, autocomplete

**No Testing Framework**: Tests not configured yet
