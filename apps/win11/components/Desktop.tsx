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
import { useDesktop } from "@/contexts/DesktopContext";
import { useTaskbar } from "@/contexts/TaskbarContext";
import { getAppMetadata, launchApp, getAppIcon } from "@/lib/app-registry";
import type { DesktopItem } from "@/types";

export interface DesktopProps {
  gridSize?: number;
  padding?: number;
}

export function Desktop({ gridSize = 80, padding = 16 }: DesktopProps) {
  const [selectedItems, setSelectedItems] = React.useState<Set<string>>(
    new Set()
  );
  const { openWindow } = useWindowManager();
  const { items, removeItem } = useDesktop();
  const { pinApp, isAppPinned } = useTaskbar();

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
    launchApp(item.id, openWindow);
  };

  const handlePinToTaskbar = (item: DesktopItem) => {
    if (!isAppPinned(item.id)) {
      pinApp({
        id: item.id,
        name: item.name,
        type: item.type,
        windowType: item.windowType,
        href: item.href,
        metadata: item.metadata
      });
    }
  };

  const handleRemoveFromDesktop = (item: DesktopItem) => {
    removeItem(item.id);
    setSelectedItems(new Set());
  };

  return (
    <TooltipProvider delayDuration={500}>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className={cn(
              "relative w-full h-full min-h-screen",
              "pb-20",
              "overflow-hidden cursor-default select-none"
            )}
            onClick={handleDesktopClick}
            role="main"
            aria-label="Desktop"
          >
            {/* Desktop items */}
            {items.map((item) => {
              return (
                <DesktopIcon
                  key={item.id}
                  item={item}
                  icon={getAppIcon(item.id, "size-10")}
                  gridSize={gridSize}
                  padding={padding}
                  selected={selectedItems.has(item.id)}
                  onClick={(e) => handleItemClick(e, item)}
                  onDoubleClick={() => handleItemDoubleClick(item)}
                  onPinToTaskbar={() => handlePinToTaskbar(item)}
                  onRemove={() => handleRemoveFromDesktop(item)}
                  isPinned={isAppPinned(item.id)}
                />
              );
            })}
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
  icon?: React.ReactNode;
  gridSize: number;
  padding: number;
  selected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDoubleClick: () => void;
  onPinToTaskbar: () => void;
  onRemove: () => void;
  isPinned: boolean;
};

const DesktopIcon = React.memo(
  ({
    item,
    icon,
    gridSize,
    padding,
    selected,
    onClick,
    onDoubleClick,
    onPinToTaskbar,
    onRemove,
    isPinned
  }: DesktopIconProps) => {
    return (
      <ContextMenu>
        <ContextMenuTrigger asChild>
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
                  left: item.position.x * gridSize + padding,
                  top: item.position.y * gridSize + padding,
                  width: gridSize - 8,
                  height: gridSize - 8
                }}
                onClick={onClick}
                onDoubleClick={onDoubleClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center justify-center mb-1 size-8">
                  {icon}
                </div>
                <span
                  className="text-xs text-center leading-tight max-w-full truncate px-1 py-0.5 rounded backdrop-blur-sm"
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
        </ContextMenuTrigger>

        <ContextMenuContent className="w-48">
          <ContextMenuItem onClick={onDoubleClick}>
            <Button variant="ghost" className="w-full justify-start p-0 h-auto">
              Open
            </Button>
          </ContextMenuItem>
          {!isPinned && (
            <ContextMenuItem onClick={onPinToTaskbar}>
              <Button
                variant="ghost"
                className="w-full justify-start p-0 h-auto"
              >
                Pin to Taskbar
              </Button>
            </ContextMenuItem>
          )}
          <ContextMenuSeparator />
          <ContextMenuItem onClick={onRemove}>
            <Button
              variant="ghost"
              className="w-full justify-start p-0 h-auto text-destructive"
            >
              Remove from Desktop
            </Button>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  }
);

DesktopIcon.displayName = "DesktopIcon";

export default Desktop;
