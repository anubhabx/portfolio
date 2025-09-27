"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@workspace/ui/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger
} from "@workspace/ui/components/context-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@workspace/ui/components/tooltip";
import {
  ChromeIcon,
  ExplorerIcon,
  TerminalIcon,
  FolderIcon,
  ProgramFolderIcon
} from "./Icons";
import {
  FileText,
  Archive,
  Settings,
  Folder,
  BrushIcon,
  ClipboardPaste,
  RefreshCcw,
  RefreshCw
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useWindowManager } from "./WindowManager";

type DesktopItem = {
  id: string;
  name: string;
  type: "folder" | "file" | "app" | "shortcut";
  icon: React.ReactNode;
  x: number; // Grid position
  y: number; // Grid position
  href?: string;
};

const defaultDesktopItems: DesktopItem[] = [
  {
    id: "this-pc",
    name: "This PC",
    type: "shortcut",
    icon: <ExplorerIcon className="size-8" />,
    x: 0,
    y: 0
  },
  {
    id: "chrome",
    name: "Google Chrome",
    type: "app",
    icon: <ChromeIcon className="size-8" />,
    x: 0,
    y: 1,
    href: "https://google.com"
  },
  {
    id: "terminal",
    name: "Windows Terminal",
    type: "app",
    icon: <TerminalIcon className="size-8" />,
    x: 0,
    y: 2
  },
  {
    id: "documents",
    name: "Documents",
    type: "folder",
    icon: <FolderIcon className="size-8" />,
    x: 1,
    y: 0
  },
  {
    id: "projects",
    name: "Projects",
    type: "folder",
    icon: <ProgramFolderIcon className="size-8" />,
    x: 1,
    y: 1
  },
  {
    id: "readme",
    name: "README.txt",
    type: "file",
    icon: <FileText className="size-8" />,
    x: 1,
    y: 2
  }
];

export type DesktopProps = {
  items?: DesktopItem[];
  gridSize?: number;
  padding?: number;
};

