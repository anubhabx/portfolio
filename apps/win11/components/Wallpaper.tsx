"use client";

import * as React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { useWallpaper } from "@/contexts/WallpaperContext";

export type WallpaperProps = {
  className?: string;
  children?: React.ReactNode;
};

export function Wallpaper({ className, children }: WallpaperProps) {
  const { variant } = useWallpaper();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch by only rendering after mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const getWallpaperGradient = () => {
    switch (variant) {
      case "dark":
        return "linear-gradient(to bottom right, rgb(17, 24, 39), rgb(31, 41, 55), rgb(30, 58, 138))";
      case "light":
        return "linear-gradient(to bottom right, rgb(239, 246, 255), rgb(224, 231, 255), rgb(237, 233, 254))";
      case "custom":
        return "linear-gradient(to bottom right, rgb(88, 28, 135), rgb(112, 26, 117), rgb(67, 56, 202))";
      case "default":
      default:
        return "linear-gradient(to bottom right, rgb(15, 23, 42), rgb(30, 41, 59), rgb(38, 38, 38))";
    }
  };

  // On server and initial client render, use default gradient
  if (!mounted) {
    return (
      <div 
        className={cn("fixed inset-0 -z-10", className)}
        style={{ background: "linear-gradient(to bottom right, rgb(15, 23, 42), rgb(30, 41, 59), rgb(38, 38, 38))" }}
      >
        {/* Windows 11 style subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" className="w-full h-full">
            <defs>
              <pattern
                id="windows-pattern"
                x="0"
                y="0"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <rect width="40" height="40" fill="none" />
                <circle cx="20" cy="20" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#windows-pattern)" />
          </svg>
        </div>

        {/* Subtle light effect */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />

        {children}
      </div>
    );
  }

  return (
    <div 
      className={cn("fixed inset-0 -z-10", className)}
      style={{ background: getWallpaperGradient() }}
    >
      {/* Windows 11 style subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" className="w-full h-full">
          <defs>
            <pattern
              id="windows-pattern"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <rect width="40" height="40" fill="none" />
              <circle cx="20" cy="20" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#windows-pattern)" />
        </svg>
      </div>

      {/* Subtle light effect */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />

      {children}
    </div>
  );
}

export default Wallpaper;
