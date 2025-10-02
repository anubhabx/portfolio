import * as React from "react";
import {
  ExplorerIcon,
  ChromeIcon,
  TerminalIcon,
  FolderIcon,
  WindowsUserFolderIcon,
  ProgramFolderIcon
} from "../components/Icons";
import { FileText, Mail } from "lucide-react";
import type {
  DesktopItem,
  TaskbarApp,
  FileSystemItem,
  ApplicationType,
  WindowType
} from "../types";

/**
 * Legacy Application interface for backward compatibility
 * This allows existing code to continue working while we migrate
 */
interface LegacyApplication {
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

export const applications: LegacyApplication[] = [
  // System Applications
  {
    id: "file-explorer",
    name: "File Explorer",
    type: "system",
    icon: <ExplorerIcon className="size-5" />,
    pinnedToTaskbar: true,
    showOnDesktop: false,
    dateModified: new Date(2024, 0, 1),
    windowType: "file-explorer"
  },
  {
    id: "this-pc",
    name: "This PC",
    type: "shortcut",
    icon: <ExplorerIcon className="size-8" />,
    showOnDesktop: true,
    desktopPosition: { x: 0, y: 0 },
    dateModified: new Date(2024, 0, 1),
    windowType: "file-explorer"
  },

  // Portfolio Applications
  {
    id: "about-me",
    name: "About Me",
    type: "portfolio",
    icon: <WindowsUserFolderIcon className="size-6" />,
    pinnedToTaskbar: true,
    showOnDesktop: true,
    desktopPosition: { x: 0, y: 1 },
    dateModified: new Date(2024, 0, 1),
    windowType: "about-me"
  },
  {
    id: "my-projects",
    name: "My Projects",
    type: "portfolio",
    icon: <ProgramFolderIcon className="size-6" />,
    pinnedToTaskbar: true,
    showOnDesktop: true,
    desktopPosition: { x: 0, y: 2 },
    dateModified: new Date(2024, 0, 1),
    windowType: "my-projects"
  },
  {
    id: "resume",
    name: "Resume",
    type: "portfolio",
    icon: <FileText className="size-6" />,
    pinnedToTaskbar: true,
    showOnDesktop: true,
    desktopPosition: { x: 0, y: 3 },
    dateModified: new Date(2024, 0, 1),
    windowType: "resume"
  },
  {
    id: "contact",
    name: "Contact",
    type: "portfolio",
    icon: <Mail className="size-6" />,
    pinnedToTaskbar: false,
    showOnDesktop: true,
    desktopPosition: { x: 1, y: 0 },
    dateModified: new Date(2024, 0, 1),
    windowType: "contact"
  },

  // Third-party Applications
  {
    id: "chrome",
    name: "Google Chrome",
    type: "app",
    icon: <ChromeIcon className="size-5" />,
    href: "https://google.com",
    pinnedToTaskbar: true,
    showOnDesktop: false,
    dateModified: new Date(2024, 0, 1)
  },
  {
    id: "terminal",
    name: "Windows Terminal",
    type: "app",
    icon: <TerminalIcon className="size-5" />,
    pinnedToTaskbar: true,
    showOnDesktop: false,
    dateModified: new Date(2024, 0, 1)
  },

  // Basic folders for This PC
  {
    id: "documents",
    name: "Documents",
    type: "folder",
    icon: <FolderIcon className="size-6" />,
    path: "/Documents",
    dateModified: new Date(2024, 0, 20),
    showOnDesktop: false
  },
  {
    id: "downloads",
    name: "Downloads",
    type: "folder",
    icon: <FolderIcon className="size-6" />,
    path: "/Downloads",
    dateModified: new Date(2024, 0, 25),
    showOnDesktop: false
  },
  {
    id: "desktop-folder",
    name: "Desktop",
    type: "folder",
    icon: <FolderIcon className="size-6" />,
    path: "/Desktop",
    dateModified: new Date(2024, 0, 15),
    showOnDesktop: false
  }
];

// Helper functions to convert legacy applications to new types
export const getTaskbarApps = (): TaskbarApp[] =>
  applications
    .filter((app) => app.pinnedToTaskbar === true)
    .map((app) => ({
      id: app.id,
      name: app.name,
      type: app.type,
      windowType: app.windowType,
      href: app.href,
      metadata: {
        dateModified: app.dateModified,
        size: app.size
      }
    }));

export const getDesktopItems = (): DesktopItem[] =>
  applications
    .filter((app) => app.showOnDesktop === true && app.desktopPosition !== undefined)
    .map((app) => ({
      id: app.id,
      name: app.name,
      type: app.type,
      position: app.desktopPosition!,
      windowType: app.windowType,
      href: app.href,
      metadata: {
        dateModified: app.dateModified,
        size: app.size
      }
    }));

export const getThisPCItems = (): FileSystemItem[] =>
  applications.filter((app) =>
    ["documents", "downloads", "desktop-folder"].includes(app.id)
  );

export const getDesktopFolderItems = (): FileSystemItem[] =>
  applications.filter((app) => app.parentPath === "/Desktop");

// Utility function to get window type from application
export const getWindowTypeFromApp = (app: LegacyApplication): string | null => {
  if (app.windowType) return app.windowType;
  if (app.id === "this-pc" || app.type === "system") return "file-explorer";
  return null;
};
