"use client";

import * as React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Separator } from "@workspace/ui/components/separator";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Home,
  Search,
  Grid3X3,
  List,
  Monitor,
  Folder,
  Download
} from "lucide-react";
import { ExplorerIcon, FolderIcon } from "@/components/Icons";
import Window from "@/components/Window";
import { type FileSystemItem } from "@/types";
import { APP_REGISTRY } from "@/lib/app-registry";

export type FileExplorerProps = {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  onFocus?: () => void;
  windowId?: string;
  zIndex?: number;
  isFocused?: boolean;
  initialPath?: string;
};

// Helper to get This PC items
const getThisPCItems = (): FileSystemItem[] => {
  return ["documents", "downloads", "desktop-folder"].map((id) => {
    const app = APP_REGISTRY[id];
    return {
      id,
      name: app?.name || id,
      type: "folder" as const,
      icon: app?.icon || <FolderIcon className="size-6" />,
      path: `/${app?.name || id}`,
      dateModified: new Date(2024, 0, 15)
    };
  });
};

// Helper to get Desktop folder items
const getDesktopFolderItems = (): FileSystemItem[] => {
  // Return empty array or add desktop-specific items here
  return [];
};

export function FileExplorer({
  isOpen,
  onClose,
  onMinimize,
  onFocus,
  windowId,
  zIndex,
  isFocused,
  initialPath = "This PC"
}: FileExplorerProps) {
  const [currentPath, setCurrentPath] = React.useState(initialPath);
  const [navigationHistory, setNavigationHistory] = React.useState<string[]>([
    initialPath
  ]);
  const [historyIndex, setHistoryIndex] = React.useState(0);
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [selectedItems, setSelectedItems] = React.useState<Set<string>>(
    new Set()
  );
  const [searchQuery, setSearchQuery] = React.useState("");

  const getCurrentItems = (): FileSystemItem[] => {
    if (currentPath === "This PC") {
      return getThisPCItems();
    } else if (currentPath === "/Desktop") {
      return getDesktopFolderItems();
    }
    return [];
  };

  const filteredItems = getCurrentItems().filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    const newHistory = navigationHistory.slice(0, historyIndex + 1);
    newHistory.push(path);
    setNavigationHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setSelectedItems(new Set());
  };

  const navigateBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const newPath = navigationHistory[newIndex];
      if (newPath) {
        setHistoryIndex(newIndex);
        setCurrentPath(newPath);
        setSelectedItems(new Set());
      }
    }
  };

  const navigateForward = () => {
    if (historyIndex < navigationHistory.length - 1) {
      const newIndex = historyIndex + 1;
      const newPath = navigationHistory[newIndex];
      if (newPath) {
        setHistoryIndex(newIndex);
        setCurrentPath(newPath);
        setSelectedItems(new Set());
      }
    }
  };

  const navigateUp = () => {
    if (currentPath !== "This PC") {
      navigateTo("This PC");
    }
  };

  const handleItemClick = (item: FileSystemItem, isDoubleClick = false) => {
    if (isDoubleClick) {
      if (item.type === "folder" && item.path) {
        navigateTo(item.path);
      }
    } else {
      setSelectedItems(new Set([item.id]));
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <Window
      title="File Explorer"
      icon={<ExplorerIcon className="size-4" />}
      isOpen={isOpen}
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
      windowId={windowId}
      zIndex={zIndex}
      isFocused={isFocused}
      className="min-w-[800px] min-h-[500px]"
    >
      <div className="flex flex-col h-full">
        {/* Toolbar */}
        <div className="flex items-center gap-2 p-2 bg-background/30 border-b border-white/10">
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={navigateBack}
              disabled={historyIndex === 0}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={navigateForward}
              disabled={historyIndex >= navigationHistory.length - 1}
            >
              <ChevronRight className="size-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={navigateUp}
              disabled={currentPath === "This PC"}
            >
              <ChevronUp className="size-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Address Bar */}
          <div className="flex-1 flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-background/50 rounded border border-border/50 flex-1">
              <Home className="size-4 text-muted-foreground" />
              <span className="text-sm">{currentPath}</span>
            </div>

            <div className="flex items-center gap-1 px-2 py-1 bg-background/50 rounded border border-border/50 w-64">
              <Search className="size-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="border-none bg-transparent! px-0 py-0 h-auto focus-visible:ring-0 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? (
              <List className="size-4" />
            ) : (
              <Grid3X3 className="size-4" />
            )}
          </Button>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 border-r border-white/10 p-2">
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start h-8"
                onClick={() => navigateTo("/Desktop")}
              >
                <Monitor className="size-4 mr-2" />
                Desktop
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start h-8"
                onClick={() => navigateTo("/Documents")}
              >
                <Folder className="size-4 mr-2" />
                Documents
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start h-8"
                onClick={() => navigateTo("/Downloads")}
              >
                <Download className="size-4 mr-2" />
                Downloads
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-4">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-6 gap-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex flex-col items-center p-3 rounded-lg cursor-pointer text-center",
                      "hover:bg-foreground/5 transition-colors",
                      selectedItems.has(item.id) &&
                        "bg-blue-500/20 ring-1 ring-blue-400/50"
                    )}
                    onClick={() => handleItemClick(item)}
                    onDoubleClick={() => handleItemClick(item, true)}
                  >
                    <div className="mb-2">{item.icon}</div>
                    <span className="text-sm break-words line-clamp-2">
                      {item.name}
                    </span>
                    {item.size && (
                      <span className="text-xs text-muted-foreground mt-1">
                        {formatFileSize(item.size)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {/* List Header */}
                <div className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground border-b border-white/10">
                  <div className="flex-1">Name</div>
                  <div className="w-32 text-right">Date modified</div>
                  <div className="w-20 text-right">Type</div>
                  <div className="w-20 text-right">Size</div>
                </div>

                {/* List Items */}
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center px-3 py-2 rounded cursor-pointer",
                      "hover:bg-foreground/5 transition-colors",
                      selectedItems.has(item.id) && "bg-blue-500/20"
                    )}
                    onClick={() => handleItemClick(item)}
                    onDoubleClick={() => handleItemClick(item, true)}
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <div className="mr-3 flex-shrink-0">{item.icon}</div>
                      <span className="text-sm truncate">{item.name}</span>
                    </div>
                    <div className="w-32 text-right text-sm text-muted-foreground">
                      {formatDate(item.dateModified)}
                    </div>
                    <div className="w-20 text-right text-sm text-muted-foreground capitalize">
                      {item.type}
                    </div>
                    <div className="w-20 text-right text-sm text-muted-foreground">
                      {formatFileSize(item.size)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 py-2 text-sm text-muted-foreground border-t border-white/10 bg-background/20">
          <span>{filteredItems.length} items</span>
          {selectedItems.size > 0 && <span>{selectedItems.size} selected</span>}
        </div>
      </div>
    </Window>
  );
}

export default FileExplorer;
