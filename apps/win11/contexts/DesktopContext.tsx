"use client";

import * as React from "react";
import type { DesktopItem } from "@/types";

interface DesktopContextType {
  items: DesktopItem[];
  addItem: (item: DesktopItem) => void;
  removeItem: (id: string) => void;
  updateItemPosition: (id: string, position: { x: number; y: number }) => void;
  reorderItems: (fromIndex: number, toIndex: number) => void;
}

const DesktopContext = React.createContext<DesktopContextType | null>(null);

export function useDesktop() {
  const context = React.useContext(DesktopContext);
  if (!context) {
    throw new Error("useDesktop must be used within DesktopProvider");
  }
  return context;
}

export function DesktopProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<DesktopItem[]>([]);

  // Load desktop items from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("desktop-items");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to parse desktop items:", error);
      }
    } else {
      // Set default desktop items
      const defaultItems = getDefaultDesktopItems();
      setItems(defaultItems);
      localStorage.setItem("desktop-items", JSON.stringify(defaultItems));
    }
  }, []);

  // Save to localStorage whenever items change
  React.useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("desktop-items", JSON.stringify(items));
    }
  }, [items]);

  const addItem = React.useCallback((item: DesktopItem) => {
    setItems((prev) => {
      // Check if item already exists
      if (prev.some((i) => i.id === item.id)) {
        return prev;
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateItemPosition = React.useCallback(
    (id: string, position: { x: number; y: number }) => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, position } : item))
      );
    },
    []
  );

  const reorderItems = React.useCallback(
    (fromIndex: number, toIndex: number) => {
      setItems((prev) => {
        const newItems = [...prev];
        const [removed] = newItems.splice(fromIndex, 1);
        if (removed) {
          newItems.splice(toIndex, 0, removed);
        }
        return newItems;
      });
    },
    []
  );

  return (
    <DesktopContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateItemPosition,
        reorderItems
      }}
    >
      {children}
    </DesktopContext.Provider>
  );
}

// Default desktop items - these icons appear on the desktop by default
function getDefaultDesktopItems(): DesktopItem[] {
  return [
    {
      id: "this-pc",
      name: "This PC",
      type: "shortcut",
      position: { x: 0, y: 0 },
      windowType: "file-explorer",
      metadata: {
        dateModified: new Date(2024, 0, 1)
      }
    },
    {
      id: "about-me",
      name: "About Me",
      type: "portfolio",
      position: { x: 0, y: 1 },
      windowType: "about-me",
      metadata: {
        dateModified: new Date(2024, 0, 1)
      }
    },
    {
      id: "my-projects",
      name: "My Projects",
      type: "portfolio",
      position: { x: 0, y: 2 },
      windowType: "my-projects",
      metadata: {
        dateModified: new Date(2024, 0, 1)
      }
    },
    {
      id: "resume",
      name: "Resume",
      type: "portfolio",
      position: { x: 0, y: 3 },
      windowType: "resume",
      metadata: {
        dateModified: new Date(2024, 0, 1)
      }
    },
    {
      id: "contact",
      name: "Contact",
      type: "portfolio",
      position: { x: 1, y: 0 },
      windowType: "contact",
      metadata: {
        dateModified: new Date(2024, 0, 1)
      }
    },
    {
      id: "chrome",
      name: "Google Chrome",
      type: "app",
      position: { x: 1, y: 1 },
      metadata: {
        dateModified: new Date(2024, 0, 1)
      }
    }
  ];
}
