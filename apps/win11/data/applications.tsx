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
  Application,
  DesktopItem,
  TaskbarApp,
  FileSystemItem
} from "../types";

export const applications: Application[] = [
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

// Helper functions with proper type guards
export const getTaskbarApps = (): TaskbarApp[] =>
  applications.filter((app): app is TaskbarApp => app.pinnedToTaskbar === true);

export const getDesktopItems = (): DesktopItem[] =>
  applications.filter(
    (app): app is DesktopItem =>
      app.showOnDesktop === true && app.desktopPosition !== undefined
  );

export const getThisPCItems = (): FileSystemItem[] =>
  applications.filter((app) =>
    ["documents", "downloads", "desktop-folder"].includes(app.id)
  );

export const getDesktopFolderItems = (): FileSystemItem[] =>
  applications.filter((app) => app.parentPath === "/Desktop");

// Utility function to get window type from application
export const getWindowTypeFromApp = (app: Application): string | null => {
  if (app.windowType) return app.windowType;
  if (app.id === "this-pc" || app.type === "system") return "file-explorer";
  return null;
};
