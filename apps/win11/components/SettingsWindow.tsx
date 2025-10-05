"use client";

import * as React from "react";
import { Settings as SettingsIcon, Image as ImageIcon } from "lucide-react";
import Window, { WindowProps } from "@/components/Window";
import { useWallpaper, WallpaperVariant } from "@/contexts/WallpaperContext";
import { cn } from "@workspace/ui/lib/utils";

export function SettingsWindow({
  isOpen,
  onClose,
  onMinimize,
  onFocus,
  windowId,
  zIndex,
  isFocused
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
      name: "Default Dark",
      description: "Classic Windows 11 dark theme",
      preview: "from-slate-900 via-slate-800 to-neutral-900"
    },
    {
      id: "dark",
      name: "Midnight",
      description: "Deep dark gradient",
      preview: "from-slate-900 via-slate-800 to-neutral-900"
    },
    {
      id: "light",
      name: "Azure Sky",
      description: "Bright and airy",
      preview: "from-blue-50 via-blue-100 to-indigo-200"
    },
    {
      id: "custom",
      name: "Purple Dream",
      description: "Vibrant purple and blue",
      preview: "from-purple-900 via-blue-900 to-indigo-900"
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
      initialWidth={720}
      initialHeight={520}
      initialX={200}
      initialY={100}
    >
      <div className="h-full flex">
        {/* Sidebar */}
        <div className="w-48 bg-background/30 border-r border-border/30 p-4">
          <div className="space-y-1">
            <button className="w-full text-left px-3 py-2 rounded-lg bg-blue-500/20 text-white text-sm">
              <div className="flex items-center gap-2">
                <ImageIcon className="size-4" />
                <span>Wallpaper</span>
              </div>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
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
      </div>
    </Window>
  );
}

export default SettingsWindow;
