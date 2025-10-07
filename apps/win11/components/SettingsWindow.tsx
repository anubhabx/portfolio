"use client";

import * as React from "react";
import { Image as ImageIcon } from "lucide-react";
import Window, { WindowProps } from "@/components/Window";
import { useWallpaper, WallpaperVariant } from "@/contexts/WallpaperContext";
import { cn } from "@workspace/ui/lib/utils";
import { SettingsIcon } from "./Icons";

export function SettingsWindow({
  isOpen,
  onClose,
  onMinimize,
  onFocus,
  windowId,
  zIndex,
  isFocused,
  isMinimized
}: Omit<WindowProps, "title" | "children" | "icon">) {
  const { variant, setVariant } = useWallpaper();

  const wallpapers: Array<{
    id: WallpaperVariant;
    name: string;
    description: string;
    preview: string;
  }> = [
    {
      id: "default",
      name: "Windows Dark",
      description: "Classic Windows 11 dark theme",
      preview: "from-slate-900 via-slate-800 to-neutral-900"
    },
    {
      id: "dark",
      name: "Midnight Blue",
      description: "Deep blue dark gradient",
      preview: "from-gray-900 via-gray-800 to-blue-900"
    },
    {
      id: "light",
      name: "Azure Sky",
      description: "Bright and professional",
      preview: "from-blue-50 via-indigo-100 to-purple-200"
    },
    {
      id: "custom",
      name: "Purple Dream",
      description: "Vibrant purple and blue fusion",
      preview: "from-purple-900 via-fuchsia-900 to-indigo-900"
    }
  ];

  return (
    <Window
      title="Settings"
      icon={<SettingsIcon className="size-4" />}
      isOpen={isOpen}
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
      windowId={windowId}
      zIndex={zIndex}
      isFocused={isFocused}
      isMinimized={isMinimized}
      initialWidth={720}
      initialHeight={520}
      initialX={200}
      initialY={100}
    >
      <div className="h-full overflow-auto p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Background</h2>
            <p className="text-sm text-muted-foreground">
              Choose a wallpaper for your desktop
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {wallpapers.map((wp) => (
              <button
                key={wp.id}
                onClick={() => setVariant(wp.id)}
                className={cn(
                  "group relative rounded-lg overflow-hidden border-2 transition-all",
                  variant === wp.id
                    ? "border-blue-500 ring-2 ring-blue-500/50"
                    : "border-border/30 hover:border-blue-500/50"
                )}
              >
                {/* Preview */}
                <div
                  className={cn(
                    "aspect-video bg-gradient-to-br",
                    wp.preview,
                    "relative"
                  )}
                >
                  {variant === wp.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Active
                      </div>
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="p-3 bg-background/50">
                  <div className="font-medium text-sm">{wp.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {wp.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Window>
  );
}

export default SettingsWindow;
