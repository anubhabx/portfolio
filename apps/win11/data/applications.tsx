import * as React from "react";
import {
  ExplorerIcon,
  ChromeIcon,
  TerminalIcon,
  FolderIcon
} from "../components/Icons";
import { FileText } from "lucide-react";

export type ApplicationType = "folder" | "file" | "app" | "shortcut" | "system";

export type Application = {
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
};

export const applications: Application[] = [
  // System Applications
  {
    id: "file-explorer",
    name: "File Explorer",
    type: "system",
    icon: <ExplorerIcon className="size-5" />,
    pinnedToTaskbar: true,
    showOnDesktop: false,
    dateModified: new Date(2024, 0, 1)
  },
  {
    id: "this-pc",
    name: "This PC",
    type: "shortcut",
    icon: <ExplorerIcon className="size-8" />,
    showOnDesktop: true,
    desktopPosition: { x: 0, y: 0 },
    dateModified: new Date(2024, 0, 1)
  },

  // Third-party Applications
  {
    id: "chrome",
    name: "Google Chrome",
    type: "app",
    icon: <ChromeIcon className="size-5" />,
    href: "https://google.com",
    pinnedToTaskbar: true,
    showOnDesktop: true,
    desktopPosition: { x: 0, y: 1 },
    dateModified: new Date(2024, 0, 1)
  },
  {
    id: "terminal",
    name: "Windows Terminal",
    type: "app",
    icon: <TerminalIcon className="size-5" />,
    pinnedToTaskbar: true,
    showOnDesktop: true,
    desktopPosition: { x: 0, y: 2 },
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
    showOnDesktop: true,
    desktopPosition: { x: 1, y: 0 }
  },
  {
    id: "downloads",
    name: "Downloads",
    type: "folder",
    icon: <FolderIcon className="size-6" />,
    path: "/Downloads",
    dateModified: new Date(2024, 0, 25)
  },
  {
    id: "desktop-folder",
    name: "Desktop",
    type: "folder",
    icon: <FolderIcon className="size-6" />,
    path: "/Desktop",
    dateModified: new Date(2024, 0, 15)
  },

  // Sample file for desktop
  {
    id: "readme",
    name: "README.txt",
    type: "file",
    icon: <FileText className="size-6" />,
    path: "/Desktop/README.txt",
    parentPath: "/Desktop",
    size: 1024,
    dateModified: new Date(2024, 0, 15),
    showOnDesktop: true,
    desktopPosition: { x: 1, y: 1 }
  }
];

// Helper functions with proper type assertions
export const getTaskbarApps = (): TaskbarApp[] =>
  applications.filter((app): app is TaskbarApp => app.pinnedToTaskbar === true);

export const getDesktopItems = (): DesktopItem[] =>
  applications.filter(
    (app): app is DesktopItem =>
      app.showOnDesktop === true && app.desktopPosition !== undefined
  );

export const getThisPCItems = () =>
  applications.filter((app) =>
    ["documents", "downloads", "desktop-folder"].includes(app.id)
  );

export const getDesktopFolderItems = () =>
  applications.filter((app) => app.parentPath === "/Desktop");

// Type exports
export type DesktopItem = Application &
  Required<Pick<Application, "showOnDesktop" | "desktopPosition">>;
export type TaskbarApp = Application &
  Required<Pick<Application, "pinnedToTaskbar">>;
export type FileSystemItem = Application;
