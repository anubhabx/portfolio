"use client";

import * as React from "react";
import type { TaskbarApp } from "@/types";

interface TaskbarContextType {
  apps: TaskbarApp[];
  pinnedApps: TaskbarApp[];
  runningApps: TaskbarApp[];
  pinApp: (app: TaskbarApp) => void;
  unpinApp: (id: string) => void;
  addRunningApp: (app: TaskbarApp) => void;
  removeRunningApp: (id: string) => void;
  isAppPinned: (id: string) => boolean;
  isAppRunning: (id: string) => boolean;
}

const TaskbarContext = React.createContext<TaskbarContextType | null>(null);

export function useTaskbar() {
  const context = React.useContext(TaskbarContext);
  if (!context) {
    throw new Error("useTaskbar must be used within TaskbarProvider");
  }
  return context;
}

export function TaskbarProvider({ children }: { children: React.ReactNode }) {
  const [pinnedApps, setPinnedApps] = React.useState<TaskbarApp[]>([]);
  const [runningApps, setRunningApps] = React.useState<TaskbarApp[]>([]);

  // Load pinned apps from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("taskbar-pinned");
    if (saved) {
      try {
        setPinnedApps(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to parse pinned apps:", error);
      }
    } else {
      // Set default pinned apps
      const defaultApps = getDefaultPinnedApps();
      setPinnedApps(defaultApps);
      localStorage.setItem("taskbar-pinned", JSON.stringify(defaultApps));
    }
  }, []);

  // Save to localStorage whenever pinned apps change
  React.useEffect(() => {
    if (pinnedApps.length > 0) {
      localStorage.setItem("taskbar-pinned", JSON.stringify(pinnedApps));
    }
  }, [pinnedApps]);

  // Combine pinned and running apps, avoiding duplicates
  const apps = React.useMemo(() => {
    const pinnedIds = new Set(pinnedApps.map((app) => app.id));
    const uniqueRunning = runningApps.filter((app) => !pinnedIds.has(app.id));
    return [...pinnedApps, ...uniqueRunning];
  }, [pinnedApps, runningApps]);

  const pinApp = React.useCallback((app: TaskbarApp) => {
    setPinnedApps((prev) => {
      if (prev.some((a) => a.id === app.id)) {
        return prev;
      }
      return [...prev, app];
    });
  }, []);

  const unpinApp = React.useCallback((id: string) => {
    setPinnedApps((prev) => prev.filter((app) => app.id !== id));
  }, []);

  const addRunningApp = React.useCallback((app: TaskbarApp) => {
    setRunningApps((prev) => {
      if (prev.some((a) => a.id === app.id)) {
        return prev;
      }
      return [...prev, app];
    });
  }, []);

  const removeRunningApp = React.useCallback((id: string) => {
    setRunningApps((prev) => prev.filter((app) => app.id !== id));
  }, []);

  const isAppPinned = React.useCallback(
    (id: string) => pinnedApps.some((app) => app.id === id),
    [pinnedApps]
  );

  const isAppRunning = React.useCallback(
    (id: string) => runningApps.some((app) => app.id === id),
    [runningApps]
  );

  return (
    <TaskbarContext.Provider
      value={{
        apps,
        pinnedApps,
        runningApps,
        pinApp,
        unpinApp,
        addRunningApp,
        removeRunningApp,
        isAppPinned,
        isAppRunning
      }}
    >
      {children}
    </TaskbarContext.Provider>
  );
}

// Default pinned apps - these appear on the taskbar by default
function getDefaultPinnedApps(): TaskbarApp[] {
  return [
    {
      id: "file-explorer",
      name: "File Explorer",
      type: "system",
      windowType: "file-explorer",
      metadata: {
        dateModified: new Date(2024, 0, 1)
      }
    },
    {
      id: "about-me",
      name: "About Me",
      type: "portfolio",
      windowType: "about-me",
      metadata: {
        dateModified: new Date(2024, 0, 1)
      }
    },
    {
      id: "my-projects",
      name: "My Projects",
      type: "portfolio",
      windowType: "my-projects",
      metadata: {
        dateModified: new Date(2024, 0, 1)
      }
    },
    {
      id: "resume",
      name: "Resume",
      type: "portfolio",
      windowType: "resume",
      metadata: {
        dateModified: new Date(2024, 0, 1)
      }
    },
    {
      id: "chrome",
      name: "Google Chrome",
      type: "app",
      href: "https://google.com",
      metadata: {
        dateModified: new Date(2024, 0, 1)
      }
    },
    {
      id: "terminal",
      name: "Windows Terminal",
      type: "app",
      metadata: {
        dateModified: new Date(2024, 0, 1)
      }
    }
  ];
}
