"use client";

import * as React from "react";
import { AnimatePresence } from "framer-motion";
import type { OpenWindow, WindowManagerContextType } from "../types";

// Import window components
import FileExplorer from "./FileExplorer";
import AboutWindow from "@/components/AboutWindow";
import ProjectsWindow from "@/components/ProjectsWindow";
import ResumeWindow from "@/components/ResumeWindow";

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

  const openWindow = React.useCallback((window: Omit<OpenWindow, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setWindows((prev) => [...prev, { ...window, id }]);
  }, []);

  const closeWindow = React.useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const focusWindow = React.useCallback((id: string) => {
    setWindows((prev) => {
      const window = prev.find((w) => w.id === id);
      if (!window) return prev;
      return [window, ...prev.filter((w) => w.id !== id)];
    });
  }, []);

  return (
    <WindowManagerContext.Provider
      value={{
        windows,
        openWindow,
        closeWindow,
        focusWindow
      }}
    >
      {children}

      <AnimatePresence>
        {windows.map((window) => {
          switch (window.type) {
            case "file-explorer":
              return (
                <FileExplorer
                  key={window.id}
                  isOpen={true}
                  onClose={() => closeWindow(window.id)}
                  {...window.props}
                />
              );
            case "about-me":
              return (
                <AboutWindow
                  key={window.id}
                  isOpen={true}
                  onClose={() => closeWindow(window.id)}
                />
              );
            case "my-projects":
              return (
                <ProjectsWindow
                  key={window.id}
                  isOpen={true}
                  onClose={() => closeWindow(window.id)}
                />
              );
            case "resume":
              return (
                <ResumeWindow
                  key={window.id}
                  isOpen={true}
                  onClose={() => closeWindow(window.id)}
                />
              );
            default:
              return null;
          }
        })}
      </AnimatePresence>
    </WindowManagerContext.Provider>
  );
}

export default WindowManagerProvider;
