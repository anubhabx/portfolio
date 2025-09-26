"use client";

import { cn } from "@workspace/ui/lib/utils";

export type WallpaperProps = {
  variant?: "default" | "dark" | "light" | "custom";
  className?: string;
  children?: React.ReactNode;
};

export function Wallpaper({
  variant = "default",
  className,
  children
}: WallpaperProps) {
  const getWallpaperStyles = () => {
    switch (variant) {
      case "dark":
        return "bg-gradient-to-br from-slate-900 via-slate-800 to-neutral-900";
      case "light":
        return "bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-200";
      case "custom":
        return "bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900";
      default:
        return "bg-gradient-to-br from-slate-900 via-slate-800 to-neutral-900";
    }
  };

  return (
    <div className={cn("fixed inset-0 -z-10", getWallpaperStyles(), className)}>
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
