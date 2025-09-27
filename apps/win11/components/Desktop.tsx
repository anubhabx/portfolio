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
import { Button } from "@workspace/ui/components/button";
import { useWindowManager } from "./WindowManager";
import { getDesktopItems, type DesktopItem } from "../data/applications";

export type DesktopProps = {
  items?: DesktopItem[];
  gridSize?: number;
  padding?: number;
};

export function Desktop({
  items = getDesktopItems(),
  gridSize = 80,
  padding = 16
}: DesktopProps) {
  const [selectedItems, setSelectedItems] = React.useState<Set<string>>(
    new Set()
  );
  const { openWindow } = useWindowManager();

  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedItems(new Set());
    }
  };

  const handleItemClick = (e: React.MouseEvent, item: DesktopItem) => {
    e.stopPropagation();
    setSelectedItems(new Set([item.id]));
  };

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

  return (
    <TooltipProvider delayDuration={500}>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className={cn(
              "relative w-full h-full min-h-screen",
              "pb-20", // Space for taskbar
              "overflow-hidden cursor-default select-none"
            )}
            onClick={handleDesktopClick}
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
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent className="w-48">
          <ContextMenuItem>
            <Button variant="ghost" className="w-full justify-start p-0 h-auto">
              Refresh
            </Button>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <Button variant="ghost" className="w-full justify-start p-0 h-auto">
              Display settings
            </Button>
          </ContextMenuItem>
          <ContextMenuItem>
            <Button variant="ghost" className="w-full justify-start p-0 h-auto">
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
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            className={cn(
              "absolute flex flex-col items-center justify-center gap-1 p-2 rounded-lg",
              "text-white/90 hover:text-white transition-colors",
              "focus:outline-none",
              selected && "bg-blue-500/20 ring-1 ring-blue-400/50"
            )}
            style={{
              left: item.desktopPosition.x * gridSize + padding,
              top: item.desktopPosition.y * gridSize + padding,
              width: gridSize - 8,
              height: gridSize - 8
            }}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center justify-center mb-1">
              {item.icon}
            </div>
            <span
              className="text-xs text-center leading-tight max-w-full truncate px-1 py-0.5 rounded bg-black/30 backdrop-blur-sm"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
            >
              {item.name}
            </span>
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {item.name}
        </TooltipContent>
      </Tooltip>
    );
  }
);

DesktopIcon.displayName = "DesktopIcon";

export default Desktop;
