"use client";

import * as React from "react";
import Window from "@/components/Window";
import { ChromeIcon } from "@/components/Icons";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Lock,
  Search,
  X,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { SimpleSearchPage } from "@/components/SimpleSearchPage";

export type BrowserWindowProps = {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  onFocus?: () => void;
  windowId?: string;
  zIndex?: number;
  isFocused?: boolean;
  isMinimized?: boolean;
  initialUrl?: string;
};

interface Tab {
  id: string;
  url: string;
  title: string;
  isLoading: boolean;
  hasError: boolean;
  isSearchPage?: boolean;
  searchQuery?: string;
}

export function BrowserWindow({
  isOpen,
  onClose,
  onMinimize,
  onFocus,
  windowId,
  zIndex,
  isFocused,
  isMinimized,
  initialUrl = "search:"
}: BrowserWindowProps) {
  const [tabs, setTabs] = React.useState<Tab[]>([
    {
      id: "tab-1",
      url: initialUrl,
      title: "New Tab",
      isLoading: false,
      hasError: false,
      isSearchPage: initialUrl === "search:",
      searchQuery: ""
    }
  ]);
  const [activeTabId, setActiveTabId] = React.useState("tab-1");
  const [urlInput, setUrlInput] = React.useState(initialUrl === "search:" ? "" : initialUrl);
  const [canGoBack, setCanGoBack] = React.useState(false);
  const [canGoForward, setCanGoForward] = React.useState(false);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const loadTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  // Sync URL input with active tab
  React.useEffect(() => {
    if (activeTab) {
      if (activeTab.isSearchPage && activeTab.url.startsWith("search:")) {
        // For search pages, show the search query or empty
        setUrlInput(activeTab.searchQuery || "");
      } else {
        setUrlInput(activeTab.url);
      }
    }
  }, [activeTab]);

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, []);

  const handleNavigate = (url: string) => {
    let finalUrl = url.trim();
    let isSearch = false;
    let searchQuery = "";

    // Add https:// if no protocol specified
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      // Check if it looks like a URL (has a dot and no spaces)
      if (finalUrl.includes(".") && !finalUrl.includes(" ")) {
        finalUrl = `https://${finalUrl}`;
      } else {
        // Treat as search query - use Google Programmable Search Engine
        isSearch = true;
        searchQuery = finalUrl;
        finalUrl = `search:${finalUrl}`; // Special URL format for search
      }
    }

    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabId
          ? {
              ...tab,
              url: finalUrl,
              isLoading: !isSearch,
              hasError: false,
              isSearchPage: isSearch,
              searchQuery: isSearch ? searchQuery : undefined
            }
          : tab
      )
    );
    setUrlInput(finalUrl);

    // Set a timeout to detect if the page fails to load (only for non-search pages)
    if (!isSearch) {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
      loadTimeoutRef.current = setTimeout(() => {
        setTabs((prev) =>
          prev.map((tab) =>
            tab.id === activeTabId && tab.isLoading
              ? { ...tab, isLoading: false, hasError: true }
              : tab
          )
        );
      }, 10000); // 10 second timeout
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNavigate(urlInput);
  };

  const handleRefresh = () => {
    if (activeTab) {
      if (activeTab.isSearchPage) {
        // For search pages, just re-render
        setTabs((prev) =>
          prev.map((tab) =>
            tab.id === activeTabId ? { ...tab } : tab
          )
        );
      } else {
        setTabs((prev) =>
          prev.map((tab) =>
            tab.id === activeTabId
              ? { ...tab, isLoading: true, hasError: false }
              : tab
          )
        );
        if (iframeRef.current && !activeTab.url.startsWith("search:")) {
          iframeRef.current.src = activeTab.url;
        }
      }
    }
  };

  const handleHome = () => {
    // Open a new search page as home
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabId
          ? {
              id: tab.id,
              url: "search:",
              title: "Google Search",
              isLoading: false,
              hasError: false,
              isSearchPage: true,
              searchQuery: ""
            }
          : tab
      )
    );
    setUrlInput("");
  };

  const handleNewTab = () => {
    const newTabId = `tab-${Date.now()}`;
    const newTab: Tab = {
      id: newTabId,
      url: "search:",
      title: "New Tab",
      isLoading: false,
      hasError: false,
      isSearchPage: true,
      searchQuery: ""
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTabId);
  };

  const handleCloseTab = (tabId: string) => {
    if (tabs.length === 1) {
      // If closing the last tab, close the window
      onClose();
      return;
    }

    const tabIndex = tabs.findIndex((t) => t.id === tabId);
    setTabs((prev) => prev.filter((t) => t.id !== tabId));

    // Switch to adjacent tab if closing active tab
    if (tabId === activeTabId) {
      const newActiveTab = tabs[tabIndex === 0 ? 1 : tabIndex - 1];
      if (newActiveTab) {
        setActiveTabId(newActiveTab.id);
      }
    }
  };

  const handleIframeLoad = () => {
    // Clear the timeout since the page loaded successfully
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }

    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabId
          ? { ...tab, isLoading: false, hasError: false }
          : tab
      )
    );

    // Try to get the title from iframe (will fail for cross-origin)
    try {
      const iframeDoc = iframeRef.current?.contentDocument;
      if (iframeDoc?.title) {
        setTabs((prev) =>
          prev.map((tab) =>
            tab.id === activeTabId ? { ...tab, title: iframeDoc.title } : tab
          )
        );
      }
    } catch (e) {
      // Cross-origin, can't access title
      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === activeTabId
            ? { ...tab, title: new URL(tab.url).hostname }
            : tab
        )
      );
    }
  };

  const handleIframeError = () => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }

    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabId
          ? { ...tab, isLoading: false, hasError: true }
          : tab
      )
    );
  };

  const handleOpenInNewTab = () => {
    if (activeTab) {
      window.open(activeTab.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Window
      title="Google Chrome"
      icon={<ChromeIcon className="size-4" />}
      isOpen={isOpen}
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
      windowId={windowId}
      zIndex={zIndex}
      isFocused={isFocused}
      isMinimized={isMinimized}
      className="min-w-[800px] min-h-[600px]"
    >
      <div className="flex flex-col h-full bg-[#202124]">
        {/* Tab Bar */}
        <div className="flex items-center gap-1 px-2 pt-2 bg-[#202124]">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-t-lg cursor-pointer group min-w-[160px] max-w-[240px]",
                tab.id === activeTabId
                  ? "bg-[#292a2d]"
                  : "bg-[#252629] hover:bg-[#2a2b2e]"
              )}
            >
              <ChromeIcon className="size-4 flex-shrink-0" />
              <span className="text-xs text-gray-300 truncate flex-1">
                {tab.title}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="size-5 opacity-0 group-hover:opacity-100 hover:bg-[#3c4043] flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseTab(tab.id);
                }}
              >
                <X className="size-3" />
              </Button>
            </div>
          ))}
          <Button
            variant="ghost"
            size="icon"
            className="size-7 hover:bg-[#3c4043] rounded-full"
            onClick={handleNewTab}
          >
            <span className="text-gray-300 text-lg leading-none">+</span>
          </Button>
        </div>

        {/* Navigation Bar */}
        <div className="flex items-center gap-2 px-3 py-2 bg-[#292a2d] border-b border-[#3c4043]">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 hover:bg-[#3c4043] disabled:opacity-30"
              disabled={!canGoBack}
              onClick={() => iframeRef.current?.contentWindow?.history.back()}
            >
              <ArrowLeft className="size-4 text-gray-300" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 hover:bg-[#3c4043] disabled:opacity-30"
              disabled={!canGoForward}
              onClick={() =>
                iframeRef.current?.contentWindow?.history.forward()
              }
            >
              <ArrowRight className="size-4 text-gray-300" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 hover:bg-[#3c4043]"
              onClick={handleRefresh}
            >
              <RotateCw
                className={cn(
                  "size-4 text-gray-300",
                  activeTab?.isLoading && "animate-spin"
                )}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 hover:bg-[#3c4043]"
              onClick={handleHome}
            >
              <Home className="size-4 text-gray-300" />
            </Button>
          </div>

          {/* Address Bar */}
          <form onSubmit={handleSubmit} className="flex-1">
            <div className="relative flex items-center">
              <Lock className="absolute left-3 size-3 text-gray-400" />
              <Input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Search or enter website URL"
                className="w-full pl-9 pr-9 h-9 bg-[#3c4043] border-none text-gray-200 placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-full"
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-1 size-7 hover:bg-[#4a4d51] rounded-full"
              >
                <Search className="size-3.5 text-gray-400" />
              </Button>
            </div>
          </form>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative bg-[#202124] overflow-hidden">
          {/* Google Search Page */}
          {activeTab?.isSearchPage && !activeTab.hasError && (
            <div className="absolute inset-0 overflow-auto">
              <SimpleSearchPage
                key={activeTab.id}
                searchQuery={activeTab.searchQuery}
              onSearch={(query) => {
                // Update the tab with the new search query
                setTabs((prev) =>
                  prev.map((tab) =>
                    tab.id === activeTabId
                      ? { ...tab, searchQuery: query, title: `${query} - Google Search` }
                      : tab
                  )
                );
              }}
            />
            </div>
          )}

          {/* Regular iframe for websites */}
          {activeTab && !activeTab.hasError && !activeTab.isSearchPage && (
            <iframe
              ref={iframeRef}
              key={activeTab.id}
              src={activeTab.url}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              className="w-full h-full border-none"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-downloads"
              title={activeTab.title}
            />
          )}

          {activeTab?.hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#202124]">
              <div className="flex flex-col items-center gap-4 max-w-md px-6 text-center">
                <div className="size-16 rounded-full bg-red-950/50 flex items-center justify-center">
                  <AlertCircle className="size-8 text-red-400" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-gray-100">
                    Can't Display This Page
                  </h2>
                  <p className="text-sm text-gray-400">
                    To protect your security,{" "}
                    <span className="font-medium text-gray-300">
                      {new URL(activeTab.url).hostname}
                    </span>{" "}
                    will not allow this browser to display the page if another
                    site has embedded it.
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <Button
                    onClick={handleOpenInNewTab}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
                  >
                    <ExternalLink className="size-4" />
                    Open in New Browser Tab
                  </Button>
                  <Button
                    onClick={handleRefresh}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <RotateCw className="size-4" />
                    Try Again
                  </Button>
                </div>
                <p className="text-xs text-gray-400">
                  Try browsing sites like Wikipedia, GitHub, Stack Overflow, or
                  MDN instead.
                </p>
              </div>
            </div>
          )}

          {activeTab?.isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#202124]">
              <div className="flex flex-col items-center gap-3">
                <RotateCw className="size-8 text-blue-400 animate-spin" />
                <p className="text-sm text-gray-300">Loading...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Window>
  );
}

export default BrowserWindow;