export function Desktop({
  items = defaultDesktopItems,
  gridSize = 80,
  padding = 16
}: DesktopProps) {
  const [selectedItems, setSelectedItems] = React.useState<Set<string>>(
    new Set()
  );
  const [dragStart, setDragStart] = React.useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectionBox, setSelectionBox] = React.useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const desktopRef = React.useRef<HTMLDivElement>(null);
  const { openWindow } = useWindowManager();

  // Handle desktop click to clear selection
  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedItems(new Set());
    }
  };

  // Handle item click
  const handleItemClick = (e: React.MouseEvent, item: DesktopItem) => {
    e.stopPropagation();

    if (e.ctrlKey || e.metaKey) {
      // Multi-select
      const newSelection = new Set(selectedItems);
      if (newSelection.has(item.id)) {
        newSelection.delete(item.id);
      } else {
        newSelection.add(item.id);
      }
      setSelectedItems(newSelection);
    } else {
      // Single select
      setSelectedItems(new Set([item.id]));
    }
  };

  // Handle item double click
  const handleItemDoubleClick = (item: DesktopItem) => {
    if (item.href) {
      window.open(item.href, "_blank", "noopener,noreferrer");
    } else if (item.id === "this-pc") {
      openWindow({
        type: "file-explorer",
        title: "This PC",
        props: { initialPath: "This PC" }
      });
    } else {
      alert(`Opening ${item.name}...`);
    }
  };

  // Handle drag selection start
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      const rect = desktopRef.current?.getBoundingClientRect();
      if (rect) {
        setDragStart({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
        setSelectedItems(new Set());
      }
    }
  };

  // Handle drag selection
  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (!dragStart || !desktopRef.current) return;

      const rect = desktopRef.current.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      const x = Math.min(dragStart.x, currentX);
      const y = Math.min(dragStart.y, currentY);
      const width = Math.abs(currentX - dragStart.x);
      const height = Math.abs(currentY - dragStart.y);

      setSelectionBox({ x, y, width, height });

      // Select items within selection box
      const newSelection = new Set<string>();
      items.forEach((item) => {
        const itemX = item.x * gridSize + padding;
        const itemY = item.y * gridSize + padding;
        const itemRight = itemX + gridSize;
        const itemBottom = itemY + gridSize;

        if (
          x < itemRight &&
          x + width > itemX &&
          y < itemBottom &&
          y + height > itemY
        ) {
          newSelection.add(item.id);
        }
      });
      setSelectedItems(newSelection);
    },
    [dragStart, items, gridSize, padding]
  );

  // Handle drag selection end
  const handleMouseUp = React.useCallback(() => {
    setDragStart(null);
    setSelectionBox(null);
  }, []);

  // Set up mouse event listeners
  React.useEffect(() => {
    if (dragStart) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragStart, handleMouseMove, handleMouseUp]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Delete" && selectedItems.size > 0) {
      alert(`Moving ${selectedItems.size} item(s) to Recycle Bin...`);
      setSelectedItems(new Set());
    } else if (e.key === "Escape") {
      setSelectedItems(new Set());
    } else if (e.key === "a" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setSelectedItems(new Set(items.map((item) => item.id)));
    }
  };

  return (
    <TooltipProvider delayDuration={500}>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            ref={desktopRef}
            className={cn(
              "relative w-full h-full min-h-screen",
              "pb-20", // Offset for taskbar
              "overflow-hidden",
              "cursor-default select-none"
            )}
            onClick={handleDesktopClick}
            onMouseDown={handleMouseDown}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="main"
            aria-label="Desktop"
          >
            {/* Desktop items */}
            {items.map((item) => (
              <DesktopIcon
                key={item.id}
                item={item}
                gridSize={gridSize}
                padding={padding}
                selected={selectedItems.has(item.id)}
                onClick={(e) => handleItemClick(e, item)}
                onDoubleClick={() => handleItemDoubleClick(item)}
              />
            ))}

            {/* Selection box */}
            {selectionBox && (
              <div
                className="absolute border border-blue-500/60 bg-blue-500/10 pointer-events-none"
                style={{
                  left: selectionBox.x,
                  top: selectionBox.y,
                  width: selectionBox.width,
                  height: selectionBox.height
                }}
              />
            )}
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent className="w-52 p-2 bg-background/30 backdrop-blur-2xl border border-border shadow-lg">
          <ContextMenuItem asChild>
            <Button variant="ghost" className="w-full justify-start p-0">
              <Settings className="size-4 mr-2" />
              View
            </Button>
          </ContextMenuItem>
          <ContextMenuItem asChild>
            <Button variant="ghost" className="w-full justify-start p-0">
              <Archive className="size-4 mr-2" />
              Sort by
            </Button>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem asChild>
            <Button variant="ghost" className="w-full justify-start p-0">
              <Folder className="size-4 mr-2" />
              New folder
            </Button>
          </ContextMenuItem>
          <ContextMenuItem asChild>
            <Button variant="ghost" className="w-full justify-start p-0">
              <FileText className="size-4 mr-2" />
              New document
            </Button>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem asChild>
            <Button variant="ghost" className="w-full justify-start p-0">
              <ClipboardPaste className="size-4 mr-2" />
              Paste
            </Button>
          </ContextMenuItem>
          <ContextMenuItem asChild>
            <Button variant="ghost" className="w-full justify-start p-0">
              <RefreshCw className="size-4 mr-2" />
              Refresh
            </Button>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem asChild>
            <Button variant="ghost" className="w-full justify-start p-0">
              <Settings className="size-4 mr-2" />
              Display settings
            </Button>
          </ContextMenuItem>
          <ContextMenuItem asChild>
            <Button variant={"ghost"} className="w-full justify-start p-0">
              <BrushIcon className="size-4 mr-2" />
              Personalize
            </Button>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </TooltipProvider>
  );
}

type DesktopIconProps = {
  item: DesktopItem;
  gridSize: number;
  padding: number;
  selected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDoubleClick: () => void;
};

const DesktopIcon = React.memo(
  ({
    item,
    gridSize,
    padding,
    selected,
    onClick,
    onDoubleClick
  }: DesktopIconProps) => {
    const [isPressed, setIsPressed] = React.useState(false);

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            className={cn(
              "absolute flex flex-col items-center justify-center gap-1",
              "p-2 rounded-lg transition-colors",
              "text-white/90 hover:text-white",
              "focus:outline-none focus:ring-none",
              selected && "bg-blue-500/10 ring-1 ring-blue-400/10"
            )}
            style={{
              left: item.x * gridSize + padding,
              top: item.y * gridSize + padding,
              width: gridSize - 8,
              height: gridSize - 8
            }}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => setIsPressed(false)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            animate={{
              scale: isPressed ? 0.95 : 1
            }}
            transition={{ duration: 0.1 }}
          >
            <div className="flex items-center justify-center">{item.icon}</div>
            <span
              className="text-xs text-center leading-tight max-w-full truncate px-1 py-0.5 rounded bg-black/20 backdrop-blur-sm"
              style={{
                textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                fontSize: "11px"
              }}
            >
              {item.name}
            </span>
          </motion.button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="px-2 py-1 text-xs bg-background/50 text-foreground"
        >
          <div className="flex flex-col items-center gap-0.5">
            <span className="font-medium">{item.name}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }
);

DesktopIcon.displayName = "DesktopIcon";

export default Desktop;
