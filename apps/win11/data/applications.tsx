import {
  ChromeIcon,
  ExplorerIcon,
  TerminalIcon,
  FolderIcon,
  ProgramFolderIcon
} from "@/components/Icons";
import { FileText } from "lucide-react";

export type ApplicationType =
  | "folder"
  | "file"
  | "app"
  | "shortcut"
  | "system"
  | "drive";

export type Application = {
  id: string;
  name: string;
  type: ApplicationType;
  icon: React.ReactNode;
  href?: string;
  /** Path for file explorer navigation */
  path?: string;
  /** Parent path for file system hierarchy */
  parentPath?: string;
  /** File size in bytes */
  size?: number;
  /** Date modified for files/folders */
  dateModified?: Date;
  /** Whether app should be pinned to taskbar */
  pinnedToTaskbar?: boolean;
  /** Whether app should appear on desktop */
  showOnDesktop?: boolean;
  /** Desktop grid position */
  desktopPosition?: {
    x: number;
    y: number;
  };
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
    pinnedToTaskbar: false,
    showOnDesktop: true,
    desktopPosition: { x: 0, y: 0 }
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
    desktopPosition: { x: 0, y: 1 }
  },
  {
    id: "terminal",
    name: "Windows Terminal",
    type: "app",
    icon: <TerminalIcon className="size-5" />,
    pinnedToTaskbar: true,
    showOnDesktop: true,
    desktopPosition: { x: 0, y: 2 }
  },

  // User Folders
  {
    id: "documents",
    name: "Documents",
    type: "folder",
    icon: <FolderIcon className="size-4" />,
    path: "/Documents",
    dateModified: new Date(2024, 0, 20),
    showOnDesktop: true,
    desktopPosition: { x: 1, y: 0 }
  },
  {
    id: "projects",
    name: "Projects",
    type: "folder",
    icon: <ProgramFolderIcon className="size-8" />,
    path: "/Projects",
    dateModified: new Date(2024, 0, 18),
    showOnDesktop: true,
    desktopPosition: { x: 1, y: 1 }
  },

  // Files
  {
    id: "readme",
    name: "README.txt",
    type: "file",
    icon: <FileText className="size-4" />,
    path: "/Desktop/README.txt",
    parentPath: "/Desktop",
    size: 1024,
    dateModified: new Date(2024, 0, 15),
    showOnDesktop: true,
    desktopPosition: { x: 1, y: 2 }
  },

  // System Folders (for File Explorer)
  {
    id: "desktop-folder",
    name: "Desktop",
    type: "folder",
    icon: <FolderIcon className="size-4" />,
    path: "/Desktop",
    dateModified: new Date(2024, 0, 15),
    showOnDesktop: false
  },
  {
    id: "downloads",
    name: "Downloads",
    type: "folder",
    icon: <FolderIcon className="size-4" />,
    path: "/Downloads",
    dateModified: new Date(2024, 0, 25),
    showOnDesktop: false
  },
  {
    id: "music",
    name: "Music",
    type: "folder",
    icon: <FolderIcon className="size-4" />,
    path: "/Music",
    dateModified: new Date(2024, 0, 18),
    showOnDesktop: false
  },
  {
    id: "pictures",
    name: "Pictures",
    type: "folder",
    icon: <FolderIcon className="size-4" />,
    path: "/Pictures",
    dateModified: new Date(2024, 0, 22),
    showOnDesktop: false
  },
  {
    id: "videos",
    name: "Videos",
    type: "folder",
    icon: <FolderIcon className="size-4" />,
    path: "/Videos",
    dateModified: new Date(2024, 0, 19),
    showOnDesktop: false
  },

  // System Drives
  {
    id: "c-drive",
    name: "Windows (C:)",
    type: "folder",
    icon: <FolderIcon className="size-4" />,
    path: "/C:",
    size: 512000000000, // 512GB
    dateModified: new Date(2024, 0, 10),
    showOnDesktop: false
  },
  {
    id: "d-drive",
    name: "Data (D:)",
    type: "folder",
    icon: <FolderIcon className="size-4" />,
    path: "/D:",
    size: 1000000000000, // 1TB
    dateModified: new Date(2024, 0, 10),
    showOnDesktop: false
  }
];

// Helper functions to filter applications
export const getTaskbarApps = () =>
  applications.filter((app) => app.pinnedToTaskbar);

export const getDesktopItems = () =>
  applications.filter((app) => app.showOnDesktop);

export const getThisPCItems = () =>
  applications.filter((app) =>
    [
      "desktop-folder",
      "documents",
      "downloads",
      "music",
      "pictures",
      "videos",
      "c-drive",
      "d-drive"
    ].includes(app.id)
  );

export const getDesktopFolderItems = () =>
  applications.filter((app) => app.parentPath === "/Desktop");

export const getApplicationById = (id: string) =>
  applications.find((app) => app.id === id);

export const getApplicationsByPath = (path: string) =>
  applications.filter((app) => app.parentPath === path);

// Type exports for components
export type DesktopItem = Application &
  Required<Pick<Application, "showOnDesktop" | "desktopPosition">>;
export type TaskbarApp = Application &
  Required<Pick<Application, "pinnedToTaskbar">>;
export type FileSystemItem = Application &
  Required<Pick<Application, "dateModified">>;
