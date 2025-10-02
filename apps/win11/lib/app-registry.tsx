import * as React from "react";
import {
  ExplorerIcon,
  ChromeIcon,
  TerminalIcon,
  WindowsUserFolderIcon,
  ProgramFolderIcon
} from "@/components/Icons";
import { FileText, Mail } from "lucide-react";
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
    icon: <ExplorerIcon className="size-5" />,
    windowType: "file-explorer",
    description: "Browse files and folders"
  },
  "this-pc": {
    id: "this-pc",
    name: "This PC",
    icon: <ExplorerIcon className="size-8" />,
    windowType: "file-explorer",
    description: "Access your computer's drives and folders"
  },
  "about-me": {
    id: "about-me",
    name: "About Me",
    icon: <WindowsUserFolderIcon className="size-6" />,
    windowType: "about-me",
    description: "Learn more about me"
  },
  "my-projects": {
    id: "my-projects",
    name: "My Projects",
    icon: <ProgramFolderIcon className="size-6" />,
    windowType: "my-projects",
    description: "View my portfolio projects"
  },
  resume: {
    id: "resume",
    name: "Resume",
    icon: <FileText className="size-6" />,
    windowType: "resume",
    description: "View my resume and experience"
  },
  contact: {
    id: "contact",
    name: "Contact",
    icon: <Mail className="size-6" />,
    windowType: "contact",
    description: "Get in touch with me"
  },
  chrome: {
    id: "chrome",
    name: "Google Chrome",
    icon: <ChromeIcon className="size-5" />,
    href: "https://google.com",
    description: "Web browser"
  },
  terminal: {
    id: "terminal",
    name: "Windows Terminal",
    icon: <TerminalIcon className="size-5" />,
    description: "Command line interface"
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
export function getAppIcon(id: string): React.ReactNode {
  const app = APP_REGISTRY[id];
  if (!app) return null;
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
      props: id === "this-pc" || id === "file-explorer" 
        ? { initialPath: "This PC" } 
        : {}
    });
    return true;
  }

  console.warn(`App has no launch target: ${id}`);
  return false;
}
