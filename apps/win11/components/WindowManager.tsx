"use client";

import * as React from "react";
import { AnimatePresence } from "framer-motion";
import type { OpenWindow, WindowManagerContextType } from "../types";

// Import window components
import FileExplorer from "./FileExplorer";
import AboutWindow from "@/components/AboutWindow";
import ProjectsWindow from "@/components/ProjectsWindow";
import ResumeWindow from "@/components/ResumeWindow";
import ContactWindow from "@/components/ContactWindow";

const WindowManagerContext =
  React.createContext<WindowManagerContextType | null>(null);

export function useWindowManager() {
  const context = React.useContext(WindowManagerContext);
  if (!context) {
    throw new Error(
      "useWindowManager must be used within WindowManagerProvider"
    );
  }
  return context;
}

export function WindowManagerProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [windows, setWindows] = React.useState<OpenWindow[]>([]);
  const [focusedWindowId, setFocusedWindowId] = React.useState<string | null>(
    null
  );

  const openWindow = React.useCallback((window: Omit<OpenWindow, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newWindow = { ...window, id, isMinimized: false };
    setWindows((prev) => [...prev, newWindow]);
    setFocusedWindowId(id);
  }, []);

  const closeWindow = React.useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    setFocusedWindowId((current) => (current === id ? null : current));
  }, []);

  const focusWindow = React.useCallback((id: string) => {
    setFocusedWindowId(id);
    // Restore if minimized
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: false } : w))
    );
  }, []);

  const minimizeWindow = React.useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    setFocusedWindowId((current) => (current === id ? null : current));
  }, []);

  const restoreWindow = React.useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: false } : w))
    );
    setFocusedWindowId(id);
  }, []);

  const getWindowZIndex = React.useCallback(
    (windowId: string) => {
      if (windowId === focusedWindowId) return 50;
      return 49;
    },
    [focusedWindowId]
  );

  const value = {
    windows,
    openWindow,
    closeWindow,
    focusWindow,
    minimizeWindow,
    restoreWindow
  };

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
      <AnimatePresence mode="popLayout">
        {windows.map((window) => {
          const commonProps = {
            isOpen: true,
            onClose: () => closeWindow(window.id),
            onMinimize: () => minimizeWindow(window.id),
            onFocus: () => focusWindow(window.id),
            windowId: `${window.type}-${window.id}`,
            zIndex: getWindowZIndex(window.id),
            isFocused: window.id === focusedWindowId
          };

          switch (window.type) {
            case "file-explorer":
              return (
                <FileExplorer
                  key={window.id}
                  {...commonProps}
                  {...window.props}
                />
              );
            case "about-me":
              return <AboutWindow key={window.id} {...commonProps} />;
            case "my-projects":
              return <ProjectsWindow key={window.id} {...commonProps} />;
            case "resume":
              return <ResumeWindow key={window.id} {...commonProps} />;
            case "contact":
              return <ContactWindow key={window.id} {...commonProps} />;
            default:
              return null;
          }
        })}
      </AnimatePresence>
    </WindowManagerContext.Provider>
  );
}

export default WindowManagerProvider;
