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

// Base Application Interface
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
  // Map application ID to window type for portfolio apps
  windowType?: WindowType;
}

// Specialized Application Types
export type DesktopItem = Application &
  Required<Pick<Application, "showOnDesktop" | "desktopPosition">>;

export type TaskbarApp = Application &
  Required<Pick<Application, "pinnedToTaskbar">>;

export type FileSystemItem = Application;

// Window Manager Types
export interface OpenWindow {
  id: string;
  type: WindowType;
  title: string;
  props?: Record<string, any>;
}

export interface WindowManagerContextType {
  windows: OpenWindow[];
  openWindow: (window: Omit<OpenWindow, "id">) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
}

// Window Component Props
export interface BaseWindowProps {
  isOpen: boolean;
  onClose: () => void;
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
