"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@workspace/ui/components/tooltip";
import { Separator } from "@workspace/ui/components/separator";
import { WindowsIcon } from "./Icons";
import { BatteryCharging, Volume2, Wifi } from "lucide-react";
import { useWindowManager } from "./WindowManager";
import { getTaskbarApps, type TaskbarApp } from "../data/applications";
import StartMenu from "./StartMenu";

export type TaskbarProps = {
  alignment?: "center" | "left";
  pinned?: TaskbarApp[];
};

export function Taskbar({
  alignment = "center",
  pinned = getTaskbarApps()
}: TaskbarProps) {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [isStartMenuOpen, setIsStartMenuOpen] = React.useState(false);
  const { openWindow } = useWindowManager();

  const handleLaunch = (app: TaskbarApp) => {
    setActiveId(app.id);

    if (app.href) {
      window.open(app.href, "_blank", "noopener,noreferrer");
    } else if (app.id === "file-explorer") {
      openWindow({
        type: "file-explorer",
        title: "File Explorer",
        props: { initialPath: "This PC" }
      });
    } else {
      alert(`Opening ${app.name}...`);
    }

    setTimeout(() => setActiveId(null), 1000);
  };

  const handleStartClick = () => {
    setIsStartMenuOpen(!isStartMenuOpen);
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
            "flex items-center justify-between gap-2 px-2 py-2",
            "border-t border-white/10",
            "bg-white/10 dark:bg-black/20",
            "backdrop-blur-xl shadow-lg",
            "relative"
          )}
        >
          <div />

          <div className="flex items-center gap-1.5 px-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <TaskbarButton
              onClick={handleStartClick}
              aria-label="Start"
              active={isStartMenuOpen}
            >
              <WindowsIcon className="size-5" />
            </TaskbarButton>

            {pinned.map((app) => (
              <TaskbarIcon
                key={app.id}
                app={app}
                active={activeId === app.id}
                onLaunch={() => handleLaunch(app)}
              />
            ))}
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

        {/* Start Menu */}
        <StartMenu
          isOpen={isStartMenuOpen}
          onClose={() => setIsStartMenuOpen(false)}
        />
      </div>
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
      size="sm"
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

const TaskbarIcon = React.forwardRef<
  HTMLButtonElement,
  { app: TaskbarApp; active?: boolean; onLaunch: () => void }
>(({ app, active, onLaunch }, ref) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <TaskbarButton
          ref={ref}
          onClick={onLaunch}
          active={active}
          aria-label={app.name}
        >
          {app.icon}
          <motion.span
            layoutId={`indicator-${app.id}`}
            className={cn(
              "absolute -bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-cyan-400/90",
              active ? "opacity-100" : "opacity-0"
            )}
            aria-hidden
          />
        </TaskbarButton>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        {app.name}
      </TooltipContent>
    </Tooltip>
  );
});
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
