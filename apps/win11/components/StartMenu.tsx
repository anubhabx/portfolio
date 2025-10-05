"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Search, Power, User } from "lucide-react";
import { useWindowManager } from "@/components/WindowManager";
import { APP_REGISTRY, launchApp, getAppIcon } from "@/lib/app-registry";

interface AppItem {
  id: string;
  name: string;
  icon?: React.ReactNode;
  windowType?: string;
  href?: string;
}

export type StartMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function StartMenu({ isOpen, onClose }: StartMenuProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showAllApps, setShowAllApps] = React.useState(false);
  const { openWindow } = useWindowManager();

  // Convert APP_REGISTRY to array format
  const allApps = React.useMemo(
    () =>
      Object.values(APP_REGISTRY).map((app) => ({
        id: app.id,
        name: app.name,
        icon: app.icon,
        windowType: app.windowType,
        href: app.href
      })),
    []
  );

  // Show apps that should appear in start menu (exclude system folders)
  const pinnedApps = React.useMemo(
    () =>
      allApps.filter(
        (app) => !["documents", "downloads", "desktop-folder"].includes(app.id)
      ),
    [allApps]
  );

  const recentFiles: AppItem[] = []; // Can be populated from recent activity

  const filteredApps = React.useMemo(() => {
    if (!searchQuery) return pinnedApps;
    return allApps.filter((app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, pinnedApps, allApps]);

  const handleAppClick = (app: AppItem) => {
    launchApp(app.id, openWindow);
    onClose();
  };

  // Close on outside click (but not on start button)
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      // Don't close if clicking on the start button - let the Taskbar handle it
      if (target.closest("[aria-label='Start']")) {
        return;
      }

      // Close if clicking outside the start menu
      if (isOpen && !target.closest("[data-start-menu]")) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-start-menu
          className={cn(
            "fixed bottom-14 left-1/2 -translate-x-[50%] z-[51]",
            "w-[640px] h-[640px]",
            "bg-black/30 backdrop-blur-lg",
            "border border-white/10 rounded-lg shadow-2xl",
            "overflow-hidden flex flex-col"
          )}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header - Fixed height */}
          <div className="p-6 pb-4 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Type here to search"
                className="pl-10 bg-white/10 border-white/20 rounded-full text-white text-sm placeholder:text-white/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {/* Content - Flexible with fixed height */}
          <div className="flex-1 px-6 pb-4 overflow-auto min-h-0">
            {searchQuery ? (
              /* Search Results */
              <div className="h-full">
                <h3 className="text-sm font-medium text-white/70 mb-4">
                  Search results
                </h3>
                <div className="grid grid-cols-6 gap-3">
                  {filteredApps.map((app) => (
                    <AppTile
                      key={app.id}
                      app={app}
                      onClick={() => handleAppClick(app)}
                    />
                  ))}
                  {filteredApps.length === 0 && (
                    <div className="col-span-6 text-center text-white/50 py-8">
                      No results found
                    </div>
                  )}
                </div>
              </div>
            ) : showAllApps ? (
              /* All Apps View */
              <div className="h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-white/70">
                    All apps
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/50 hover:text-white h-auto p-1 text-xs"
                    onClick={() => setShowAllApps(false)}
                  >
                    Back
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {allApps.map((app) => (
                    <motion.button
                      key={app.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg",
                        "hover:bg-white/10 transition-colors text-left w-full"
                      )}
                      onClick={() => handleAppClick(app)}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-white/90">
                        {getAppIcon(app.id, "size-6")}
                      </div>
                      <span className="text-sm text-white/90">{app.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              /* Default View */
              <div className="space-y-6 h-full">
                {/* Pinned Apps */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-white/70">
                      Pinned
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/50 hover:text-white h-auto p-1 text-xs"
                      onClick={() => setShowAllApps(true)}
                    >
                      All apps
                    </Button>
                  </div>
                  <div className="grid grid-cols-6 gap-3">
                    {pinnedApps.slice(0, 18).map((app) => (
                      <AppTile
                        key={app.id}
                        app={app}
                        onClick={() => handleAppClick(app)}
                      />
                    ))}
                  </div>
                </div>

                {/* Recommended */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-white/70">
                      Recommended
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/50 hover:text-white h-auto p-1 text-xs"
                    >
                      More
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {recentFiles.map((item) => (
                      <RecentItem
                        key={item.id}
                        item={item}
                        onClick={() => handleAppClick(item)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer - Fixed height */}
          <div className="p-4 border-t border-white/10 flex-shrink-0">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white hover:bg-white/10 flex items-center gap-2 h-10 px-3"
              >
                <User className="size-4" />
                <span className="text-sm">User</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white hover:bg-white/10 size-10 p-0"
                onClick={onClose}
              >
                <Power className="size-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type AppTileProps = {
  app: AppItem;
  onClick: () => void;
};

function AppTile({ app, onClick }: AppTileProps) {
  return (
    <motion.button
      className={cn(
        "flex flex-col items-center p-3 rounded-lg",
        "hover:bg-white/10 transition-colors",
        "text-center group"
      )}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
    >
      <div className="mb-2 text-white/90 group-hover:text-white">
        {getAppIcon(app.id, "size-8")}
      </div>
      <span className="text-xs text-white/70 group-hover:text-white leading-tight line-clamp-2">
        {app.name}
      </span>
    </motion.button>
  );
}

type RecentItemProps = {
  item: AppItem;
  onClick: () => void;
};

function RecentItem({ item, onClick }: RecentItemProps) {
  return (
    <motion.button
      className={cn(
        "flex items-center gap-3 p-2 rounded-lg w-full",
        "hover:bg-white/10 transition-colors text-left"
      )}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
    >
      <div className="text-white/90">{item.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-white/90 truncate">{item.name}</div>
      </div>
    </motion.button>
  );
}

export default StartMenu;
