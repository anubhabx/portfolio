"use client";

import * as React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@workspace/ui/components/tooltip";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger
} from "@workspace/ui/components/context-menu";
import { Separator } from "@workspace/ui/components/separator";
import { WindowsIcon } from "./Icons";
import { BatteryCharging, Volume2, Wifi } from "lucide-react";
import { useWindowManager } from "@/components/WindowManager";
import { useTaskbar } from "@/contexts/TaskbarContext";
import { getAppIcon, getAppMetadata, launchApp } from "@/lib/app-registry";
import StartMenu from "@/components/StartMenu";
import type { TaskbarApp, WindowType } from "@/types";

export interface TaskbarProps {
  alignment?: "center" | "left";
}

export function Taskbar({ alignment = "center" }: TaskbarProps) {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [isStartMenuOpen, setIsStartMenuOpen] = React.useState(false);
  const { openWindow, windows, restoreWindow } = useWindowManager();
  const { apps, unpinApp, isAppPinned } = useTaskbar();

  const handleLaunch = (app: TaskbarApp) => {
    // Check if app has minimized windows
    const metadata = getAppMetadata(app.id);
    const minimizedWindow = windows.find(
      (w) => w.type === metadata?.windowType && w.isMinimized
    );

    if (minimizedWindow) {
      // Restore minimized window instead of opening new one
      restoreWindow(minimizedWindow.id);
    } else {
      setActiveId(app.id);
      launchApp(app.id, openWindow);
      setTimeout(() => setActiveId(null), 1000);
    }
  };

  const handleStartClick = () => {
    setIsStartMenuOpen(!isStartMenuOpen);
  };

  const handleUnpin = (appId: string) => {
    unpinApp(appId);
  };

  // Check if an app has open windows (including minimized)
  const getAppWindows = (appId: string, appWindowType?: WindowType) => {
    // First try to use the app's windowType directly
    // Fall back to getting from registry if not provided
    const windowType = appWindowType || getAppMetadata(appId)?.windowType;
    if (!windowType) return [];

    return windows.filter((w) => w.type === windowType);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={cn("fixed bottom-0 z-50 w-full")}
        aria-label="Taskbar"
        role="navigation"
      >
        <div
          className={cn(
            "flex items-center justify-between gap-2 p-2",
            "border-t border-white/10",
            "bg-white/10 dark:bg-black/20",
            "backdrop-blur-xl shadow-lg"
          )}
        >
          <div />

          <div className="flex items-center gap-1.5 px-2">
            <TaskbarButton
              onClick={handleStartClick}
              aria-label="Start"
              active={isStartMenuOpen}
            >
              <WindowsIcon className="size-5" />
            </TaskbarButton>

            {apps.map((app) => {
              const metadata = getAppMetadata(app.id);
              const appWindows = getAppWindows(app.id, app.windowType);
              const hasOpenWindows = appWindows.length > 0;
              const hasVisibleWindows = appWindows.some((w) => !w.isMinimized);

              return (
                <TaskbarIcon
                  key={app.id}
                  app={app}
                  icon={getAppIcon(app.id, "size-5")}
                  active={activeId === app.id}
                  hasOpenWindows={hasOpenWindows}
                  hasVisibleWindows={hasVisibleWindows}
                  isPinned={isAppPinned(app.id)}
                  onLaunch={() => handleLaunch(app)}
                  onUnpin={() => handleUnpin(app.id)}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Separator orientation="vertical" className="h-6 bg-white/20" />
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 opacity-75 px-2 py-1 hover:bg-foreground/10 rounded-md transition-colors">
                <Wifi className="size-4" />
                <Volume2 className="size-4" />
                <BatteryCharging className="size-4" />
              </div>
              <Clock />
            </div>
          </div>
        </div>
      </div>

      <StartMenu
        isOpen={isStartMenuOpen}
        onClose={() => setIsStartMenuOpen(false)}
      />
    </TooltipProvider>
  );
}

type TaskbarButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

const TaskbarButton = React.forwardRef<HTMLButtonElement, TaskbarButtonProps>(
  ({ className, active, ...props }, ref) => (
    <Button
      ref={ref}
      variant="ghost"
      className={cn(
        "relative size-10 p-0 rounded-lg",
        "text-foreground/80 hover:text-foreground",
        "hover:bg-foreground/10 active:bg-white/25",
        "transition-colors",
        active && "bg-white/15",
        className
      )}
      {...props}
    />
  )
);
TaskbarButton.displayName = "TaskbarButton";

type TaskbarIconProps = {
  app: TaskbarApp;
  icon?: React.ReactNode;
  active?: boolean;
  hasOpenWindows?: boolean;
  hasVisibleWindows?: boolean;
  isPinned: boolean;
  onLaunch: () => void;
  onUnpin: () => void;
};

const TaskbarIcon = React.forwardRef<HTMLButtonElement, TaskbarIconProps>(
  (
    {
      app,
      icon,
      active,
      hasOpenWindows,
      hasVisibleWindows,
      isPinned,
      onLaunch,
      onUnpin
    },
    ref
  ) => {
    return (
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <Tooltip>
            <TooltipTrigger asChild>
              <TaskbarButton
                ref={ref}
                onClick={onLaunch}
                active={active || hasVisibleWindows}
                aria-label={app.name}
              >
                <div className="flex items-center justify-center size-8 w-full h-full">
                  {icon}
                </div>
                {hasOpenWindows && (
                  <span
                    className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-cyan-400/90"
                    aria-hidden
                  />
                )}
              </TaskbarButton>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              {app.name}
              {hasOpenWindows && " (Running)"}
            </TooltipContent>
          </Tooltip>
        </ContextMenuTrigger>

        <ContextMenuContent className="w-48">
          {!hasOpenWindows && (
            <ContextMenuItem onClick={onLaunch}>
              <Button
                variant="ghost"
                className="w-full justify-start p-0 h-auto"
              >
                Open
              </Button>
            </ContextMenuItem>
          )}
          {isPinned && (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem onClick={onUnpin}>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-0 h-auto"
                >
                  Unpin from Taskbar
                </Button>
              </ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>
    );
  }
);
TaskbarIcon.displayName = "TaskbarIcon";

function Clock() {
  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

  const date = now.toLocaleDateString([], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  return (
    <div className="text-right text-xs leading-tight">
      <div>{time}</div>
      <div className="text-foreground/60">{date}</div>
    </div>
  );
}

export default Taskbar;
