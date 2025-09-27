"use client";

import * as React from "react";
import FileExplorer from "./FileExplorer";

export type OpenWindow = {
  id: string;
  type: "file-explorer" | "notepad" | "calculator";
  title: string;
  props?: any;
};

type WindowManagerContextType = {
  windows: OpenWindow[];
  openWindow: (window: Omit<OpenWindow, "id">) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
};

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

      {/* Render Windows */}
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
          default:
            return null;
        }
      })}
    </WindowManagerContext.Provider>
  );
}

export default WindowManagerProvider;
