"use client";

import * as React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Separator } from "@workspace/ui/components/separator";
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
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Home,
  Search,
  MoreHorizontal,
  RefreshCw,
  FolderPlus,
  Upload,
  Download,
  Copy,
  Scissors,
  Trash2,
  Grid3X3,
  List,
  Monitor,
  HardDrive,
  Folder,
  FileText,
  Image,
  Music,
  Video,
  Archive,
  Usb,
  Wifi
} from "lucide-react";
import { ExplorerIcon, FolderIcon } from "./Icons";
import Window from "./Window";
import {
  getThisPCItems,
  getDesktopFolderItems,
  type FileSystemItem
} from "@/data/applications";

export type FileExplorerProps = {
  isOpen: boolean;
  onClose: () => void;
  initialPath?: string;
};

export function FileExplorer({
  isOpen,
  onClose,
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
      return getThisPCItems().map((item) => ({
        ...item,
        dateModified: item.dateModified ?? new Date()
      }));
    } else if (currentPath === "/Desktop") {
      return getDesktopFolderItems().map((item) => ({
        ...item,
        dateModified: item.dateModified ?? new Date()
      }));
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
      setSelectedItems(new Set());
    }
  };

  const navigateUp = () => {
    if (currentPath !== "This PC") {
      navigateTo("This PC");
    }
  };

  const handleItemClick = (item: FileSystemItem, isDoubleClick = false) => {
    if (isDoubleClick) {
      if (item.type === "folder" || item.type === "drive") {
        navigateTo(item.path || "/");
      }
    } else {
      setSelectedItems(new Set([item.id]));
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const units = ["B", "KB", "MB", "GB", "TB"];
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

  return (
    <Window
      title="File Explorer"
      icon={<ExplorerIcon className="size-4" />}
      isOpen={isOpen}
      onClose={onClose}
      className="min-w-[800px] min-h-[400px]"
    >
      <div className="flex flex-col h-full">
        {/* Toolbar */}
        <div className="flex items-center gap-2 p-2 bg-background/30 border-b border-t border-white/10">
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
            <div className="flex items-center gap-1 px-2 py-2 bg-background/50 rounded border border-border/50 flex-1">
              <Home className="size-4 text-muted-foreground" />
              <span className="text-xs">{currentPath}</span>
            </div>

            <div className="flex items-center gap-1 px-2 py-2 bg-background/50 rounded border border-border/50 w-64">
              <Search className="size-4 text-muted-foreground" />
              <Input
                placeholder="Search This PC"
                className="border-none bg-transparent! px-0 py-0 h-auto focus-visible:ring-0 text-xs placeholder:text-muted-foreground placeholder:text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center gap-1">
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
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="size-4" />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 border-r border-white/10">
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start h-8 px-2"
                onClick={() => navigateTo("/Desktop")}
              >
                <Monitor className="size-4 mr-2" />
                Desktop
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start h-8 px-2"
                onClick={() => navigateTo("/Documents")}
              >
                <Folder className="size-4 mr-2 text-blue-500" />
                Documents
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start h-8 px-2"
                onClick={() => navigateTo("/Downloads")}
              >
                <Download className="size-4 mr-2 text-green-500" />
                Downloads
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-4">
            {viewMode === "grid" ? (
              <div
                className="grid grid-cols-auto-fit gap-4"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))"
                }}
              >
                {filteredItems.map((item) => (
                  <ContextMenu key={item.id}>
                    <ContextMenuTrigger asChild>
                      <div
                        className={cn(
                          "flex flex-col items-center p-3 rounded-lg cursor-pointer",
                          "hover:bg-foreground/5 transition-colors",
                          selectedItems.has(item.id) &&
                            "bg-blue-500/20 ring-1 ring-blue-400/50"
                        )}
                        onClick={() => handleItemClick(item)}
                        onDoubleClick={() => handleItemClick(item, true)}
                      >
                        <div className="mb-2">{item.icon}</div>
                        <span className="text-sm text-center break-words">
                          {item.name}
                        </span>
                        {item.size && (
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(item.size)}
                          </span>
                        )}
                      </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem>Open</ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem>Cut</ContextMenuItem>
                      <ContextMenuItem>Copy</ContextMenuItem>
                      <ContextMenuItem>Paste</ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem>Delete</ContextMenuItem>
                      <ContextMenuItem>Properties</ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {/* List Header */}
                <div className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground border-b border-white/10">
                  <div className="flex-1">Name</div>
                  <div className="w-24 text-right">Date modified</div>
                  <div className="w-20 text-right">Type</div>
                  <div className="w-16 text-right">Size</div>
                </div>

                {/* List Items */}
                {filteredItems.map((item) => (
                  <ContextMenu key={item.id}>
                    <ContextMenuTrigger asChild>
                      <div
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
                        <div className="w-24 text-right text-sm text-muted-foreground">
                          {formatDate(item.dateModified)}
                        </div>
                        <div className="w-20 text-right text-sm text-muted-foreground capitalize">
                          {item.type}
                        </div>
                        <div className="w-16 text-right text-sm text-muted-foreground">
                          {formatFileSize(item.size)}
                        </div>
                      </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem>Open</ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem>Cut</ContextMenuItem>
                      <ContextMenuItem>Copy</ContextMenuItem>
                      <ContextMenuItem>Paste</ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem>Delete</ContextMenuItem>
                      <ContextMenuItem>Properties</ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 py-1 text-xs text-muted-foreground border-t border-white/10 bg-background/20">
          <span>{filteredItems.length} items</span>
          {selectedItems.size > 0 && (
            <span>{selectedItems.size} item(s) selected</span>
          )}
        </div>
      </div>
    </Window>
  );
}

export default FileExplorer;
