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
  isMinimized?: boolean;
  windowId?: string; // For persistence key
};

interface WindowState {
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMaximized: boolean;
  snapZone?: "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "maximize" | null;
}

type SnapZone = "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "maximize" | null;

interface SnapPreview {
  zone: SnapZone;
  bounds: { x: number; y: number; width: number; height: number };
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
  isMinimized = false,
  windowId
}: WindowProps) {
  const TASKBAR_HEIGHT = 48;
  const SNAP_THRESHOLD = 10; // pixels from edge to trigger snap
  const persistenceKey = windowId ? `window-state-${windowId}` : null;

  const [snapPreview, setSnapPreview] = React.useState<SnapPreview | null>(null);

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
      isMaximized: false,
      snapZone: null
    };
  });

  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });

  // Calculate snap zone based on mouse position
  const getSnapZone = React.useCallback((x: number, y: number): SnapZone => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight - TASKBAR_HEIGHT;
    const cornerSize = 200; // Size of corner zones

    // Top edge - check corners first, then maximize
    if (y < SNAP_THRESHOLD) {
      if (x < cornerSize) return "top-left";
      if (x > screenWidth - cornerSize) return "top-right";
      // Top edge (not corners) will trigger maximize
      return "maximize" as SnapZone;
    }

    // Left edge
    if (x < SNAP_THRESHOLD) {
      if (y < cornerSize) return "top-left";
      if (y > screenHeight - cornerSize) return "bottom-left";
      return "left";
    }

    // Right edge
    if (x > screenWidth - SNAP_THRESHOLD) {
      if (y < cornerSize) return "top-right";
      if (y > screenHeight - cornerSize) return "bottom-right";
      return "right";
    }

    return null;
  }, [SNAP_THRESHOLD, TASKBAR_HEIGHT]);

  // Get snap zone bounds
  const getSnapBounds = React.useCallback((zone: SnapZone) => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight - TASKBAR_HEIGHT;
    const halfWidth = screenWidth / 2;
    const halfHeight = screenHeight / 2;

    switch (zone) {
      case "maximize":
        return { x: 0, y: 0, width: screenWidth, height: screenHeight };
      case "left":
        return { x: 0, y: 0, width: halfWidth, height: screenHeight };
      case "right":
        return { x: halfWidth, y: 0, width: halfWidth, height: screenHeight };
      case "top-left":
        return { x: 0, y: 0, width: halfWidth, height: halfHeight };
      case "top-right":
        return { x: halfWidth, y: 0, width: halfWidth, height: halfHeight };
      case "bottom-left":
        return { x: 0, y: halfHeight, width: halfWidth, height: halfHeight };
      case "bottom-right":
        return { x: halfWidth, y: halfHeight, width: halfWidth, height: halfHeight };
      default:
        return null;
    }
  }, [TASKBAR_HEIGHT]);

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
    // Don't start dragging if clicking on a button
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }
    
    onFocus?.(); // Focus when dragging starts
    
    // If window is maximized, restore it to normal size on drag
    if (windowState.isMaximized) {
      // Calculate where the window should be positioned when restored
      // Position it under the mouse cursor proportionally
      const restoreWidth = initialWidth;
      const restoreHeight = initialHeight;
      const mouseXPercent = e.clientX / window.innerWidth;
      
      setWindowState((prev) => ({
        ...prev,
        isMaximized: false,
        size: { width: restoreWidth, height: restoreHeight },
        position: {
          x: e.clientX - restoreWidth * mouseXPercent,
          y: Math.max(0, e.clientY - 16) // 16px is half of title bar height
        }
      }));
      
      // Start dragging from the new position
      setDragStart({
        x: restoreWidth * mouseXPercent,
        y: 16
      });
      setIsDragging(true);
      return;
    }
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - windowState.position.x,
      y: e.clientY - windowState.position.y
    });
  };

  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (isDragging && !windowState.isMaximized) {
        // Update window position
        setWindowState((prev) => ({
          ...prev,
          position: {
            x: e.clientX - dragStart.x,
            y: Math.max(0, e.clientY - dragStart.y)
          }
        }));

        // Check for snap zones
        const zone = getSnapZone(e.clientX, e.clientY);
        if (zone) {
          const bounds = getSnapBounds(zone);
          if (bounds) {
            setSnapPreview({ zone, bounds });
          }
        } else {
          setSnapPreview(null);
        }
      }
    },
    [isDragging, dragStart, windowState.isMaximized, getSnapZone, getSnapBounds]
  );

  const handleMouseUp = React.useCallback(() => {
    if (isDragging) {
      // Apply snap if preview is active
      if (snapPreview) {
        // Handle maximize zone specially
        if (snapPreview.zone === "maximize") {
          setWindowState((prev) => ({
            ...prev,
            isMaximized: true,
            snapZone: null
          }));
        } else {
          setWindowState((prev) => ({
            ...prev,
            position: { x: snapPreview.bounds.x, y: snapPreview.bounds.y },
            size: { width: snapPreview.bounds.width, height: snapPreview.bounds.height },
            isMaximized: false,
            snapZone: snapPreview.zone
          }));
        }
        setSnapPreview(null);
      }
      setIsDragging(false);
    }
  }, [isDragging, snapPreview]);

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

  // Don't render minimized windows (they're just in taskbar)
  if (isMinimized) return null;

  return (
    <>
      {/* Snap Preview Overlay */}
      {snapPreview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed z-[48] pointer-events-none"
          style={{
            left: snapPreview.bounds.x,
            top: snapPreview.bounds.y,
            width: snapPreview.bounds.width,
            height: snapPreview.bounds.height,
            border: "3px solid rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)"
          }}
        />
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0,
          transition: {
            duration: 0.2,
            ease: [0.4, 0, 0.2, 1]
          }
        }}
        exit={{ 
          opacity: 0, 
          scale: 0.95, 
          y: 10,
          transition: {
            duration: 0.15,
            ease: [0.4, 0, 1, 1]
          }
        }}
        onClick={handleWindowClick}
        className={cn(
          "fixed flex flex-col",
          "bg-background/40 backdrop-blur-xl",
          "border rounded-lg shadow-2xl",
          "overflow-hidden",
          "user-select-none",
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
        whileHover={{ 
          boxShadow: isFocused ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)" : undefined 
        }}
        transition={{
          layout: { duration: 0.2 }
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
              onMouseDown={(e) => {
                e.stopPropagation(); // Prevent drag handler
              }}
              onClick={(e) => {
                e.stopPropagation();
                onMinimize?.();
              }}
            >
              <VscChromeMinimize className="size-3" />
            </Button>
          )}

          {maximizable && (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-8 p-0 rounded-none hover:bg-foreground/20! transition-colors delay-0 duration-75"
              onMouseDown={(e) => {
                e.stopPropagation(); // Prevent drag handler
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleMaximize();
              }}
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
            onMouseDown={(e) => {
              e.stopPropagation(); // Prevent drag handler
            }}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <VscChromeClose className="size-3" />
          </Button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </motion.div>
    </>
  );
}

export default Window;
