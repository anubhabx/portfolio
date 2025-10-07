"use client";

import * as React from "react";
import { Search, ExternalLink, Clock, TrendingUp } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

interface SimpleSearchPageProps {
  searchQuery?: string;
  onSearch?: (query: string) => void;
}

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  displayLink: string;
}

const TRENDING_SEARCHES = [
  "JavaScript tutorials",
  "React best practices",
  "TypeScript guide",
  "Web development 2025",
  "CSS animations",
  "Next.js documentation"
];

const QUICK_LINKS = [
  { name: "GitHub", url: "https://github.com", icon: "💻" },
  { name: "Stack Overflow", url: "https://stackoverflow.com", icon: "📚" },
  { name: "MDN Web Docs", url: "https://developer.mozilla.org", icon: "📖" },
  { name: "Wikipedia", url: "https://wikipedia.org", icon: "🌐" },
  { name: "Reddit", url: "https://reddit.com", icon: "🔴" },
  { name: "YouTube", url: "https://youtube.com", icon: "▶️" }
];

export function SimpleSearchPage({ searchQuery: initialQuery = "", onSearch }: SimpleSearchPageProps) {
  const [query, setQuery] = React.useState(initialQuery);
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    onSearch?.(query);

    try {
      // Call our API route which uses Google Custom Search
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (!response.ok) {
        console.error("Search API error:", data);
        
        // If quota exceeded or API fails, use mock results as fallback
        if (data.quotaExceeded) {
          console.warn("Search quota exceeded, using mock results");
        }
        throw new Error(data.error || "Search failed");
      }

      // Use real search results
      setResults(data.results || []);
      setIsSearching(false);
    } catch (error) {
      console.error("Search error:", error);
      
      // Fallback to mock results on error
      const mockResults: SearchResult[] = [
        {
          title: `${query} - Documentation and Tutorials`,
          link: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
          snippet: `Comprehensive guide and documentation for ${query}. Learn the fundamentals, best practices, and advanced techniques...`,
          displayLink: "developer.mozilla.org"
        },
        {
          title: `Best ${query} Resources for 2025`,
          link: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
          snippet: `Curated list of the best resources, tutorials, and courses for learning ${query}. Updated regularly with the latest content...`,
          displayLink: "github.com"
        },
        {
          title: `${query} Tutorial - Step by Step Guide`,
          link: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
          snippet: `Complete beginner-friendly tutorial covering all aspects of ${query}. Includes code examples, exercises, and practical projects...`,
          displayLink: "freecodecamp.org"
        },
        {
          title: `Common ${query} Questions - Stack Overflow`,
          link: `https://stackoverflow.com/search?q=${encodeURIComponent(query)}`,
          snippet: `Browse thousands of questions and answers about ${query} from the developer community. Get help with specific problems...`,
          displayLink: "stackoverflow.com"
        },
        {
          title: `${query} Examples and Code Snippets`,
          link: `https://www.google.com/search?q=${encodeURIComponent(query + " examples")}`,
          snippet: `Practical code examples and snippets demonstrating ${query}. Copy and paste ready-to-use solutions for common use cases...`,
          displayLink: "codepen.io"
        }
      ];

      setResults(mockResults);
      setIsSearching(false);
    }
  };

  const handleQuickSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    setTimeout(() => {
      const form = document.querySelector('form');
      form?.requestSubmit();
    }, 0);
  };

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full h-full bg-[#202124]">
      {/* Search Header */}
      <div className={cn(
        "sticky top-0 z-10 bg-[#202124] border-b border-[#3c4043] transition-all duration-300",
        hasSearched ? "py-3 px-6" : "py-12"
      )}>
        <div className={cn(
          "max-w-4xl mx-auto transition-all duration-300",
          !hasSearched && "text-center"
        )}>
          {/* Google Logo */}
          {!hasSearched && (
            <svg
              className="w-64 h-24 mx-auto mb-8"
              viewBox="0 0 272 92"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#4285F4"
                d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
              />
              <path
                fill="#EA4335"
                d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
              />
              <path
                fill="#FBBC05"
                d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"
              />
              <path fill="#4285F4" d="M225 3v65h-9.5V3h9.5z" />
              <path
                fill="#34A853"
                d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"
              />
              <path
                fill="#EA4335"
                d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"
              />
            </svg>
          )}

          {/* Search Form */}
          <form onSubmit={handleSubmit} className={cn(
            "w-full transition-all duration-300",
            hasSearched ? "max-w-3xl" : "max-w-2xl mx-auto"
          )}>
            <div className="relative flex items-center group">
              <Search className={cn(
                "absolute left-4 text-gray-400 transition-all",
                hasSearched ? "size-4" : "size-5"
              )} />
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Google or type a URL"
                className={cn(
                  "w-full pl-12 pr-4 border-none bg-[#303134] text-gray-200 placeholder:text-gray-500 hover:bg-[#303134] hover:shadow-md focus:bg-[#303134] focus:shadow-md rounded-full text-base transition-all focus-visible:ring-1 focus-visible:ring-blue-500",
                  hasSearched ? "h-11" : "h-12"
                )}
                autoFocus
              />
            </div>
            {!hasSearched && (
              <div className="flex gap-3 justify-center mt-6">
                <Button
                  type="submit"
                  variant="outline"
                  className="px-6 py-2 bg-[#303134] hover:bg-[#3c4043] border border-[#5f6368] text-gray-200 rounded text-sm font-medium"
                >
                  Google Search
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleLinkClick("https://en.wikipedia.org/wiki/Special:Random")}
                  className="px-6 py-2 bg-[#303134] hover:bg-[#3c4043] border border-[#5f6368] text-gray-200 rounded text-sm font-medium"
                >
                  I'm Feeling Lucky
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto px-6 py-6 pb-12">
        {!hasSearched ? (
          <div className="space-y-8 mt-8">
            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
                <ExternalLink className="size-4" />
                Quick Links
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {QUICK_LINKS.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleLinkClick(link.url)}
                    className="flex items-center gap-3 p-4 rounded-lg border border-[#3c4043] hover:border-blue-500 hover:bg-[#303134] transition-all group"
                  >
                    <span className="text-2xl">{link.icon}</span>
                    <span className="text-sm font-medium text-gray-300 group-hover:text-blue-400">
                      {link.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Searches */}
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
                <TrendingUp className="size-4" />
                Trending Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map((trend) => (
                  <button
                    key={trend}
                    onClick={() => handleQuickSearch(trend)}
                    className="px-4 py-2 rounded-full bg-[#303134] hover:bg-[#3c4043] text-sm text-gray-300 transition-colors"
                  >
                    {trend}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Search Results */}
            {isSearching ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="size-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-gray-400">Searching...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-sm text-gray-500 mb-6">
                  About {results.length} results (0.{Math.floor(Math.random() * 90) + 10} seconds)
                </div>
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="py-3 group cursor-pointer"
                    onClick={() => handleLinkClick(result.link)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="size-6 rounded-full bg-[#303134] flex items-center justify-center text-xs text-gray-400">
                            {result.displayLink.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm text-gray-500">
                            {result.displayLink}
                          </span>
                        </div>
                        <h3 className="text-xl text-[#8ab4f8] group-hover:underline mb-1 line-clamp-1">
                          {result.title}
                        </h3>
                        <p className="text-sm text-gray-400 line-clamp-2">
                          {result.snippet}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Note about real results */}
                <div className="mt-8 p-4 bg-[#303134] border border-[#5f6368] rounded-lg">
                  <p className="text-sm text-gray-300">
                    💡 <strong>Note:</strong> These are mock search results. For real search results, click any result above to search on Google.com, or integrate a search API like Google Custom Search JSON API, Bing Search API, or Algolia.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
