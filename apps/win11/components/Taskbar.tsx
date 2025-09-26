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
import { ChromeIcon, ExplorerIcon, TerminalIcon } from "./Icons";

import { BatteryCharging, Volume2, Wifi } from "lucide-react";

type PinnedApp = {
  id: string;
  name: string;
  icon: React.ReactNode;
  href?: string;
};

const WindowsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false" {...props}>
    <path
      fill="currentColor"
      d="M4 7.5l18-2.5v20H4V7.5zm20 17.5V5l20-3v23H24zM4 24h18v19.5L4 41V24zm20 0h20v23l-20-3V24z"
    />
  </svg>
);

const DummyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
    <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.12" />
    <path
      d="M8 12h8M12 8v8"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>
);

const defaultPinned: PinnedApp[] = [
  {
    id: "explorer",
    name: "Explorer",
    icon: <ExplorerIcon className="size-5" />
  },
  { id: "chrome", name: "Chrome", icon: <ChromeIcon className="size-5" /> },
  {
    id: "terminal",
    name: "Terminal",
    icon: <TerminalIcon className="size-5" />
  }
];

export type TaskbarProps = {
  alignment?: "center" | "left";
  pinned?: PinnedApp[];
};

export function Taskbar({
  alignment = "center",
  pinned = defaultPinned
}: TaskbarProps) {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [overflowOpen, setOverflowOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = React.useState(pinned.length);

  // Recompute visible items on resize
  React.useEffect(() => {
    const compute = () => {
      const container = listRef.current;
      if (!container) return;
      const maxWidth = container.clientWidth;
      const itemWidth = 44; // button size including gap
      // Remove the overflow button space subtraction since overflow button isn't in the main dock
      const maxItems = Math.max(0, Math.floor(maxWidth / itemWidth));
      setVisibleCount(Math.min(maxItems, pinned.length));
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (containerRef.current) ro.observe(containerRef.current);
    if (listRef.current) ro.observe(listRef.current);
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [pinned.length]);

  // Keyboard navigation within pinned icons
  const buttonsRef = React.useRef<Array<HTMLButtonElement | null>>([]);
  const focusIndex = (index: number) => buttonsRef.current[index]?.focus();

  const onKeyDown = (e: React.KeyboardEvent) => {
    const currentIndex = buttonsRef.current.findIndex(
      (el) => el === document.activeElement
    );
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = (currentIndex + 1) % Math.min(visibleCount, pinned.length);
      focusIndex(next);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev =
        (currentIndex - 1 + Math.min(visibleCount, pinned.length)) %
        Math.min(visibleCount, pinned.length);
      focusIndex(prev);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = pinned[currentIndex];
      if (target) handleLaunch(target);
    } else if (e.key === "Escape") {
      setOverflowOpen(false);
      (
        containerRef.current?.querySelector<HTMLButtonElement>(
          "button[data-start]"
        ) as HTMLButtonElement | null
      )?.focus();
    }
  };

  const handleLaunch = (app: PinnedApp) => {
    setActiveId(app.id);
    if (app.href) {
      window.open(app.href, "_blank", "noopener,noreferrer");
    } else {
      alert(`${app.name} opened`);
    }
  };

  const visible = pinned.slice(0, visibleCount);
  const overflow = pinned.slice(visibleCount);

  return (
    <TooltipProvider delayDuration={200}>
      <div
        ref={containerRef}
        className={cn("fixed bottom-0 z-50", "w-full")}
        aria-label="Taskbar"
        role="navigation"
      >
        <div
          className={cn(
            "flex items-center gap-2 p-2",
            "border border-white/10",
            "bg-white/10 dark:bg-black/20",
            "backdrop-blur-xl shadow-lg shadow-black/10"
          )}
        >
          {/* Dock */}
          <div
            ref={listRef}
            className={cn(
              "flex items-center gap-1.5 px-1",
              alignment === "center" ? "mx-auto" : "",
              "absolute left-1/2 -translate-x-1/2"
            )}
            onKeyDown={onKeyDown}
            role="toolbar"
            aria-label="Dock"
          >
            {/* Start button */}
            <TaskbarButton
              aria-label="Start"
              data-start
              onClick={() => alert("Start menu coming soon")}
            >
              <WindowsIcon className="size-5" />
            </TaskbarButton>

            {visible.map((app, i) => (
              <TaskbarIcon
                key={app.id}
                ref={(el) => {
                  buttonsRef.current[i] = el;
                }}
                app={app}
                active={activeId === app.id}
                onLaunch={() => handleLaunch(app)}
              />
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2 pr-2">
            {/* System tray placeholder */}
            <Separator orientation="vertical" className="h-6 bg-white/20" />

            <div className="flex items-center gap-2 pl-1 pr-1.5 text-xs tabular-nums text-foreground/80">
              <div
                aria-hidden
                className="flex items-center gap-2 opacity-75 px-2 p-2 hover:bg-foreground/10 rounded-md transition-colors"
              >
                <Wifi className="size-4" />
                <Volume2 className="size-4" />
                <BatteryCharging className="size-4" />
              </div>
              <Clock />
            </div>
          </div>
        </div>

        {/* Overflow menu */}
        {overflow.length > 0 && overflowOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute bottom-14 left-1/2 -translate-x-1/2 rounded-xl border border-white/10 bg-white/10 dark:bg-black/30 backdrop-blur-xl shadow-xl p-2 grid grid-cols-6 gap-1"
            role="menu"
            aria-label="Overflow apps"
          >
            {overflow.map((app) => (
              <TaskbarButton
                key={app.id}
                onClick={() => handleLaunch(app)}
                aria-label={app.name}
              >
                {app.icon}
              </TaskbarButton>
            ))}
          </motion.div>
        )}
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
      className={cn(
        "bg-transparent",
        "relative grid place-items-center size-9 rounded-lg",
        "text-foreground/80 hover:text-foreground",
        "outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        "transition-colors",
        "hover:bg-foreground/10 active:bg-white/25",
        className
      )}
      {...props}
    />
  )
);
TaskbarButton.displayName = "TaskbarButton";

const TaskbarIcon = React.forwardRef<
  HTMLButtonElement,
  { app: PinnedApp; active?: boolean; onLaunch: () => void }
>(({ app, active, onLaunch }, ref) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <TaskbarButton
          ref={ref}
          aria-label={app.name}
          onClick={onLaunch}
          active={active}
        >
          <span className="sr-only">{app.name}</span>
          <span className="text-base">{app.icon}</span>
          <motion.span
            layoutId={`indicator-${app.id}`}
            className={cn(
              "pointer-events-none absolute -bottom-1 left-1/2 h-0.5 w-3 -translate-x-1/2 rounded-full bg-cyan-400/90",
              active ? "opacity-100" : "opacity-0"
            )}
            aria-hidden
          />
        </TaskbarButton>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="px-2 py-1 text-xs bg-background/50 text-foreground -translate-y-4"
      >
        {app.name}
      </TooltipContent>
    </Tooltip>
  );
});
TaskbarIcon.displayName = "TaskbarIcon";

function Clock() {
  const [now, setNow] = React.useState(() => new Date());
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(id);
  }, []);
  const time = now.toLocaleTimeString([], {
    formatMatcher: "best fit",
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
    <div
      aria-label="Clock"
      className="leading-none text-right flex flex-col gap-0.5"
    >
      <div className="text-xs">{time}</div>
      <div className="text-foreground/60 text-xs">{date}</div>
    </div>
  );
}

export default Taskbar;
