import * as React from "react";

// Base Application Types
export type ApplicationType =
  | "folder"
  | "file"
  | "app"
  | "shortcut"
  | "system"
  | "portfolio";

// Window Types - these are the actual window components that can be opened
export type WindowType =
  | "file-explorer"
  | "about-me"
  | "my-projects"
  | "resume"
  | "contact"
  | "notepad"
  | "calculator";

// NEW: Simplified Desktop Item (no longer extends Application)
export interface DesktopItem {
  id: string;
  name: string;
  type: ApplicationType;
  position: { x: number; y: number };
  windowType?: WindowType;
  href?: string;
  metadata?: {
    dateModified?: Date;
    size?: number;
    [key: string]: any;
  };
}

// NEW: Simplified Taskbar App (no longer extends Application)
export interface TaskbarApp {
  id: string;
  name: string;
  type: ApplicationType;
  windowType?: WindowType;
  href?: string;
  metadata?: {
    dateModified?: Date;
    [key: string]: any;
  };
}

// NEW: File System Item (for File Explorer)
export interface FileSystemItem {
  id: string;
  name: string;
  type: ApplicationType;
  path?: string;
  parentPath?: string;
  size?: number;
  dateModified: Date;
  icon?: React.ReactNode;
}

// LEGACY: Keep old Application interface for backward compatibility
// but mark as deprecated
/** @deprecated Use DesktopItem, TaskbarApp, or FileSystemItem instead */
export interface Application {
  id: string;
  name: string;
  type: ApplicationType;
  icon: React.ReactNode;
  href?: string;
  path?: string;
  parentPath?: string;
  size?: number;
  dateModified: Date;
  pinnedToTaskbar?: boolean;
  showOnDesktop?: boolean;
  desktopPosition?: { x: number; y: number };
  windowType?: WindowType;
}

// Window Manager Types
export interface OpenWindow {
  id: string;
  type: WindowType;
  title: string;
  props?: Record<string, any>;
  isMinimized?: boolean;
}

export interface WindowManagerContextType {
  windows: OpenWindow[];
  openWindow: (window: Omit<OpenWindow, "id">) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
}

// Window Component Props
export interface BaseWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  onFocus?: () => void;
  windowId?: string;
  zIndex?: number;
  isFocused?: boolean;
}

export interface FileExplorerProps extends BaseWindowProps {
  initialPath?: string;
}

// Component Props
export interface DesktopProps {
  items?: DesktopItem[];
  gridSize?: number;
  padding?: number;
}

export interface TaskbarProps {
  alignment?: "center" | "left";
  pinned?: TaskbarApp[];
}

export interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface WallpaperProps {
  variant?: "default" | "dark" | "light" | "custom";
  className?: string;
  children?: React.ReactNode;
}

// Utility Types
export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface WindowState {
  position: Position;
  size: Size;
  isMaximized: boolean;
  isMinimized: boolean;
}
