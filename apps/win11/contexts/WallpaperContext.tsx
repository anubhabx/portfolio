"use client";

import * as React from "react";

export type WallpaperVariant = "default" | "dark" | "light" | "custom";

interface WallpaperContextType {
  variant: WallpaperVariant;
  setVariant: (variant: WallpaperVariant) => void;
}

const WallpaperContext = React.createContext<WallpaperContextType | undefined>(
  undefined
);

export function WallpaperProvider({ children }: { children: React.ReactNode }) {
  const [variant, setVariantState] = React.useState<WallpaperVariant>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("wallpaper-variant");
      return (saved as WallpaperVariant) || "default";
    }
    return "default";
  });

  const setVariant = React.useCallback((newVariant: WallpaperVariant) => {
    setVariantState(newVariant);
    localStorage.setItem("wallpaper-variant", newVariant);
  }, []);

  return (
    <WallpaperContext.Provider value={{ variant, setVariant }}>
      {children}
    </WallpaperContext.Provider>
  );
}

export function useWallpaper() {
  const context = React.useContext(WallpaperContext);
  if (context === undefined) {
    throw new Error("useWallpaper must be used within a WallpaperProvider");
  }
  return context;
}
