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
  onFocus?: () => void;
  className?: string;
  initialWidth?: number;
  initialHeight?: number;
  initialX?: number;
  initialY?: number;
  maximizable?: boolean;
  minimizable?: boolean;
  zIndex?: number;
  isFocused?: boolean;
  windowId?: string; // For persistence key
};

interface WindowState {
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMaximized: boolean;
}

export function Window({
  title,
  icon,
  children,
  isOpen,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  className,
  initialWidth = 480,
  initialHeight = 300,
  initialX = 100,
  initialY = 50,
  maximizable = true,
  minimizable = true,
  zIndex = 49,
  isFocused = false,
  windowId
}: WindowProps) {
  const TASKBAR_HEIGHT = 48;
  const persistenceKey = windowId ? `window-state-${windowId}` : null;

  // Load saved state or use defaults
  const [windowState, setWindowState] = React.useState<WindowState>(() => {
    if (persistenceKey) {
      const saved = localStorage.getItem(persistenceKey);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse window state:", e);
        }
      }
    }
    return {
      position: { x: initialX, y: initialY },
      size: { width: initialWidth, height: initialHeight },
      isMaximized: false
    };
  });

  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });

  // Save state to localStorage whenever it changes
  React.useEffect(() => {
    if (persistenceKey) {
      localStorage.setItem(persistenceKey, JSON.stringify(windowState));
    }
  }, [windowState, persistenceKey]);

  // Handle window focus on click
  const handleWindowClick = () => {
    if (!isFocused) {
      onFocus?.();
    }
  };

  // Handle window dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (windowState.isMaximized) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - windowState.position.x,
      y: e.clientY - windowState.position.y
    });
    onFocus?.(); // Focus when dragging starts
  };

  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (isDragging && !windowState.isMaximized) {
        setWindowState((prev) => ({
          ...prev,
          position: {
            x: e.clientX - dragStart.x,
            y: Math.max(0, e.clientY - dragStart.y)
          }
        }));
      }
    },
    [isDragging, dragStart, windowState.isMaximized]
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
    setWindowState((prev) => ({
      ...prev,
      isMaximized: !prev.isMaximized
    }));
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
      onClick={handleWindowClick}
      className={cn(
        "fixed flex flex-col",
        "bg-background/40 backdrop-blur-xl",
        "border rounded-lg shadow-2xl",
        "overflow-hidden",
        "user-select-none transition-all",
        windowState.isMaximized && "!top-0 !left-0 rounded-none",
        isFocused ? "border-blue-500/10" : "border-border/50",
        className
      )}
      style={{
        zIndex,
        left: windowState.isMaximized ? 0 : windowState.position.x,
        top: windowState.isMaximized ? 0 : windowState.position.y,
        width: windowState.isMaximized ? "100vw" : windowState.size.width,
        height: windowState.isMaximized
          ? `calc(100vh - ${TASKBAR_HEIGHT}px)`
          : windowState.size.height
      }}
    >
      {/* Title Bar */}
      <div
        className={cn(
          "flex items-center h-8 pl-4 pr-1 py-2",
          "bg-background/50 border-b border-border/30",
          "cursor-move select-none",
          isFocused ? "bg-black/50" : ""
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
              {windowState.isMaximized ? (
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
