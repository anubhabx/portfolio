import * as React from "react";
import {
  ExplorerIcon,
  ChromeIcon,
  TerminalIcon,
  WindowsUserFolderIcon,
  ProgramFolderIcon,
  PDFIcon,
  FolderIcon,
  MailIcon,
  SettingsIcon
} from "@/components/Icons";
import { Settings } from "lucide-react";
import type { WindowType } from "@/types";

/**
 * Application Registry
 *
 * This registry maps application IDs to their visual properties (icons, etc.)
 * and window types. It serves as a single source of truth for application metadata.
 */

export interface AppMetadata {
  id: string;
  name: string;
  icon: React.ReactNode;
  windowType?: WindowType;
  href?: string;
  description?: string;
}

export const APP_REGISTRY: Record<string, AppMetadata> = {
  "file-explorer": {
    id: "file-explorer",
    name: "File Explorer",
    icon: <ExplorerIcon />,
    windowType: "file-explorer",
    description: "Browse files and folders"
  },
  "this-pc": {
    id: "this-pc",
    name: "This PC",
    icon: <ExplorerIcon />,
    windowType: "file-explorer",
    description: "Access your computer's drives and folders"
  },
  "my-projects": {
    id: "my-projects",
    name: "My Projects",
    icon: <ProgramFolderIcon />,
    windowType: "my-projects",
    description: "View my portfolio projects"
  },
  resume: {
    id: "resume",
    name: "Resume / CV",
    icon: <PDFIcon />,
    windowType: "resume",
    description:
      "View my professional resume, experience, education, and projects"
  },
  contact: {
    id: "contact",
    name: "Contact",
    icon: <MailIcon />,
    windowType: "contact",
    description: "Get in touch with me"
  },
  settings: {
    id: "settings",
    name: "Settings",
    icon: <SettingsIcon className="size-4" />,
    windowType: "settings",
    description: "Customize your desktop appearance"
  },
  chrome: {
    id: "chrome",
    name: "Google Chrome",
    icon: <ChromeIcon />,
    windowType: "browser",
    description: "Web browser"
  },
  terminal: {
    id: "terminal",
    name: "Terminal",
    icon: <TerminalIcon />,
    windowType: "terminal",
    description: "Portfolio command line interface"
  },
  documents: {
    id: "documents",
    name: "Documents",
    icon: <FolderIcon />,
    description: "Personal documents"
  },
  downloads: {
    id: "downloads",
    name: "Downloads",
    icon: <FolderIcon />,
    description: "Downloaded files"
  },
  "desktop-folder": {
    id: "desktop-folder",
    name: "Desktop",
    icon: <FolderIcon />,
    description: "Desktop folder"
  }
};

/**
 * Get application metadata by ID
 */
export function getAppMetadata(id: string): AppMetadata | undefined {
  return APP_REGISTRY[id];
}

/**
 * Get icon for an application
 */
export function getAppIcon(id: string, className?: string): React.ReactNode {
  const app = APP_REGISTRY[id];
  if (!app || !app.icon) return null;

  // If no className is provided, return the icon as-is
  if (!className) return app.icon;

  // Check if the icon is a valid React element that can accept className
  if (React.isValidElement(app.icon)) {
    return React.cloneElement(
      app.icon as React.ReactElement<{ className?: string }>,
      {
        className
      }
    );
  }

  return app.icon;
}

/**
 * Launch an application
 * Returns true if the app was launched successfully
 */
export function launchApp(
  id: string,
  openWindow: (window: any) => void
): boolean {
  const app = APP_REGISTRY[id];
  if (!app) {
    console.warn(`App not found in registry: ${id}`);
    return false;
  }

  // External link
  if (app.href) {
    window.open(app.href, "_blank", "noopener,noreferrer");
    return true;
  }

  // Window-based app
  if (app.windowType) {
    openWindow({
      type: app.windowType,
      title: app.name,
      props:
        id === "this-pc" || id === "file-explorer"
          ? { initialPath: "This PC" }
          : {}
    });
    return true;
  }

  console.warn(`App has no launch target: ${id}`);
  return false;
}
