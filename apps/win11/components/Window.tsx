"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";

import {
  VscChromeClose,
  VscChromeMaximize,
  VscChromeMinimize,
  VscChromeRestore
} from "react-icons/vsc";

export type WindowProps = {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  className?: string;
  initialWidth?: number;
  initialHeight?: number;
  initialX?: number;
  initialY?: number;
  maximizable?: boolean;
  minimizable?: boolean;
};

export function Window({
  title,
  icon,
  children,
  isOpen,
  onClose,
  onMinimize,
  onMaximize,
  className,
  initialWidth = 480,
  initialHeight = 300,
  initialX = 100,
  initialY = 50,
  maximizable = true,
  minimizable = true
}: WindowProps) {
  const [isMaximized, setIsMaximized] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [position, setPosition] = React.useState({ x: initialX, y: initialY });
  const [size] = React.useState({
    width: initialWidth,
    height: initialHeight
  });

  // Taskbar height - adjust this to match your taskbar
  const TASKBAR_HEIGHT = 48;

  // Handle window dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (isDragging && !isMaximized) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: Math.max(0, e.clientY - dragStart.y)
        });
      }
    },
    [isDragging, dragStart, isMaximized]
  );

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Handle maximize/restore
  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    onMaximize?.();
  };

  // Handle double-click to maximize
  const handleDoubleClick = () => {
    if (maximizable) {
      handleMaximize();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "fixed z-[49] flex flex-col",
        "bg-background/50 backdrop-blur-xl",
        "border border-border/50 rounded-lg shadow-2xl",
        "overflow-hidden",
        "user-select-none",
        isMaximized && "!top-0 !left-0 rounded-none",
        className
      )}
      style={{
        left: isMaximized ? 0 : position.x,
        top: isMaximized ? 0 : position.y,
        width: isMaximized ? "100vw" : size.width,
        height: isMaximized ? `calc(100vh - ${TASKBAR_HEIGHT}px)` : size.height
      }}
    >
      {/* Title Bar */}
      <div
        className={cn(
          "flex items-center h-8 pl-4 pr-1 py-2",
          "bg-background/50 border-b border-border/30",
          "cursor-move select-none"
        )}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <span className="text-sm font-medium truncate">{title}</span>
        </div>

        <div className="flex items-center">
          {minimizable && (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-8 p-0 rounded-none hover:bg-foreground/20! transition-colors delay-0 duration-75"
              onClick={onMinimize}
            >
              <VscChromeMinimize className="size-3" />
            </Button>
          )}

          {maximizable && (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-8 p-0 rounded-none hover:bg-foreground/20! transition-colors delay-0 duration-75"
              onClick={handleMaximize}
            >
              {isMaximized ? (
                <VscChromeRestore className="size-3" />
              ) : (
                <VscChromeMaximize className="size-3" />
              )}
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-8 p-0 rounded-none hover:bg-red-500! hover:text-white transition-colors delay-0 duration-75"
            onClick={onClose}
          >
            <VscChromeClose className="size-3" />
          </Button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </motion.div>
  );
}

export default Window;
