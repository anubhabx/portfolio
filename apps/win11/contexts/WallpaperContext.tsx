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
  const [variant, setVariantState] = React.useState<WallpaperVariant>("default");
  const [mounted, setMounted] = React.useState(false);

  // Load saved variant after mount to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("wallpaper-variant");
    if (saved) {
      setVariantState(saved as WallpaperVariant);
    }
  }, []);

  const setVariant = React.useCallback((newVariant: WallpaperVariant) => {
    setVariantState(newVariant);
    if (mounted) {
      localStorage.setItem("wallpaper-variant", newVariant);
    }
  }, [mounted]);

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
